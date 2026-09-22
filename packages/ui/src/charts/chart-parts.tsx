"use client";

import * as React from "react";
import { TableIcon, ChartColumnIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { CHROME, defaultValueFormatter } from "./chart-config";

/* ---------------------------------------------------------------------------
 * LEYENDA
 *
 * Siempre presente con 2+ series: es el canal de identidad confiable. Con UNA
 * sola serie no se dibuja — hay un único color y el título ya dice qué es; una
 * caja con un solo swatch repite el título y gasta espacio.
 *
 * El texto va en tokens de tipografía, NUNCA en el color de la serie: un aqua o
 * un amarillo categórico es ilegible como texto sobre la superficie. La
 * identidad la carga el punto de color al lado, no la letra.
 * ------------------------------------------------------------------------ */
export interface ChartLegendProps extends React.ComponentProps<"ul"> {
  categories: readonly string[];
  colors: readonly string[];
  /** Serie resaltada; el resto baja de opacidad. */
  active?: string | null;
  onHover?: (category: string | null) => void;
}

function ChartLegend({
  categories,
  colors,
  active,
  onHover,
  className,
  ...props
}: ChartLegendProps) {
  if (categories.length < 2) return null;

  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}
      {...props}
    >
      {categories.map((category, i) => {
        const dimmed = active != null && active !== category;
        return (
          <li
            key={category}
            className={cn(
              "flex items-center gap-1.5 text-ui-sm text-muted-foreground transition-opacity duration-(--duration-fast)",
              dimmed && "opacity-40",
            )}
            onMouseEnter={() => onHover?.(category)}
            onMouseLeave={() => onHover?.(null)}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            {category}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
 * TOOLTIP
 *
 * La capa de hover va por defecto: un gráfico en HTML/SVG ES interactivo, y sin
 * tooltip el lector solo puede estimar valores contra el eje.
 * ------------------------------------------------------------------------ */
export interface ChartTooltipPayloadItem {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipPayloadItem[];
  valueFormatter?: (value: number) => string;
  /** Muestra el total de las series visibles. Útil en stacks. */
  showTotal?: boolean;
}

function ChartTooltip({
  active,
  label,
  payload,
  valueFormatter = defaultValueFormatter,
  showTotal = false,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce(
    (sum, item) => sum + (typeof item.value === "number" ? item.value : 0),
    0,
  );

  return (
    <div
      data-slot="chart-tooltip"
      className="min-w-40 rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md"
    >
      {label != null ? (
        <div className="mb-1.5 border-b pb-1.5 text-caption font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}

      <ul className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <li
            key={`${item.dataKey}-${i}`}
            className="flex items-center justify-between gap-4 text-ui-sm"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {typeof item.value === "number"
                ? valueFormatter(item.value)
                : item.value}
            </span>
          </li>
        ))}
      </ul>

      {showTotal && payload.length > 1 ? (
        <div className="mt-1.5 flex items-center justify-between gap-4 border-t pt-1.5 text-ui-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium tabular-nums text-foreground">
            {valueFormatter(total)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * FRAME
 *
 * Envuelve título + leyenda + gráfico + vista de tabla.
 *
 * La vista de tabla no es un extra: tres hues de la paleta categórica quedan
 * bajo 3:1 contra la superficie clara (aqua, amarillo, magenta). Esa medición
 * obliga a un canal de relief — labels visibles o tabla. Acá se resuelve con el
 * toggle, que además da acceso real a los valores exactos a cualquiera que use
 * lector de pantalla, porque un <svg> de Recharts no es navegable.
 * ------------------------------------------------------------------------ */
// `title` se omite de las props del DOM a propósito: el atributo HTML `title`
// es un string (el tooltip nativo del navegador) y acá `title` es el encabezado
// del gráfico, que puede ser cualquier nodo de React.
export interface ChartFrameProps
  extends Omit<React.ComponentProps<"figure">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Datos crudos para la vista de tabla. */
  data?: readonly Record<string, unknown>[];
  index?: string;
  categories?: readonly string[];
  valueFormatter?: (value: number) => string;
  legend?: React.ReactNode;
  toolbar?: React.ReactNode;
  showTableToggle?: boolean;
}

function ChartFrame({
  title,
  description,
  data,
  index,
  categories,
  valueFormatter = defaultValueFormatter,
  legend,
  toolbar,
  showTableToggle = true,
  className,
  children,
  ...props
}: ChartFrameProps) {
  const [asTable, setAsTable] = React.useState(false);
  const canToggle =
    showTableToggle && !!data?.length && !!index && !!categories?.length;

  return (
    <figure
      data-slot="chart-frame"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {title || description || toolbar || canToggle ? (
        <figcaption className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {title ? <div className="text-h4">{title}</div> : null}
            {description ? (
              <div className="text-ui-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {toolbar}
            {canToggle ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAsTable((v) => !v)}
                aria-pressed={asTable}
              >
                {asTable ? <ChartColumnIcon /> : <TableIcon />}
                {asTable ? "Gráfico" : "Tabla"}
              </Button>
            ) : null}
          </div>
        </figcaption>
      ) : null}

      {legend}

      {asTable && canToggle ? (
        <Table caption={typeof title === "string" ? title : "Datos del gráfico"}>
          <TableHeader>
            <TableRow>
              <TableHead>{index}</TableHead>
              {categories!.map((c) => (
                <TableHead key={c} numeric>
                  {c}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data!.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {String(row[index!] ?? "")}
                </TableCell>
                {categories!.map((c) => (
                  <TableCell key={c} numeric>
                    {typeof row[c] === "number"
                      ? valueFormatter(row[c] as number)
                      : "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        children
      )}
    </figure>
  );
}

/** Props de eje compartidas: ticks recesivos, sin línea de eje redundante. */
export const axisDefaults = {
  stroke: CHROME.axis,
  tick: { fill: CHROME.ink, fontSize: CHROME.tickFontSize },
  tickLine: false,
  axisLine: false,
} as const;

export { ChartLegend, ChartTooltip, ChartFrame };
