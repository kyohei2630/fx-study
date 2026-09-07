export function PinBarDiagram() {
  return (
    <svg
      viewBox="0 0 260 220"
      className="mx-auto h-56 w-full max-w-xs"
      role="img"
      aria-label="実体が小さく下ヒゲが長いPin Barの形状を示した図"
    >
      {/* wick */}
      <line
        x1="130"
        y1="25"
        x2="130"
        y2="195"
        className="stroke-muted-foreground"
        strokeWidth="2"
      />
      {/* small body near the top */}
      <rect
        x="112"
        y="32"
        width="36"
        height="26"
        rx="3"
        className="fill-danger/15 stroke-danger"
        strokeWidth="2"
      />

      <line x1="148" y1="45" x2="190" y2="45" className="stroke-muted-foreground" strokeWidth="1" />
      <text x="196" y="49" className="fill-foreground text-[13px] font-medium">
        小さい実体
      </text>

      <line x1="130" y1="130" x2="190" y2="130" className="stroke-muted-foreground" strokeWidth="1" />
      <text x="196" y="120" className="fill-foreground text-[13px] font-medium">
        長いヒゲ
      </text>
      <text x="196" y="138" className="fill-muted-foreground text-[11px]">
        （その方向への反発）
      </text>
    </svg>
  );
}
