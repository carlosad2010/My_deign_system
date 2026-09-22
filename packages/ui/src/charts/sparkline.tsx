"use client";

import * as React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { cn } from "../lib/utils";
import { MARK } from "./chart-config";

export interface SparklineProps {
  data: readonly number[];
  /** Slot categórico o cualquier color del sistema. */
  color?: string;
  className?: string;
  /** Etiqueta para lector de pantalla: el SVG por sí solo no dice nada. */
  label?: string;
}

/**
 * SPARKLINE — micro-tendencia para meter dentro de un stat tile.
 *
 * Sin ejes, sin grilla, sin tooltip: a este tamaño no hay lectura de valores
 * posible y el eje sería tinta sin función. La forma comunica dirección y
 * volatilidad; el número exacto lo carga el valor del tile, y la serie completa
 * vive en el gráfico grande. Por eso lleva `aria-hidden` y el tile es el que
 * expone el dato accesible.
 */
function Sparkline({
  data,
  color = "var(--chart-1)",
  className,
  label,
}: SparklineProps) {
  const series = React.useMemo(
    () => data.map((value, i) => ({ i, value })),
    [data],
  );

  return (
    <div
      className={cn("h-10 w-full", className)}
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={series}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <Area
            type="linear"
            dataKey="value"
            stroke={color}
            strokeWidth={MARK.lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity={MARK.areaOpacity}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Sparkline };
