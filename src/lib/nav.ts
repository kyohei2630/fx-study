import type { LucideIcon } from "lucide-react";
import {
  Home,
  GraduationCap,
  LineChart,
  NotebookPen,
  Eye,
  Route,
  Rewind,
  Lightbulb,
  FlaskConical,
  Layers,
  ClipboardList,
  BarChart3,
  Database,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/learning", label: "学習", icon: GraduationCap },
  { href: "/chart-training", label: "チャート練習", icon: LineChart },
  { href: "/observations", label: "観察記録", icon: NotebookPen },
  { href: "/visual-learning", label: "ビジュアル学習", icon: Eye },
  { href: "/scenario-training", label: "シナリオ訓練", icon: Route },
  { href: "/chart-replay", label: "チャートリプレイ", icon: Rewind },
  { href: "/hypotheses", label: "仮説", icon: Lightbulb },
  { href: "/backtest", label: "バックテスト", icon: FlaskConical },
  { href: "/strategies", label: "戦略", icon: Layers },
  { href: "/trades", label: "トレード記録", icon: ClipboardList },
  { href: "/analysis", label: "分析", icon: BarChart3 },
  { href: "/settings", label: "データ管理", icon: Database },
];
