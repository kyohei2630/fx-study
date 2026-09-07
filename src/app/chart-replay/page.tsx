import { Rewind } from "lucide-react";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export default function ChartReplayPage() {
  return (
    <PlaceholderSection
      icon={Rewind}
      title="チャートリプレイ"
      description="過去のローソク足を1本ずつ再生しながら判断を練習する"
      upcoming={[
        "ローソク足を1本ずつ進める再生機能",
        "未来を隠したチャート判断",
        "Entry/SL/TP後の結果表示",
      ]}
    />
  );
}
