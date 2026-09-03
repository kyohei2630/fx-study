export interface RRecord {
  rMultiple: number;
  result: "win" | "loss" | "breakeven";
}

export interface Stats {
  totalCount: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number | null;
  avgWin: number | null;
  avgLoss: number | null;
  avgR: number | null;
  expectedValue: number | null;
  profitFactor: number | null;
  maxWinStreak: number;
  maxLossStreak: number;
  maxDrawdown: number;
  cumulativeR: number[];
}

const EMPTY_STATS: Stats = {
  totalCount: 0,
  wins: 0,
  losses: 0,
  breakevens: 0,
  winRate: null,
  avgWin: null,
  avgLoss: null,
  avgR: null,
  expectedValue: null,
  profitFactor: null,
  maxWinStreak: 0,
  maxLossStreak: 0,
  maxDrawdown: 0,
  cumulativeR: [],
};

/**
 * Computes the full stats bundle. `records` must be given in chronological
 * order (oldest first) — streaks, drawdown, and the cumulative-R series all
 * depend on that ordering.
 */
export function computeStats(records: RRecord[]): Stats {
  if (records.length === 0) return EMPTY_STATS;

  const wins = records.filter((r) => r.result === "win");
  const losses = records.filter((r) => r.result === "loss");
  const breakevens = records.filter((r) => r.result === "breakeven");

  const winRate = (wins.length / records.length) * 100;
  const lossRate = losses.length / records.length;
  const winShare = wins.length / records.length;

  const avgWin = wins.length > 0 ? average(wins.map((r) => r.rMultiple)) : null;
  const avgLoss = losses.length > 0 ? average(losses.map((r) => r.rMultiple)) : null;
  const avgR = average(records.map((r) => r.rMultiple));

  const expectedValue = winShare * (avgWin ?? 0) + lossRate * (avgLoss ?? 0);

  const grossProfit = sum(wins.map((r) => r.rMultiple));
  const grossLoss = Math.abs(sum(losses.map((r) => r.rMultiple)));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : null;

  const { maxWinStreak, maxLossStreak } = computeStreaks(records);
  const cumulativeR = computeCumulative(records);
  const maxDrawdown = computeMaxDrawdown(cumulativeR);

  return {
    totalCount: records.length,
    wins: wins.length,
    losses: losses.length,
    breakevens: breakevens.length,
    winRate,
    avgWin,
    avgLoss,
    avgR,
    expectedValue,
    profitFactor,
    maxWinStreak,
    maxLossStreak,
    maxDrawdown,
    cumulativeR,
  };
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

function computeStreaks(records: RRecord[]): {
  maxWinStreak: number;
  maxLossStreak: number;
} {
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  for (const record of records) {
    if (record.result === "win") {
      currentWinStreak += 1;
      currentLossStreak = 0;
    } else if (record.result === "loss") {
      currentLossStreak += 1;
      currentWinStreak = 0;
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
    maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
  }

  return { maxWinStreak, maxLossStreak };
}

function computeCumulative(records: RRecord[]): number[] {
  let running = 0;
  return records.map((r) => {
    running += r.rMultiple;
    return running;
  });
}

function computeMaxDrawdown(cumulativeR: number[]): number {
  let peak = 0;
  let maxDrawdown = 0;
  for (const value of cumulativeR) {
    peak = Math.max(peak, value);
    maxDrawdown = Math.max(maxDrawdown, peak - value);
  }
  return maxDrawdown;
}

export type SampleConfidence = "reference" | "provisional" | "usable" | "reliable";

export function sampleConfidence(n: number): SampleConfidence {
  if (n < 20) return "reference";
  if (n < 50) return "provisional";
  if (n < 100) return "usable";
  return "reliable";
}

export const SAMPLE_CONFIDENCE_LABEL: Record<SampleConfidence, string> = {
  reference: "参考値（20件未満）",
  provisional: "暫定評価（20〜49件）",
  usable: "評価可能（50〜99件）",
  reliable: "比較的信頼性の高い検証（100件以上）",
};
