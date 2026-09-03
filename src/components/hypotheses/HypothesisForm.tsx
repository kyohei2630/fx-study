"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { HYPOTHESIS_STATUS_OPTIONS, TIMEFRAME_OPTIONS } from "@/lib/options";
import type { Hypothesis } from "@/types";

export type HypothesisDraft = Omit<
  Hypothesis,
  "id" | "createdAt" | "updatedAt" | "verificationCount"
>;

const EMPTY_DRAFT: HypothesisDraft = {
  title: "",
  description: "",
  symbol: "USD/JPY",
  timeframe: "5m",
  higherTimeframe: "4h",
  entryRules: "",
  exitRules: "",
  stopLossRules: "",
  takeProfitRules: "",
  exclusionRules: "",
  expectedR: null,
  conditions: [],
  status: "draft",
};

export function HypothesisForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Hypothesis;
  onSave: (draft: HypothesisDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<HypothesisDraft>(initial ?? EMPTY_DRAFT);
  const [conditionInput, setConditionInput] = useState("");

  function update<K extends keyof HypothesisDraft>(key: K, value: HypothesisDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function addCondition() {
    const value = conditionInput.trim();
    if (!value) return;
    update("conditions", [...draft.conditions, value]);
    setConditionInput("");
  }

  function removeCondition(index: number) {
    update(
      "conditions",
      draft.conditions.filter((_, i) => i !== index)
    );
  }

  return (
    <Card className="space-y-5">
      <Field label="仮説名">
        <Input
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="4時間足上昇トレンド中のEMA押し目反発"
        />
      </Field>

      <Field label="仮説内容">
        <Textarea
          value={draft.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="4時間足が上昇トレンドのとき、5分足でEMA付近まで押した後に反発した場合、その後上昇する確率が高いのではないか。"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="通貨ペア">
          <Input value={draft.symbol} onChange={(e) => update("symbol", e.target.value)} />
        </Field>
        <Field label="時間足">
          <Select
            value={draft.timeframe}
            onChange={(e) => update("timeframe", e.target.value as HypothesisDraft["timeframe"])}
          >
            {TIMEFRAME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="上位時間足">
          <Select
            value={draft.higherTimeframe}
            onChange={(e) =>
              update("higherTimeframe", e.target.value as HypothesisDraft["higherTimeframe"])
            }
          >
            {TIMEFRAME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="エントリー条件">
          <Textarea
            value={draft.entryRules}
            onChange={(e) => update("entryRules", e.target.value)}
          />
        </Field>
        <Field label="決済条件">
          <Textarea value={draft.exitRules} onChange={(e) => update("exitRules", e.target.value)} />
        </Field>
        <Field label="SL（損切り）ルール">
          <Textarea
            value={draft.stopLossRules}
            onChange={(e) => update("stopLossRules", e.target.value)}
          />
        </Field>
        <Field label="TP（利確）ルール">
          <Textarea
            value={draft.takeProfitRules}
            onChange={(e) => update("takeProfitRules", e.target.value)}
          />
        </Field>
      </div>

      <Field label="除外条件" optional>
        <Textarea
          value={draft.exclusionRules}
          onChange={(e) => update("exclusionRules", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="想定R" optional>
          <Input
            type="number"
            step="any"
            value={draft.expectedR ?? ""}
            onChange={(e) =>
              update("expectedR", e.target.value.trim() === "" ? null : Number(e.target.value))
            }
          />
        </Field>
        <Field label="採用状況">
          <Select
            value={draft.status}
            onChange={(e) => update("status", e.target.value as HypothesisDraft["status"])}
          >
            {HYPOTHESIS_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="条件タグ" optional>
        <div className="flex gap-2">
          <Input
            value={conditionInput}
            onChange={(e) => setConditionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCondition();
              }
            }}
            placeholder="例: 上位足上昇"
          />
          <Button type="button" variant="secondary" onClick={addCondition}>
            追加
          </Button>
        </div>
        {draft.conditions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.conditions.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
              >
                {c}
                <button type="button" onClick={() => removeCondition(i)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
