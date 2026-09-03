export interface GlossaryTerm {
  id: string;
  term: string;
  shortLabel?: string;
  category: string;
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "candlestick",
    term: "ローソク足",
    category: "基礎",
    definition: "一定期間の始値・高値・安値・終値をまとめて表したチャートの表示形式。",
  },
  {
    id: "body",
    term: "実体",
    category: "基礎",
    definition: "ローソク足の始値と終値の間の四角い部分。",
  },
  {
    id: "wick",
    term: "ヒゲ",
    category: "基礎",
    definition: "実体から上下に伸びる線。その期間中に実体の範囲を超えて動いた価格を示す。",
  },
  {
    id: "high",
    term: "高値",
    category: "高値・安値",
    definition: "その期間で最も高かった価格。ヒゲの先端を含めて判断する。",
  },
  {
    id: "low",
    term: "安値",
    category: "高値・安値",
    definition: "その期間で最も低かった価格。ヒゲの先端を含めて判断する。",
  },
  {
    id: "swing",
    term: "スイング高値・安値",
    shortLabel: "Swing High / Low",
    category: "高値・安値",
    definition: "価格が上昇から下降、下降から上昇へと方向転換したポイント。相場構造の判断に使う。",
  },
  {
    id: "hh",
    term: "HH",
    shortLabel: "Higher High",
    category: "相場構造",
    definition: "前回の高値を上回って形成された高値。",
  },
  {
    id: "hl",
    term: "HL",
    shortLabel: "Higher Low",
    category: "相場構造",
    definition: "前回の安値を上回って形成された安値。",
  },
  {
    id: "lh",
    term: "LH",
    shortLabel: "Lower High",
    category: "相場構造",
    definition: "前回の高値を下回って形成された高値。",
  },
  {
    id: "ll",
    term: "LL",
    shortLabel: "Lower Low",
    category: "相場構造",
    definition: "前回の安値を下回って形成された安値。",
  },
  {
    id: "trend",
    term: "トレンド",
    category: "相場構造",
    definition: "価格が一定の方向へ継続して動いている状態。上昇トレンドはHH・HLの連続、下降トレンドはLL・LHの連続で形成される。",
  },
  {
    id: "range",
    term: "レンジ",
    category: "相場構造",
    definition: "価格が一定の範囲内を往復している状態。明確な方向性を持たない。",
  },
  {
    id: "support",
    term: "サポート",
    shortLabel: "支持線",
    category: "重要価格",
    definition: "価格が下落したときに反発しやすいと意識される価格帯。",
  },
  {
    id: "resistance",
    term: "レジスタンス",
    shortLabel: "抵抗線",
    category: "重要価格",
    definition: "価格が上昇したときに反落しやすいと意識される価格帯。",
  },
  {
    id: "ema",
    term: "EMA",
    shortLabel: "指数平滑移動平均線",
    category: "インジケーター",
    definition: "直近の価格に比重を置いた移動平均線。SMAより値動きへの反応が速い。",
  },
  {
    id: "sma",
    term: "SMA",
    shortLabel: "単純移動平均線",
    category: "インジケーター",
    definition: "一定期間の価格を単純平均した移動平均線。",
  },
  {
    id: "bb",
    term: "BB",
    shortLabel: "ボリンジャーバンド",
    category: "インジケーター",
    definition: "移動平均線と標準偏差（σ）で構成されるバンド。価格の位置とボラティリティを示す。",
  },
  {
    id: "atr",
    term: "ATR",
    shortLabel: "Average True Range",
    category: "インジケーター",
    definition: "値幅（ボラティリティ）を数値化した指標。ストップ幅の設計などに応用される。",
  },
  {
    id: "rsi",
    term: "RSI",
    shortLabel: "Relative Strength Index",
    category: "インジケーター",
    definition: "0〜100で値動きの勢い（モメンタム）を表す指標。",
  },
  {
    id: "macd",
    term: "MACD",
    category: "インジケーター",
    definition: "2本の移動平均線の差でトレンドの勢いを見る指標。シグナル線・ヒストグラムを併用する。",
  },
  {
    id: "r-multiple",
    term: "R",
    shortLabel: "Rマルチプル",
    category: "分析",
    definition: "リスク（Entryからストップまでの値幅）を基準にした損益の倍率。利益 ÷ リスクで算出する。",
  },
  {
    id: "expected-value",
    term: "期待値",
    category: "分析",
    definition: "勝率と平均利益・平均損失から算出する、1トレードあたりの見込み損益。",
  },
  {
    id: "profit-factor",
    term: "Profit Factor",
    category: "分析",
    definition: "総利益 ÷ 総損失で算出する指標。1より大きいほど利益が損失を上回っていることを示す。",
  },
  {
    id: "drawdown",
    term: "ドローダウン",
    category: "分析",
    definition: "資産（累積損益）が直近の最高値からどれだけ下落したかを示す指標。",
  },
];

export const GLOSSARY_CATEGORIES = Array.from(
  new Set(GLOSSARY.map((term) => term.category))
);
