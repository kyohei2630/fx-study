import { Route } from "lucide-react";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function ScenarioTrainingPage() {
  return (
    <PlaceholderSection
      icon={Route}
      title="シナリオ訓練"
      description="現在のチャートから複数の未来を想定し、条件付き判断を練習する"
      upcoming={[
        "複数シナリオの想定・入力",
        "Prediction/Trigger/Invalidationの分離記録",
        "NO TRADE専用問題",
      ]}
    />
  );
}
