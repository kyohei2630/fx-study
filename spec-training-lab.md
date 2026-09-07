# FX Training Lab

## 新規FX学習・チャート分析・戦略研究アプリ 完全開発仕様書

あなたはシニアフルスタックエンジニア、UX設計者、FX教育コンテンツ設計者、データ分析エンジニアとして、この仕様書に基づいてアプリケーションを設計・実装してください。

---

## 0. 最重要方針

このアプリは「FXの勝ち方を教えるアプリ」ではない。

目的は、

**FX初心者が、価格そのものを観察し、チャートを構造的に読み、Price Actionを理解し、自分で仮説を立て、検証し、統計的に評価し、最終的に自分自身のトレード戦略を構築・改善できるようにすること**

である。

したがって、

* インジケーターを増やすこと
* 「この形なら買い」という単純なシグナル
* 勝率だけを重視すること
* 過去チャートに合わせた後付けルール
* 根拠のない「必勝法」
* 薄い用語解説

を目的にしてはいけない。

最優先するものは、

**価格 → 構造 → 相場環境 → Price Action → シナリオ → リスク → 検証 → 統計 → 改善**

という一貫した思考プロセスである。

---

## 1. アプリ名称

仮称: **FX Training Lab**

サブタイトル: *Learn the Market. Read the Chart. Test Your Ideas.*

---

## 2. 開発方針

新規アプリとして設計する。既存アプリの教材構造や画面構造をそのまま引き継がない。

ただし、既存リポジトリに存在するコードのうち、

* UIコンポーネント
* 汎用ユーティリティ
* 計算ロジック
* グラフコンポーネント
* CSS
* 型定義

など、品質が高く再利用可能なものがあれば流用してよい。

ただし、教材構造・学習システム・チャート訓練システム・戦略研究システムは新規設計する。

---

## 3. 技術スタック

以下を基本構成とする。

* Next.js
* TypeScript
* React
* Tailwind CSS
* IndexedDB
* Dexie.js
* Recharts
* Lucide React
* PWA
* JSON Import / Export
* CSV Export
* SVG / CSS / Reactによる教材図解

外部クラウドサービスや有料APIを必須にしない。

---

## 4. データ保存

基本はLocal First。IndexedDB + Dexie.jsを使用する。ユーザーの学習データ、問題回答、観察記録、仮説、バックテスト、戦略、トレード記録などはローカル保存する。

---

## 5. 将来の外部データ連携

v1ではリアルタイムFX APIを必須にしない。ただし将来、

```text
FX Data Provider
      ↓
OHLC Data
      ↓
Chart Engine
      ↓
Chart Replay
      ↓
Backtest
```

へ拡張できるようにデータ構造を設計する。CSVによるOHLCデータ取り込みにも対応できる設計とする。

---

## 6. アプリ全体構造

メインナビゲーション:

```text
Dashboard
│
├── Learn
│
├── Visual Learning
│
├── Chart Training
│
├── Market Analysis
│
├── Scenario Training
│
├── Chart Replay
│
├── Hypothesis Lab
│
├── Backtest
│
├── Strategies
│
├── Trade Journal
│
├── Analytics
│
└── Settings / Data
```

---

## 7. 学習カリキュラム

学習順序は以下を基本とする。

### LEVEL 1: FX基礎

1. FXとは
2. 通貨ペア
3. Ask / Bid
4. スプレッド
5. pips
6. ロット
7. レバレッジ
8. 必要証拠金
9. 損益
10. スワップ
11. 成行注文
12. 指値注文
13. 逆指値
14. 損切り
15. 利確
16. リスクリワード

### LEVEL 2: ローソク足

1. ローソク足とは
2. 始値
3. 高値
4. 安値
5. 終値
6. 実体
7. 上ヒゲ
8. 下ヒゲ
9. 陽線
10. 陰線
11. 実体の大きさ
12. ヒゲの長さ
13. ヒゲと価格拒否
14. 大陽線
15. 大陰線
16. 小陽線・小陰線
17. 連続するローソク足
18. モメンタム
19. 失速
20. ローソク足から読み取れる情報

### LEVEL 3: 高値・安値

1. 高値とは
2. 安値とは
3. ローソク足のどこを見るか
4. ヒゲ先端と実体
5. 最高値
6. 最安値
7. 直近高値
8. 直近安値
9. 最近の高値・安値
10. スイングハイ
11. スイングロー
12. 重要な高値
13. 重要な安値
14. 高値更新
15. 安値更新
16. 高値・安値の切り上げ
17. 高値・安値の切り下げ
18. 押し安値
19. 戻り高値

特に、**「最高値」と「重要な高値」は同じではない** ことを明確に教える。

### LEVEL 4: ダウ理論

ダウ理論は重要基礎として扱う。

1. ダウ理論とは
2. トレンドの考え方
3. 上昇トレンド
4. 下降トレンド
5. トレンド継続
6. トレンド転換
7. HH
8. HL
9. LH
10. LL
11. 押し安値
12. 戻り高値
13. 高値・安値とトレンド
14. レンジとの違い
15. ダウ理論の限界
16. 実際のチャートでの適用

重要: **HHだから買い、HLだから買い、という単純化は禁止。**

### LEVEL 5: 市場構造

1. Market Structureとは
2. Swing
3. HH
4. HL
5. LH
6. LL
7. 上昇構造
8. 下降構造
9. レンジ構造
10. 構造ブレイク
11. 構造転換
12. Break of Structure
13. Change of Character
14. 押し目
15. 戻り
16. 構造が不明瞭な状態

「判断困難」も正常な選択肢として教える。

### LEVEL 6: トレンド・レンジ

1. 上昇トレンド
2. 下降トレンド
3. レンジ
4. トレンド初期
5. トレンド継続
6. トレンド終盤
7. 転換途中
8. レンジ中央
9. レンジ上限
10. レンジ下限
11. ブレイク
12. フェイクブレイク
13. トレンドとレンジの見分け方

### LEVEL 7: 水平線・重要価格

1. サポート
2. レジスタンス
3. 高値
4. 安値
5. 前日高値
6. 前日安値
7. 前週高値
8. 前週安値
9. ラウンドナンバー
10. 価格帯
11. 反発
12. ブレイク
13. レジサポ転換
14. 複数の根拠が重なる価格

### LEVEL 8: マルチタイムフレーム

1. 時間足とは
2. 上位足
3. 下位足
4. 上位足のトレンド
5. 下位足の構造
6. 上位足と下位足の一致
7. 上位足と下位足の不一致
8. 日足
9. 4時間足
10. 1時間足
11. 15分足
12. 5分足
13. 時間足ごとの役割
14. マルチタイムフレーム分析

### LEVEL 9: Price Action

Price Actionを重要カリキュラムとして扱う。

基礎:

1. Price Actionとは
2. 価格そのものを見る意味
3. ローソク足との関係
4. 高値・安値との関係
5. 市場構造との関係
6. 水平線との関係
7. 上位足との関係

パターン:

1. Pin Bar
2. Engulfing
3. Inside Bar
4. 長い上ヒゲ
5. 長い下ヒゲ
6. 大陽線
7. 大陰線
8. 小さい実体
9. 連続陽線
10. 連続陰線
11. ブレイクアウト
12. リテスト
13. フェイクブレイク
14. 押し目
15. 戻り
16. 失速

重要: **「パターン＝売買シグナル」という説明は禁止。** 必ず、

```text
Pattern
+
Location
+
Market Structure
+
Higher Timeframe
+
Price Context
+
Invalidation
```

で説明する。

### LEVEL 10: インジケーター

インジケーターは価格構造を学んだ後に配置する。

**EMA**

1. EMAとは
2. SMAとの違い
3. EMAの計算概念
4. EMAの傾き
5. EMAとトレンド
6. EMAと価格位置
7. EMAへの回帰
8. EMAクロス
9. EMAの限界
10. Price Actionとの組み合わせ

**Bollinger Bands**

1. ボリンジャーバンドとは
2. 移動平均
3. 標準偏差
4. ±1σ
5. ±2σ
6. バンド幅
7. スクイーズ
8. エクスパンション
9. バンドウォーク
10. レンジとの関係

「上バンドタッチ＝売り」などの単純化は禁止。

**ATR**

1. ATRとは
2. ボラティリティ
3. ATRとSL
4. ATRとTP
5. ATRと相場環境

**RSI**

1. RSIとは
2. 過熱
3. ダイバージェンス
4. トレンド時の注意

**MACD**

1. MACDとは
2. シグナル
3. ヒストグラム
4. モメンタム
5. 限界

### LEVEL 11: チャート分析

ここから知識を実際の判断に変換する。分析順序を固定する。

```text
1. Timeframe
2. Current Price
3. Recent High / Low
4. Swing High / Low
5. HH / HL / LH / LL
6. Market Structure
7. Trend / Range
8. Important Price Levels
9. Higher Timeframe
10. Current Price Action
11. Scenario
12. Entry possibility
13. Stop Loss
14. Take Profit
15. Risk / Reward
16. NO TRADE possibility
```

---

## 8. 全教材の品質基準

絶対条件: すべての教材を薄くしない。単純な、「○○とは〜です。」だけの説明は禁止。

各レッスンは最低限以下の構造を持つ。

```text
Lesson
├── Learning Objective
├── Prerequisite
├── Introduction
├── Intuitive Explanation
├── Core Concept
├── Detailed Explanation
├── Terminology
├── Visual Explanation
├── Diagram
├── Good Example
├── Bad Example
├── Common Mistakes
├── Related Concepts
├── Chart Reading Points
├── Practical Application
├── Knowledge Quiz
├── Chart Quiz
├── Wrong Answer Feedback
├── Correct Answer Explanation
└── Practice Task
```

---

## 9. 教材の深さ

各テーマは、

* LEVEL 1: 知識
* LEVEL 2: 認識
* LEVEL 3: 構造理解
* LEVEL 4: チャート判断
* LEVEL 5: シナリオ作成
* LEVEL 6: トレード判断

まで段階的に発展させる。

---

## 10. 図解システム

教材には図解を積極的に使用する。外部画像に依存しない。基本は、

* SVG
* CSS
* React
* Canvas

を利用する。

図解例(ローソク足):

```text
       │
       │ ← 上ヒゲ
   ┌───┐
   │   │ ← 実体
   └───┘
       │
       │ ← 下ヒゲ
```

図解例(上昇トレンド):

```text
          HH
         /  \
        /    \
      HL      \
       \        HH
        \      /  \
         \    /
          HL
```

---

## 11. 図解のルール

単なる装飾画像は禁止。図解には必ず学習目的を持たせる。例えば、「押し安値とは何か」なら、

1. 上昇
2. 押し
3. 反発
4. 高値更新

を視覚的に表現する。可能ならアニメーションやステップ表示を利用する。

---

## 12. チャートトレーニング

チャート問題を大量に用意する。

難易度:

* Level 1: 明確な高値・安値
* Level 2: ヒゲ・実体
* Level 3: 候補が複数ある
* Level 4: Swing判断
* Level 5: Market Structure
* Level 6: Trend / Range
* Level 7: Price Action
* Level 8: 複数時間足
* Level 9: 実戦的な曖昧チャート

---

## 13. 「判断困難」を実装

問題の回答には、A / B / C / D / 判断困難 を設定可能にする。判断困難が合理的な場合は正解とする。

実際の相場では、**無理に判断しない** ことも重要な能力として扱う。

---

## 14. 個別誤答フィードバック

固定文章だけのフィードバックは禁止。誤答タイプを分類する。

```text
ERROR_WICK
ERROR_BODY
ERROR_RECENT_HIGH_LOW
ERROR_HIGHEST_VS_SWING
ERROR_SWING
ERROR_IMPORTANT_LEVEL
ERROR_MARKET_STRUCTURE
ERROR_TREND_RANGE
ERROR_TIMEFRAME
ERROR_PRICE_ACTION
ERROR_CONTEXT
ERROR_RISK_REWARD
```

例: 高値問題でヒゲではなく実体を選んだ場合、「実体上端を高値として選択しています。今回は上ヒゲが実体より上に伸びているため、価格としての高値はヒゲ先端です。」のように理由を具体的に説明する。

---

## 15. 判断根拠を記録

チャート問題では、回答だけではなく理由も記録する。例:

```text
Answer: 上昇トレンド
Reason: HHとHLが形成されているため
Confidence: 高 / 中 / 低
```

---

## 16. シナリオトレーニング

現在のチャートから未来を複数想定する。例:

```text
現在価格
   │
   ├── A: レジスタンス突破
   │
   ├── B: レジスタンス反落
   │
   └── C: レンジ継続
```

ユーザーに、シナリオ / 発生条件 / エントリー条件 / 無効条件 / SL / TP / NO TRADE条件 を入力させる。

---

## 17. 予測と条件付き判断を分離

以下を別フィールドにする。

* Prediction: 「上がると思う」
* Trigger: 「○○を上抜けたら」
* Invalidation: 「○○を下抜けたら」
* Action: 「条件成立時に買いを検討」

---

## 18. NO TRADE訓練

専用問題を作る。例えば、

* レンジ中央
* 高値・安値不明瞭
* 上位足と下位足が矛盾
* SLが置けない
* RRが悪い
* 重要価格の中間
* ボラティリティ異常
* Price Action不明確

など。「何もしない」を正解として評価する。

---

## 19. 未来を隠したチャート

Historical OHLCデータを利用して、

```text
過去 ←──── 現在 │ 未来
                   ↑
                表示停止
```

未来部分を隠す。ユーザーが、相場環境 / 高値・安値 / 構造 / Price Action / シナリオ / Trade / No Trade を判断。その後、未来を表示して答え合わせする。

---

## 20. Chart Replay

可能な範囲で実装する。ローソク足を1本ずつ進められるようにする。

```text
Start
 ↓
Observe
 ↓
Analyze
 ↓
Scenario
 ↓
Entry
 ↓
SL / TP
 ↓
Replay
 ↓
Result
 ↓
Review
```

---

## 21. Virtual Trade

実際の注文機能は不要。仮想トレードのみ。記録:

* Date
* Pair
* Timeframe
* Direction
* Entry
* Stop Loss
* Take Profit
* Exit
* Result
* R
* Market Environment
* Higher Timeframe
* Market Structure
* Price Action
* Indicator
* Reason
* Screenshot
* Rule Adherence
* Emotional State
* Post Trade Review

---

## 22. R計算

BUY:

```text
Risk = Entry - SL
Profit = Exit - Entry
R = Profit / Risk
```

SELL:

```text
Risk = SL - Entry
Profit = Entry - Exit
R = Profit / Risk
```

---

## 23. トレード評価

勝敗だけで評価しない。例えば、

```text
Market Analysis      ○
Structure Reading    ○
Entry                △
SL                   ○
TP                   ○
Rule Adherence       ○
Result               LOSS
```

として、良い負け と 悪い勝ち を区別する。

---

## 24. 仮説管理

Hypothesis Labを作る。例:

```text
Hypothesis #001

条件:
上位足上昇トレンド
+
HL形成
+
重要価格で反発
+
Bullish Price Action

仮説:
この条件が揃った場合、
その後の上昇確率・期待値が高くなる可能性がある。
```

---

## 25. 仮説は自動的に「正しい」と判定しない

アプリは、「この戦略は勝てます」とは言わない。必ず、「現在のデータではこの結果だった」という表現にする。

---

## 26. バックテスト

記録項目:

* Date
* Pair
* Timeframe
* Direction
* Environment
* Entry Conditions
* Entry
* SL
* TP
* Exit
* Result
* R
* Screenshot
* Notes
* Rule Adherence

---

## 27. 統計分析

最低限、

* Total Trades
* Wins
* Losses
* Win Rate
* Average Win
* Average Loss
* Average R
* Expectancy
* Profit Factor
* Maximum Drawdown
* Maximum Consecutive Wins
* Maximum Consecutive Losses
* Cumulative R

を表示。

---

## 28. Expectancy

基本:

```text
Expectancy
=
Win Rate × Average Win
-
Loss Rate × Average Loss
```

Rベースでも表示する。

---

## 29. 条件別分析

例えば、

```text
Overall
EMA
Market Structure
Price Action
Day of Week
Time of Day
Currency Pair
Timeframe
Market Environment
Higher Timeframe Direction
```

ごとに分析する。

---

## 30. サンプル数警告

アプリ内の目安として、

```text
<20      参考程度
20–49    暫定
50–99    評価可能
100+     比較的信頼性が高い
```

と表示する。ただし、これは絶対的な統計基準ではない ことを明記する。

---

## 31. 過学習対策

条件を増やしすぎた場合、過学習の可能性があります と警告する。特に、

* サンプル数が少ない
* 条件が多すぎる
* 特定期間だけ極端に良い
* 特定通貨だけ良い
* 特定時間だけ良い

場合に警告する。

---

## 32. データ分割

将来的に、

```text
Training Data
Validation Data
Test Data
```

へ分割できる構造にする。

---

## 33. 戦略管理

Strategyを作成可能にする。

```text
Strategy
├── Name
├── Description
├── Market Environment
├── Timeframe
├── Higher Timeframe
├── Entry Conditions
├── Exit Conditions
├── SL
├── TP
├── Risk
├── Required Conditions
├── Optional Conditions
└── Exclusion Conditions
```

---

## 34. Strategy Version

必ずバージョン管理する。例:

```text
v1.0  EMAのみ
v1.1  + Higher Timeframe
v1.2  + Important High/Low
v1.3  + Price Action
v2.0  Major Rule Change
```

変更内容と成績を比較できるようにする。

---

## 35. 自動改善提案

統計から、「この条件では成績が低下しています」などを提示する。ただし、自動的に戦略を書き換えない。必ず、

```text
Observation
↓
Hypothesis
↓
User Decision
↓
New Strategy Version
↓
Backtest
```

とする。

---

## 36. 能力マップ

学習進捗だけではなく能力を評価する。例:

```text
FX Basics             91%
Candlestick           94%
High / Low            88%
Dow Theory            82%
Market Structure      76%
Trend / Range         68%
Horizontal Level      71%
Price Action          54%
Multi Timeframe       62%
Trade Planning        48%
Risk Management       80%
```

---

## 37. KnowledgeとSkillを分離

例えば、

```text
Dow Theory Knowledge      92%
Dow Theory Recognition    79%
Dow Theory Chart Reading  65%
```

とする。「知っている」と「使える」を分ける。

---

## 38. 学習モード

* Guided Mode: 順番に学習する。
* Free Mode: 自由に問題を選択。
* Weakness Mode: 苦手項目だけを出題。
* Review Mode: 過去に間違えた問題を再出題。
* Challenge Mode: 実戦的な難問。

---

## 39. 学習進捗

状態:

```text
Not Started
↓
Learning
↓
Understanding Checked
↓
Practicing
↓
Completed
```

ただし、Completedは単純な読了ではなく、知識＋問題＋チャート訓練 を基準とする。

---

## 40. Dashboard

トップ画面には、

* 今日の学習
* 学習時間
* 現在のレベル
* 苦手分野
* 最近のチャート問題
* 最近の仮説
* 戦略成績
* 未復習項目

を表示。

---

## 41. データ構造

最低限以下を用意。

```text
users
lessons
lessonSections
quizzes
quizResults
chartTrainingProblems
chartTrainingResults
observations
hypotheses
indicators
strategies
strategyVersions
backtests
trades
tradeConditions
analytics
learningProgress
skillMastery
```

---

## 42. Lessonsデータ

教材はコード内に直接大量記述せず、可能な限りデータとして管理する。例:

```ts
type Lesson = {
  id: string
  category: string
  title: string
  level: number
  objectives: string[]
  prerequisites: string[]
  sections: LessonSection[]
  diagrams: DiagramDefinition[]
  quizzes: string[]
  chartProblems: string[]
  practiceTasks: PracticeTask[]
}
```

---

## 43. Diagram Definition

図解を再利用可能なコンポーネントとして設計する。例:

```ts
type DiagramDefinition = {
  id: string
  type: string
  title: string
  description: string
  steps?: DiagramStep[]
  interactive?: boolean
}
```

---

## 44. UI

デザインは、Trading Terminal × Modern Learning Platform をイメージする。ただし初心者が怖くならないUIにする。PCをメインとしつつ、PC / iPad / Smartphone に対応。

---

## 45. Dark Mode

ダークモードを実装。

---

## 46. アクセシビリティ

* 十分な文字サイズ
* 適切なコントラスト
* キーボード操作
* aria-label
* 色だけに依存しない表示

を実装。

---

## 47. チャート

チャートは、Candlestick / OHLC / High-Low Marker / Swing Marker / Horizontal Level / Entry / SL / TP などを表示できる設計。ユーザーが、高値をクリック / 安値をクリック / Swingをクリック / 重要価格をマーキング できるようにする。

---

## 48. Chart Annotation

ユーザーがチャート上に、High / Low / Swing High / Swing Low / Support / Resistance / Entry / SL / TP を配置できる。

---

## 49. Observation Journal

実際の相場を見ながら、

```text
Date
Pair
Timeframe
Market Environment
Trend
Structure
Important Levels
Price Action
Scenario
No Trade?
Notes
```

を記録できる。

---

## 50. 感情ではなくプロセスを記録

Trade Journalでは、Before Trade / After Trade を分ける。Before: なぜ入ろうと思ったか。After: 結果を見た後どう考えるか。を分離する。

---

## 51. Rule Adherence

結果とルール遵守を分離。例: `Result: LOSS` / `Rule Adherence: 100%` なら、ルール通りに負けた と評価。

---

## 52. 学習とトレードの循環

最終的なアプリの思想:

```text
Learn → Understand → Observe → Analyze → Hypothesize → Test →
Build Strategy → Trade → Review → Analyze → Improve → Re-test
```

---

## 53. やってはいけないこと

1. 教材を数行で終わらせる
2. すべての概念を簡単に済ませる
3. 「○○なら買い」という単純化
4. インジケーター万能論
5. 勝率だけで評価
6. 勝ったトレードを良いトレードとする
7. 負けたトレードを悪いトレードとする
8. 判断困難を無理やり正解にする
9. ユーザーの判断理由を無視する
10. 過去データに合わせてルールを自動最適化
11. 自動的に戦略を変更
12. 根拠のない勝率予測
13. 「必勝」「高確率で勝てる」などの表現
14. 教材の薄さをUIでごまかす

---

## 54. コンテンツ品質チェック

実装後、各Lessonについて自動チェックまたは開発者向けチェックを用意する。最低限、Detailed Explanationあり / Diagramあり / Exampleあり / Common Mistakesあり / Quizあり / Chart Problemあり / Feedbackあり / Practice Taskあり を確認。

---

## 55. テスト

各Phaseごとに、

```bash
npm run lint
npm run build
npm test
```

を実行。エラーを残したまま次Phaseに進まない。

---

## 56. 実装Phase

* Phase 0: Repository調査(package.json / src / app / components / database / existing dependencies)
* Phase 1: 基盤(Next.js / TypeScript / Tailwind / Dexie / PWA / Layout / Navigation / Dark Mode)
* Phase 2: 教材システム(Lesson / Section / Progress / Quiz / Review / Skill Mastery)
* Phase 3: 教材コンテンツ(FX基礎 → ローソク足 → 高値・安値 → ダウ理論 → 市場構造)
* Phase 4: 図解システム(SVG / Reactベース)
* Phase 5: Chart Training(チャート表示 / マーカー / 高値安値問題 / Swing問題 / Structure問題 / Trend-Range問題)
* Phase 6: Price Action(理論 / 図解 / パターン / Context / Chart Training)
* Phase 7: Market Analysis(Observation / Multi Timeframe / Scenario / NO TRADE)
* Phase 8: Chart Replay
* Phase 9: Hypothesis Lab
* Phase 10: Backtest
* Phase 11: Strategy
* Phase 12: Trade Journal
* Phase 13: Analytics
* Phase 14: 改善・品質確認

---

## 57. Claude Codeへの実装指示

実装前に必ず、

1. 現在のリポジトリ構造を調査
2. package.json確認
3. 使用可能なライブラリ確認
4. 既存コードで再利用可能なものを確認
5. 新規アーキテクチャを決定

する。ただし、既存アプリの制約に引きずられないこと。

---

## 58. 実装優先順位

```text
教材品質 → 学習体験 → チャート読解 → Price Action →
仮説 → 検証 → 戦略 → 統計 → 外部データ
```

外部APIを先に実装しない。

---

## 59. MVPの定義

MVPでも、「教材が薄い状態」では完成扱いにしない。最低限、詳細教材 / 図解 / Quiz / Chart Training / 誤答分析 / ダウ理論 / Market Structure / Price Action / Market Analysis / Observation まで完成させる。

---

## 60. 最終目標

このアプリを使ったユーザーが、チャートを見て、

```text
① 今どの時間足を見ているか
② 現在価格はどこか
③ 直近高値・安値はどこか
④ Swingはどこか
⑤ HH / HL / LH / LLはどうなっているか
⑥ トレンドかレンジか
⑦ 重要価格はどこか
⑧ 上位足はどうなっているか
⑨ 現在のPrice Actionは何を示しているか
⑩ どんなシナリオが考えられるか
⑪ どこで条件が成立するか
⑫ どこで仮説が無効になるか
⑬ SLはどこか
⑭ TPはどこか
⑮ RRは適切か
⑯ NO TRADEの方が合理的ではないか
```

を自分で考えられるようにする。最終的には、「なぜここでトレードするのか」「なぜここではトレードしないのか」「この考え方にはどの程度の統計的根拠があるのか」を自分の言葉で説明できる状態を目指す。

---

## 61. 最終成果物

完成時には以下を報告する。

1. 実装した機能
2. 主なファイル
3. データ構造
4. 教材数
5. 図解数
6. チャート問題数
7. Quiz数
8. テスト結果
9. lint結果
10. build結果
11. 未実装項目
12. 技術的課題
13. 今後の拡張候補

---

## 62. 最重要メッセージ

このプロジェクトでは、機能数よりも「学習の質」を優先する。特に、「教材を読んだだけではチャートを読めるようにならない」ことを前提とする。したがって、

**Theory → Visual → Quiz → Chart Training → Feedback → Observation → Hypothesis → Backtest**

という流れをアプリ全体の中心思想とする。実装を簡略化する場合も、まずこの学習サイクルを壊さないこと。

不明な部分については、仕様と矛盾しない範囲で合理的に判断して実装する。ユーザーへの確認は、

* 有料サービス
* 外部データ送信
* 認証・セキュリティ上の重大変更
* 仕様上の重大な矛盾

など、本当に必要な場合に限定する。それ以外は自律的に実装を進める。

まずPhase 0としてリポジトリを調査し、その結果を整理する。その後、Phase 1から順番に実装する。各Phase終了時にlint / test / buildを実行し、問題を修正してから次へ進む。

---

## 実装進捗ログ

- **Phase 0(リポジトリ調査)**: 完了。既存アプリ「FX研究ノート」(`spec.md`)がNext.js 16 / React 19 / TypeScript / Tailwind v4 / Dexie / next-themes構成で実装済みと確認。技術スタックは新仕様とほぼ一致するため、既存アプリを土台に段階移行する方針を決定。
- **Phase 1(基盤: ブランディング・ナビゲーション拡張)**: 完了。FX Training Labへのリブランディング、13項目ナビゲーション(Visual Learning/Scenario Training/Chart Replayをプレースホルダーとして追加)、PWA自動更新(controllerchange時に自動リロード)を実装。
- **Phase 2(教材システム)**: 完了。`comprehension_check`状態の接続(理解確認ゲート)、能力マップ(`computeSkillMastery`、DBスキーマ変更なし)、復習カード、クイズ採点の独立モジュール化(`src/lib/learning/quiz.ts`)、`Lesson.sections`(将来の拡張用、任意)を実装。
- **Phase 3(教材コンテンツ: FX基礎・ダウ理論)**: 完了。既存12レッスン(ローソク足・高値安値・市場構造など)はそのまま、新規に`fx-basics`・`dow-theory`の2レッスンを追加。
- **Phase 4(図解システム)**: 完了。`@diagram:<id>`記法とレジストリでSVG図解をレッスン本文に埋め込む仕組みを実装。candlestick-anatomy/trend-structure/pullback-stepsの3種を作成。
- **Phase 5(Chart Training)**: 既存実装で高値安値・Swing・構造・Trend/Range問題(17種)が完成済みと確認。新仕様13章が求める「判断困難」を選択肢として明示するため、`classifyTrend`にスイング不足時の`unclear`判定を追加。
- **Phase 6(Price Action)**: レッスン(`price-action`, 6要素フレーム: Pattern/Location/Market Structure/Higher Timeframe/Price Context/Invalidation)・図解2種(pin-bar/engulfing)・クイズ4問を追加。**Chart TrainingへのPrice Actionパターン認識問題の統合は未実装**(`generateCandles`のランダムウォーク生成器がPin Bar/Engulfing等の特定パターンを意図的に出現させる仕組みを持たないため、別途生成ロジックの拡張が必要な技術タスクとして残っている)。
- **Phase 7(Market Analysis)**: 完了。既存の観察記録に`structure`・`priceAction`・`scenario`・`noTrade`の4フィールドを追加(Dexieスキーマ変更なし)。新規に「シナリオ訓練」機能を実装(Dexieスキーマ初のv2移行、`scenarios`テーブル追加): 複数シナリオ(A/B/C…)ごとに条件・予測・トリガー・無効条件・SL/TP・NO TRADEを分離記録できる。Multi Timeframeは既存の`higherTimeframeDirection`で対応済みと判断し新規実装なし。**未来を隠したチャートによるNO TRADE専用チャート問題(新仕様19章)は未実装**(Chart Replayと設計が重なるためPhase 8で合わせて検討)。
- **Phase 8(Chart Replay)**: 完了。プレースホルダーを実機能に置き換え。`generateCandles`で生成した80本の合成チャートを30本表示した状態からスタートし、「次の足へ進む」で1本ずつ将来を開示。任意のタイミングでエントリー(方向/価格/SL/TP)を確定でき、以降新しく開示された足がSL/TPに触れたかを自動判定、または手動決済・データ終端到達で結果を確定し、既存の`calculateR`/`resultFromR`(`src/lib/calculations/r.ts`)でR倍数と勝敗を表示する。「NO TRADE(見送り)」も選択可能で、見送った後の値動きを最後まで開示して振り返られるようにした——これはPhase 7で保留した「NO TRADE専用チャート問題」の実質的な代替として機能する。結果の永続化(DB保存)は行っていない(練習用ツールとして毎回リセットされる設計)。
