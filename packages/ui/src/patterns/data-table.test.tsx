import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTable, type DataTableColumn } from "./data-table";

type Fila = { id: string; nombre: string; vistas: number | null };

const datos: Fila[] = [
  { id: "1", nombre: "Ceci", vistas: 30 },
  { id: "2", nombre: "ana", vistas: 100 },
  { id: "3", nombre: "Ñandú", vistas: 5 },
];

const columnas: DataTableColumn<Fila>[] = [
  { id: "nombre", header: "Nombre", accessor: (f) => f.nombre, sortable: true },
  {
    id: "vistas",
    header: "Vistas",
    accessor: (f) => f.vistas,
    sortable: true,
    numeric: true,
  },
];

/** Texto de la primera celda de cada fila del cuerpo, en orden de render. */
function nombresEnPantalla() {
  return screen
    .getAllByRole("row")
    .slice(1) // la primera es la cabecera
    .map((fila) => within(fila).getAllByRole("cell")[0]?.textContent);
}

function montar(props: Partial<React.ComponentProps<typeof DataTable<Fila>>> = {}) {
  return render(
    <DataTable
      data={datos}
      columns={columnas}
      getRowId={(f) => f.id}
      caption="Tabla de prueba"
      {...props}
    />,
  );
}

describe("DataTable", () => {
  it("renderiza una fila por dato, en el orden recibido", () => {
    montar();
    expect(nombresEnPantalla()).toEqual(["Ceci", "ana", "Ñandú"]);
  });

  describe("orden", () => {
    it("ordena respetando el locale español", async () => {
      // Con un comparador ingenuo de strings, «ana» en minúscula iría después
      // de las mayúsculas y «Ñandú» caería detrás de «Z».
      montar();
      await userEvent.click(screen.getByRole("button", { name: /Nombre/ }));
      expect(nombresEnPantalla()).toEqual(["ana", "Ceci", "Ñandú"]);
    });

    it("cicla asc → desc → sin orden", async () => {
      montar();
      const cabecera = screen.getByRole("button", { name: /Nombre/ });

      await userEvent.click(cabecera);
      expect(nombresEnPantalla()).toEqual(["ana", "Ceci", "Ñandú"]);

      await userEvent.click(cabecera);
      expect(nombresEnPantalla()).toEqual(["Ñandú", "Ceci", "ana"]);

      // El tercer clic devuelve el orden natural de los datos, que a veces es
      // el que importa (el que vino de la API).
      await userEvent.click(cabecera);
      expect(nombresEnPantalla()).toEqual(["Ceci", "ana", "Ñandú"]);
    });

    it("expone el orden en aria-sort", async () => {
      montar();
      const columna = screen
        .getAllByRole("columnheader")
        .find((c) => c.textContent?.includes("Nombre"))!;

      // La flechita sola no comunica nada a un lector de pantalla.
      expect(columna).toHaveAttribute("aria-sort", "none");

      await userEvent.click(within(columna).getByRole("button"));
      expect(columna).toHaveAttribute("aria-sort", "ascending");

      await userEvent.click(within(columna).getByRole("button"));
      expect(columna).toHaveAttribute("aria-sort", "descending");
    });

    it("manda los valores vacíos al final en ambos sentidos", async () => {
      // «Sin dato» no es ni el mayor ni el menor: arrastrarlo al tope invierte
      // la lectura de la tabla.
      const conNulos: Fila[] = [
        { id: "1", nombre: "b", vistas: 10 },
        { id: "2", nombre: "a", vistas: null },
        { id: "3", nombre: "c", vistas: 5 },
      ];
      render(
        <DataTable
          data={conNulos}
          columns={columnas}
          getRowId={(f) => f.id}
          caption="Con nulos"
        />,
      );

      const cabecera = screen.getByRole("button", { name: /Vistas/ });

      await userEvent.click(cabecera);
      expect(nombresEnPantalla()).toEqual(["c", "b", "a"]);

      await userEvent.click(cabecera);
      expect(nombresEnPantalla()).toEqual(["b", "c", "a"]);
    });

    it("no ordena una columna sin accessor aunque diga sortable", () => {
      render(
        <DataTable
          data={datos}
          columns={[{ id: "x", header: "Sin accessor", sortable: true }]}
          getRowId={(f) => f.id}
          caption="Sin accessor"
        />,
      );

      // No se puede comparar un ReactNode, así que no se ofrece el control.
      expect(screen.queryByRole("button", { name: /Sin accessor/ })).toBeNull();
    });

    it("no muta el array que recibe por props", async () => {
      const original = [...datos];
      montar();
      await userEvent.click(screen.getByRole("button", { name: /Nombre/ }));
      expect(datos).toEqual(original);
    });
  });

  describe("paginación", () => {
    it("muestra solo la página actual y navega", async () => {
      montar({ pageSize: 2 });
      expect(nombresEnPantalla()).toEqual(["Ceci", "ana"]);

      await userEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
      expect(nombresEnPantalla()).toEqual(["Ñandú"]);
    });

    it("deshabilita los controles en los extremos", async () => {
      montar({ pageSize: 2 });

      expect(screen.getByRole("button", { name: /Anterior/ })).toBeDisabled();
      await userEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
      expect(screen.getByRole("button", { name: /Siguiente/ })).toBeDisabled();
    });

    it("no muestra controles si todo entra en una página", () => {
      montar({ pageSize: 50 });
      expect(screen.queryByRole("button", { name: /Siguiente/ })).toBeNull();
    });

    it("vuelve a la primera página al reordenar", async () => {
      montar({ pageSize: 2 });
      await userEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
      await userEvent.click(screen.getByRole("button", { name: /Nombre/ }));

      // Quedarse en la página 2 después de reordenar muestra datos que el
      // usuario no pidió ver.
      expect(nombresEnPantalla()).toEqual(["ana", "Ceci"]);
    });
  });

  describe("selección", () => {
    it("informa la fila marcada", async () => {
      const onSelectedChange = vi.fn();
      montar({ selectable: true, selected: [], onSelectedChange });

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[1]!); // 0 es el «seleccionar todas»

      expect(onSelectedChange).toHaveBeenCalledWith(["1"]);
    });

    it("«seleccionar todas» alcanza solo la página visible", async () => {
      // Marcar miles de filas invisibles con un clic es un accidente
      // esperando ocurrir.
      const onSelectedChange = vi.fn();
      montar({
        selectable: true,
        selected: [],
        onSelectedChange,
        pageSize: 2,
      });

      await userEvent.click(screen.getAllByRole("checkbox")[0]!);
      expect(onSelectedChange).toHaveBeenCalledWith(["1", "2"]);
    });

    it("al desmarcar todas conserva lo seleccionado en otras páginas", async () => {
      const onSelectedChange = vi.fn();
      montar({
        selectable: true,
        selected: ["1", "2", "3"],
        onSelectedChange,
        pageSize: 2,
      });

      await userEvent.click(screen.getAllByRole("checkbox")[0]!);
      expect(onSelectedChange).toHaveBeenCalledWith(["3"]);
    });
  });

  describe("estados", () => {
    it("muestra el vacío en lugar de la tabla cuando no hay datos", () => {
      render(
        <DataTable
          data={[]}
          columns={columnas}
          getRowId={(f) => f.id}
          caption="Vacía"
          empty={<p>No hay nada todavía</p>}
        />,
      );

      expect(screen.getByText("No hay nada todavía")).toBeInTheDocument();
      expect(screen.queryByRole("table")).toBeNull();
    });

    it("mientras carga muestra la estructura, no el vacío", () => {
      render(
        <DataTable
          data={[]}
          columns={columnas}
          getRowId={(f) => f.id}
          caption="Cargando"
          loading
          empty={<p>No hay nada todavía</p>}
        />,
      );

      // Mostrar «no hay nada» mientras los datos viajan es mentirle al usuario.
      expect(screen.queryByText("No hay nada todavía")).toBeNull();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });
});
