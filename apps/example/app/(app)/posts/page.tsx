"use client";

import * as React from "react";
import {
  ArchiveIcon,
  CircleCheckIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  SearchXIcon,
  TrashIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
  type DataTableColumn,
} from "@ds/ui";

import { ESTADOS, useStore } from "@/lib/store";
import { EstadoBadge, etiquetaEstado } from "@/components/estado-badge";
import { PostDialog } from "@/components/post-dialog";
import type { EstadoPost, Post } from "@/lib/types";

const miles = (v: number) =>
  new Intl.NumberFormat("es", {
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(v);

export default function PostsPage() {
  const { posts, hidratado, autorDe, actualizar, eliminar, reiniciar } = useStore();

  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos");
  const [editando, setEditando] = React.useState<Post | undefined>();
  const [dialogAbierto, setDialogAbierto] = React.useState(false);
  const [porEliminar, setPorEliminar] = React.useState<Post | undefined>();
  const [seleccion, setSeleccion] = React.useState<string[]>([]);

  const filtrados = React.useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return posts.filter((p) => {
      const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
      const coincideTexto =
        !q ||
        p.titulo.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        (autorDe(p.autorId)?.nombre.toLowerCase().includes(q) ?? false);
      return coincideEstado && coincideTexto;
    });
  }, [posts, busqueda, filtroEstado, autorDe]);

  const hayFiltros = busqueda.trim() !== "" || filtroEstado !== "todos";

  const abrirNuevo = () => {
    setEditando(undefined);
    setDialogAbierto(true);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("todos");
  };

  const cambiarEstado = (post: Post, estado: EstadoPost) => {
    actualizar(post.id, { estado });
    toast.success(`«${post.titulo}» ahora es ${etiquetaEstado(estado).toLowerCase()}`);
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    eliminar(porEliminar.id);
    setSeleccion((s) => s.filter((id) => id !== porEliminar.id));
    // Sin acción «Deshacer» a propósito: ya hubo un diálogo de confirmación.
    // Poner las dos cosas es redundante — o preguntás antes, o dejás deshacer
    // después, no ambas.
    toast.success("Post eliminado");
    setPorEliminar(undefined);
  };

  const columnas: DataTableColumn<Post>[] = React.useMemo(
    () => [
      {
        id: "titulo",
        header: "Título",
        accessor: (p) => p.titulo,
        sortable: true,
        cell: (p) => (
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium">{p.titulo}</span>
            <span className="truncate font-mono text-caption text-muted-foreground">
              /{p.slug}
            </span>
          </div>
        ),
      },
      {
        id: "autor",
        header: "Autor",
        accessor: (p) => autorDe(p.autorId)?.nombre,
        sortable: true,
        className: "hidden md:table-cell text-muted-foreground",
      },
      {
        id: "estado",
        header: "Estado",
        accessor: (p) => p.estado,
        sortable: true,
        cell: (p) => <EstadoBadge estado={p.estado} />,
      },
      {
        id: "vistas",
        header: "Vistas",
        accessor: (p) => p.vistas,
        sortable: true,
        numeric: true,
        className: "hidden sm:table-cell",
        cell: (p) => miles(p.vistas),
      },
      {
        id: "creado",
        header: "Creado",
        accessor: (p) => p.creadoEn,
        sortable: true,
        className: "hidden lg:table-cell text-muted-foreground",
      },
      {
        id: "acciones",
        header: <span className="ds-sr-only">Acciones</span>,
        cell: (post) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon />
                  <span className="ds-sr-only">Acciones para {post.titulo}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setEditando(post);
                    setDialogAbierto(true);
                  }}
                >
                  <PencilIcon />
                  Editar
                </DropdownMenuItem>

                {post.estado !== "publicado" ? (
                  <DropdownMenuItem onClick={() => cambiarEstado(post, "publicado")}>
                    <CircleCheckIcon />
                    Publicar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => cambiarEstado(post, "borrador")}>
                    <PencilIcon />
                    Pasar a borrador
                  </DropdownMenuItem>
                )}

                {post.estado !== "archivado" ? (
                  <DropdownMenuItem onClick={() => cambiarEstado(post, "archivado")}>
                    <ArchiveIcon />
                    Archivar
                  </DropdownMenuItem>
                ) : null}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setPorEliminar(post)}
                >
                  <TrashIcon />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    // `cambiarEstado` y `autorDe` cambian con el store; recalcular acá evita
    // que las celdas queden atadas a una versión vieja de los datos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autorDe, actualizar],
  );

  return (
    <>
      <PageHeader
        eyebrow="Contenido"
        title="Posts"
        description="Creá, editá y cambiá el estado de las entradas del blog."
        action={
          <Button onClick={abrirNuevo}>
            <PlusIcon />
            Nuevo post
          </Button>
        }
        separated
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, slug o autor…"
            className="pl-9"
            aria-label="Buscar posts"
          />
        </div>

        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-44" aria-label="Filtrar por estado">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e}>
                {etiquetaEstado(e)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hayFiltros ? (
          <Button variant="ghost" onClick={limpiarFiltros}>
            Limpiar
          </Button>
        ) : null}

        {seleccion.length > 0 ? (
          <Button
            variant="outline"
            onClick={() => {
              toast.info(
                `${seleccion.length} post${seleccion.length === 1 ? "" : "s"} seleccionado${seleccion.length === 1 ? "" : "s"}`,
                { description: "Las acciones en lote quedan para otra iteración." },
              );
            }}
          >
            Acciones ({seleccion.length})
          </Button>
        ) : null}
      </div>

      <DataTable
        data={filtrados}
        columns={columnas}
        getRowId={(p) => p.id}
        caption="Posts del blog"
        initialSort={{ columnId: "creado", direction: "desc" }}
        selectable
        selected={seleccion}
        onSelectedChange={setSeleccion}
        pageSize={6}
        loading={!hidratado}
        empty={
          // Dos vacíos distintos: «no hay nada» y «tu búsqueda no encontró
          // nada» son problemas diferentes y necesitan salidas diferentes.
          hayFiltros ? (
            <EmptyState
              icon={SearchXIcon}
              title="Sin resultados"
              description="Ningún post coincide con los filtros actuales. Probá con otro término o quitá el filtro de estado."
              action={
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={FileTextIcon}
              title="Todavía no hay posts"
              description="Cuando crees tu primera entrada va a aparecer en esta lista con su estado y sus métricas de lectura."
              action={
                <>
                  <Button onClick={abrirNuevo}>
                    <PlusIcon />
                    Crear el primer post
                  </Button>
                  <Button variant="outline" onClick={reiniciar}>
                    <RotateCcwIcon />
                    Restaurar ejemplos
                  </Button>
                </>
              }
            />
          )
        }
      />

      <Alert>
        <FileTextIcon />
        <AlertTitle>Los cambios se guardan en tu navegador</AlertTitle>
        <AlertDescription>
          Este MVP no tiene backend: lo que crees o edites vive en localStorage.
          Podés volver a los datos de ejemplo cuando quieras desde Ajustes.
        </AlertDescription>
      </Alert>

      <PostDialog
        post={editando}
        open={dialogAbierto}
        onOpenChange={setDialogAbierto}
      />

      <Dialog
        open={Boolean(porEliminar)}
        onOpenChange={(abierto) => !abierto && setPorEliminar(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar este post?</DialogTitle>
            <DialogDescription>
              Se va a borrar «{porEliminar?.titulo}». Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPorEliminar(undefined)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEliminar}>
              <TrashIcon />
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
