"use client";

import { MailIcon, ShieldIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Grid,
  PageHeader,
  Progress,
  Separator,
} from "@ds/ui";

import { useStore } from "@/lib/store";

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

export default function AutoresPage() {
  const { autores, posts } = useStore();

  const maximo = Math.max(
    1,
    ...autores.map((a) => posts.filter((p) => p.autorId === a.id).length),
  );

  return (
    <>
      <PageHeader
        eyebrow="Equipo"
        title="Autores"
        description="Quién escribe y cuánto. Los contadores salen del mismo estado que la tabla de posts."
        separated
      />

      <Grid cols={2}>
        {autores.map((autor) => {
          const suyos = posts.filter((p) => p.autorId === autor.id);
          const publicados = suyos.filter((p) => p.estado === "publicado").length;
          const vistas = suyos.reduce((s, p) => s + p.vistas, 0);

          return (
            <Card key={autor.id}>
              <CardContent className="flex flex-col gap-4 pt-5">
                <div className="flex items-start gap-3">
                  <Avatar size="lg">
                    <AvatarFallback>{iniciales(autor.nombre)}</AvatarFallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-h4">{autor.nombre}</span>
                    <span className="flex items-center gap-1.5 truncate text-ui-sm text-muted-foreground">
                      <MailIcon className="size-3.5 shrink-0" />
                      {autor.email}
                    </span>
                  </div>

                  <Badge
                    variant={autor.rol === "Administración" ? "primary" : "outline"}
                    className="ml-auto shrink-0"
                  >
                    <ShieldIcon />
                    {autor.rol}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-h3">{suyos.length}</span>
                    <span className="text-caption text-muted-foreground">Posts</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-h3">{publicados}</span>
                    <span className="text-caption text-muted-foreground">
                      Publicados
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-h3">
                      {new Intl.NumberFormat("es", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(vistas)}
                    </span>
                    <span className="text-caption text-muted-foreground">Vistas</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-caption text-muted-foreground">
                    Participación en el contenido
                  </span>
                  <Progress
                    value={(suyos.length / maximo) * 100}
                    aria-label={`${autor.nombre}: ${suyos.length} de ${maximo} posts del autor más activo`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Grid>
    </>
  );
}
