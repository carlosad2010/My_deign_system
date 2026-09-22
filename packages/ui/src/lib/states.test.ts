import { describe, expect, it } from "vitest";

import { buttonVariants } from "../components/button";
import { inputVariants } from "../components/input";
import { controlHeight } from "./states";

/**
 * Estos tests no verifican estilos: verifican el CONTRATO del sistema.
 *
 * La promesa es que los estados y los tamaños se definen una sola vez y todos
 * los componentes los componen. Si alguien escribe su propio anillo de foco en
 * un componente nuevo, o le pone una altura a mano a un control, la
 * consistencia se rompe en silencio — nadie lo nota hasta que un input y un
 * botón quedan desalineados en producción. Esto lo hace ruidoso.
 */

describe("contrato de estados", () => {
  it("el anillo de foco es el mismo en Button y en Input", () => {
    const boton = buttonVariants();
    const input = inputVariants();

    for (const clase of [
      "focus-visible:ring-[3px]",
      "focus-visible:ring-ring/55",
      "focus-visible:ring-offset-2",
    ]) {
      expect(boton, `Button perdió ${clase}`).toContain(clase);
      expect(input, `Input perdió ${clase}`).toContain(clase);
    }
  });

  it("el foco se activa con focus-visible y nunca con focus a secas", () => {
    // `:focus` a secas dibuja el anillo también al hacer clic con el mouse,
    // que es ruido visual para quien no navega con teclado.
    const clases = `${buttonVariants()} ${inputVariants()}`;
    const focoPelado = clases
      .split(/\s+/)
      .filter((c) => c.startsWith("focus:") && c.includes("ring"));

    expect(focoPelado).toEqual([]);
  });

  it("Button e Input toman la altura de la misma tabla", () => {
    // Es lo que hace que alineen al convivir en una fila de toolbar.
    for (const tamaño of ["sm", "md", "lg"] as const) {
      const alto = controlHeight[tamaño];
      expect(buttonVariants({ size: tamaño })).toContain(alto);
      expect(inputVariants({ size: tamaño })).toContain(alto);
    }
  });

  it("el tamaño lg cumple el mínimo de área táctil de 44px", () => {
    // h-11 = 2.75rem = 44px, el mínimo recomendado para un objetivo de toque.
    expect(controlHeight.lg).toBe("h-11");
  });

  it("todo control deshabilitado bloquea los eventos de puntero", () => {
    // Sin `pointer-events-none`, un tooltip se dispara sobre un control que no
    // responde: la interfaz parece rota.
    expect(buttonVariants()).toContain("disabled:pointer-events-none");
    expect(inputVariants()).toContain("disabled:pointer-events-none");
  });
});
