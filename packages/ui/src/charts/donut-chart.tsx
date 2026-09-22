"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "../lib/utils";
import {
  CHROME,
  MARK,
  compactFormatter,
  createValueFormatter,
  resolveSeriesColors,
  type NumberFormat,
} from "./chart-config";
import { ChartFrame, ChartLegend, ChartTooltip } from "./chart-parts";

export interface DonutChartProps {
  data: readonly Record<string, unknown>[];
  /** Campo con el nombre de cada porción. */
  index: string;
  /** Campo con el valor de cada porción. */
  category: string;
  valueFormatter?: (value: number) => string;
  /** Alternativa serializable: se puede pasar desde un Server Component. */
  numberFormat?: NumberFormat;
  /** Texto central. Por defecto muestra el total. */
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  showLegend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  chartClassName?: string;
}

/**
 * DONUT
 *
 * Advertencia de uso, no de implementación: comparar ángulos es más difícil que
 * comparar longitudes. Un donut sirve para "cuánto del total es X" con pocas
 * porciones. Para comparar categorías entre sí, una barra es mejor lectura
 * siempre. Si hay más de 5 porciones, agrupá la cola en "Otros".
 */
function DonutChart({
  data,
  index,
  category,
  valueFormatter,
  numberFormat,
  centerLabel = "Total",
  centerValue,
  showLegend = true,
  title,
  description,
  className,
  chartClassName = "h-72",
}: DonutChartProps) {
  const names = React.useMemo(
    () => data.map((d) => String(d[index] ?? "")),
    [data, index],
  );
  const colors = React.useMemo(() => resolveSeriesColors(names), [names]);
  const format = React.useMemo(
    () => valueFormatter ?? createValueFormatter(numberFormat),
    [valueFormatter, numberFormat],
  );
  const total = React.useMemo(
    () =>
      data.reduce(
        (sum, d) => sum + (typeof d[category] === "number" ? (d[category] as number) : 0),
        0,
      ),
    [data, category],
  );

  return (
    <ChartFrame
      title={title}
      description={description}
      data={data}
      index={index}
      categories={[category]}
      valueFormatter={format}
      className={className}
      legend={
        showLegend ? (
          <ChartLegend categories={names} colors={colors} />
        ) : null
      }
    >
      <div className={cn("relative w-full", chartClassName)}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip valueFormatter={format} />} />
            <Pie
              data={data as Record<string, unknown>[]}
              dataKey={category}
              nameKey={index}
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={0}
              // Mismo gap de superficie que en un stack: separa porciones
              // vecinas sin dibujarles un contorno propio.
              stroke={CHROME.surface}
              strokeWidth={MARK.surfaceGap}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* El número del centro es el hero de este gráfico: va en cifras
            proporcionales y en el token de texto, nunca en un color de serie. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-caption text-muted-foreground">{centerLabel}</span>
          <span className="text-h2 text-foreground">
            {centerValue ?? compactFormatter(total)}
          </span>
        </div>
      </div>
    </ChartFrame>
  );
}

export { DonutChart };
