"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TradeEntryForm, type TradeEntryDraft } from "@/components/trades/TradeEntryForm";
import { TradeExitForm, type TradeExitDraft } from "@/components/trades/TradeExitForm";
import { generateId } from "@/db/repository";
import { strategiesRepo, strategyVersionsRepo, tradesRepo } from "@/db/repositories";
import { calculateR, resultFromR } from "@/lib/calculations/r";
import { cn } from "@/lib/utils";
import type { Strategy, StrategyVersion, Trade, TradeResult } from "@/types";

type View =
  | { mode: "list" }
  | { mode: "new" }
  | { mode: "edit"; id: string }
  | { mode: "exit"; id: string };

const RESULT_STYLES: Record<TradeResult, string> = {
  win: "bg-success/10 text-success",
  loss: "bg-danger/10 text-danger",
  breakeven: "bg-muted text-muted-foreground",
};

const RESULT_LABEL: Record<TradeResult, string> = {
  win: "勝ち",
  loss: "負け",
  breakeven: "引き分け",
};

export function TradesClient() {
  const [items, setItems] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategyVersions, setStrategyVersions] = useState<StrategyVersion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const [all, allStrategies, allVersions] = await Promise.all([
      tradesRepo.list(),
      strategiesRepo.list(),
      strategyVersionsRepo.list(),
    ]);
    all.sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.time.localeCompare(a.time) ||
        b.createdAt.localeCompare(a.createdAt)
    );
    setItems(all);
    setStrategies(allStrategies);
    setStrategyVersions(allVersions);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSaveEntry(draft: TradeEntryDraft, editingId?: string) {
    if (editingId) {
      await tradesRepo.update(editingId, draft);
    } else {
      await tradesRepo.add({
        ...draft,
        id: generateId(),
        exit: null,
        result: null,
        rMultiple: null,
        ruleCompliant: null,
        psychologyTags: [],
        postTradeNote: "",
        screenshot: null,
        createdAt: new Date().toISOString(),
      });
    }
    setView({ mode: "list" });
    await refresh();
  }

  async function handleSaveExit(trade: Trade, draft: TradeExitDraft) {
    const r = calculateR(trade.direction, trade.entry, trade.stopLoss, draft.exit);
    await tradesRepo.update(trade.id, {
      exit: draft.exit,
      rMultiple: r,
      result: resultFromR(r) ?? "breakeven",
      postTradeNote: draft.postTradeNote,
      ruleCompliant: draft.ruleCompliant,
      psychologyTags: draft.psychologyTags,
    });
    setView({ mode: "list" });
    await refresh();
  }

  async function handleDelete(id: string) {
    await tradesRepo.remove(id);
    await refresh();
  }

  if (view.mode === "new" || view.mode === "edit") {
    const editing = view.mode === "edit" ? items.find((t) => t.id === view.id) : undefined;
    if (view.mode === "edit" && !editing) return null;
    return (
      <div className="space-y-6">
        <Header />
        <TradeEntryForm
          initial={editing}
          strategies={strategies}
          strategyVersions={strategyVersions}
          onSave={(draft) => handleSaveEntry(draft, view.mode === "edit" ? view.id : undefined)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  if (view.mode === "exit") {
    const trade = items.find((t) => t.id === view.id);
    if (!trade) return null;
    return (
      <div className="space-y-6">
        <Header />
        <TradeExitForm
          trade={trade}
          onSave={(draft) => handleSaveExit(trade, draft)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  const closed = items.filter((t) => t.result !== null);
  const wins = closed.filter((t) => t.result === "win").length;
  const winRate = closed.length > 0 ? Math.round((wins / closed.length) * 1000) / 10 : null;
  const totalR = closed.reduce((sum, t) => sum + (t.rMultiple ?? 0), 0);

  return (
    <div className="space-y-6">
      <Header />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setView({ mode: "new" })}>
          <Plus className="h-4 w-4" />
          新しいトレード
        </Button>
        {closed.length > 0 && (
          <span className="text-sm text-muted-foreground">
            決済済み {closed.length}件 ・ 勝率 {winRate}% ・ 累積 {totalR >= 0 ? "+" : ""}
            {totalR.toFixed(1)}R
          </span>
        )}
      </div>

      {loaded && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだトレード記録がありません。実際のトレードを記録してみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setView({ mode: "edit", id: t.id })}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {t.date} {t.time}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.symbol} ・ {t.timeframe} ・ {t.direction === "buy" ? "Buy" : "Sell"}
                  </span>
                  {t.result ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        RESULT_STYLES[t.result]
                      )}
                    >
                      {RESULT_LABEL[t.result]}
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      オープン中
                    </span>
                  )}
                  {t.ruleCompliant === false && (
                    <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
                      ルール違反
                    </span>
                  )}
                </div>
                {t.rMultiple !== null && (
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {t.rMultiple >= 0 ? "+" : ""}
                    {t.rMultiple.toFixed(2)}R
                  </p>
                )}
              </button>
              <div className="flex shrink-0 items-center gap-1">
                {t.result === null && (
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => setView({ mode: "exit", id: t.id })}
                  >
                    決済を記録
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                  aria-label="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">トレード記録</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        実際のトレードを「トレード前」と「トレード後」に分けて記録します。
      </p>
    </div>
  );
}
