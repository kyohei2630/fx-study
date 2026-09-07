"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { generateId } from "@/db/repository";
import { TIMEFRAME_OPTIONS } from "@/lib/options";
import type { ScenarioCase, ScenarioPlan } from "@/types";

export type ScenarioDraft = Omit<ScenarioPlan, "id" | "createdAt">;

const CASE_LABELS = ["A", "B", "C", "D", "E", "F"];

function emptyCase(label: string): ScenarioCase {
  return {
    id: generateId(),
    label,
    condition: "",
    prediction: "",
    trigger: "",
    invalidation: "",
    stopLoss: "",
    takeProfit: "",
    isNoTrade: false,
  };
}

const EMPTY_DRAFT: ScenarioDraft = {
  date: new Date().toISOString().slice(0, 10),
  symbol: "USD/JPY",
  timeframe: "5m",
  currentPrice: null,
  summary: "",
  cases: [emptyCase("A"), emptyCase("B")],
  notes: "",
};

export function ScenarioForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ScenarioPlan;
  onSave: (draft: ScenarioDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ScenarioDraft>(initial ?? EMPTY_DRAFT);

  function update<K extends keyof ScenarioDraft>(key: K, value: ScenarioDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateCase<K extends keyof ScenarioCase>(
    caseId: string,
    key: K,
    value: ScenarioCase[K]
  ) {
    update(
      "cases",
      draft.cases.map((c) => (c.id === caseId ? { ...c, [key]: value } : c))
    );
  }

  function addCase() {
    const nextLabel = CASE_LABELS[draft.cases.length] ?? `Case ${draft.cases.length + 1}`;
    update("cases", [...draft.cases, emptyCase(nextLabel)]);
  }

  function removeCase(caseId: string) {
    update(
      "cases",
      draft.cases.filter((c) => c.id !== caseId)
    );
  }

  function numberOrNull(value: string): number | null {
    if (value.trim() === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  return (
    <Card className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="日付">
          <Input
            type="date"
            value={draft.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </Field>
        <Field label="通貨ペア">
          <Input value={draft.symbol} onChange={(e) => update("symbol", e.target.value)} />
        </Field>
        <Field label="時間足">
          <Select
            value={draft.timeframe}
            onChange={(e) => update("timeframe", e.target.value as ScenarioDraft["timeframe"])}
          >
            {TIMEFRAME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="現在価格" optional>
          <Input
            type="number"
            step="any"
            value={draft.currentPrice ?? ""}
            onChange={(e) => update("currentPrice", numberOrNull(e.target.value))}
          />
        </Field>
      </div>

      <Field label="現状の要約">
        <Textarea
          value={draft.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="重要レジスタンス手前で上昇トレンドが継続中。ここからの動きを複数想定する。"
        />
      </Field>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground">シナリオ</p>
        {draft.cases.map((c) => (
          <div key={c.id} className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                シナリオ {c.label}
              </span>
              {draft.cases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCase(c.id)}
                  className="text-muted-foreground hover:text-danger"
                  aria-label="このシナリオを削除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <Field label="発生条件">
              <Textarea
                value={c.condition}
                onChange={(e) => updateCase(c.id, "condition", e.target.value)}
                placeholder="レジスタンスを明確に上抜けた場合"
              />
            </Field>
            <Field label="予測（このシナリオでは何が起きると思うか）">
              <Textarea
                value={c.prediction}
                onChange={(e) => updateCase(c.id, "prediction", e.target.value)}
                placeholder="上昇が加速し、次のレジスタンスまで伸びる"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="トリガー（エントリー条件）" optional>
                <Textarea
                  value={c.trigger}
                  onChange={(e) => updateCase(c.id, "trigger", e.target.value)}
                  placeholder="上抜け後のリテストで反発を確認したら"
                />
              </Field>
              <Field label="無効条件（見立てが崩れる条件）" optional>
                <Textarea
                  value={c.invalidation}
                  onChange={(e) => updateCase(c.id, "invalidation", e.target.value)}
                  placeholder="上抜け後にすぐ元のレンジへ戻ったら見送り"
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SL（損切り）" optional>
                <Input
                  value={c.stopLoss}
                  onChange={(e) => updateCase(c.id, "stopLoss", e.target.value)}
                />
              </Field>
              <Field label="TP（利確）" optional>
                <Input
                  value={c.takeProfit}
                  onChange={(e) => updateCase(c.id, "takeProfit", e.target.value)}
                />
              </Field>
            </div>
            <Checkbox
              label="このシナリオはNO TRADE（見送り）とする"
              checked={c.isNoTrade}
              onChange={(e) => updateCase(c.id, "isNoTrade", e.target.checked)}
            />
          </div>
        ))}

        <Button type="button" variant="secondary" onClick={addCase}>
          <Plus className="h-4 w-4" />
          シナリオを追加
        </Button>
      </div>

      <Field label="メモ" optional>
        <Textarea value={draft.notes} onChange={(e) => update("notes", e.target.value)} />
      </Field>

      <div className="flex gap-3">
        <Button onClick={() => onSave(draft)}>保存する</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </Card>
  );
}
