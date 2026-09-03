import { Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex max-w-sm flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">ページが見つかりません</p>
          <p className="mt-1 text-sm text-muted-foreground">
            URLが変更されたか、削除された可能性があります。
          </p>
        </div>
        <LinkButton href="/">ホームに戻る</LinkButton>
      </Card>
    </div>
  );
}
