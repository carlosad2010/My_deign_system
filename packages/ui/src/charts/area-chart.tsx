"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
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

export interface AreaChartProps {
  data: readonly Record<string, unknown>[];
  /** Campo del eje X (normalmente una fecha o un período). */
  index: string;
  /** Campos a graficar, en orden. El orden define el color de cada serie. */
  categories: readonly string[];
  /** Control total del formato. Requiere que quien lo pase sea Client Component. */
  valueFormatter?: (value: number) => string;
  /** Alternativa serializable: se puede pasar desde un Server Component. */
  numberFormat?: NumberFormat;
  stack?: boolean;
  /** `linear` por defecto: una curva suave inventa valores entre puntos. */
  curve?: "linear" | "monotone" | "step";
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  /** Alto del área de dibujo. Se pasa como clase para que sea responsive. */
  chartClassName?: string;
}

function AreaChart({
  data,
  index,
  categories,
  valueFormatter,
  numberFormat,
  stack = false,
  curve = "linear",
  showGrid = true,
  showYAxis = true,
  showLegend = true,
  title,
  description,
  className,
  chartClassName = "h-72",
}: AreaChartProps) {
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
          <RechartsAreaChart
            data={data as Record<string, unknown>[]}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            {showGrid ? (
              // Solo horizontales: las verticales compiten con las marcas y no
              // ayudan a leer una magnitud. Sólidas, nunca punteadas.
              <CartesianGrid
                horizontal
                vertical={false}
                stroke={CHROME.grid}
                strokeWidth={1}
              />
            ) : null}

            <XAxis dataKey={index} {...axisDefaults} dy={8} minTickGap={16} />

            {showYAxis ? (
              <YAxis
                {...axisDefaults}
                width={48}
                tickFormatter={(v: number) => format(v)}
              />
            ) : null}

            <Tooltip
              // El crosshair es la pieza que hace legible una serie temporal:
              // ancla la lectura a un punto del eje en vez de a la marca.
              cursor={{ stroke: CHROME.axis, strokeWidth: 1 }}
              content={
                <ChartTooltip valueFormatter={format} showTotal={stack} />
              }
            />

            {categories.map((category, i) => {
              const dimmed = active != null && active !== category;
              return (
                <Area
                  key={category}
                  type={curve}
                  dataKey={category}
                  stackId={stack ? "stack" : undefined}
                  stroke={colors[i]}
                  strokeWidth={MARK.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={colors[i]}
                  fillOpacity={dimmed ? 0.03 : MARK.areaOpacity}
                  strokeOpacity={dimmed ? 0.25 : 1}
                  dot={false}
                  activeDot={{
                    r: MARK.dotRadiusActive,
                    // Anillo de 2px en color de superficie: mantiene el punto
                    // legible donde cruza otra línea.
                    stroke: CHROME.surface,
                    strokeWidth: MARK.surfaceGap,
                    fill: colors[i],
                  }}
                  isAnimationActive={false}
                />
              );
            })}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export { AreaChart };
