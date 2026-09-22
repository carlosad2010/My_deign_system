"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
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

export interface BarChartProps {
  data: readonly Record<string, unknown>[];
  index: string;
  categories: readonly string[];
  valueFormatter?: (value: number) => string;
  /** Alternativa serializable: se puede pasar desde un Server Component. */
  numberFormat?: NumberFormat;
  stack?: boolean;
  /** `horizontal` para categorías con nombres largos. */
  layout?: "vertical" | "horizontal";
  showGrid?: boolean;
  showLegend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  chartClassName?: string;
}

function BarChart({
  data,
  index,
  categories,
  valueFormatter,
  numberFormat,
  stack = false,
  layout = "vertical",
  showGrid = true,
  showLegend = true,
  title,
  description,
  className,
  chartClassName = "h-72",
}: BarChartProps) {
  const colors = React.useMemo(
    () => resolveSeriesColors(categories),
    [categories],
  );
  const format = React.useMemo(
    () => valueFormatter ?? createValueFormatter(numberFormat),
    [valueFormatter, numberFormat],
  );
  const [active, setActive] = React.useState<string | null>(null);

  // `vertical` = columnas que crecen hacia arriba (el default mental de la
  // gente). Recharts lo llama layout "horizontal", así que se traduce acá para
  // que la API pública no herede esa confusión.
  const isColumns = layout === "vertical";

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
          <RechartsBarChart
            data={data as Record<string, unknown>[]}
            layout={isColumns ? "horizontal" : "vertical"}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="20%"
          >
            {showGrid ? (
              <CartesianGrid
                horizontal={isColumns}
                vertical={!isColumns}
                stroke={CHROME.grid}
                strokeWidth={1}
              />
            ) : null}

            {isColumns ? (
              <>
                <XAxis dataKey={index} {...axisDefaults} dy={8} />
                <YAxis
                  {...axisDefaults}
                  width={48}
                  tickFormatter={(v: number) => format(v)}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  {...axisDefaults}
                  tickFormatter={(v: number) => format(v)}
                />
                <YAxis
                  type="category"
                  dataKey={index}
                  {...axisDefaults}
                  width={110}
                />
              </>
            )}

            <Tooltip
              cursor={{ fill: CHROME.ink, fillOpacity: 0.06 }}
              content={
                <ChartTooltip
                  valueFormatter={format}
                  showTotal={stack}
                />
              }
            />

            {categories.map((category, i) => {
              const dimmed = active != null && active !== category;
              return (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId={stack ? "stack" : undefined}
                  fill={colors[i]}
                  fillOpacity={dimmed ? 0.25 : 1}
                  // Tope de grosor: lo que sobra de la banda queda como aire.
                  maxBarSize={MARK.barMaxWidth}
                  // Extremo de dato redondeado y base cuadrada. En un stack no
                  // se redondea: el "extremo" de un segmento interior no existe,
                  // y redondearlo dibuja una muesca falsa entre segmentos.
                  radius={
                    stack
                      ? 0
                      : isColumns
                        ? [MARK.barRadius, MARK.barRadius, 0, 0]
                        : [0, MARK.barRadius, MARK.barRadius, 0]
                  }
                  // El "gap de superficie" de 2px que separa segmentos que se
                  // tocan. Es un stroke del color del fondo: no agrega tinta,
                  // la quita.
                  stroke={stack ? CHROME.surface : undefined}
                  strokeWidth={stack ? MARK.surfaceGap : 0}
                  isAnimationActive={false}
                />
              );
            })}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export { BarChart };
