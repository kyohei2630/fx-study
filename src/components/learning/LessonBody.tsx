import type { LessonSection } from "@/types";

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; items: string[] };

function parseContent(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let noteLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
      paragraphLines = [];
    }
  };
  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };
  const flushNote = () => {
    if (noteLines.length > 0) {
      blocks.push({ type: "note", items: noteLines });
      noteLines = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      flushNote();
      blocks.push({ type: "heading", text: line.slice(2) });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      flushNote();
      listItems.push(line.slice(2));
    } else if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      noteLines.push(line.slice(2));
    } else if (line === "") {
      flushParagraph();
      flushList();
      flushNote();
    } else {
      paragraphLines.push(line);
    }
  }
  flushParagraph();
  flushList();
  flushNote();

  return blocks;
}

function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="pt-2 text-base font-bold text-foreground"
              >
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="space-y-1.5 pl-1 text-sm text-foreground">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "note":
            return (
              <div
                key={index}
                className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-foreground"
              >
                {block.items.map((item, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : undefined}>
                    {item}
                  </p>
                ))}
              </div>
            );
          case "paragraph":
          default:
            return (
              <p key={index} className="text-sm leading-relaxed text-foreground">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

export function LessonBody({
  content,
  sections,
}: {
  content?: string;
  sections?: LessonSection[];
}) {
  if (sections && sections.length > 0) {
    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={index > 0 ? "border-t border-border pt-6" : undefined}
          >
            <h2 className="text-base font-bold text-foreground">{section.title}</h2>
            <div className="mt-3">
              <BlockList blocks={parseContent(section.body)} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <BlockList blocks={parseContent(content ?? "")} />;
}
