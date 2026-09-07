export interface Candle {
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SwingPoint {
  index: number;
  price: number;
  kind: "high" | "low";
  /** HH/HL/LH/LL relative to the previous swing point of the same kind. */
  tag: "HH" | "HL" | "LH" | "LL" | null;
  /** Rough importance score used to pick "important" high/low problems. */
  importance: number;
}

export type MarketVerdict = "uptrend" | "downtrend" | "range" | "unclear";
