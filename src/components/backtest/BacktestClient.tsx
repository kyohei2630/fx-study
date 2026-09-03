"use client";

import { useEffect, useState } from "react";
import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BacktestForm, type BacktestDraft } from "@/components/backtest/BacktestForm";
import { generateId } from "@/db/repository";
import {
  backtestsRepo,
  hypothesesRepo,
  strategiesRepo,
  strategyVersionsRepo,
} from "@/db/repositories";
import { calculateR, resultFromR } from "@/lib/calculations/r";
import { cn } from "@/lib/utils";
import type { Backtest, BacktestResult, Hypothesis, Strategy, StrategyVersion } from "@/types";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string };

const RESULT_STYLES: Record<BacktestResult, string> = {
  win: "bg-success/10 text-success",
  loss: "bg-danger/10 text-danger",
  breakeven: "bg-muted text-muted-foreground",
};

const RESULT_LABEL: Record<BacktestResult, string> = {
  win: "勝ち",
  loss: "負け",
  breakeven: "引き分け",
};

export function BacktestClient() {
  const [items, setItems] = useState<Backtest[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategyVersions, setStrategyVersions] = useState<StrategyVersion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const [all, allHypotheses, allStrategies, allVersions] = await Promise.all([
      backtestsRepo.list(),
      hypothesesRepo.list(),
      strategiesRepo.list(),
      strategyVersionsRepo.list(),
    ]);
    all.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    setItems(all);
    setHypotheses(allHypotheses);
    setStrategies(allStrategies);
    setStrategyVersions(allVersions);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(draft: BacktestDraft, editingId?: string) {
    const r = calculateR(draft.direction, draft.entry, draft.stopLoss, draft.exit);
    const result = resultFromR(r) ?? "breakeven";

    if (editingId) {
      await backtestsRepo.update(editingId, { ...draft, rMultiple: r ?? 0, result });
    } else {
      await backtestsRepo.add({
        ...draft,
        id: generateId(),
        rMultiple: r ?? 0,
        result,
        createdAt: new Date().toISOString(),
      });
    }
    setView({ mode: "list" });
    await refresh();
  }

  async function handleDelete(id: string) {
    await backtestsRepo.remove(id);
    await refresh();
  }

  if (view.mode === "new" || view.mode === "edit") {
    const editing = view.mode === "edit" ? items.find((b) => b.id === view.id) : undefined;
    if (view.mode === "edit" && !editing) return null;
    return (
      <div className="space-y-6">
        <Header />
        <BacktestForm
          initial={editing}
          hypotheses={hypotheses}
          strategies={strategies}
          strategyVersions={strategyVersions}
          onSave={(draft) => handleSave(draft, view.mode === "edit" ? view.id : undefined)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  const totalR = items.reduce((sum, b) => sum + b.rMultiple, 0);
  const wins = items.filter((b) => b.result === "win").length;
  const winRate = items.length > 0 ? Math.round((wins / items.length) * 1000) / 10 : null;

  return (
    <div className="space-y-6">
      <Header />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setView({ mode: "new" })}>
          <Plus className="h-4 w-4" />
          新しいバックテスト
        </Button>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground">
            検証数 {items.length}件 ・ 勝率 {winRate}% ・ 累積 {totalR >= 0 ? "+" : ""}
            {totalR.toFixed(1)}R
          </span>
        )}
      </div>

      {loaded && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <FlaskConical className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだバックテスト記録がありません。仮説を過去チャートで検証してみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setView({ mode: "edit", id: b.id })}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{b.date}</span>
                  <span className="text-sm text-muted-foreground">
                    {b.symbol} ・ {b.timeframe} ・ {b.direction === "buy" ? "Buy" : "Sell"}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      RESULT_STYLES[b.result]
                    )}
                  >
                    {RESULT_LABEL[b.result]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {b.rMultiple >= 0 ? "+" : ""}
                  {b.rMultiple.toFixed(2)}R
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(b.id)}
                className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                aria-label="削除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">バックテスト</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        仮説を過去チャートで検証し、Rベースで結果を記録します。
      </p>
    </div>
  );
}
