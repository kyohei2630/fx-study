const POINTS = [
  { x: 20, y: 150 },
  { x: 70, y: 55, label: "HH", kind: "high" },
  { x: 120, y: 105, label: "HL", kind: "low" },
  { x: 180, y: 35, label: "HH", kind: "high" },
  { x: 240, y: 90, label: "HL", kind: "low" },
  { x: 300, y: 15, label: "HH", kind: "high" },
] as const;

export function TrendStructureDiagram() {
  const path = POINTS.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 320 180"
      className="mx-auto h-44 w-full max-w-md"
      role="img"
      aria-label="高値と安値が切り上がっていく上昇構造(HH・HL)の図"
    >
      <polyline
        points={path}
        fill="none"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {POINTS.filter((p): p is (typeof POINTS)[number] & { label: string; kind: string } => "label" in p).map(
        (p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              className={p.kind === "high" ? "fill-success" : "fill-primary"}
            />
            <text
              x={p.x}
              y={p.kind === "high" ? p.y - 12 : p.y + 22}
              textAnchor="middle"
              className="fill-foreground text-[13px] font-semibold"
            >
              {p.label}
            </text>
          </g>
        )
      )}
    </svg>
  );
}
