import type {
  Direction,
  HypothesisStatus,
  IndicatorState,
  PsychologyTag,
  Timeframe,
  TrendState,
} from "@/types";

export const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: "1m", label: "1分足" },
  { value: "5m", label: "5分足" },
  { value: "15m", label: "15分足" },
  { value: "1h", label: "1時間足" },
  { value: "4h", label: "4時間足" },
  { value: "1d", label: "日足" },
  { value: "1w", label: "週足" },
];

export const TREND_STATE_OPTIONS: { value: TrendState; label: string }[] = [
  { value: "uptrend", label: "上昇トレンド" },
  { value: "downtrend", label: "下降トレンド" },
  { value: "range", label: "レンジ" },
  { value: "unclear", label: "判断が難しい" },
];

export const INDICATOR_STATE_OPTIONS: { value: IndicatorState; label: string }[] = [
  { value: "unset", label: "未記録" },
  { value: "above", label: "価格が上" },
  { value: "below", label: "価格が下" },
  { value: "near", label: "付近" },
  { value: "flat", label: "横ばい" },
  { value: "expanding", label: "拡大" },
  { value: "squeezing", label: "収縮" },
  { value: "overbought", label: "買われすぎ水準" },
  { value: "oversold", label: "売られすぎ水準" },
];

export const DIRECTION_OPTIONS: { value: Direction; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

export const HYPOTHESIS_STATUS_OPTIONS: { value: HypothesisStatus; label: string }[] = [
  { value: "draft", label: "下書き" },
  { value: "testing", label: "検証中" },
  { value: "provisionally_adopted", label: "暫定採用" },
  { value: "adopted", label: "採用" },
  { value: "rejected", label: "不採用" },
];

export const PSYCHOLOGY_TAG_OPTIONS: { value: PsychologyTag; label: string }[] = [
  { value: "impatience", label: "焦り" },
  { value: "rule_violation", label: "ルール違反" },
  { value: "fear_of_loss", label: "損失への恐怖" },
  { value: "rushed_profit", label: "利益確定を急いだ" },
  { value: "delayed_stop_loss", label: "損切りを遅らせた" },
  { value: "fomo", label: "FOMO" },
];

export function labelFor<T extends string>(
  options: { value: T; label: string }[],
  value: T
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
