import { afterEach, describe, expect, it, vi } from "vitest";

import {
  MAX_SERIES,
  createValueFormatter,
  resolveOrdinalColors,
  resolveSeriesColors,
} from "./chart-config";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("paleta categórica", () => {
  it("asigna los slots en orden fijo", () => {
    // El ORDEN es el mecanismo de seguridad para daltonismo: los pares
    // validados son los adyacentes. Reordenar invalida la medición.
    expect(resolveSeriesColors(["a", "b", "c"])).toEqual([
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
    ]);
  });

  it("NO cicla los colores al pasarse de la paleta", () => {
    // Es la regla más importante del módulo: si la serie 9 reusa el color de
    // la serie 1, dos entidades distintas se pintan igual y el gráfico miente.
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const categorias = Array.from({ length: MAX_SERIES + 3 }, (_, i) => `s${i}`);
    const colores = resolveSeriesColors(categorias);

    const excedente = colores.slice(MAX_SERIES);
    expect(excedente.every((c) => c === "var(--muted-foreground)")).toBe(true);

    // Y ningún color de identidad aparece dos veces.
    const identidad = colores.slice(0, MAX_SERIES);
    expect(new Set(identidad).size).toBe(MAX_SERIES);
  });

  it("avisa por consola cuando se piden más series de las que hay", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    resolveSeriesColors(Array.from({ length: MAX_SERIES + 1 }, (_, i) => `s${i}`));
    expect(warn).toHaveBeenCalledOnce();
  });

  it("no avisa mientras se esté dentro de la paleta", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    resolveSeriesColors(Array.from({ length: MAX_SERIES }, (_, i) => `s${i}`));
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("rampa ordinal", () => {
  it("devuelve pasos de un solo hue, en orden", () => {
    expect(resolveOrdinalColors(3)).toEqual([
      "var(--chart-seq-1)",
      "var(--chart-seq-2)",
      "var(--chart-seq-3)",
    ]);
  });

  it("satura en el último paso en vez de romperse", () => {
    const colores = resolveOrdinalColors(8);
    expect(colores).toHaveLength(8);
    expect(colores.at(-1)).toBe("var(--chart-seq-5)");
  });
});

describe("formateador de valores", () => {
  it("agrupa los miles de forma consistente en números de 4 y 5 dígitos", () => {
    // El bug que motivó `useGrouping: "always"`: en locale `es`, Intl omite el
    // separador en 4 dígitos, así que un eje mostraba «7500» y «10.000».
    const formatear = createValueFormatter({ maximumFractionDigits: 0 });

    const cuatro = formatear(7500);
    const cinco = formatear(10000);

    expect(cuatro).toContain(".");
    expect(cinco).toContain(".");
    expect(cuatro).toBe("7.500");
    expect(cinco).toBe("10.000");
  });

  it("respeta las opciones que le pasen por encima del default", () => {
    const sinAgrupar = createValueFormatter({
      maximumFractionDigits: 0,
      useGrouping: false,
    });
    expect(sinAgrupar(7500)).toBe("7500");
  });

  it("acepta otro locale", () => {
    const enUS = createValueFormatter({
      locale: "en-US",
      maximumFractionDigits: 0,
    });
    expect(enUS(7500)).toBe("7,500");
  });
});
