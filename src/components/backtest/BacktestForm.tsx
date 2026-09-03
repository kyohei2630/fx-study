"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { calculateR, resultFromR } from "@/lib/calculations/r";
import {
  DIRECTION_OPTIONS,
  TIMEFRAME_OPTIONS,
  TREND_STATE_OPTIONS,
} from "@/lib/options";
import type { Backtest, Hypothesis, Strategy, StrategyVersion } from "@/types";

export type BacktestDraft = Omit<
  Backtest,
  "id" | "createdAt" | "rMultiple" | "result"
>;

const EMPTY_DRAFT: BacktestDraft = {
  date: new Date().toISOString().slice(0, 10),
  symbol: "USD/JPY",
  timeframe: "5m",
  direction: "buy",
  entry: 0,
  stopLoss: 0,
  takeProfit: null,
  exit: 0,
  marketEnvironment: "unclear",
  higherTimeframeDirection: "unclear",
  entryConditions: [],
  exclusionConditions: [],
  hypothesisId: null,
  strategyId: null,
  strategyVersionId: null,
  screenshot: null,
  comment: "",
};

const RESULT_LABEL = { win: "勝ち", loss: "負け", breakeven: "引き分け" } as const;

export function BacktestForm({
  initial,
  hypotheses,
  strategies,
  strategyVersions,
  onSave,
  onCancel,
}: {
  initial?: Backtest;
  hypotheses: Hypothesis[];
  strategies: Strategy[];
  strategyVersions: StrategyVersion[];
  onSave: (draft: BacktestDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<BacktestDraft>(initial ?? EMPTY_DRAFT);
  const [entryConditionInput, setEntryConditionInput] = useState("");
  const [exclusionConditionInput, setExclusionConditionInput] = useState("");

  function update<K extends keyof BacktestDraft>(key: K, value: BacktestDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const r = useMemo(
    () => calculateR(draft.direction, draft.entry, draft.stopLoss, draft.exit),
    [draft.direction, draft.entry, draft.stopLoss, draft.exit]
  );
  const result = resultFromR(r);

  function addTag(field: "entryConditions" | "exclusionConditions", value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    update(field, [...draft[field], trimmed]);
  }

  function removeTag(field: "entryConditions" | "exclusionConditions", index: number) {
    update(
      field,
      draft[field].filter((_, i) => i !== index)
    );
  }

  return (
    <Card className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="日付">
          <Input type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} />
        </Field>
        <Field label="通貨ペア">
          <Input value={draft.symbol} onChange={(e) => update("symbol", e.target.value)} />
        </Field>
        <Field label="時間足">
          <Select
            value={draft.timeframe}
            onChange={(e) => update("timeframe", e.target.value as BacktestDraft["timeframe"])}
          >
            {TIMEFRAME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="方向">
        <div className="flex gap-2">
          {DIRECTION_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("direction", o.value)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                draft.direction === o.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Entry">
          <Input
            type="number"
            step="any"
            value={draft.entry}
            onChange={(e) => update("entry", Number(e.target.value))}
          />
        </Field>
        <Field label="SL">
          <Input
            type="number"
            step="any"
            value={draft.stopLoss}
            onChange={(e) => update("stopLoss", Number(e.target.value))}
          />
        </Field>
        <Field label="TP" optional>
          <Input
            type="number"
            step="any"
            value={draft.takeProfit ?? ""}
            onChange={(e) =>
              update("takeProfit", e.target.value.trim() === "" ? null : Number(e.target.value))
            }
          />
        </Field>
        <Field label="Exit">
          <Input
            type="number"
            step="any"
            value={draft.exit}
            onChange={(e) => update("exit", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">R</span>
        <span className="text-lg font-bold text-foreground">
          {r === null ? "計算不可" : `${r >= 0 ? "+" : ""}${r.toFixed(2)}R`}
        </span>
        {result && (
          <span className="ml-auto text-sm font-semibold text-muted-foreground">
            {RESULT_LABEL[result]}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="市場環境">
          <Select
            value={draft.marketEnvironment}
            onChange={(e) =>
              update("marketEnvironment", e.target.value as BacktestDraft["marketEnvironment"])
            }
          >
            {TREND_STATE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="上位足方向">
          <Select
            value={draft.higherTimeframeDirection}
            onChange={(e) =>
              update(
                "higherTimeframeDirection",
                e.target.value as BacktestDraft["higherTimeframeDirection"]
              )
            }
          >
            {TREND_STATE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="関連する仮説" optional>
        <Select
          value={draft.hypothesisId ?? ""}
          onChange={(e) => update("hypothesisId", e.target.value || null)}
        >
          <option value="">なし</option>
          {hypotheses.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title || "無題の仮説"}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="関連する戦略" optional>
          <Select
            value={draft.strategyId ?? ""}
            onChange={(e) => {
              update("strategyId", e.target.value || null);
              update("strategyVersionId", null);
            }}
          >
            <option value="">なし</option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="戦略Version" optional>
          <Select
            value={draft.strategyVersionId ?? ""}
            onChange={(e) => update("strategyVersionId", e.target.value || null)}
            disabled={!draft.strategyId}
          >
            <option value="">なし</option>
            {strategyVersions
              .filter((v) => v.strategyId === draft.strategyId)
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.version}
                </option>
              ))}
          </Select>
        </Field>
      </div>

      <TagField
        label="エントリー条件"
        tags={draft.entryConditions}
        input={entryConditionInput}
        onInputChange={setEntryConditionInput}
        onAdd={() => {
          addTag("entryConditions", entryConditionInput);
          setEntryConditionInput("");
        }}
        onRemove={(i) => removeTag("entryConditions", i)}
      />

      <TagField
        label="除外条件"
        tags={draft.exclusionConditions}
        input={exclusionConditionInput}
        onInputChange={setExclusionConditionInput}
        onAdd={() => {
          addTag("exclusionConditions", exclusionConditionInput);
          setExclusionConditionInput("");
        }}
        onRemove={(i) => removeTag("exclusionConditions", i)}
      />

      <Field label="コメント" optional>
        <Textarea value={draft.comment} onChange={(e) => update("comment", e.target.value)} />
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

function TagField({
  label,
  tags,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  label: string;
  tags: string[];
  input: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Field label={label} optional>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => onInputChange(e.target.value)} />
        <Button type="button" variant="secondary" onClick={onAdd}>
          追加
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
            >
              {tag}
              <button type="button" onClick={() => onRemove(i)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}
