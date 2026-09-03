import type { Direction } from "@/types";

/**
 * R multiple: profit divided by the risk defined by entry-to-stop distance.
 *
 * Buy:  risk = entry - stopLoss,  profit = exit - entry
 * Sell: risk = stopLoss - entry,  profit = entry - exit
 *
 * Returns null when risk is zero or negative (an invalid/degenerate stop),
 * since R is undefined in that case rather than misleadingly infinite.
 */
export function calculateR(
  direction: Direction,
  entry: number,
  stopLoss: number,
  exit: number
): number | null {
  const risk = direction === "buy" ? entry - stopLoss : stopLoss - entry;
  if (risk <= 0) return null;

  const profit = direction === "buy" ? exit - entry : entry - exit;
  return profit / risk;
}

export type RResult = "win" | "loss" | "breakeven";

export function resultFromR(r: number | null, epsilon = 1e-9): RResult | null {
  if (r === null) return null;
  if (Math.abs(r) < epsilon) return "breakeven";
  return r > 0 ? "win" : "loss";
}
