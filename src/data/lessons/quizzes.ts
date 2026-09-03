import type { Quiz } from "@/types";

export const QUIZZES: Quiz[] = [
  {
    id: "candlestick-q1",
    lessonId: "candlestick",
    question: "ローソク足の「実体」を構成する2つの価格はどれですか？",
    options: [
      { id: "a", label: "高値と安値" },
      { id: "b", label: "始値と終値" },
      { id: "c", label: "高値と終値" },
      { id: "d", label: "始値と安値" },
    ],
    answer: "b",
    explanation:
      "実体は始値と終値の間の四角い部分です。高値・安値はヒゲとして表されます。",
  },
  {
    id: "candlestick-q2",
    lessonId: "candlestick",
    question: "終値が始値より高いローソク足のことを何と呼びますか？",
    options: [
      { id: "a", label: "陰線" },
      { id: "b", label: "十字線" },
      { id: "c", label: "陽線" },
      { id: "d", label: "包み足" },
    ],
    answer: "c",
    explanation: "終値が始値より高い場合は陽線、低い場合は陰線と呼びます。",
  },
  {
    id: "high-low-q1",
    lessonId: "high-low",
    question: "高値・安値を判断するとき、基本的にどこまでを含めますか？",
    options: [
      { id: "a", label: "実体の端まで" },
      { id: "b", label: "ヒゲの先端まで" },
      { id: "c", label: "終値の位置まで" },
      { id: "d", label: "始値の位置まで" },
    ],
    answer: "b",
    explanation:
      "基本的にはローソク足のヒゲの先端まで含めて高値・安値を判断します。",
  },
  {
    id: "high-low-q2",
    lessonId: "high-low",
    question: "「最高値」についての説明として正しいものはどれですか？",
    options: [
      { id: "a", label: "最高値は常に最も重要な高値である" },
      { id: "b", label: "最高値は直近高値と必ず一致する" },
      { id: "c", label: "最高値が今のトレードで最も重要とは限らない" },
      { id: "d", label: "最高値はスイング高値とは無関係である" },
    ],
    answer: "c",
    explanation:
      "最高値＝最も重要な高値ではありません。直近で反発した高値の方が重要な場合も多くあります。",
  },
  {
    id: "high-low-q3",
    lessonId: "high-low",
    question: "前回の高値を上回って形成された高値のことを何と呼びますか？",
    options: [
      { id: "a", label: "Lower High（LH）" },
      { id: "b", label: "Higher Low（HL）" },
      { id: "c", label: "Lower Low（LL）" },
      { id: "d", label: "Higher High（HH）" },
    ],
    answer: "d",
    explanation: "前回の高値を上回る高値がHigher High（HH）です。",
  },
  {
    id: "high-low-q4",
    lessonId: "high-low",
    question: "重要高値・重要安値の判断材料として適切でないものはどれですか？",
    options: [
      { id: "a", label: "その価格から大きく反発したか" },
      { id: "b", label: "何度も意識されているか" },
      { id: "c", label: "チャートの背景色" },
      { id: "d", label: "上位時間足でも意識されているか" },
    ],
    answer: "c",
    explanation:
      "重要高値・安値の判断は、反発の大きさ・意識された回数・上位時間足での位置などを考慮します。背景色は無関係です。",
  },
  {
    id: "chart-reading-q1",
    lessonId: "chart-reading",
    question: "このアプリが推奨するチャートの見る順番として正しいものはどれですか？",
    options: [
      { id: "a", label: "EMA → 高値安値 → 時間足" },
      { id: "b", label: "時間足 → 現在価格 → 高値安値 → 相場構造" },
      { id: "c", label: "RSI → MACD → 相場構造" },
      { id: "d", label: "上位時間足 → EMA → 現在価格" },
    ],
    answer: "b",
    explanation:
      "時間足→現在価格→高値安値→相場構造→トレンド/レンジ→重要価格→上位時間足→インジケーターの順が基本です。",
  },
  {
    id: "market-structure-q1",
    lessonId: "market-structure",
    question: "上昇構造を構成する高値・安値の並びとして正しいものはどれですか？",
    options: [
      { id: "a", label: "LL と LH の連続" },
      { id: "b", label: "HH と HL の連続" },
      { id: "c", label: "HH のみが連続" },
      { id: "d", label: "レンジと同じ並び" },
    ],
    answer: "b",
    explanation: "上昇構造はHH（切り上げ高値）とHL（切り上げ安値）の連続で形成されます。",
  },
  {
    id: "trend-range-q1",
    lessonId: "trend-range",
    question: "下降トレンドで連続して形成される高値・安値の組み合わせはどれですか？",
    options: [
      { id: "a", label: "HHとHL" },
      { id: "b", label: "LLとLH" },
      { id: "c", label: "HHのみ" },
      { id: "d", label: "LLのみ" },
    ],
    answer: "b",
    explanation: "下降トレンドはLL（切り下げ安値）とLH（切り下げ高値）が連続します。",
  },
  {
    id: "key-levels-q1",
    lessonId: "key-levels",
    question: "前日高値・前日安値の基本ルールとして正しいものはどれですか？",
    options: [
      { id: "a", label: "実体の範囲のみで判断する" },
      { id: "b", label: "ヒゲを含む最高値・最安値を使用する" },
      { id: "c", label: "終値のみで判断する" },
      { id: "d", label: "始値のみで判断する" },
    ],
    answer: "b",
    explanation:
      "前日のローソク足のヒゲを含む最高値・最安値を、前日高値・前日安値として使用します。",
  },
  {
    id: "timeframes-q1",
    lessonId: "timeframes",
    question: "マルチタイムフレーム分析の基本的な考え方として正しいものはどれですか？",
    options: [
      { id: "a", label: "下位時間足だけで全てを判断する" },
      { id: "b", label: "上位時間足で大きな構造、下位時間足でタイミングを見る" },
      { id: "c", label: "上位時間足は使わない" },
      { id: "d", label: "時間足はどれを見ても同じ結果になる" },
    ],
    answer: "b",
    explanation:
      "上位時間足で大きな相場構造をつかみ、下位時間足で具体的なエントリータイミングを探ります。",
  },
  {
    id: "ema-q1",
    lessonId: "ema",
    question: "このアプリでのEMAの扱い方として正しいものはどれですか？",
    options: [
      { id: "a", label: "EMAに触れたら必ず買う" },
      { id: "b", label: "EMAを下抜けたら必ず売る" },
      { id: "c", label: "相場構造と組み合わせて観察・検証する材料として扱う" },
      { id: "d", label: "EMAだけで全てのエントリーを判断する" },
    ],
    answer: "c",
    explanation:
      "EMAは単純な売買シグナルとしてではなく、相場構造と組み合わせて考える観察材料として扱います。",
  },
  {
    id: "bollinger-bands-q1",
    lessonId: "bollinger-bands",
    question: "バンド幅が狭まっている状態を何と呼びますか？",
    options: [
      { id: "a", label: "エクスパンション" },
      { id: "b", label: "バンドウォーク" },
      { id: "c", label: "スクイーズ" },
      { id: "d", label: "ダイバージェンス" },
    ],
    answer: "c",
    explanation: "バンド幅が狭まりボラティリティが低下している状態をスクイーズと呼びます。",
  },
  {
    id: "atr-q1",
    lessonId: "atr",
    question: "ATRが高い状態のとき、一般的にどう考えられますか？",
    options: [
      { id: "a", label: "値動きが小さい" },
      { id: "b", label: "値動きが大きい" },
      { id: "c", label: "トレンドが必ず発生している" },
      { id: "d", label: "価格が必ず反発する" },
    ],
    answer: "b",
    explanation: "ATRが高い状態は値動き（ボラティリティ）が大きいことを示します。",
  },
  {
    id: "rsi-q1",
    lessonId: "rsi",
    question: "RSIの正しい使い方として推奨されるものはどれですか？",
    options: [
      { id: "a", label: "70以上になったら必ず売る" },
      { id: "b", label: "30以下になったら必ず買う" },
      { id: "c", label: "相場構造と合わせて観察し、検証対象として扱う" },
      { id: "d", label: "RSIだけで全てのトレードを判断する" },
    ],
    answer: "c",
    explanation:
      "強いトレンド中はRSIが70以上に張り付くこともあります。単純ルール化せず観察・検証しましょう。",
  },
  {
    id: "macd-q1",
    lessonId: "macd",
    question: "MACDのヒストグラムが表すものは何ですか？",
    options: [
      { id: "a", label: "MACD線とシグナル線の差" },
      { id: "b", label: "価格の高値と安値の差" },
      { id: "c", label: "RSIとの差" },
      { id: "d", label: "移動平均線の期間の差" },
    ],
    answer: "a",
    explanation: "ヒストグラムはMACD線とシグナル線の差を表し、モメンタムの強弱を示します。",
  },
];

export const QUIZZES_BY_LESSON: Record<string, Quiz[]> = QUIZZES.reduce(
  (acc, quiz) => {
    (acc[quiz.lessonId] ??= []).push(quiz);
    return acc;
  },
  {} as Record<string, Quiz[]>
);
