// Sin "use client" a propósito: StatCard no usa hooks ni handlers, es
// computación pura. Así puede renderizarse en el servidor y RECIBIR un
// componente de icono como prop — una referencia a componente no cruza la
// frontera server→client, pero acá no hay frontera que cruzar. El Sparkline
// interior sí es client, y un componente de servidor puede renderizarlo sin
// problema.
import * as React from "react";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Card, CardContent } from "../components/card";
import { Sparkline } from "../charts/sparkline";
import { compactFormatter } from "../charts/chart-config";

/**
 * El delta se formatea con Intl y no con `toFixed`, que siempre escribe punto
 * decimal. En locale `es` eso dejaba "58,7 mil" y "+16.3%" juntos en la misma
 * tarjeta, con dos separadores decimales distintos.
 *
 * El signo se pone a mano (`signDisplay` daría un "-" ASCII); acá se usa el
 * menos tipográfico U+2212, que tiene el mismo ancho que el "+".
 */
const percentFormatter = new Intl.NumberFormat("es", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export interface StatCardProps extends React.ComponentProps<"div"> {
  /** En estilo oración, sin dos puntos al final. */
  label: string;
  /** Número crudo (se compacta) o un nodo ya formateado. */
  value: number | React.ReactNode;
  /** Variación relativa en puntos porcentuales. Signada. */
  delta?: number;
  /** Período de comparación. Un delta sin referencia no significa nada. */
  deltaLabel?: string;
  /**
   * Para métricas donde bajar es bueno (churn, tasa de error, latencia).
   * El contrato es `color = dirección × si subir es bueno`: sin esta prop, una
   * caída del 20% en errores se pintaría de rojo, que es exactamente al revés.
   */
  lowerIsBetter?: boolean;
  /** Micro-tendencia. 12 puntos es el largo de referencia. */
  trend?: readonly number[];
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * STAT CARD — el contrato de "stat tile": label · value · delta · trend.
 *
 * Accesibilidad del delta: además del color, lleva SIEMPRE un icono de
 * dirección y el texto del período. Un triángulo verde solo no comunica nada a
 * quien no distingue verde de rojo, y el color de estado por sí mismo tampoco
 * llega a un lector de pantalla.
 */
function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  lowerIsBetter = false,
  trend,
  icon: Icon,
  className,
  ...props
}: StatCardProps) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const isFlat = hasDelta && Math.abs(delta) < 0.05;
  const isUp = hasDelta && delta > 0;

  // Dirección × polaridad de la métrica.
  const isGood = isFlat ? null : lowerIsBetter ? !isUp : isUp;

  const DeltaIcon = isFlat ? MinusIcon : isUp ? TrendingUpIcon : TrendingDownIcon;

  const deltaTone =
    isGood === null
      ? "text-muted-foreground"
      : isGood
        ? "text-success-text"
        : "text-destructive-text";

  return (
    <Card data-slot="stat-card" className={cn("", className)} {...props}>
      <CardContent className="flex flex-col gap-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-ui-sm text-muted-foreground">{label}</span>
          {Icon ? (
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          ) : null}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          {/* Cifras proporcionales a propósito: `tabular-nums` a este tamaño
              separa los dígitos de más. */}
          <span className="text-h1 font-semibold tracking-tight">
            {typeof value === "number" ? compactFormatter(value) : value}
          </span>

          {hasDelta ? (
            <span
              className={cn("flex items-center gap-1 text-ui-sm font-medium", deltaTone)}
            >
              <DeltaIcon className="size-3.5" aria-hidden="true" />
              {isFlat
                ? "sin cambios"
                : `${delta > 0 ? "+" : "−"}${percentFormatter.format(Math.abs(delta))}%`}
            </span>
          ) : null}
        </div>

        {hasDelta && deltaLabel ? (
          <span className="text-caption text-muted-foreground">{deltaLabel}</span>
        ) : null}

        {trend?.length ? (
          <Sparkline
            data={trend}
            // La tendencia es contexto, no el dato principal: va en el hue de
            // de-énfasis para no competir con el número.
            color="var(--chart-seq-2)"
            className="mt-1 h-10"
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export { StatCard };
