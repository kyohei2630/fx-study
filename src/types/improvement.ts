export type ImprovementDecision = "pending" | "adopted" | "rejected";

export interface ImprovementNote {
  id: string;
  strategyId: string;
  strategyVersionId: string;
  observation: string;
  analysis: string;
  proposedChange: string;
  decision: ImprovementDecision;
  createdAt: string;
}
