import type { Candle, MarketVerdict, SwingPoint } from "@/types/chart";

/**
 * Fractal-style swing detection: a candle is a swing high if its high is the
 * strict max within a window of `lookback` candles on each side (swing low is
 * the mirror case for lows). This is a simplification of how traders read
 * swing points visually, good enough for training/grading purposes.
 */
export function findSwingPoints(candles: Candle[], lookback = 2): SwingPoint[] {
  const points: { index: number; price: number; kind: "high" | "low" }[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const isHigh = window.every(
      (c) => c.index === candles[i].index || c.high <= candles[i].high
    );
    const isLow = window.every(
      (c) => c.index === candles[i].index || c.low >= candles[i].low
    );

    if (isHigh) points.push({ index: i, price: candles[i].high, kind: "high" });
    if (isLow) points.push({ index: i, price: candles[i].low, kind: "low" });
  }

  return tagAndScore(points, candles);
}

function tagAndScore(
  raw: { index: number; price: number; kind: "high" | "low" }[],
  candles: Candle[]
): SwingPoint[] {
  const result: SwingPoint[] = [];
  let lastHigh: number | null = null;
  let lastLow: number | null = null;

  for (const point of raw) {
    let tag: SwingPoint["tag"] = null;
    if (point.kind === "high") {
      if (lastHigh !== null) tag = point.price > lastHigh ? "HH" : "LH";
      lastHigh = point.price;
    } else {
      if (lastLow !== null) tag = point.price > lastLow ? "HL" : "LL";
      lastLow = point.price;
    }
    result.push({ ...point, tag, importance: 0 });
  }

  return result.map((point, i) => ({
    ...point,
    importance: computeImportance(result, i, candles),
  }));
}

/** How far price reversed away from this point before the next opposite swing — a proxy for how "important" the level looks. */
function computeImportance(
  points: SwingPoint[],
  i: number,
  candles: Candle[]
): number {
  const point = points[i];
  const prevOpposite = [...points.slice(0, i)].reverse().find((p) => p.kind !== point.kind);
  const nextOpposite = points.slice(i + 1).find((p) => p.kind !== point.kind);

  const distances: number[] = [];
  if (prevOpposite) distances.push(Math.abs(point.price - prevOpposite.price));
  if (nextOpposite) distances.push(Math.abs(point.price - nextOpposite.price));

  const priceRange = Math.max(...candles.map((c) => c.high)) -
    Math.min(...candles.map((c) => c.low));
  if (distances.length === 0 || priceRange === 0) return 0;

  return distances.reduce((a, b) => a + b, 0) / distances.length / priceRange;
}

export function classifyTrend(swings: SwingPoint[]): MarketVerdict {
  const highs = swings.filter((p) => p.kind === "high").slice(-2);
  const lows = swings.filter((p) => p.kind === "low").slice(-2);

  // Fewer than two swing highs/lows means there isn't enough structure to
  // read a trend from at all — "判断困難" is the honest answer here, not a
  // guess dressed up as "range".
  if (highs.length < 2 || lows.length < 2) return "unclear";

  const risingHighs = highs[1].tag === "HH";
  const risingLows = lows[1].tag === "HL";
  const fallingHighs = highs[1].tag === "LH";
  const fallingLows = lows[1].tag === "LL";

  if (risingHighs && risingLows) return "uptrend";
  if (fallingHighs && fallingLows) return "downtrend";
  return "range";
}

export function findHighestCandle(candles: Candle[]): Candle {
  return candles.reduce((max, c) => (c.high > max.high ? c : max), candles[0]);
}

export function findLowestCandle(candles: Candle[]): Candle {
  return candles.reduce((min, c) => (c.low < min.low ? c : min), candles[0]);
}

export function findMostRecentSwing(
  swings: SwingPoint[],
  kind: "high" | "low"
): SwingPoint | null {
  const matches = swings.filter((p) => p.kind === kind);
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

export function findMostImportantSwing(
  swings: SwingPoint[],
  kind: "high" | "low"
): SwingPoint | null {
  const matches = swings.filter((p) => p.kind === kind);
  if (matches.length === 0) return null;
  return matches.reduce((best, p) => (p.importance > best.importance ? p : best));
}

/** First candle whose close breaks beyond the most recent prior swing high/low. */
export function findBreakout(
  candles: Candle[],
  swings: SwingPoint[]
): { candle: Candle; direction: "up" | "down" } | null {
  for (let i = 0; i < candles.length; i++) {
    const priorSwingHighs = swings.filter((p) => p.kind === "high" && p.index < i);
    const priorSwingLows = swings.filter((p) => p.kind === "low" && p.index < i);
    const lastHigh = priorSwingHighs[priorSwingHighs.length - 1];
    const lastLow = priorSwingLows[priorSwingLows.length - 1];

    if (lastHigh && candles[i].close > lastHigh.price) {
      return { candle: candles[i], direction: "up" };
    }
    if (lastLow && candles[i].close < lastLow.price) {
      return { candle: candles[i], direction: "down" };
    }
  }
  return null;
}
