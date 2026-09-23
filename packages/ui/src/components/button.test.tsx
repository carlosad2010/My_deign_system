import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("por defecto es type=button y no envía el formulario que lo contiene", async () => {
    // Un <button> sin type dentro de un <form> hace submit. Es una de las
    // causas más comunes de «se recargó la página sola».
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Acción</Button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Acción" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe("formAction", () => {
    // Regresión: el default `type="button"` hacía que el navegador ignorara
    // `formAction` por completo. El clic no hacía nada y no había error en
    // consola — el peor tipo de bug. Apareció en una app real, en un botón de
    // «Guardar borrador» que no guardaba.
    it("cambia el type a submit cuando recibe formAction", () => {
      render(<Button formAction={() => {}}>Guardar borrador</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("dispara la acción del formAction al hacer clic", async () => {
      const principal = vi.fn((e: React.FormEvent) => e.preventDefault());
      // `formAction` recibe el FormData, no el evento: es la firma de una
      // server action, distinta de la de `onSubmit`.
      const alternativa = vi.fn((_: FormData) => {});

      render(
        <form onSubmit={principal}>
          <Button formAction={alternativa}>Guardar borrador</Button>
        </form>,
      );

      await userEvent.click(screen.getByRole("button"));
      // jsdom no implementa el override real de formAction, pero sí dispara el
      // submit — que es exactamente lo que NO pasaba con type="button".
      expect(principal).toHaveBeenCalledOnce();
    });

    it("un type explícito sigue ganando sobre formAction", () => {
      render(
        <Button type="button" formAction={() => {}}>
          Raro pero válido
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("sin formAction se mantiene el default seguro", () => {
      render(<Button>Acción</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  it("respeta un type=submit explícito", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Enviar</Button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  describe("estado de carga", () => {
    it("bloquea el botón y marca aria-busy", () => {
      render(<Button loading>Guardar</Button>);
      const boton = screen.getByRole("button");

      // `disabled` evita el doble envío; `aria-busy` es lo que comunica
      // «esperá» a un lector de pantalla — el spinner solo es visual.
      expect(boton).toBeDisabled();
      expect(boton).toHaveAttribute("aria-busy", "true");
    });

    it("no se puede clickear mientras carga", async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Guardar
        </Button>,
      );

      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("reemplaza el texto cuando se le pasa loadingText", () => {
      render(
        <Button loading loadingText="Verificando…">
          Iniciar sesión
        </Button>,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Verificando…");
      expect(screen.queryByText("Iniciar sesión")).not.toBeInTheDocument();
    });

    it("conserva el contenido si no se le pasa loadingText", () => {
      render(<Button loading>Guardar</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Guardar");
    });

    it("sin loading no marca aria-busy ni se deshabilita", () => {
      render(<Button>Guardar</Button>);
      const boton = screen.getByRole("button");
      expect(boton).not.toBeDisabled();
      expect(boton).not.toHaveAttribute("aria-busy");
    });
  });

  describe("asChild", () => {
    it("renderiza el hijo conservando los estilos", () => {
      render(
        <Button asChild>
          <a href="/destino">Ir</a>
        </Button>,
      );

      const enlace = screen.getByRole("link", { name: "Ir" });
      expect(enlace).toHaveAttribute("href", "/destino");
      expect(enlace.className).toContain("inline-flex");
    });

    it("ignora loading, porque Slot espera exactamente un hijo", () => {
      // Con asChild + spinner habría dos hijos y Slot rompería. La decisión
      // está documentada en el componente; esto la fija.
      render(
        <Button asChild loading>
          <a href="/destino">Ir</a>
        </Button>,
      );

      const enlace = screen.getByRole("link", { name: "Ir" });
      expect(enlace).not.toHaveAttribute("aria-busy");
    });
  });
});
