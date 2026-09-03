"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Layers, Plus, Trash2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { StrategyVersionForm, type VersionRulesDraft } from "@/components/strategies/StrategyVersionForm";
import { VersionComparisonTable } from "@/components/strategies/VersionComparisonTable";
import { ImprovementHint } from "@/components/strategies/ImprovementHint";
import { generateId } from "@/db/repository";
import {
  backtestsRepo,
  strategiesRepo,
  strategyVersionsRepo,
  tradesRepo,
} from "@/db/repositories";
import { suggestNextVersion } from "@/lib/strategy/version";
import { cn } from "@/lib/utils";
import type { Backtest, Strategy, StrategyStatus, StrategyVersion, Trade } from "@/types";

type View =
  | { mode: "list" }
  | { mode: "new" }
  | { mode: "detail"; id: string }
  | { mode: "edit-version"; strategyId: string; versionId: string }
  | { mode: "new-version"; strategyId: string };

const STATUS_OPTIONS: { value: StrategyStatus; label: string }[] = [
  { value: "draft", label: "下書き" },
  { value: "active", label: "運用中" },
  { value: "archived", label: "アーカイブ" },
];

const STATUS_STYLES: Record<StrategyStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-success/10 text-success",
  archived: "bg-muted text-muted-foreground",
};

const EMPTY_VERSION_RULES: VersionRulesDraft = {
  version: "v1.0",
  entryRules: "",
  exitRules: "",
  stopLossRules: "",
  takeProfitRules: "",
  conditions: [],
  note: "",
};

export function StrategiesClient() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [versions, setVersions] = useState<StrategyVersion[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const [allStrategies, allVersions, allTrades, allBacktests] = await Promise.all([
      strategiesRepo.list(),
      strategyVersionsRepo.list(),
      tradesRepo.list(),
      backtestsRepo.list(),
    ]);
    allStrategies.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setStrategies(allStrategies);
    setVersions(allVersions);
    setTrades(allTrades);
    setBacktests(allBacktests);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreateStrategy(name: string, description: string) {
    const now = new Date().toISOString();
    const strategyId = generateId();
    await strategiesRepo.add({
      id: strategyId,
      name,
      description,
      currentVersion: "v1.0",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    await strategyVersionsRepo.add({
      id: generateId(),
      strategyId,
      ...EMPTY_VERSION_RULES,
      createdAt: now,
    });
    setView({ mode: "detail", id: strategyId });
    await refresh();
  }

  async function handleDeleteStrategy(id: string) {
    await strategiesRepo.remove(id);
    const toRemove = versions.filter((v) => v.strategyId === id);
    await Promise.all(toRemove.map((v) => strategyVersionsRepo.remove(v.id)));
    setView({ mode: "list" });
    await refresh();
  }

  async function handleUpdateCurrentVersion(versionId: string, draft: VersionRulesDraft) {
    await strategyVersionsRepo.update(versionId, draft);
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      await strategiesRepo.update(version.strategyId, { updatedAt: new Date().toISOString() });
      setView({ mode: "detail", id: version.strategyId });
    }
    await refresh();
  }

  async function handleCreateVersion(strategyId: string, draft: VersionRulesDraft) {
    const now = new Date().toISOString();
    await strategyVersionsRepo.add({
      id: generateId(),
      strategyId,
      ...draft,
      createdAt: now,
    });
    await strategiesRepo.update(strategyId, { currentVersion: draft.version, updatedAt: now });
    setView({ mode: "detail", id: strategyId });
    await refresh();
  }

  if (view.mode === "new") {
    return (
      <div className="space-y-6">
        <Header />
        <NewStrategyForm
          onSave={handleCreateStrategy}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  if (view.mode === "edit-version") {
    const version = versions.find((v) => v.id === view.versionId);
    if (!version) return null;
    return (
      <div className="space-y-6">
        <BackLink onClick={() => setView({ mode: "detail", id: view.strategyId })} />
        <StrategyVersionForm
          title={`${version.version} を編集`}
          initial={version}
          versionEditable={false}
          onSave={(draft) => handleUpdateCurrentVersion(version.id, draft)}
          onCancel={() => setView({ mode: "detail", id: view.strategyId })}
        />
      </div>
    );
  }

  if (view.mode === "new-version") {
    const strategy = strategies.find((s) => s.id === view.strategyId);
    const current = versions.find(
      (v) => v.strategyId === view.strategyId && v.version === strategy?.currentVersion
    );
    const base: VersionRulesDraft = current
      ? { ...current, version: suggestNextVersion(current.version), note: "" }
      : { ...EMPTY_VERSION_RULES, version: suggestNextVersion(strategy?.currentVersion ?? "v1.0") };

    return (
      <div className="space-y-6">
        <BackLink onClick={() => setView({ mode: "detail", id: view.strategyId })} />
        <StrategyVersionForm
          title="新しいVersionを作成"
          initial={base}
          onSave={(draft) => handleCreateVersion(view.strategyId, draft)}
          onCancel={() => setView({ mode: "detail", id: view.strategyId })}
        />
      </div>
    );
  }

  if (view.mode === "detail") {
    const strategy = strategies.find((s) => s.id === view.id);
    if (!strategy) return null;
    const strategyVersions = versions
      .filter((v) => v.strategyId === strategy.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const current =
      strategyVersions.find((v) => v.version === strategy.currentVersion) ?? strategyVersions[0];
    const past = strategyVersions.filter((v) => v.id !== current?.id);

    return (
      <div className="space-y-6">
        <BackLink onClick={() => setView({ mode: "list" })} />

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{strategy.name}</h1>
              <StatusBadge status={strategy.status} />
            </div>
            {strategy.description && (
              <p className="mt-1 text-sm text-muted-foreground">{strategy.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleDeleteStrategy(strategy.id)}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
            aria-label="削除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <Field label="ステータス">
          <Select
            value={strategy.status}
            onChange={async (e) => {
              await strategiesRepo.update(strategy.id, {
                status: e.target.value as StrategyStatus,
                updatedAt: new Date().toISOString(),
              });
              await refresh();
            }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>

        {current && (
          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>現在のVersion（{current.version}）</CardTitle>
              <button
                type="button"
                onClick={() =>
                  setView({ mode: "edit-version", strategyId: strategy.id, versionId: current.id })
                }
                className="text-xs font-semibold text-primary hover:underline"
              >
                編集
              </button>
            </div>
            <dl className="mt-3 space-y-3 text-sm">
              <RuleRow label="エントリー条件" value={current.entryRules} />
              <RuleRow label="損切りルール" value={current.stopLossRules} />
              <RuleRow label="利確ルール" value={current.takeProfitRules} />
              <RuleRow label="決済条件" value={current.exitRules} />
            </dl>
            {current.conditions.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-muted-foreground">条件チェックリスト</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {current.conditions.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
                    >
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <ImprovementHint backtests={backtests.filter((b) => b.strategyId === strategy.id)} />

        <VersionComparisonTable versions={strategyVersions} trades={trades} backtests={backtests} />

        <Button onClick={() => setView({ mode: "new-version", strategyId: strategy.id })}>
          <Plus className="h-4 w-4" />
          新しいVersionを作成
        </Button>

        {past.length > 0 && (
          <div>
            <p className="text-sm font-bold text-muted-foreground">過去のVersion</p>
            <div className="mt-2 space-y-2">
              {past.map((v) => (
                <Card key={v.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{v.version}</span>
                    <span className="text-xs text-muted-foreground">
                      {v.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  {v.note && <p className="mt-1 text-muted-foreground">{v.note}</p>}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <Button onClick={() => setView({ mode: "new" })}>
        <Plus className="h-4 w-4" />
        新しい戦略
      </Button>

      {loaded && strategies.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Layers className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだ戦略がありません。検証した仮説から戦略を作ってみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {strategies.map((s) => (
          <Card
            key={s.id}
            className="cursor-pointer transition-colors hover:border-primary/40"
            onClick={() => setView({ mode: "detail", id: s.id })}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{s.name}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {s.currentVersion}
              </span>
              <StatusBadge status={s.status} />
            </div>
            {s.description && (
              <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{s.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function RuleRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value || "（未設定）"}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: StrategyStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_OPTIONS.find((o) => o.value === status)?.label}
    </span>
  );
}

function NewStrategyForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="space-y-4">
      <Field label="戦略名">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="押し目買い" />
      </Field>
      <Field label="説明" optional>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="flex gap-3">
        <Button onClick={() => name.trim() && onSave(name.trim(), description)}>作成する</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </Card>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">戦略</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        戦略を作成し、Versionごとに条件と成績を管理します。
      </p>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      戻る
    </button>
  );
}
