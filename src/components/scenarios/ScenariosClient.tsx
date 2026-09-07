"use client";

import { useEffect, useState } from "react";
import { Route, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScenarioForm, type ScenarioDraft } from "@/components/scenarios/ScenarioForm";
import { generateId } from "@/db/repository";
import { scenariosRepo } from "@/db/repositories";
import type { ScenarioPlan } from "@/types";

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string };

export function ScenariosClient() {
  const [items, setItems] = useState<ScenarioPlan[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const all = await scenariosRepo.list();
    all.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    setItems(all);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(draft: ScenarioDraft, editingId?: string) {
    if (editingId) {
      await scenariosRepo.update(editingId, draft);
    } else {
      await scenariosRepo.add({
        ...draft,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    }
    setView({ mode: "list" });
    await refresh();
  }

  async function handleDelete(id: string) {
    await scenariosRepo.remove(id);
    await refresh();
  }

  if (view.mode === "new") {
    return (
      <div className="space-y-6">
        <Header />
        <ScenarioForm onSave={(draft) => handleSave(draft)} onCancel={() => setView({ mode: "list" })} />
      </div>
    );
  }

  if (view.mode === "edit") {
    const editing = items.find((s) => s.id === view.id);
    if (!editing) return null;
    return (
      <div className="space-y-6">
        <Header />
        <ScenarioForm
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
        新しいシナリオ
      </Button>

      {loaded && items.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Route className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            まだシナリオがありません。今のチャートから複数の未来を想定してみましょう。
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((plan) => {
          const noTradeCount = plan.cases.filter((c) => c.isNoTrade).length;
          return (
            <Card key={plan.id}>
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setView({ mode: "edit", id: plan.id })}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{plan.date}</span>
                    <span className="text-sm text-muted-foreground">
                      {plan.symbol} ・ {plan.timeframe}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      シナリオ {plan.cases.length}件
                    </span>
                    {noTradeCount > 0 && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        NO TRADE {noTradeCount}件
                      </span>
                    )}
                  </div>
                  {plan.summary && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{plan.summary}</p>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                  aria-label="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">シナリオ訓練</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        今のチャートから複数の未来を想定し、条件・予測・無効条件を分けて記録します。
      </p>
    </div>
  );
}
