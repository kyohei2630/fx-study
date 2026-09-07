"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/Field";
import {
  INDICATOR_STATE_OPTIONS,
  TIMEFRAME_OPTIONS,
  TREND_STATE_OPTIONS,
} from "@/lib/options";
import type { Hypothesis, Observation } from "@/types";

export type ObservationDraft = Omit<Observation, "id" | "createdAt">;

const EMPTY_DRAFT: ObservationDraft = {
  date: new Date().toISOString().slice(0, 10),
  symbol: "USD/JPY",
  timeframe: "5m",
  currentPrice: null,
  marketEnvironment: "unclear",
  higherTimeframeDirection: "unclear",
  high: null,
  low: null,
  importantLevels: "",
  structure: "",
  priceAction: "",
  scenario: "",
  noTrade: false,
  emaState: "unset",
  bbState: "unset",
  atrState: "unset",
  rsiState: "unset",
  macdState: "unset",
  notes: "",
  hypothesisId: null,
};

export function ObservationForm({
  initial,
  hypotheses,
  onSave,
  onCancel,
}: {
  initial?: Observation;
  hypotheses: Hypothesis[];
  onSave: (draft: ObservationDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ObservationDraft>(initial ?? EMPTY_DRAFT);

  function update<K extends keyof ObservationDraft>(key: K, value: ObservationDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
          <Input
            value={draft.symbol}
            onChange={(e) => update("symbol", e.target.value)}
            placeholder="USD/JPY"
          />
        </Field>
        <Field label="時間足">
          <Select
            value={draft.timeframe}
            onChange={(e) => update("timeframe", e.target.value as ObservationDraft["timeframe"])}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="トレンド／レンジ（現在足）">
          <Select
            value={draft.marketEnvironment}
            onChange={(e) =>
              update("marketEnvironment", e.target.value as ObservationDraft["marketEnvironment"])
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
                e.target.value as ObservationDraft["higherTimeframeDirection"]
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="直近高値" optional>
          <Input
            type="number"
            step="any"
            value={draft.high ?? ""}
            onChange={(e) => update("high", numberOrNull(e.target.value))}
          />
        </Field>
        <Field label="直近安値" optional>
          <Input
            type="number"
            step="any"
            value={draft.low ?? ""}
            onChange={(e) => update("low", numberOrNull(e.target.value))}
          />
        </Field>
      </div>

      <Field label="重要価格" optional>
        <Input
          value={draft.importantLevels}
          onChange={(e) => update("importantLevels", e.target.value)}
          placeholder="前日高値 158.20、週足レジスタンス 159.00 など"
        />
      </Field>

      <Field label="相場構造" optional>
        <Textarea
          value={draft.structure}
          onChange={(e) => update("structure", e.target.value)}
          placeholder="HH→HLが継続中、直近安値を割り込めば構造変化の可能性 など"
        />
      </Field>

      <Field label="Price Action" optional>
        <Textarea
          value={draft.priceAction}
          onChange={(e) => update("priceAction", e.target.value)}
          placeholder="重要高値付近でPin Bar形成、長い上ヒゲで反発 など"
        />
      </Field>

      <Field label="シナリオ" optional>
        <Textarea
          value={draft.scenario}
          onChange={(e) => update("scenario", e.target.value)}
          placeholder="このレジスタンスを上抜ければ上昇継続、反落すればレンジ継続 など"
        />
      </Field>

      <Checkbox
        label="この場面はNO TRADE（見送り）が合理的だと判断した"
        checked={draft.noTrade}
        onChange={(e) => update("noTrade", e.target.checked)}
      />

      <div>
        <p className="text-sm font-medium text-foreground">インジケーター状態</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["emaState", "EMA"],
              ["bbState", "ボリンジャーバンド"],
              ["atrState", "ATR"],
              ["rsiState", "RSI"],
              ["macdState", "MACD"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <Select value={draft[key]} onChange={(e) => update(key, e.target.value as IndicatorStateValue)}>
                {INDICATOR_STATE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
          ))}
        </div>
      </div>

      <Field label="気づいたこと">
        <Textarea
          value={draft.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="上位足上昇中に押し目を形成している、など"
        />
      </Field>

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

      <div className="flex gap-3">
        <Button onClick={() => onSave(draft)}>保存する</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </Card>
  );
}

type IndicatorStateValue = ObservationDraft["emaState"];
