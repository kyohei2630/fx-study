import type { ChartTrainingType } from "@/types/learning";

export interface ChartTrainingTypeInfo {
  type: ChartTrainingType;
  label: string;
  description: string;
  group: "高値・安値" | "相場構造" | "環境判定";
}

export const CHART_TRAINING_TYPES: ChartTrainingTypeInfo[] = [
  { type: "high", label: "高値を選ぶ", description: "指定範囲内の高値を見極める", group: "高値・安値" },
  { type: "low", label: "安値を選ぶ", description: "指定範囲内の安値を見極める", group: "高値・安値" },
  { type: "highest", label: "最高値を選ぶ", description: "チャート全体の最高値を見極める", group: "高値・安値" },
  { type: "lowest", label: "最安値を選ぶ", description: "チャート全体の最安値を見極める", group: "高値・安値" },
  { type: "recent_high", label: "直近高値を選ぶ", description: "現在位置から見た直近の高値", group: "高値・安値" },
  { type: "recent_low", label: "直近安値を選ぶ", description: "現在位置から見た直近の安値", group: "高値・安値" },
  { type: "swing_high", label: "スイング高値を選ぶ", description: "方向転換した高値を見つける", group: "高値・安値" },
  { type: "swing_low", label: "スイング安値を選ぶ", description: "方向転換した安値を見つける", group: "高値・安値" },
  { type: "important_high", label: "重要高値を選ぶ", description: "大きく反発した重要な高値", group: "高値・安値" },
  { type: "important_low", label: "重要安値を選ぶ", description: "大きく反発した重要な安値", group: "高値・安値" },
  { type: "hh", label: "HHを選ぶ", description: "切り上げ高値（Higher High）", group: "相場構造" },
  { type: "hl", label: "HLを選ぶ", description: "切り上げ安値（Higher Low）", group: "相場構造" },
  { type: "lh", label: "LHを選ぶ", description: "切り下げ高値（Lower High）", group: "相場構造" },
  { type: "ll", label: "LLを選ぶ", description: "切り下げ安値（Lower Low）", group: "相場構造" },
  { type: "breakout", label: "ブレイクを選ぶ", description: "直前の高値・安値の更新を見つける", group: "相場構造" },
  { type: "trend", label: "トレンド判定", description: "上昇・下降・レンジを判断する", group: "環境判定" },
  { type: "range", label: "レンジ判定", description: "レンジ相場かどうかを判断する", group: "環境判定" },
];

export const CHART_TRAINING_TYPES_BY_ID: Record<string, ChartTrainingTypeInfo> =
  Object.fromEntries(CHART_TRAINING_TYPES.map((t) => [t.type, t]));
