"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex max-w-sm flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-7 w-7 text-danger" />
        </div>
        <div>
          <p className="font-semibold text-foreground">エラーが発生しました</p>
          <p className="mt-1 text-sm text-muted-foreground">
            お手数ですが、もう一度お試しください。データは端末内に保存されているため失われません。
          </p>
        </div>
        <Button onClick={reset}>もう一度試す</Button>
      </Card>
    </div>
  );
}
