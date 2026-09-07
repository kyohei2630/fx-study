export function EngulfingDiagram() {
  return (
    <svg
      viewBox="0 0 260 200"
      className="mx-auto h-48 w-full max-w-xs"
      role="img"
      aria-label="後のローソク足の実体が前のローソク足の実体を完全に包み込むEngulfingの形状を示した図"
    >
      {/* first (smaller) candle */}
      <line x1="90" y1="70" x2="90" y2="130" className="stroke-muted-foreground" strokeWidth="2" />
      <rect
        x="75"
        y="85"
        width="30"
        height="35"
        rx="2"
        className="fill-danger/15 stroke-danger"
        strokeWidth="2"
      />

      {/* second (larger, engulfing) candle */}
      <line x1="170" y1="35" x2="170" y2="165" className="stroke-muted-foreground" strokeWidth="2" />
      <rect
        x="150"
        y="50"
        width="40"
        height="110"
        rx="2"
        className="fill-success/15 stroke-success"
        strokeWidth="2"
      />

      <text x="90" y="145" textAnchor="middle" className="fill-foreground text-[12px] font-medium">
        陰線（小）
      </text>
      <text x="170" y="180" textAnchor="middle" className="fill-foreground text-[12px] font-medium">
        陽線が完全に包み込む
      </text>
    </svg>
  );
}
