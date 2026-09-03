import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CHART_TRAINING_TYPES } from "@/data/chartTrainingTypes";

const GROUPS = ["高値・安値", "相場構造", "環境判定"] as const;

export default function ChartTrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          チャート練習
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          チャート上をタップして、高値・安値・相場構造を見極める練習をします。
        </p>
      </div>

      {GROUPS.map((group) => (
        <div key={group} className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {CHART_TRAINING_TYPES.filter((t) => t.group === group).map((t) => (
              <Link key={t.type} href={`/chart-training/${t.type}`}>
                <Card className="flex items-center justify-between gap-3 transition-colors hover:border-primary/40">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{t.label}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
