"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HypothesisForm, type HypothesisDraft } from "@/components/hypotheses/HypothesisForm";
import { generateId } from "@/db/repository";
import { backtestsRepo, hypothesesRepo } from "@/db/repositories";
import { HYPOTHESIS_STATUS_OPTIONS, labelFor } from "@/lib/options";
import type { Hypothesis, HypothesisStatus } from "@/types";
import { cn } from "@/lib/utils";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string };

const STATUS_STYLES: Record<HypothesisStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  testing: "bg-primary/10 text-primary",
  provisionally_adopted: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  adopted: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
};

export function HypothesesClient() {
  const [items, setItems] = useState<Hypothesis[]>([]);
  const [verificationCounts, setVerificationCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const [all, backtests] = await Promise.all([hypothesesRepo.list(), backtestsRepo.list()]);
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const counts: Record<string, number> = {};
    for (const b of backtests) {
      if (!b.hypothesisId) continue;
      counts[b.hypothesisId] = (counts[b.hypothesisId] ?? 0) + 1;
    }
    setItems(all);
    setVerificationCounts(counts);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(draft: HypothesisDraft, editingId?: string) {
    const now = new Date().toISOString();
    if (editingId) {
      await hypothesesRepo.update(editingId, { ...draft, updatedAt: now });
    } else {
      await hypothesesRepo.add({
        ...draft,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      });
    }
    setView({ mode: "list" });
    await refresh();
  }

  async function handleDelete(id: string) {
    await hypothesesRepo.remove(id);
    await refresh();
  }

  if (view.mode === "new") {
    return (
      <div className="space-y-6">
        <Header />
        <HypothesisForm
          onSave={(draft) => handleSave(draft)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  if (view.mode === "edit") {
    const editing = items.find((h) => h.id === view.id);
    if (!editing) return null;
    return (
      <div className="space-y-6">
        <Header />
        <HypothesisForm
          initial={editing}
          onSave={(draft) => handleSave(draft, view.id)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <Button onClick={() => setView({ mode: "new" })}>
        <Plus className="h-4 w-4" />
        新しい仮説
      </Button>

      {loaded && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Lightbulb className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだ仮説がありません。観察から気づいたことを仮説にしてみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((h) => (
          <Card key={h.id}>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setView({ mode: "edit", id: h.id })}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{h.title || "無題の仮説"}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      STATUS_STYLES[h.status]
                    )}
                  >
                    {labelFor(HYPOTHESIS_STATUS_OPTIONS, h.status)}
                  </span>
                </div>
                {h.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{h.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.symbol} ・ {h.timeframe} ・ 検証数 {verificationCounts[h.id] ?? 0}
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(h.id)}
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
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">仮説</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        「〜のとき、〜する確率が高いのではないか」を仮説として保存・管理します。
      </p>
    </div>
  );
}
