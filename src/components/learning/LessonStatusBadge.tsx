import { Check, BookOpen, PenLine, CircleDashed, Circle } from "lucide-react";
import type { LearningStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  LearningStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  not_started: {
    label: "未開始",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "学習中",
    icon: BookOpen,
    className: "bg-primary/10 text-primary",
  },
  comprehension_check: {
    label: "理解確認",
    icon: CircleDashed,
    className: "bg-primary/10 text-primary",
  },
  practicing: {
    label: "練習中",
    icon: PenLine,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  completed: {
    label: "完了",
    icon: Check,
    className: "bg-success/10 text-success",
  },
};

export function LessonStatusBadge({ status }: { status: LearningStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
