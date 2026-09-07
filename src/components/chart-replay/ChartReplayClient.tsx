"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Ban } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { CandlestickChart, type CandlestickMarker } from "@/components/chart/CandlestickChart";
import { generateCandles } from "@/lib/chart/generateCandles";
import { randomSeed } from "@/lib/chart/random";
import { calculateR, resultFromR } from "@/lib/calculations/r";
import { DIRECTION_OPTIONS } from "@/lib/options";
import type { Direction } from "@/types";

const TOTAL_CANDLES = 80;
const INITIAL_VISIBLE = 30;

type Phase = "observing" | "entering" | "entered" | "no_trade" | "finished";

interface EntryPlan {
  direction: Direction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  entryIndex: number;
}

export function ChartReplayClient() {
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(randomSeed()), []);

  const fullCandles = useMemo(
    () => (seed === null ? [] : generateCandles({ seed, count: TOTAL_CANDLES })),
    [seed]
  );

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [phase, setPhase] = useState<Phase>("observing");
  const [plan, setPlan] = useState<EntryPlan | null>(null);
  const [exitIndex, setExitIndex] = useState<number | null>(null);
  const [exitPrice, setExitPrice] = useState<number | null>(null);

  const [draftDirection, setDraftDirection] = useState<Direction>("buy");
  const [draftEntry, setDraftEntry] = useState("");
  const [draftSL, setDraftSL] = useState("");
  const [draftTP, setDraftTP] = useState("");

  // Auto-detect whether newly revealed candles touched the stop loss or take
  // profit, or whether we simply ran out of replay data with the trade open.
  useEffect(() => {
    if (phase !== "entered" || !plan || fullCandles.length === 0) return;

    for (let i = plan.entryIndex + 1; i < visibleCount; i++) {
      const c = fullCandles[i];
      const hitSL = plan.direction === "buy" ? c.low <= plan.stopLoss : c.high >= plan.stopLoss;
      const hitTP = plan.direction === "buy" ? c.high >= plan.takeProfit : c.low <= plan.takeProfit;
      if (hitSL || hitTP) {
        setExitIndex(i);
        setExitPrice(hitSL ? plan.stopLoss : plan.takeProfit);
        setPhase("finished");
        return;
      }
    }

    if (visibleCount >= fullCandles.length) {
      setExitIndex(fullCandles.length - 1);
      setExitPrice(fullCandles[fullCandles.length - 1].close);
      setPhase("finished");
    }
  }, [visibleCount, phase, plan, fullCandles]);

  if (seed === null || fullCandles.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="h-96 animate-pulse" />
      </div>
    );
  }

  const visible = fullCandles.slice(0, visibleCount);
  const lastClose = visible[visible.length - 1].close;
  const atEnd = visibleCount >= fullCandles.length;

  function reset() {
    setSeed(randomSeed());
    setVisibleCount(INITIAL_VISIBLE);
    setPhase("observing");
    setPlan(null);
    setExitIndex(null);
    setExitPrice(null);
    setDraftDirection("buy");
    setDraftEntry("");
    setDraftSL("");
    setDraftTP("");
  }

  function advance() {
    setVisibleCount((prev) => Math.min(prev + 1, fullCandles.length));
  }

  function revealAll() {
    setVisibleCount(fullCandles.length);
  }

  function openEntryForm() {
    setDraftDirection("buy");
    setDraftEntry(String(lastClose));
    setDraftSL("");
    setDraftTP("");
    setPhase("entering");
  }

  function confirmEntry() {
    const entryPrice = Number(draftEntry);
    const stopLoss = Number(draftSL);
    const takeProfit = Number(draftTP);
    if (![entryPrice, stopLoss, takeProfit].every(Number.isFinite)) return;
    if (stopLoss === entryPrice) return;

    setPlan({
      direction: draftDirection,
      entryPrice,
      stopLoss,
      takeProfit,
      entryIndex: visibleCount - 1,
    });
    setPhase("entered");
  }

  function closeManually() {
    if (!plan) return;
    setExitIndex(visibleCount - 1);
    setExitPrice(lastClose);
    setPhase("finished");
  }

  const markers: CandlestickMarker[] = [];
  if (plan) markers.push({ index: plan.entryIndex, color: "primary" });
  if (phase === "finished" && exitIndex !== null && plan) {
    const r = calculateR(plan.direction, plan.entryPrice, plan.stopLoss, exitPrice ?? plan.entryPrice);
    markers.push({ index: exitIndex, color: r !== null && r > 0 ? "success" : "danger" });
  }

  const entryValid =
    Number.isFinite(Number(draftEntry)) &&
    Number.isFinite(Number(draftSL)) &&
    Number.isFinite(Number(draftTP)) &&
    Number(draftSL) !== Number(draftEntry);

  return (
    <div className="space-y-6">
      <Header />

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {visibleCount} / {fullCandles.length} 本を表示中
          </p>
          <span className="text-sm font-semibold text-foreground">現在値 {lastClose}</span>
        </div>
        <div className="mt-3">
          <CandlestickChart candles={visible} markers={markers} interactive={false} />
        </div>
      </Card>

      {phase === "observing" && (
        <Card className="flex flex-wrap gap-3">
          <Button onClick={advance} disabled={atEnd}>
            <RefreshCcw className="h-4 w-4" />
            次の足へ進む
          </Button>
          <Button variant="secondary" onClick={openEntryForm}>
            エントリーを検討する
          </Button>
          <Button variant="ghost" onClick={() => setPhase("no_trade")}>
            <Ban className="h-4 w-4" />
            NO TRADE（見送り）にする
          </Button>
        </Card>
      )}

      {phase === "entering" && (
        <Card className="space-y-4">
          <CardTitle>エントリー計画</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="方向">
              <Select
                value={draftDirection}
                onChange={(e) => setDraftDirection(e.target.value as Direction)}
              >
                {DIRECTION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="エントリー価格">
              <Input
                type="number"
                step="any"
                value={draftEntry}
                onChange={(e) => setDraftEntry(e.target.value)}
              />
            </Field>
            <Field label="SL（損切り）">
              <Input
                type="number"
                step="any"
                value={draftSL}
                onChange={(e) => setDraftSL(e.target.value)}
              />
            </Field>
            <Field label="TP（利確）">
              <Input
                type="number"
                step="any"
                value={draftTP}
                onChange={(e) => setDraftTP(e.target.value)}
              />
            </Field>
          </div>
          <div className="flex gap-3">
            <Button onClick={confirmEntry} disabled={!entryValid}>
              エントリーを確定する
            </Button>
            <Button variant="secondary" onClick={() => setPhase("observing")}>
              キャンセル
            </Button>
          </div>
        </Card>
      )}

      {phase === "entered" && plan && (
        <Card className="space-y-3">
          <p className="text-sm text-foreground">
            {DIRECTION_OPTIONS.find((o) => o.value === plan.direction)?.label} @{" "}
            {plan.entryPrice} ・ SL {plan.stopLoss} ・ TP {plan.takeProfit}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={advance} disabled={atEnd}>
              <RefreshCcw className="h-4 w-4" />
              次の足へ進む
            </Button>
            <Button variant="secondary" onClick={closeManually}>
              ここで決済する
            </Button>
          </div>
        </Card>
      )}

      {phase === "no_trade" && (
        <Card className="space-y-3">
          <p className="text-sm text-foreground">
            NO TRADEと判断しました。その後の値動きを確認してみましょう。
          </p>
          <Button variant="secondary" onClick={revealAll} disabled={atEnd}>
            残りの値動きを見る
          </Button>
          {atEnd && (
            <p className="text-sm text-muted-foreground">
              見送った後の値動きはこの通りでした。エントリーしていたら、結果はどうなっていたか考えてみましょう。
            </p>
          )}
          <Button variant="ghost" onClick={reset}>
            もう一度練習する
          </Button>
        </Card>
      )}

      {phase === "finished" && plan && exitPrice !== null && (
        <ResultCard plan={plan} exitPrice={exitPrice} onRetry={reset} />
      )}
    </div>
  );
}

function ResultCard({
  plan,
  exitPrice,
  onRetry,
}: {
  plan: EntryPlan;
  exitPrice: number;
  onRetry: () => void;
}) {
  const r = calculateR(plan.direction, plan.entryPrice, plan.stopLoss, exitPrice);
  const result = resultFromR(r);
  const resultLabel =
    result === "win" ? "勝ち" : result === "loss" ? "負け" : result === "breakeven" ? "同値" : "計算不可";

  return (
    <Card className="space-y-3">
      <CardTitle>結果</CardTitle>
      <p className="text-lg font-bold text-foreground">
        {resultLabel}
        {r !== null && <span className="ml-2 text-base font-semibold">{r.toFixed(2)}R</span>}
      </p>
      <p className="text-sm text-muted-foreground">
        エントリー {plan.entryPrice} ・ 決済 {exitPrice} ・ SL {plan.stopLoss} ・ TP {plan.takeProfit}
      </p>
      <p className="text-sm text-foreground">
        結果そのものより、「なぜここでエントリーしたのか」「SL/TPの根拠は何だったか」を振り返ることが重要です。
      </p>
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCcw className="h-4 w-4" />
        もう一度練習する
      </Button>
    </Card>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">チャートリプレイ</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ローソク足を1本ずつ進めながら、観察・判断・エントリー・結果検証を練習します。
      </p>
    </div>
  );
}
