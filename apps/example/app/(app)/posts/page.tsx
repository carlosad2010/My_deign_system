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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ds/ui";

import { ESTADOS, useStore } from "@/lib/store";
import { EstadoBadge, etiquetaEstado } from "@/components/estado-badge";
import { PostDialog } from "@/components/post-dialog";
import type { Post } from "@/lib/types";

const miles = (v: number) =>
  new Intl.NumberFormat("es", { maximumFractionDigits: 0, useGrouping: "always" }).format(v);

export default function PostsPage() {
  const { posts, hidratado, autorDe, actualizar, eliminar, reiniciar } = useStore();

  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<string>("todos");
  const [editando, setEditando] = React.useState<Post | undefined>();
  const [dialogAbierto, setDialogAbierto] = React.useState(false);
  const [porEliminar, setPorEliminar] = React.useState<Post | undefined>();

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

  const abrirEdicion = (post: Post) => {
    setEditando(post);
    setDialogAbierto(true);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("todos");
  };

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

      {/* Los filtros van en una fila arriba de la tabla, no desperdigados. */}
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

        <span className="ml-auto text-ui-sm text-muted-foreground" aria-live="polite">
          {filtrados.length} de {posts.length}
        </span>
      </div>

      {!hidratado ? (
        <div role="status" aria-label="Cargando posts" className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        // Dos vacíos distintos: "no hay nada" y "tu búsqueda no encontró nada"
        // son problemas diferentes y necesitan salidas diferentes.
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
      ) : (
        <Table caption="Posts del blog">
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Autor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden sm:table-cell" numeric>
                Vistas
              </TableHead>
              <TableHead className="hidden lg:table-cell">Creado</TableHead>
              <TableHead>
                <span className="ds-sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-medium">{post.titulo}</span>
                    <span className="truncate font-mono text-caption text-muted-foreground">
                      /{post.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {autorDe(post.autorId)?.nombre ?? "—"}
                </TableCell>
                <TableCell>
                  <EstadoBadge estado={post.estado} />
                </TableCell>
                <TableCell className="hidden sm:table-cell" numeric>
                  {miles(post.vistas)}
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {post.creadoEn}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                          <span className="ds-sr-only">
                            Acciones para {post.titulo}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => abrirEdicion(post)}>
                          <PencilIcon />
                          Editar
                        </DropdownMenuItem>

                        {post.estado !== "publicado" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              actualizar(post.id, { estado: "publicado" })
                            }
                          >
                            <CircleCheckIcon />
                            Publicar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              actualizar(post.id, { estado: "borrador" })
                            }
                          >
                            <PencilIcon />
                            Pasar a borrador
                          </DropdownMenuItem>
                        )}

                        {post.estado !== "archivado" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              actualizar(post.id, { estado: "archivado" })
                            }
                          >
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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

      {/* Confirmación de borrado: acción irreversible, se nombra el post para
          que nadie borre "el de arriba" por error. */}
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
            <Button
              variant="destructive"
              onClick={() => {
                if (porEliminar) eliminar(porEliminar.id);
                setPorEliminar(undefined);
              }}
            >
              <TrashIcon />
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
