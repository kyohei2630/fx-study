import { Eye } from "lucide-react";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function VisualLearningPage() {
  return (
    <PlaceholderSection
      icon={Eye}
      title="ビジュアル学習"
      description="SVG・Reactによる図解で、価格構造を視覚的に理解する"
      upcoming={[
        "SVG/Reactによる図解コンポーネント",
        "ローソク足・トレンド構造のステップ図解",
        "アニメーション表示",
      ]}
    />
  );
}
