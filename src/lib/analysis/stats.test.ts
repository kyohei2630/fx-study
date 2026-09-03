import { describe, expect, it } from "vitest";
import { computeStats, sampleConfidence, type RRecord } from "@/lib/analysis/stats";

function record(rMultiple: number): RRecord {
  const result = rMultiple > 0 ? "win" : rMultiple < 0 ? "loss" : "breakeven";
  return { rMultiple, result };
}

describe("computeStats", () => {
  it("returns zeroed stats for an empty record set", () => {
    const stats = computeStats([]);
    expect(stats.totalCount).toBe(0);
    expect(stats.winRate).toBeNull();
    expect(stats.profitFactor).toBeNull();
  });

  it("computes win rate, counts, and averages", () => {
    const stats = computeStats([record(2), record(-1), record(1), record(-1)]);
    expect(stats.totalCount).toBe(4);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(2);
    expect(stats.winRate).toBe(50);
    expect(stats.avgWin).toBe(1.5);
    expect(stats.avgLoss).toBe(-1);
  });

  it("computes expected value consistent with average R", () => {
    const records = [record(2), record(-1), record(1), record(-1)];
    const stats = computeStats(records);
    // avgR = (2 - 1 + 1 - 1) / 4 = 0.25
    expect(stats.avgR).toBeCloseTo(0.25);
    expect(stats.expectedValue).toBeCloseTo(0.25);
  });

  it("computes Profit Factor as gross profit over gross loss", () => {
    // gross profit = 2 + 1 = 3, gross loss = |-1 -1| = 2 -> PF = 1.5
    const stats = computeStats([record(2), record(-1), record(1), record(-1)]);
    expect(stats.profitFactor).toBe(1.5);
  });

  it("returns null Profit Factor when there are no losses", () => {
    const stats = computeStats([record(1), record(2)]);
    expect(stats.profitFactor).toBeNull();
  });

  it("does not let a high win rate alone imply a good outcome (spec's core warning)", () => {
    // 70% win rate, but avg win +0.5R and avg loss -2R -> negative expectancy
    const records = [
      record(0.5),
      record(0.5),
      record(0.5),
      record(0.5),
      record(0.5),
      record(0.5),
      record(0.5),
      record(-2),
      record(-2),
      record(-2),
    ];
    const stats = computeStats(records);
    expect(stats.winRate).toBe(70);
    expect(stats.expectedValue).toBeLessThan(0);
  });

  it("computes max win and loss streaks in chronological order", () => {
    const stats = computeStats([
      record(1),
      record(1),
      record(-1),
      record(-1),
      record(-1),
      record(1),
    ]);
    expect(stats.maxWinStreak).toBe(2);
    expect(stats.maxLossStreak).toBe(3);
  });

  it("computes the cumulative R series in given order", () => {
    const stats = computeStats([record(1), record(-0.5), record(2)]);
    expect(stats.cumulativeR).toEqual([1, 0.5, 2.5]);
  });

  it("computes max drawdown as the largest peak-to-trough decline", () => {
    // cumulative: 2, 1, 3, 0 -> peak 3, trough 0 -> drawdown 3
    const stats = computeStats([record(2), record(-1), record(2), record(-3)]);
    expect(stats.maxDrawdown).toBe(3);
  });

  it("reports zero drawdown for a monotonically increasing curve", () => {
    const stats = computeStats([record(1), record(1), record(1)]);
    expect(stats.maxDrawdown).toBe(0);
  });
});

describe("sampleConfidence", () => {
  it("labels samples per the spec's thresholds", () => {
    expect(sampleConfidence(0)).toBe("reference");
    expect(sampleConfidence(19)).toBe("reference");
    expect(sampleConfidence(20)).toBe("provisional");
    expect(sampleConfidence(49)).toBe("provisional");
    expect(sampleConfidence(50)).toBe("usable");
    expect(sampleConfidence(99)).toBe("usable");
    expect(sampleConfidence(100)).toBe("reliable");
  });
});
