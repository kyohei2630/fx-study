"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { ConditionChecklistEditor } from "@/components/strategies/ConditionChecklistEditor";
import type { ConditionItem } from "@/types";

export interface VersionRulesDraft {
  version: string;
  entryRules: string;
  exitRules: string;
  stopLossRules: string;
  takeProfitRules: string;
  conditions: ConditionItem[];
  note: string;
}

export function StrategyVersionForm({
  title,
  initial,
  versionEditable = true,
  onSave,
  onCancel,
}: {
  title: string;
  initial: VersionRulesDraft;
  versionEditable?: boolean;
  onSave: (draft: VersionRulesDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<VersionRulesDraft>(initial);

  function update<K extends keyof VersionRulesDraft>(key: K, value: VersionRulesDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card className="space-y-5">
      <CardTitle>{title}</CardTitle>

      <Field label="Version">
        <Input
          value={draft.version}
          onChange={(e) => update("version", e.target.value)}
          disabled={!versionEditable}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="エントリー条件">
          <Textarea value={draft.entryRules} onChange={(e) => update("entryRules", e.target.value)} />
        </Field>
        <Field label="利確ルール">
          <Textarea
            value={draft.takeProfitRules}
            onChange={(e) => update("takeProfitRules", e.target.value)}
          />
        </Field>
        <Field label="損切りルール">
          <Textarea
            value={draft.stopLossRules}
            onChange={(e) => update("stopLossRules", e.target.value)}
          />
        </Field>
        <Field label="決済条件">
          <Textarea value={draft.exitRules} onChange={(e) => update("exitRules", e.target.value)} />
        </Field>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">条件チェックリスト</p>
        <div className="mt-2">
          <ConditionChecklistEditor
            conditions={draft.conditions}
            onChange={(conditions) => update("conditions", conditions)}
          />
        </div>
      </div>

      <Field label="このVersionのメモ" optional>
        <Textarea
          value={draft.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder="何を変更したか、なぜ変更したか"
        />
      </Field>

      <div className="flex gap-3">
        <Button onClick={() => onSave(draft)}>保存する</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </Card>
  );
}
