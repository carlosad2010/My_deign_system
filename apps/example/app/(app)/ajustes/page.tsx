"use client";

import * as React from "react";
import { CircleCheckIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooterBordered,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  PageHeader,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@ds/ui";

import { useStore } from "@/lib/store";

export default function AjustesPage() {
  const { reiniciar, posts } = useStore();
  const [guardado, setGuardado] = React.useState(false);
  const [nombreBlog, setNombreBlog] = React.useState("Redacción");

  const guardar = (evento: React.FormEvent) => {
    evento.preventDefault();
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Ajustes"
        description="Formularios completos del sistema: labels, ayuda, validación y estados."
        separated
      />

      {guardado ? (
        <Alert variant="success">
          <CircleCheckIcon />
          <AlertTitle>Ajustes guardados</AlertTitle>
          <AlertDescription>
            En un MVP sin backend esto no persiste nada, pero muestra el patrón
            de confirmación.
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="general">
        <TabsList variant="underline">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="publicacion">Publicación</TabsTrigger>
          <TabsTrigger value="datos">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-6">
          <form onSubmit={guardar} className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Identidad del blog</CardTitle>
                <CardDescription>
                  Cómo se presenta el sitio a los lectores.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nombreBlog}
                    onChange={(e) => setNombreBlog(e.target.value)}
                    aria-invalid={nombreBlog.trim() === "" || undefined}
                    aria-describedby="nombre-ayuda"
                  />
                  <p
                    id="nombre-ayuda"
                    className={
                      nombreBlog.trim() === ""
                        ? "text-caption text-destructive-text"
                        : "text-caption text-muted-foreground"
                    }
                  >
                    {nombreBlog.trim() === ""
                      ? "El nombre no puede estar vacío."
                      : "Aparece en el header y en el título de las páginas."}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger id="idioma" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    rows={3}
                    defaultValue="Notas sobre diseño de producto, sistemas de diseño y front-end."
                  />
                </div>
              </CardContent>
              <CardFooterBordered>
                <Button type="submit">Guardar cambios</Button>
                <Button type="button" variant="ghost">
                  Descartar
                </Button>
              </CardFooterBordered>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="publicacion" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de publicación</CardTitle>
              <CardDescription>
                Se aplican a todos los posts nuevos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                {
                  id: "publico",
                  label: "Blog público",
                  ayuda: "Si se apaga, solo el equipo ve el contenido.",
                  def: true,
                },
                {
                  id: "comentarios",
                  label: "Permitir comentarios",
                  ayuda: "Los comentarios se moderan antes de aparecer.",
                  def: true,
                },
                {
                  id: "rss",
                  label: "Publicar feed RSS",
                  ayuda: "Incluye los últimos 20 posts publicados.",
                  def: false,
                },
              ].map((opcion, i, todas) => (
                <React.Fragment key={opcion.id}>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={opcion.id}>{opcion.label}</Label>
                      <p className="text-caption text-muted-foreground">
                        {opcion.ayuda}
                      </p>
                    </div>
                    <Switch id={opcion.id} defaultChecked={opcion.def} />
                  </div>
                  {i < todas.length - 1 ? <Separator /> : null}
                </React.Fragment>
              ))}

              <Separator />

              <div className="flex items-start gap-2">
                <Checkbox id="notificar" defaultChecked />
                <Label htmlFor="notificar" className="leading-snug">
                  Avisarme por email cuando un autor envíe un post a revisión
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datos" className="pt-6">
          <Section
            title="Datos locales"
            description="Este MVP guarda todo en el navegador, sin backend."
          >
            <Alert variant="warning">
              <TriangleAlertIcon />
              <AlertTitle>Restaurar borra tus cambios</AlertTitle>
              <AlertDescription>
                Volver a los datos de ejemplo descarta los {posts.length} posts
                actuales, incluidos los que hayas creado o editado.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">Datos de ejemplo</span>
                  <span className="text-ui-sm text-muted-foreground">
                    8 posts y 4 autores de muestra.
                  </span>
                </div>
                <Button variant="destructive" onClick={reiniciar}>
                  <RotateCcwIcon />
                  Restaurar
                </Button>
              </CardContent>
            </Card>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
