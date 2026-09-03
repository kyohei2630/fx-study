"use client";

import { useEffect, useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ObservationForm, type ObservationDraft } from "@/components/observations/ObservationForm";
import { generateId } from "@/db/repository";
import { hypothesesRepo, observationsRepo } from "@/db/repositories";
import { labelFor, TREND_STATE_OPTIONS } from "@/lib/options";
import type { Hypothesis, Observation } from "@/types";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string };

export function ObservationsClient() {
  const [items, setItems] = useState<Observation[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const [all, allHypotheses] = await Promise.all([
      observationsRepo.list(),
      hypothesesRepo.list(),
    ]);
    all.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    setItems(all);
    setHypotheses(allHypotheses);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(draft: ObservationDraft, editingId?: string) {
    if (editingId) {
      await observationsRepo.update(editingId, draft);
    } else {
      await observationsRepo.add({
        ...draft,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    }
    setView({ mode: "list" });
    await refresh();
  }

  async function handleDelete(id: string) {
    await observationsRepo.remove(id);
    await refresh();
  }

  if (view.mode === "new") {
    return (
      <div className="space-y-6">
        <Header />
        <ObservationForm
          hypotheses={hypotheses}
          onSave={(draft) => handleSave(draft)}
          onCancel={() => setView({ mode: "list" })}
        />
      </div>
    );
  }

  if (view.mode === "edit") {
    const editing = items.find((o) => o.id === view.id);
    if (!editing) return null;
    return (
      <div className="space-y-6">
        <Header />
        <ObservationForm
          initial={editing}
          hypotheses={hypotheses}
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
        新しい観察記録
      </Button>

      {loaded && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <NotebookPen className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだ観察記録がありません。チャートを見て気づいたことを記録してみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((obs) => (
          <Card key={obs.id}>
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setView({ mode: "edit", id: obs.id })}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{obs.date}</span>
                  <span className="text-sm text-muted-foreground">
                    {obs.symbol} ・ {obs.timeframe}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {labelFor(TREND_STATE_OPTIONS, obs.marketEnvironment)}
                  </span>
                </div>
                {obs.notes && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{obs.notes}</p>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(obs.id)}
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
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">観察記録</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        チャートを見て気づいたことを構造化データとして記録します。
      </p>
    </div>
  );
}

