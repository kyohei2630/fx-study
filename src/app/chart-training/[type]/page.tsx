import { notFound } from "next/navigation";
import { CHART_TRAINING_TYPES, CHART_TRAINING_TYPES_BY_ID } from "@/data/chartTrainingTypes";
import { ChartTrainingClient } from "@/components/chart-training/ChartTrainingClient";
import type { ChartTrainingType } from "@/types/learning";

export function generateStaticParams() {
  return CHART_TRAINING_TYPES.map((t) => ({ type: t.type }));
}

export default async function ChartTrainingTypePage({
  params,
}: PageProps<"/chart-training/[type]">) {
  const { type } = await params;
  const info = CHART_TRAINING_TYPES_BY_ID[type];
  if (!info) notFound();

  return <ChartTrainingClient type={type as ChartTrainingType} />;
}
