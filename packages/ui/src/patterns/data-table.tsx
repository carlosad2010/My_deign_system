"use client";

import * as React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import { cn } from "../lib/utils";
import { focusRing, transitionBase } from "../lib/states";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Skeleton } from "../components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";

/**
 * DATA TABLE
 *
 * Orden, selección y paginación, sin librería de tablas externa. La lógica es
 * de unas 80 líneas y evita sumar una dependencia más al sistema; si algún día
 * hacen falta columnas redimensionables, agrupación o virtualización, ahí sí
 * conviene una librería y este componente se reemplaza entero.
 *
 * Se apoya en los primitivos `Table*`, así que hereda gratis el scroll
 * horizontal accesible y la alineación tabular de las columnas numéricas.
 */

export type DataTableColumn<T> = {
  /** Identificador estable. Se usa como key y como criterio de orden. */
  id: string;
  header: React.ReactNode;
  /**
   * Valor plano para ordenar. Sin esto la columna no se puede ordenar, por
   * más que `sortable` diga que sí: no se puede comparar un ReactNode.
   */
  accessor?: (row: T) => string | number | null | undefined;
  /** Contenido de la celda. Por defecto, el valor del accessor. */
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  /** Alinea a la derecha y activa cifras tabulares. */
  numeric?: boolean;
  /** Para esconder la columna en pantallas chicas: "hidden md:table-cell". */
  className?: string;
};

export type SortState = { columnId: string; direction: "asc" | "desc" };

export interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  /** Identidad estable de cada fila. Necesaria para selección y keys. */
  getRowId: (row: T) => string;
  caption: string;
  initialSort?: SortState;
  onSortChange?: (sort: SortState | null) => void;
  /** Activa la columna de checkboxes. */
  selectable?: boolean;
  selected?: readonly string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Filas por página. Omitido, no pagina. */
  pageSize?: number;
  loading?: boolean;
  /** Qué mostrar cuando no hay filas. */
  empty?: React.ReactNode;
  className?: string;
}

/**
 * Comparador. Los nulos van siempre al final, en los dos sentidos del orden:
 * "sin dato" no es ni el mayor ni el menor, es la ausencia de dato, y
 * arrastrarlo al tope invierte la lectura de la tabla.
 */
function comparar(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  direccion: "asc" | "desc",
): number {
  const aVacio = a === null || a === undefined || a === "";
  const bVacio = b === null || b === undefined || b === "";
  if (aVacio && bVacio) return 0;
  if (aVacio) return 1;
  if (bVacio) return -1;

  let resultado: number;
  if (typeof a === "number" && typeof b === "number") {
    resultado = a - b;
  } else {
    // `localeCompare` con locale: sin esto "ñ" y los acentos ordenan mal.
    resultado = String(a).localeCompare(String(b), "es", {
      numeric: true,
      sensitivity: "base",
    });
  }

  return direccion === "asc" ? resultado : -resultado;
}

function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  initialSort,
  onSortChange,
  selectable = false,
  selected,
  onSelectedChange,
  pageSize,
  loading = false,
  empty,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState | null>(initialSort ?? null);
  const [page, setPage] = React.useState(0);

  const seleccionadas = React.useMemo(
    () => new Set(selected ?? []),
    [selected],
  );

  const ordenadas = React.useMemo(() => {
    if (!sort) return data;
    const columna = columns.find((c) => c.id === sort.columnId);
    if (!columna?.accessor) return data;
    const accessor = columna.accessor;
    // Copia antes de ordenar: `sort` muta, y mutar las props del consumidor es
    // una fuente clásica de bugs difíciles de rastrear.
    return [...data].sort((a, b) =>
      comparar(accessor(a), accessor(b), sort.direction),
    );
  }, [data, columns, sort]);

  const totalPaginas = pageSize ? Math.ceil(ordenadas.length / pageSize) : 1;

  // Si el filtrado de afuera achica los datos, la página actual puede quedar
  // fuera de rango y la tabla se vería vacía sin estarlo.
  const paginaSegura = Math.min(page, Math.max(0, totalPaginas - 1));
  React.useEffect(() => {
    if (paginaSegura !== page) setPage(paginaSegura);
  }, [paginaSegura, page]);

  const visibles = React.useMemo(() => {
    if (!pageSize) return ordenadas;
    const inicio = paginaSegura * pageSize;
    return ordenadas.slice(inicio, inicio + pageSize);
  }, [ordenadas, pageSize, paginaSegura]);

  const alternarOrden = (columna: DataTableColumn<T>) => {
    if (!columna.sortable || !columna.accessor) return;
    // Ciclo de tres: asc → desc → sin orden. El tercer clic devuelve la tabla
    // a su orden natural, que a veces es el que importa (el de la API).
    const siguiente: SortState | null =
      sort?.columnId !== columna.id
        ? { columnId: columna.id, direction: "asc" }
        : sort.direction === "asc"
          ? { columnId: columna.id, direction: "desc" }
          : null;

    setSort(siguiente);
    setPage(0);
    onSortChange?.(siguiente);
  };

  const idsVisibles = visibles.map(getRowId);
  const todasSeleccionadas =
    idsVisibles.length > 0 && idsVisibles.every((id) => seleccionadas.has(id));
  const algunaSeleccionada = idsVisibles.some((id) => seleccionadas.has(id));

  const alternarTodas = () => {
    if (!onSelectedChange) return;
    const restantes = [...seleccionadas].filter(
      (id) => !idsVisibles.includes(id),
    );
    // El "seleccionar todo" actúa sobre la PÁGINA visible, no sobre el dataset
    // entero: marcar 4.000 filas invisibles con un clic es un accidente
    // esperando ocurrir.
    onSelectedChange(
      todasSeleccionadas ? restantes : [...restantes, ...idsVisibles],
    );
  };

  const alternarFila = (id: string) => {
    if (!onSelectedChange) return;
    const siguiente = new Set(seleccionadas);
    if (siguiente.has(id)) siguiente.delete(id);
    else siguiente.add(id);
    onSelectedChange([...siguiente]);
  };

  const columnasTotales = columns.length + (selectable ? 1 : 0);

  if (!loading && ordenadas.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Table caption={caption}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead>
                <Checkbox
                  checked={
                    todasSeleccionadas
                      ? true
                      : algunaSeleccionada
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={alternarTodas}
                  aria-label="Seleccionar todas las filas de esta página"
                />
              </TableHead>
            ) : null}

            {columns.map((columna) => {
              const ordenable = columna.sortable && columna.accessor;
              const activa = sort?.columnId === columna.id;

              return (
                <TableHead
                  key={columna.id}
                  numeric={columna.numeric}
                  className={columna.className}
                  // `aria-sort` es lo que comunica el orden a un lector de
                  // pantalla. La flechita sola no dice nada.
                  aria-sort={
                    activa
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : ordenable
                        ? "none"
                        : undefined
                  }
                >
                  {ordenable ? (
                    <button
                      type="button"
                      onClick={() => alternarOrden(columna)}
                      className={cn(
                        "-mx-1 inline-flex items-center gap-1.5 rounded-sm px-1 py-0.5",
                        "hover:text-foreground",
                        columna.numeric && "flex-row-reverse",
                        transitionBase,
                        focusRing,
                      )}
                    >
                      {columna.header}
                      {activa ? (
                        sort.direction === "asc" ? (
                          <ArrowUpIcon className="size-3.5" />
                        ) : (
                          <ArrowDownIcon className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDownIcon className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    columna.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: pageSize ?? 5 }, (_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: columnasTotales }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : visibles.map((fila) => {
                const id = getRowId(fila);
                const marcada = seleccionadas.has(id);

                return (
                  <TableRow key={id} data-state={marcada ? "selected" : undefined}>
                    {selectable ? (
                      <TableCell>
                        <Checkbox
                          checked={marcada}
                          onCheckedChange={() => alternarFila(id)}
                          aria-label={`Seleccionar fila ${id}`}
                        />
                      </TableCell>
                    ) : null}

                    {columns.map((columna) => (
                      <TableCell
                        key={columna.id}
                        numeric={columna.numeric}
                        className={columna.className}
                      >
                        {columna.cell
                          ? columna.cell(fila)
                          : (columna.accessor?.(fila) ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>

      {pageSize && totalPaginas > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ui-sm text-muted-foreground" aria-live="polite">
            {paginaSegura * pageSize + 1}–
            {Math.min((paginaSegura + 1) * pageSize, ordenadas.length)} de{" "}
            {ordenadas.length}
            {selectable && seleccionadas.size > 0
              ? ` · ${seleccionadas.size} seleccionada${seleccionadas.size === 1 ? "" : "s"}`
              : ""}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={paginaSegura === 0}
            >
              <ChevronLeftIcon />
              Anterior
            </Button>
            <span className="text-ui-sm text-muted-foreground">
              {paginaSegura + 1} / {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPaginas - 1, p + 1))}
              disabled={paginaSegura >= totalPaginas - 1}
            >
              Siguiente
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DataTable };
