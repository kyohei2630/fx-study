import { describe, expect, it } from "vitest";
import { calculateR, resultFromR } from "@/lib/calculations/r";

describe("calculateR", () => {
  it("computes a positive R for a winning Buy trade", () => {
    // risk = 150 - 149 = 1, profit = 152 - 150 = 2 -> R = 2
    expect(calculateR("buy", 150, 149, 152)).toBe(2);
  });

  it("computes a negative R for a losing Buy trade", () => {
    // risk = 150 - 149 = 1, profit = 149 - 150 = -1 -> R = -1
    expect(calculateR("buy", 150, 149, 149)).toBe(-1);
  });

  it("computes a positive R for a winning Sell trade", () => {
    // risk = 151 - 150 = 1, profit = 150 - 148 = 2 -> R = 2
    expect(calculateR("sell", 150, 151, 148)).toBe(2);
  });

  it("computes a negative R for a losing Sell trade", () => {
    // risk = 151 - 150 = 1, profit = 150 - 152 = -2 -> R = -2
    expect(calculateR("sell", 150, 151, 152)).toBe(-2);
  });

  it("returns null when the stop loss implies zero risk", () => {
    expect(calculateR("buy", 150, 150, 152)).toBeNull();
  });

  it("returns null when the stop loss is on the wrong side (negative risk)", () => {
    // Buy with SL above entry is a degenerate setup.
    expect(calculateR("buy", 150, 151, 152)).toBeNull();
  });

  it("handles fractional R values", () => {
    // risk = 2, profit = 1 -> R = 0.5
    expect(calculateR("buy", 150, 148, 151)).toBe(0.5);
  });
});

describe("resultFromR", () => {
  it("classifies a positive R as a win", () => {
    expect(resultFromR(1.5)).toBe("win");
  });

  it("classifies a negative R as a loss", () => {
    expect(resultFromR(-1)).toBe("loss");
  });

  it("classifies an R of exactly zero as breakeven", () => {
    expect(resultFromR(0)).toBe("breakeven");
  });

  it("returns null when R itself is null", () => {
    expect(resultFromR(null)).toBeNull();
  });
});
