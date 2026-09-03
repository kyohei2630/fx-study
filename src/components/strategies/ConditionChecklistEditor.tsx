"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { generateId } from "@/db/repository";
import { cn } from "@/lib/utils";
import type { ConditionItem, ConditionRequirement } from "@/types";

const REQUIREMENT_OPTIONS: { value: ConditionRequirement; label: string }[] = [
  { value: "required", label: "必須" },
  { value: "optional", label: "任意" },
  { value: "exclusion", label: "除外条件" },
];

const REQUIREMENT_STYLES: Record<ConditionRequirement, string> = {
  required: "bg-primary/10 text-primary",
  optional: "bg-muted text-muted-foreground",
  exclusion: "bg-danger/10 text-danger",
};

export function ConditionChecklistEditor({
  conditions,
  onChange,
}: {
  conditions: ConditionItem[];
  onChange: (conditions: ConditionItem[]) => void;
}) {
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [requirement, setRequirement] = useState<ConditionRequirement>("required");

  function addCondition() {
    if (!label.trim()) return;
    onChange([
      ...conditions,
      { id: generateId(), category: category.trim() || "その他", label: label.trim(), requirement },
    ]);
    setLabel("");
  }

  function removeCondition(id: string) {
    onChange(conditions.filter((c) => c.id !== id));
  }

  const grouped = conditions.reduce<Record<string, ConditionItem[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-xs font-bold text-muted-foreground">【{cat}】</p>
          <ul className="mt-1.5 space-y-1.5">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    REQUIREMENT_STYLES[c.requirement]
                  )}
                >
                  {REQUIREMENT_OPTIONS.find((o) => o.value === c.requirement)?.label}
                </span>
                <span className="flex-1 text-foreground">{c.label}</span>
                <button
                  type="button"
                  onClick={() => removeCondition(c.id)}
                  className="text-muted-foreground hover:text-danger"
                  aria-label="削除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.5fr_auto_auto]">
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="カテゴリ（例: 環境）"
        />
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="条件（例: 4時間足上昇）"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCondition();
            }
          }}
        />
        <Select
          value={requirement}
          onChange={(e) => setRequirement(e.target.value as ConditionRequirement)}
        >
          {REQUIREMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Button type="button" variant="secondary" onClick={addCondition}>
          追加
        </Button>
      </div>
    </div>
  );
}
