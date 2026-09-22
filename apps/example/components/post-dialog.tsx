"use client";

import * as React from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "biblioteca-diseno";

import { ESTADOS, slugificar, useStore } from "@/lib/store";
import { etiquetaEstado } from "@/components/estado-badge";
import type { BorradorPost, EstadoPost, Post } from "@/lib/types";

const VACIO: BorradorPost = {
  titulo: "",
  slug: "",
  extracto: "",
  autorId: "a1",
  estado: "borrador",
};

type Errores = Partial<Record<keyof BorradorPost, string>>;

function validar(valores: BorradorPost): Errores {
  const errores: Errores = {};

  if (!valores.titulo.trim()) {
    errores.titulo = "El título no puede estar vacío.";
  } else if (valores.titulo.trim().length < 5) {
    errores.titulo = "Usá al menos 5 caracteres para que se entienda de qué va.";
  }

  if (!valores.slug.trim()) {
    errores.slug = "El slug no puede estar vacío.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(valores.slug)) {
    errores.slug = "Solo minúsculas, números y guiones simples.";
  }

  if (valores.extracto.trim().length > 200) {
    errores.extracto = "Máximo 200 caracteres.";
  }

  return errores;
}

export function PostDialog({
  post,
  open,
  onOpenChange,
}: {
  /** Si viene, el diálogo edita. Si no, crea. */
  post?: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { autores, crear, actualizar } = useStore();
  const editando = Boolean(post);

  const [valores, setValores] = React.useState<BorradorPost>(VACIO);
  const [errores, setErrores] = React.useState<Errores>({});
  // Solo se muestran errores después del primer intento de envío: marcar en
  // rojo un formulario que el usuario todavía no terminó de completar es
  // hostil y no le da información nueva.
  const [intentado, setIntentado] = React.useState(false);
  const [slugEditado, setSlugEditado] = React.useState(false);

  // Al abrir, el formulario se carga con el post a editar o se vacía.
  React.useEffect(() => {
    if (!open) return;
    setValores(post ? { ...post } : VACIO);
    setErrores({});
    setIntentado(false);
    setSlugEditado(Boolean(post));
  }, [open, post]);

  const set = <K extends keyof BorradorPost>(
    campo: K,
    valor: BorradorPost[K],
  ) => {
    // Se calcula el próximo estado UNA vez y se usa para las dos cosas: setear
    // y revalidar. Hacerlo por separado fue un bug real — al escribir el
    // título, el slug derivado no entraba en la validación, así que el campo
    // quedaba marcado en rojo aunque ya tuviera un valor válido.
    const siguiente: BorradorPost = { ...valores, [campo]: valor };

    // El slug se deriva del título hasta que alguien lo toca a mano; a partir
    // de ahí deja de pisarse, porque ya es una decisión del usuario.
    if (campo === "titulo" && !slugEditado) {
      siguiente.slug = slugificar(String(valor));
    }

    setValores(siguiente);
    if (intentado) setErrores(validar(siguiente));
  };

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault();
    setIntentado(true);

    const siguientes = validar(valores);
    setErrores(siguientes);
    if (Object.keys(siguientes).length > 0) return;

    if (post) {
      actualizar(post.id, valores);
      toast.success("Cambios guardados");
    } else {
      crear(valores);
      toast.success("Post creado", {
        description: `«${valores.titulo}» quedó como ${valores.estado}.`,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={enviar} noValidate>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar post" : "Nuevo post"}</DialogTitle>
            <DialogDescription>
              {editando
                ? "Los cambios se aplican al guardar."
                : "Se crea como borrador salvo que elijas otro estado."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={valores.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                // `aria-invalid` hace dos cosas a la vez: dispara el estilo de
                // error del Design System y anuncia el error al lector de
                // pantalla. El borde rojo nunca viaja solo.
                aria-invalid={Boolean(errores.titulo) || undefined}
                aria-describedby={errores.titulo ? "titulo-error" : undefined}
                placeholder="Cómo elegir la escala tipográfica"
              />
              {errores.titulo ? (
                <p id="titulo-error" className="text-caption text-destructive-text">
                  {errores.titulo}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={valores.slug}
                onChange={(e) => {
                  setSlugEditado(true);
                  set("slug", e.target.value);
                }}
                aria-invalid={Boolean(errores.slug) || undefined}
                aria-describedby={errores.slug ? "slug-error" : "slug-ayuda"}
                className="font-mono"
              />
              {errores.slug ? (
                <p id="slug-error" className="text-caption text-destructive-text">
                  {errores.slug}
                </p>
              ) : (
                <p id="slug-ayuda" className="text-caption text-muted-foreground">
                  Se genera del título hasta que lo edites a mano.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="extracto">Extracto</Label>
              <Textarea
                id="extracto"
                rows={3}
                value={valores.extracto}
                onChange={(e) => set("extracto", e.target.value)}
                aria-invalid={Boolean(errores.extracto) || undefined}
                aria-describedby="extracto-ayuda"
                placeholder="Una o dos frases que aparecen en el listado."
              />
              <p
                id="extracto-ayuda"
                className="text-caption text-muted-foreground"
              >
                {errores.extracto ? (
                  <span className="text-destructive-text">{errores.extracto}</span>
                ) : (
                  `${valores.extracto.length} / 200 caracteres`
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="autor">Autor</Label>
                <Select
                  value={valores.autorId}
                  onValueChange={(v) => set("autorId", v)}
                >
                  <SelectTrigger id="autor" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {autores.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={valores.estado}
                  onValueChange={(v) => set("estado", v as EstadoPost)}
                >
                  <SelectTrigger id="estado" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {etiquetaEstado(e)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editando ? "Guardar cambios" : "Crear post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
