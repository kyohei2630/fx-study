import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PlaceholderSection({
  icon: Icon,
  title,
  description,
  upcoming,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  upcoming: string[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Card className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">この機能は準備中です</p>
          <p className="mt-1 text-sm text-muted-foreground">
            開発フェーズに沿って順次実装していきます。
          </p>
        </div>
        <ul className="mt-2 space-y-1.5 text-left text-sm text-muted-foreground">
          {upcoming.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
