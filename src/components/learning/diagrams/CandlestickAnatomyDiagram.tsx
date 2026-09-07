export function CandlestickAnatomyDiagram() {
  return (
    <svg
      viewBox="0 0 260 220"
      className="mx-auto h-56 w-full max-w-xs"
      role="img"
      aria-label="ローソク足の上ヒゲ・実体・下ヒゲを示した図"
    >
      {/* wick */}
      <line
        x1="130"
        y1="20"
        x2="130"
        y2="200"
        className="stroke-muted-foreground"
        strokeWidth="2"
      />
      {/* body */}
      <rect
        x="105"
        y="70"
        width="50"
        height="80"
        rx="3"
        className="fill-success/15 stroke-success"
        strokeWidth="2"
      />

      {/* upper wick label */}
      <line x1="130" y1="45" x2="190" y2="45" className="stroke-muted-foreground" strokeWidth="1" />
      <text x="196" y="49" className="fill-foreground text-[13px] font-medium">
        上ヒゲ
      </text>

      {/* body label */}
      <line x1="155" y1="110" x2="190" y2="110" className="stroke-muted-foreground" strokeWidth="1" />
      <text x="196" y="114" className="fill-foreground text-[13px] font-medium">
        実体
      </text>

      {/* lower wick label */}
      <line x1="130" y1="175" x2="190" y2="175" className="stroke-muted-foreground" strokeWidth="1" />
      <text x="196" y="179" className="fill-foreground text-[13px] font-medium">
        下ヒゲ
      </text>
    </svg>
  );
}
