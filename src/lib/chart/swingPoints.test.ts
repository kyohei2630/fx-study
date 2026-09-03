import { describe, expect, it } from "vitest";
import { classifyTrend, findBreakout, findSwingPoints } from "@/lib/chart/swingPoints";
import type { Candle } from "@/types/chart";

function candle(index: number, high: number, low: number): Candle {
  const mid = (high + low) / 2;
  return { index, open: mid, close: mid, high, low };
}

describe("findSwingPoints", () => {
  it("detects a simple peak as a swing high", () => {
    // 0  1  2  3  4  -> peak at index 2
    const candles = [
      candle(0, 10, 8),
      candle(1, 12, 10),
      candle(2, 15, 13),
      candle(3, 12, 10),
      candle(4, 10, 8),
    ];
    const swings = findSwingPoints(candles, 2);
    expect(swings).toHaveLength(1);
    expect(swings[0]).toMatchObject({ index: 2, kind: "high" });
  });

  it("detects a simple trough as a swing low", () => {
    const candles = [
      candle(0, 20, 18),
      candle(1, 18, 15),
      candle(2, 15, 12),
      candle(3, 18, 15),
      candle(4, 20, 18),
    ];
    const swings = findSwingPoints(candles, 2);
    expect(swings).toHaveLength(1);
    expect(swings[0]).toMatchObject({ index: 2, kind: "low" });
  });

  it("tags a higher second swing high as HH and a lower one as LH", () => {
    // Two peaks: first at 15, second higher at 18 -> HH
    const candles = [
      candle(0, 10, 8),
      candle(1, 12, 10),
      candle(2, 15, 13), // swing high #1
      candle(3, 11, 9),
      candle(4, 9, 7), // swing low
      candle(5, 13, 11),
      candle(6, 18, 16), // swing high #2, higher than #1 -> HH
      candle(7, 14, 12),
      candle(8, 10, 8),
    ];
    const swings = findSwingPoints(candles, 2);
    const highs = swings.filter((p) => p.kind === "high");
    expect(highs).toHaveLength(2);
    expect(highs[0].tag).toBeNull();
    expect(highs[1].tag).toBe("HH");
  });
});

describe("classifyTrend", () => {
  it("classifies HH+HL sequence as an uptrend", () => {
    const swings = [
      { index: 0, price: 10, kind: "low" as const, tag: null, importance: 0 },
      { index: 1, price: 15, kind: "high" as const, tag: null, importance: 0 },
      { index: 2, price: 12, kind: "low" as const, tag: "HL" as const, importance: 0 },
      { index: 3, price: 18, kind: "high" as const, tag: "HH" as const, importance: 0 },
    ];
    expect(classifyTrend(swings)).toBe("uptrend");
  });

  it("classifies LL+LH sequence as a downtrend", () => {
    const swings = [
      { index: 0, price: 18, kind: "high" as const, tag: null, importance: 0 },
      { index: 1, price: 10, kind: "low" as const, tag: null, importance: 0 },
      { index: 2, price: 15, kind: "high" as const, tag: "LH" as const, importance: 0 },
      { index: 3, price: 8, kind: "low" as const, tag: "LL" as const, importance: 0 },
    ];
    expect(classifyTrend(swings)).toBe("downtrend");
  });

  it("classifies a mixed sequence as range", () => {
    const swings = [
      { index: 0, price: 10, kind: "low" as const, tag: null, importance: 0 },
      { index: 1, price: 15, kind: "high" as const, tag: null, importance: 0 },
      { index: 2, price: 9, kind: "low" as const, tag: "LL" as const, importance: 0 },
      { index: 3, price: 16, kind: "high" as const, tag: "HH" as const, importance: 0 },
    ];
    expect(classifyTrend(swings)).toBe("range");
  });
});

describe("findBreakout", () => {
  it("finds the first candle whose close breaks the prior swing high", () => {
    const candles = [
      candle(0, 10, 8),
      candle(1, 12, 10),
      candle(2, 15, 13), // swing high at 15
      candle(3, 11, 9),
      candle(4, 9, 7), // swing low
      candle(5, 13, 11),
      candle(6, 20, 14), // breaks above 15
    ];
    const swings = findSwingPoints(candles, 2);
    const breakout = findBreakout(candles, swings);
    expect(breakout?.direction).toBe("up");
    expect(breakout?.candle.index).toBe(6);
  });

  it("returns null when price never breaks a prior swing", () => {
    const candles = [candle(0, 10, 8), candle(1, 11, 9), candle(2, 10, 8)];
    const swings = findSwingPoints(candles, 2);
    expect(findBreakout(candles, swings)).toBeNull();
  });
});
