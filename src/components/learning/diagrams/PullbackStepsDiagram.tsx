const PATH_POINTS = [
  { x: 20, y: 150 },
  { x: 100, y: 55 },
  { x: 150, y: 95 },
  { x: 210, y: 60 },
  { x: 280, y: 20 },
];

const STEPS = [
  { x: 100, y: 55, n: 1, label: "上昇" },
  { x: 150, y: 95, n: 2, label: "押し" },
  { x: 210, y: 60, n: 3, label: "反発" },
  { x: 280, y: 20, n: 4, label: "高値更新" },
];

export function PullbackStepsDiagram() {
  const path = PATH_POINTS.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 320 190"
      className="mx-auto h-48 w-full max-w-md"
      role="img"
      aria-label="上昇・押し・反発・高値更新という押し安値形成の4ステップを示した図"
    >
      {/* prior-high guide line, to show the eventual breakout level */}
      <line
        x1="0"
        y1="55"
        x2="320"
        y2="55"
        className="stroke-border"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      <polyline
        points={path}
        fill="none"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {STEPS.map((s) => (
        <g key={s.n}>
          <circle cx={s.x} cy={s.y} r={11} className="fill-primary" />
          <text
            x={s.x}
            y={s.y + 4}
            textAnchor="middle"
            className="fill-primary-foreground text-[11px] font-bold"
          >
            {s.n}
          </text>
          <text
            x={s.x}
            y={s.y - 18}
            textAnchor="middle"
            className="fill-foreground text-[12px] font-medium"
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
