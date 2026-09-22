import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("deja ganar a la última clase en conflicto", () => {
    // Es la razón de ser de `cn`: que el consumidor pueda pasar `className`
    // y sobreescribir un token sin pelear con la especificidad del CSS.
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("bg-primary", "bg-destructive")).toBe("bg-destructive");
  });

  it("no descarta clases que no compiten entre sí", () => {
    const resultado = cn("rounded-md", "border", "text-ui");
    expect(resultado).toContain("rounded-md");
    expect(resultado).toContain("border");
    expect(resultado).toContain("text-ui");
  });

  it("ignora valores falsy de los condicionales", () => {
    const activo = false;
    expect(cn("base", activo && "activo", undefined, null)).toBe("base");
  });

  it("entiende las variantes de estado como espacios separados", () => {
    // `hover:px-4` no debe colapsar con `px-2`: son contextos distintos.
    expect(cn("px-2", "hover:px-4")).toBe("px-2 hover:px-4");
  });
});
