import { mulberry32 } from "@/lib/chart/random";
import type { Candle } from "@/types/chart";

export interface GenerateCandlesOptions {
  seed: number;
  count?: number;
  startPrice?: number;
}

/**
 * Generates a plausible-looking OHLC series using alternating trend segments
 * (rather than pure random walk) so the result actually contains readable
 * swing highs/lows and HH/HL/LH/LL structure for training purposes.
 */
export function generateCandles({
  seed,
  count = 50,
  startPrice = 150,
}: GenerateCandlesOptions): Candle[] {
  const rand = mulberry32(seed);
  const candles: Candle[] = [];

  let price = startPrice;
  const volatility = startPrice * 0.006;

  const segmentCount = 4 + Math.floor(rand() * 3); // 4–6 segments
  const segmentLengths = splitIntoSegments(count, segmentCount, rand);

  let candleIndex = 0;
  for (const segmentLength of segmentLengths) {
    // Alternate-ish drift direction with random magnitude, so segments read
    // as distinct legs (impulse up, pullback, impulse down, etc.).
    const drift = (rand() < 0.5 ? -1 : 1) * (0.15 + rand() * 0.55) * volatility;

    for (let i = 0; i < segmentLength && candleIndex < count; i++, candleIndex++) {
      const open = price;
      const noise = (rand() - 0.5) * volatility * 1.4;
      const close = open + drift + noise;

      const bodyHigh = Math.max(open, close);
      const bodyLow = Math.min(open, close);
      const upperWick = rand() * volatility * 0.9;
      const lowerWick = rand() * volatility * 0.9;

      candles.push({
        index: candleIndex,
        open: round(open),
        close: round(close),
        high: round(bodyHigh + upperWick),
        low: round(bodyLow - lowerWick),
      });

      price = close;
    }
  }

  return candles;
}

function splitIntoSegments(
  total: number,
  segments: number,
  rand: () => number
): number[] {
  const weights = Array.from({ length: segments }, () => 0.5 + rand());
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const lengths = weights.map((w) => Math.max(3, Math.round((w / weightSum) * total)));

  // Rounding can drift the total off; correct it on the last segment.
  const diff = total - lengths.reduce((a, b) => a + b, 0);
  lengths[lengths.length - 1] += diff;
  return lengths;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
