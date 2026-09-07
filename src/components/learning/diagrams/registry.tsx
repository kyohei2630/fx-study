import type { ComponentType } from "react";
import { CandlestickAnatomyDiagram } from "@/components/learning/diagrams/CandlestickAnatomyDiagram";
import { TrendStructureDiagram } from "@/components/learning/diagrams/TrendStructureDiagram";
import { PullbackStepsDiagram } from "@/components/learning/diagrams/PullbackStepsDiagram";
import { PinBarDiagram } from "@/components/learning/diagrams/PinBarDiagram";
import { EngulfingDiagram } from "@/components/learning/diagrams/EngulfingDiagram";

export const DIAGRAM_REGISTRY: Record<string, ComponentType> = {
  "candlestick-anatomy": CandlestickAnatomyDiagram,
  "trend-structure": TrendStructureDiagram,
  "pullback-steps": PullbackStepsDiagram,
  "pin-bar": PinBarDiagram,
  engulfing: EngulfingDiagram,
};
