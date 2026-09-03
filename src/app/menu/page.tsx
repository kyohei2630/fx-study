import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Card } from "@/components/ui/Card";

export default function MenuPage() {
  return (
    <div className="space-y-6 md:hidden">
      <h1 className="text-xl font-bold text-foreground">メニュー</h1>
      <Card className="divide-y divide-border p-0">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-foreground first:rounded-t-2xl last:rounded-b-2xl"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
