"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "../lib/utils";
import {
  CHROME,
  MARK,
  createValueFormatter,
  resolveSeriesColors,
  type NumberFormat,
} from "./chart-config";
import {
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  axisDefaults,
} from "./chart-parts";

export interface LineChartProps {
  data: readonly Record<string, unknown>[];
  index: string;
  categories: readonly string[];
  valueFormatter?: (value: number) => string;
  /** Alternativa serializable: se puede pasar desde un Server Component. */
  numberFormat?: NumberFormat;
  curve?: "linear" | "monotone" | "step";
  showGrid?: boolean;
  showLegend?: boolean;
  /** Punto en cada dato. Por defecto off: con muchos puntos es ruido. */
  showDots?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  chartClassName?: string;
}

function LineChart({
  data,
  index,
  categories,
  valueFormatter,
  numberFormat,
  curve = "linear",
  showGrid = true,
  showLegend = true,
  showDots = false,
  title,
  description,
  className,
  chartClassName = "h-72",
}: LineChartProps) {
  const colors = React.useMemo(
    () => resolveSeriesColors(categories),
    [categories],
  );
  const format = React.useMemo(
    () => valueFormatter ?? createValueFormatter(numberFormat),
    [valueFormatter, numberFormat],
  );
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <ChartFrame
      title={title}
      description={description}
      data={data}
      index={index}
      categories={categories}
      valueFormatter={format}
      className={className}
      legend={
        showLegend ? (
          <ChartLegend
            categories={categories}
            colors={colors}
            active={active}
            onHover={setActive}
          />
        ) : null
      }
    >
      <div className={cn("w-full", chartClassName)}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data as Record<string, unknown>[]}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            {showGrid ? (
              <CartesianGrid
                horizontal
                vertical={false}
                stroke={CHROME.grid}
                strokeWidth={1}
              />
            ) : null}

            <XAxis dataKey={index} {...axisDefaults} dy={8} minTickGap={16} />
            <YAxis
              {...axisDefaults}
              width={48}
              tickFormatter={(v: number) => format(v)}
            />

            <Tooltip
              cursor={{ stroke: CHROME.axis, strokeWidth: 1 }}
              content={<ChartTooltip valueFormatter={format} />}
            />

            {categories.map((category, i) => {
              const dimmed = active != null && active !== category;
              return (
                <Line
                  key={category}
                  type={curve}
                  dataKey={category}
                  stroke={colors[i]}
                  strokeWidth={MARK.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={dimmed ? 0.25 : 1}
                  dot={
                    showDots
                      ? {
                          r: MARK.dotRadius,
                          fill: colors[i],
                          stroke: CHROME.surface,
                          strokeWidth: MARK.surfaceGap,
                        }
                      : false
                  }
                  activeDot={{
                    r: MARK.dotRadiusActive,
                    stroke: CHROME.surface,
                    strokeWidth: MARK.surfaceGap,
                    fill: colors[i],
                  }}
                  isAnimationActive={false}
                />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export { LineChart };
