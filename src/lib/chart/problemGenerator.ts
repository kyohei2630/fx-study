import { generateCandles } from "@/lib/chart/generateCandles";
import {
  classifyTrend,
  findBreakout,
  findHighestCandle,
  findLowestCandle,
  findMostImportantSwing,
  findMostRecentSwing,
  findSwingPoints,
} from "@/lib/chart/swingPoints";
import { mulberry32 } from "@/lib/chart/random";
import type { Candle, SwingPoint } from "@/types/chart";
import type { ChartTrainingType } from "@/types/learning";

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface ChartProblem {
  type: ChartTrainingType;
  seed: number;
  candles: Candle[];
  swings: SwingPoint[];
  question: string;
  interaction: "click" | "choice";
  highlightRange?: [number, number];
  choices?: ChoiceOption[];
  correctChoiceId?: string;
  correctIndex?: number;
  acceptableIndices?: number[];
  explanation: string;
}

export const CLICK_TYPES: ChartTrainingType[] = [
  "high",
  "low",
  "highest",
  "lowest",
  "recent_high",
  "recent_low",
  "swing_high",
  "swing_low",
  "important_high",
  "important_low",
  "hh",
  "hl",
  "lh",
  "ll",
  "breakout",
];

export const CHOICE_TYPES: ChartTrainingType[] = ["trend", "range"];

const TYPE_LABELS: Record<ChartTrainingType, string> = {
  high: "高値",
  low: "安値",
  highest: "最高値",
  lowest: "最安値",
  recent_high: "直近高値",
  recent_low: "直近安値",
  swing_high: "スイング高値",
  swing_low: "スイング安値",
  important_high: "重要高値",
  important_low: "重要安値",
  hh: "HH（切り上げ高値）",
  hl: "HL（切り上げ安値）",
  lh: "LH（切り下げ高値）",
  ll: "LL（切り下げ安値）",
  trend: "トレンド判定",
  range: "レンジ判定",
  breakout: "ブレイク",
};

export function typeLabel(type: ChartTrainingType): string {
  return TYPE_LABELS[type];
}

export function generateProblem(
  type: ChartTrainingType,
  seed: number
): ChartProblem {
  const candles = generateCandles({ seed, count: 50 });
  const swings = findSwingPoints(candles);

  switch (type) {
    case "high":
    case "low":
      return buildRangeHighLow(type, seed, candles, swings);
    case "highest":
      return buildGlobalExtreme("highest", seed, candles, swings);
    case "lowest":
      return buildGlobalExtreme("lowest", seed, candles, swings);
    case "recent_high":
      return buildRecent("recent_high", seed, candles, swings);
    case "recent_low":
      return buildRecent("recent_low", seed, candles, swings);
    case "swing_high":
      return buildAnySwing("swing_high", seed, candles, swings);
    case "swing_low":
      return buildAnySwing("swing_low", seed, candles, swings);
    case "important_high":
      return buildImportant("important_high", seed, candles, swings);
    case "important_low":
      return buildImportant("important_low", seed, candles, swings);
    case "hh":
    case "hl":
    case "lh":
    case "ll":
      return buildStructureTag(type, seed, candles, swings);
    case "breakout":
      return buildBreakout(seed, candles, swings);
    case "trend":
    case "range":
      return buildTrendJudgement(type, seed, candles, swings);
  }
}

function buildRangeHighLow(
  type: "high" | "low",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const rand = mulberry32(seed + 1);
  const rangeLength = 6;
  const start = 5 + Math.floor(rand() * (candles.length - rangeLength - 10));
  const end = start + rangeLength - 1;
  const window = candles.slice(start, end + 1);

  const target =
    type === "high"
      ? window.reduce((m, c) => (c.high > m.high ? c : m), window[0])
      : window.reduce((m, c) => (c.low < m.low ? c : m), window[0]);

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    highlightRange: [start, end],
    question:
      type === "high"
        ? "ハイライトされた範囲の中で、高値（最も高い価格）のローソク足を選んでください。"
        : "ハイライトされた範囲の中で、安値（最も低い価格）のローソク足を選んでください。",
    correctIndex: target.index,
    acceptableIndices: [],
    explanation:
      type === "high"
        ? `この範囲では ${target.index + 1} 本目のローソク足のヒゲ先端が最も高い価格（${target.high}）です。`
        : `この範囲では ${target.index + 1} 本目のローソク足のヒゲ先端が最も低い価格（${target.low}）です。`,
  };
}

function buildGlobalExtreme(
  type: "highest" | "lowest",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const target =
    type === "highest" ? findHighestCandle(candles) : findLowestCandle(candles);

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    question:
      type === "highest"
        ? "チャート全体の中で、最高値（最も高い価格）のローソク足を選んでください。"
        : "チャート全体の中で、最安値（最も低い価格）のローソク足を選んでください。",
    correctIndex: target.index,
    acceptableIndices: [],
    explanation:
      type === "highest"
        ? `チャート全体で最も高い価格（${target.high}）を付けたのは ${target.index + 1} 本目です。ただし最高値が必ずしも今後のトレードで最も重要とは限りません。`
        : `チャート全体で最も低い価格（${target.low}）を付けたのは ${target.index + 1} 本目です。`,
  };
}

function buildRecent(
  type: "recent_high" | "recent_low",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const kind = type === "recent_high" ? "high" : "low";
  const target = findMostRecentSwing(swings, kind);
  const fallback = kind === "high" ? findHighestCandle(candles) : findLowestCandle(candles);
  const correctIndex = target ? candles[target.index].index : fallback.index;

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    question:
      type === "recent_high"
        ? "現在位置から見て、直近の高値（最近形成された高値）のローソク足を選んでください。"
        : "現在位置から見て、直近の安値（最近形成された安値）のローソク足を選んでください。",
    correctIndex,
    acceptableIndices: swings
      .filter((p) => p.kind === kind)
      .slice(-2)
      .map((p) => candles[p.index].index),
    explanation: target
      ? `最も右側（現在に近い側）にある${kind === "high" ? "スイング高値" : "スイング安値"}が直近${kind === "high" ? "高値" : "安値"}です。`
      : "明確なスイングが少ないため、チャート全体の最高値/最安値を直近の基準としています。",
  };
}

function buildAnySwing(
  type: "swing_high" | "swing_low",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const kind = type === "swing_high" ? "high" : "low";
  const matches = swings.filter((p) => p.kind === kind);
  const primary = matches[Math.floor(matches.length / 2)] ?? matches[0];
  const correctIndex = primary ? candles[primary.index].index : 0;

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    question:
      type === "swing_high"
        ? "価格が上昇から下降へ転換した「スイング高値」を1つ選んでください。"
        : "価格が下降から上昇へ転換した「スイング安値」を1つ選んでください。",
    correctIndex,
    acceptableIndices: matches.map((p) => candles[p.index].index),
    explanation:
      "スイング高値・安値は複数存在することがあります。方向転換したポイントであれば、どれを選んでも基本的に正解です。",
  };
}

function buildImportant(
  type: "important_high" | "important_low",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const kind = type === "important_high" ? "high" : "low";
  const target = findMostImportantSwing(swings, kind);
  const fallback = kind === "high" ? findHighestCandle(candles) : findLowestCandle(candles);
  const correctIndex = target ? candles[target.index].index : fallback.index;
  const others = swings
    .filter((p) => p.kind === kind && p.index !== target?.index)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 2)
    .map((p) => candles[p.index].index);

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    question:
      type === "important_high"
        ? "この中で最も「重要」と考えられる高値を選んでください（大きく反発したポイントに注目）。"
        : "この中で最も「重要」と考えられる安値を選んでください（大きく反発したポイントに注目）。",
    correctIndex,
    acceptableIndices: others,
    explanation:
      "重要高値・安値は、そこからどれだけ大きく価格が反発したかが判断材料の一つです。前後の反対側のスイングとの値幅が最も大きいポイントを重要度が高いとみなしています。",
  };
}

function buildStructureTag(
  type: "hh" | "hl" | "lh" | "ll",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const tag = type.toUpperCase() as "HH" | "HL" | "LH" | "LL";
  const matches = swings.filter((p) => p.tag === tag);
  const target = matches[matches.length - 1];

  const kind = tag === "HH" || tag === "LH" ? "high" : "low";
  const fallbackMatches = swings.filter((p) => p.kind === kind);
  const fallback = fallbackMatches[fallbackMatches.length - 1];
  const chosen = target ?? fallback;
  const correctIndex = chosen ? candles[chosen.index].index : 0;

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "click",
    question: `直近の ${tag}（${describeTag(tag)}）にあたるローソク足を選んでください。`,
    correctIndex,
    acceptableIndices: matches.slice(0, -1).map((p) => candles[p.index].index),
    explanation: target
      ? `直前の${kind === "high" ? "高値" : "安値"}と比べて${tag === "HH" || tag === "HL" ? "切り上がって" : "切り下がって"}いるポイントが ${tag} です。`
      : `このチャートには明確な ${tag} が少ないため、直近の${kind === "high" ? "スイング高値" : "スイング安値"}を基準にしています。`,
  };
}

function describeTag(tag: "HH" | "HL" | "LH" | "LL"): string {
  switch (tag) {
    case "HH":
      return "前回の高値を上回った高値";
    case "HL":
      return "前回の安値を上回った安値";
    case "LH":
      return "前回の高値を下回った高値";
    case "LL":
      return "前回の安値を下回った安値";
  }
}

function buildBreakout(
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const breakout = findBreakout(candles, swings);
  const correctIndex = breakout ? breakout.candle.index : candles[candles.length - 1].index;

  return {
    type: "breakout",
    seed,
    candles,
    swings,
    interaction: "click",
    question: "直前のスイング高値・安値を明確に更新（ブレイク）したローソク足を選んでください。",
    correctIndex,
    acceptableIndices: [],
    explanation: breakout
      ? `終値が直前のスイング${breakout.direction === "up" ? "高値" : "安値"}を明確に超えたローソク足がブレイクです。`
      : "このチャートでは明確なブレイクが見られませんでした。直前のスイング高値・安値を意識して観察してみましょう。",
  };
}

function buildTrendJudgement(
  type: "trend" | "range",
  seed: number,
  candles: Candle[],
  swings: SwingPoint[]
): ChartProblem {
  const verdict = classifyTrend(swings);
  const choices: ChoiceOption[] = [
    { id: "uptrend", label: "上昇トレンド" },
    { id: "downtrend", label: "下降トレンド" },
    { id: "range", label: "レンジ" },
    { id: "unclear", label: "判断困難" },
  ];

  const explanations: Record<typeof verdict, string> = {
    uptrend: "直近の高値・安値がともに切り上がっており（HH・HL）、上昇トレンドと判断できます。",
    downtrend: "直近の高値・安値がともに切り下がっており（LL・LH）、下降トレンドと判断できます。",
    range: "高値・安値が明確な方向を持たず、一定範囲を往復しているためレンジと判断できます。",
    unclear:
      "明確なスイング高値・安値がまだ十分に形成されておらず、トレンドかレンジかを無理に判断できる材料がありません。このような場面では「判断困難」と答えるのが合理的です。",
  };

  return {
    type,
    seed,
    candles,
    swings,
    interaction: "choice",
    question:
      type === "trend"
        ? "このチャートは現在、上昇トレンド・下降トレンド・レンジのどれですか？"
        : "このチャートはレンジ相場ですか？ 最も近いものを選んでください。",
    choices,
    correctChoiceId: verdict,
    explanation: explanations[verdict],
  };
}
