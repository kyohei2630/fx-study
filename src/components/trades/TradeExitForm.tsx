"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { calculateR, resultFromR } from "@/lib/calculations/r";
import { PSYCHOLOGY_TAG_OPTIONS } from "@/lib/options";
import { cn } from "@/lib/utils";
import type { PsychologyTag, Trade } from "@/types";

export interface TradeExitDraft {
  exit: number;
  postTradeNote: string;
  ruleCompliant: boolean | null;
  psychologyTags: PsychologyTag[];
}

const RESULT_LABEL = { win: "勝ち", loss: "負け", breakeven: "引き分け" } as const;

export function TradeExitForm({
  trade,
  onSave,
  onCancel,
}: {
  trade: Trade;
  onSave: (draft: TradeExitDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TradeExitDraft>({
    exit: trade.exit ?? trade.entry,
    postTradeNote: trade.postTradeNote,
    ruleCompliant: trade.ruleCompliant,
    psychologyTags: trade.psychologyTags,
  });

  function update<K extends keyof TradeExitDraft>(key: K, value: TradeExitDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const r = useMemo(
    () => calculateR(trade.direction, trade.entry, trade.stopLoss, draft.exit),
    [trade.direction, trade.entry, trade.stopLoss, draft.exit]
  );
  const result = resultFromR(r);

  function toggleTag(tag: PsychologyTag) {
    update(
      "psychologyTags",
      draft.psychologyTags.includes(tag)
        ? draft.psychologyTags.filter((t) => t !== tag)
        : [...draft.psychologyTags, tag]
    );
  }

  return (
    <Card className="space-y-5">
      <p className="text-sm font-bold text-muted-foreground">トレード後の記録（決済）</p>

      <Field label="Exit">
        <Input
          type="number"
          step="any"
          value={draft.exit}
          onChange={(e) => update("exit", Number(e.target.value))}
        />
      </Field>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">R</span>
        <span className="text-lg font-bold text-foreground">
          {r === null ? "計算不可" : `${r >= 0 ? "+" : ""}${r.toFixed(2)}R`}
        </span>
        {result && (
          <span className="ml-auto text-sm font-semibold text-muted-foreground">
            {RESULT_LABEL[result]}
          </span>
        )}
      </div>

      <Field label="ルール遵守">
        <div className="flex gap-2">
          {(
            [
              { value: true, label: "遵守できた" },
              { value: false, label: "違反した" },
            ] as const
          ).map((o) => (
            <button
              key={String(o.value)}
              type="button"
              onClick={() => update("ruleCompliant", o.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                draft.ruleCompliant === o.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:bg-muted"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="心理面（該当するものがあれば）" optional>
        <div className="flex flex-wrap gap-2">
          {PSYCHOLOGY_TAG_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => toggleTag(o.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                draft.psychologyTags.includes(o.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="実際どうなったか（反省・改善点）">
        <Textarea
          value={draft.postTradeNote}
          onChange={(e) => update("postTradeNote", e.target.value)}
        />
      </Field>

      <div className="flex gap-3">
        <Button onClick={() => onSave(draft)}>決済を記録する</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </Card>
  );
}
