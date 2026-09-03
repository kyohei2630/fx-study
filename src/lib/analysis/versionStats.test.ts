import { describe, expect, it } from "vitest";
import { recordsForVersion } from "@/lib/analysis/versionStats";
import type { Backtest, Trade } from "@/types";

function trade(overrides: Partial<Trade>): Trade {
  return {
    id: "t1",
    date: "2026-09-02",
    time: "10:00",
    symbol: "USD/JPY",
    timeframe: "5m",
    direction: "buy",
    entry: 150,
    stopLoss: 149,
    takeProfit: null,
    exit: 151,
    result: "win",
    rMultiple: 1,
    strategyId: "s1",
    strategyVersionId: "v1",
    marketEnvironment: "unclear",
    higherTimeframeDirection: "unclear",
    ruleCompliant: true,
    psychologyTags: [],
    preTradeNote: "",
    postTradeNote: "",
    screenshot: null,
    createdAt: "2026-09-02T00:00:00.000Z",
    ...overrides,
  };
}

function backtest(overrides: Partial<Backtest>): Backtest {
  return {
    id: "b1",
    date: "2026-09-02",
    symbol: "USD/JPY",
    timeframe: "5m",
    direction: "buy",
    entry: 150,
    stopLoss: 149,
    takeProfit: null,
    exit: 151,
    rMultiple: 1,
    result: "win",
    marketEnvironment: "unclear",
    higherTimeframeDirection: "unclear",
    entryConditions: [],
    exclusionConditions: [],
    hypothesisId: null,
    strategyId: "s1",
    strategyVersionId: "v1",
    screenshot: null,
    comment: "",
    createdAt: "2026-09-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("recordsForVersion", () => {
  it("includes only closed trades and backtests matching the version id", () => {
    const trades = [
      trade({ id: "t1", strategyVersionId: "v1" }),
      trade({ id: "t2", strategyVersionId: "v2" }),
      trade({ id: "t3", strategyVersionId: "v1", result: null, rMultiple: null }), // open, excluded
    ];
    const backtests = [
      backtest({ id: "b1", strategyVersionId: "v1" }),
      backtest({ id: "b2", strategyVersionId: "v2" }),
    ];

    const records = recordsForVersion(trades, backtests, "v1");
    expect(records).toHaveLength(2);
  });

  it("returns an empty array when nothing matches", () => {
    expect(recordsForVersion([], [], "v1")).toEqual([]);
  });
});
