/**
 * CONFIGURACIÓN COMPARTIDA DE GRÁFICOS
 *
 * Todas las especificaciones numéricas de las marcas viven acá, una sola vez.
 * Si un chart nuevo necesita una barra más gruesa o una línea más fina, la
 * discusión es sobre este archivo — no se parchea en el componente.
 */

/** Slots categóricos, en orden fijo. El orden ES el mecanismo de seguridad CVD. */
export const CHART_SLOTS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "chart-8",
] as const;

export const MAX_SERIES = CHART_SLOTS.length;

/** Rampa ordinal/secuencial: un solo hue, lightness monótona. */
export const CHART_SEQUENTIAL = [
  "chart-seq-1",
  "chart-seq-2",
  "chart-seq-3",
  "chart-seq-4",
  "chart-seq-5",
] as const;

/**
 * Asigna colores a las series EN ORDEN, nunca ciclando.
 *
 * Por qué no `slots[i % 8]`: si la serie 9 reusa el color de la serie 1, dos
 * entidades distintas quedan pintadas igual y el gráfico miente. El límite es
 * real; pasado el octavo hay que agrupar en "Otros" o facetar en small
 * multiples. Acá se avisa en desarrollo y se degrada a un gris neutro, que al
 * menos es honesto: "no tengo identidad para esto".
 */
export function resolveSeriesColors(categories: readonly string[]): string[] {
  if (process.env.NODE_ENV !== "production" && categories.length > MAX_SERIES) {
    console.warn(
      `[ds/charts] ${categories.length} series pedidas y la paleta categórica ` +
        `tiene ${MAX_SERIES} slots validados. Los colores no se ciclan: las ` +
        `series ${MAX_SERIES + 1}+ salen en gris. Agrupá el excedente en ` +
        `"Otros" o usá small multiples.`,
    );
  }

  return categories.map((_, i) =>
    i < MAX_SERIES ? `var(--${CHART_SLOTS[i]})` : "var(--muted-foreground)",
  );
}

/** Colores de una rampa ordinal para N pasos (máximo 5). */
export function resolveOrdinalColors(steps: number): string[] {
  return Array.from({ length: steps }, (_, i) => {
    const slot = CHART_SEQUENTIAL[Math.min(i, CHART_SEQUENTIAL.length - 1)];
    return `var(--${slot})`;
  });
}

/** Especificaciones fijas de marca. */
export const MARK = {
  /** Barras: tope de grosor. Lo que sobra de la banda es aire, no relleno. */
  barMaxWidth: 24,
  /** Extremo de dato redondeado; base cuadrada sobre la línea de cero. */
  barRadius: 4,
  /** Líneas de 2px, con join y cap redondos. */
  lineWidth: 2,
  /** Marcadores: r ≥ 4 ⇒ diámetro ≥ 8px. */
  dotRadius: 4,
  dotRadiusActive: 5,
  /** Anillo/gap en color de superficie que separa marcas que se tocan. */
  surfaceGap: 2,
  /** El área es un lavado, nunca un bloque saturado. */
  areaOpacity: 0.1,
} as const;

/** Cromo: rejilla y ejes recesivos, hairline, SIEMPRE sólidos (nunca dashed). */
export const CHROME = {
  grid: "var(--chart-grid)",
  axis: "var(--chart-axis)",
  ink: "var(--chart-ink)",
  surface: "var(--chart-surface)",
  tickFontSize: 11,
} as const;

/** Formateador por defecto: miles con separador, sin decimales inventados. */
export const defaultValueFormatter = (value: number): string =>
  new Intl.NumberFormat("es", { maximumFractionDigits: 1 }).format(value);

/**
 * Formato numérico DECLARATIVO para los gráficos.
 *
 * Por qué existe además de `valueFormatter`: los gráficos son Client Components
 * (Recharts necesita el DOM), y una función no se puede pasar de un Server
 * Component a uno de cliente. Un objeto de opciones de `Intl.NumberFormat` sí
 * es serializable, así que una página de servidor puede pedir su formato sin
 * tener que declararse `"use client"` entera.
 *
 * Con `valueFormatter` (función) se gana control total; con `numberFormat`
 * (objeto) se gana poder quedarse en el servidor. Los charts aceptan ambos y la
 * función tiene prioridad.
 */
export type NumberFormat = Intl.NumberFormatOptions & { locale?: string };

export function createValueFormatter(
  format?: NumberFormat,
): (value: number) => string {
  if (!format) return defaultValueFormatter;

  const { locale = "es", ...options } = format;

  const formatter = new Intl.NumberFormat(locale, {
    // `useGrouping: "always"` por defecto y no por capricho: en locale `es`,
    // Intl omite el separador en números de 4 dígitos, así que un eje con
    // 7500 · 10.000 · 12.500 muestra el punto en unos ticks y no en otros. En
    // una columna de números alineados esa inconsistencia se nota y molesta.
    useGrouping: "always",
    ...options,
  });

  return (value: number) => formatter.format(value);
}

/**
 * Compacta números grandes para el valor de un KPI (1.284 / 12,9 mil / 4,2 M).
 * El contrato de stat tile pide esto: un hero number de 9 dígitos no se lee.
 */
export const compactFormatter = (value: number): string =>
  new Intl.NumberFormat("es", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
