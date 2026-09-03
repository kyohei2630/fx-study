"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/data/glossary";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((term) => {
      const matchesCategory = category ? term.category === category : true;
      const matchesQuery =
        q.length === 0 ||
        term.term.toLowerCase().includes(q) ||
        term.shortLabel?.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/learning"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          学習に戻る
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
          用語辞典
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          FXでよく使われる用語を検索できます。
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="用語を検索（例: HH、EMA、期待値）"
          className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            category === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          すべて
        </button>
        {GLOSSARY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            該当する用語が見つかりませんでした。
          </p>
        )}
        {filtered.map((term) => (
          <Card key={term.id}>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-bold text-foreground">{term.term}</span>
              {term.shortLabel && (
                <span className="text-xs text-muted-foreground">
                  {term.shortLabel}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {term.definition}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
