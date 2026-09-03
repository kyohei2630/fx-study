"use client";

import { useMemo } from "react";
import type { Candle } from "@/types/chart";
import { cn } from "@/lib/utils";

export interface CandlestickMarker {
  index: number;
  color: "success" | "danger" | "primary";
  label?: string;
}

interface CandlestickChartProps {
  candles: Candle[];
  highlightRange?: [number, number];
  markers?: CandlestickMarker[];
  onSelect?: (index: number) => void;
  interactive?: boolean;
  height?: number;
}

const VIEW_WIDTH = 1000;

export function CandlestickChart({
  candles,
  highlightRange,
  markers = [],
  onSelect,
  interactive = true,
  height = 320,
}: CandlestickChartProps) {
  const layout = useMemo(() => computeLayout(candles, height), [candles, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-surface">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="block"
        role="img"
        aria-label="ローソク足チャート"
      >
        {highlightRange && (
          <rect
            x={layout.xFor(highlightRange[0]) - layout.columnWidth / 2}
            y={0}
            width={
              layout.xFor(highlightRange[1]) -
              layout.xFor(highlightRange[0]) +
              layout.columnWidth
            }
            height={height}
            className="fill-primary/10"
          />
        )}

        {candles.map((candle) => {
          const isUp = candle.close >= candle.open;
          const x = layout.xFor(candle.index);
          const bodyTop = layout.yFor(Math.max(candle.open, candle.close));
          const bodyBottom = layout.yFor(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          return (
            <g
              key={candle.index}
              onClick={interactive ? () => onSelect?.(candle.index) : undefined}
              className={interactive ? "cursor-pointer" : undefined}
            >
              {interactive && (
                <rect
                  x={x - layout.columnWidth / 2}
                  y={0}
                  width={layout.columnWidth}
                  height={height}
                  fill="transparent"
                />
              )}
              <line
                x1={x}
                x2={x}
                y1={layout.yFor(candle.high)}
                y2={layout.yFor(candle.low)}
                className={isUp ? "stroke-success" : "stroke-danger"}
                strokeWidth={Math.max(1, layout.bodyWidth * 0.14)}
              />
              <rect
                x={x - layout.bodyWidth / 2}
                y={bodyTop}
                width={layout.bodyWidth}
                height={bodyHeight}
                className={isUp ? "fill-success" : "fill-danger"}
              />
            </g>
          );
        })}

        {markers.map((marker, i) => {
          const candle = candles.find((c) => c.index === marker.index);
          if (!candle) return null;
          const x = layout.xFor(marker.index);
          const y = layout.yFor(candle.high) - 14;
          return (
            <g key={`${marker.index}-${i}`}>
              <polygon
                points={`${x - 7},${y} ${x + 7},${y} ${x},${y + 12}`}
                className={cn(
                  marker.color === "success" && "fill-success",
                  marker.color === "danger" && "fill-danger",
                  marker.color === "primary" && "fill-primary"
                )}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function computeLayout(candles: Candle[], height: number) {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const padding = (maxPrice - minPrice) * 0.08 || 1;
  const domainMax = maxPrice + padding;
  const domainMin = minPrice - padding;

  const columnWidth = VIEW_WIDTH / candles.length;
  const bodyWidth = columnWidth * 0.6;

  return {
    columnWidth,
    bodyWidth,
    xFor: (index: number) => index * columnWidth + columnWidth / 2,
    yFor: (price: number) =>
      height - ((price - domainMin) / (domainMax - domainMin)) * height,
  };
}
