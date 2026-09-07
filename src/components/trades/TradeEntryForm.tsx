"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import {
  DIRECTION_OPTIONS,
  TIMEFRAME_OPTIONS,
  TREND_STATE_OPTIONS,
} from "@/lib/options";
import type { Direction, Timeframe, Trade, TrendState } from "@/types";

export interface TradeEntryDraft {
  date: string;
  time: string;
  symbol: string;
  timeframe: Timeframe;
  direction: Direction;
  entry: number;
  stopLoss: number;
  takeProfit: number | null;
  strategyId: string | null;
  strategyVersionId: string | null;
  marketEnvironment: TrendState;
  higherTimeframeDirection: TrendState;
  structure: string;
  priceAction: string;
  preTradeNote: string;
}

function toDraft(trade?: Trade): TradeEntryDraft {
  if (!trade) {
    const now = new Date();
    return {
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      symbol: "USD/JPY",
      timeframe: "5m",
      direction: "buy",
      entry: 0,
      stopLoss: 0,
      takeProfit: null,
      strategyId: null,
      strategyVersionId: null,
      marketEnvironment: "unclear",
      higherTimeframeDirection: "unclear",
      structure: "",
      priceAction: "",
      preTradeNote: "",
    };
  }
  return {
    date: trade.date,
    time: trade.time,
    symbol: trade.symbol,
    timeframe: trade.timeframe,
    direction: trade.direction,
    entry: trade.entry,
    stopLoss: trade.stopLoss,
    takeProfit: trade.takeProfit,
    strategyId: trade.strategyId,
    strategyVersionId: trade.strategyVersionId,
    marketEnvironment: trade.marketEnvironment,
    higherTimeframeDirection: trade.higherTimeframeDirection,
    structure: trade.structure,
    priceAction: trade.priceAction,
    preTradeNote: trade.preTradeNote,
  };
}

export function TradeEntryForm({
  initial,
  strategies,
  strategyVersions,
  onSave,
  onCancel,
}: {
  initial?: Trade;
  strategies: { id: string; name: string }[];
  strategyVersions: { id: string; strategyId: string; version: string }[];
  onSave: (draft: TradeEntryDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TradeEntryDraft>(toDraft(initial));

  function update<K extends keyof TradeEntryDraft>(key: K, value: TradeEntryDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card className="space-y-5">
      <p className="text-sm font-bold text-muted-foreground">トレード前の記録</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="日付">
          <Input type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} />
        </Field>
        <Field label="時刻">
          <Input type="time" value={draft.time} onChange={(e) => update("time", e.target.value)} />
        </Field>
        <Field label="通貨ペア">
          <Input value={draft.symbol} onChange={(e) => update("symbol", e.target.value)} />
        </Field>
        <Field label="時間足">
          <Select
            value={draft.timeframe}
            onChange={(e) => update("timeframe", e.target.value as Timeframe)}
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

      <div className="grid gap-4 sm:grid-cols-3">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="市場環境">
          <Select
            value={draft.marketEnvironment}
            onChange={(e) => update("marketEnvironment", e.target.value as TrendState)}
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
            onChange={(e) => update("higherTimeframeDirection", e.target.value as TrendState)}
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
        <Field label="戦略" optional>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="相場構造" optional>
          <Textarea
            value={draft.structure}
            onChange={(e) => update("structure", e.target.value)}
            placeholder="HH→HLが継続中 など"
          />
        </Field>
        <Field label="Price Action" optional>
          <Textarea
            value={draft.priceAction}
            onChange={(e) => update("priceAction", e.target.value)}
            placeholder="重要高値でPin Bar形成 など"
          />
        </Field>
      </div>

      <Field label="なぜエントリーするのか">
        <Textarea
          value={draft.preTradeNote}
          onChange={(e) => update("preTradeNote", e.target.value)}
          placeholder="エントリー理由、根拠となる条件など"
        />
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
