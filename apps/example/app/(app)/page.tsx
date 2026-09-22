"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon, EyeIcon, FileTextIcon, PenLineIcon, UsersIcon } from "lucide-react";

import {
  AreaChart,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  PageHeader,
  Section,
  Skeleton,
  StatCard,
} from "@ds/ui";

import { useStore } from "@/lib/store";
import { EstadoBadge } from "@/components/estado-badge";

const miles = (v: number) =>
  new Intl.NumberFormat("es", { maximumFractionDigits: 0, useGrouping: "always" }).format(v);

export default function ResumenPage() {
  const { posts, autores, hidratado, autorDe } = useStore();

  // Todas las métricas se derivan del estado real: crear o borrar un post en
  // /posts se refleja acá sin ningún trabajo extra.
  const publicados = posts.filter((p) => p.estado === "publicado");
  const borradores = posts.filter((p) => p.estado === "borrador");
  const vistasTotales = posts.reduce((s, p) => s + p.vistas, 0);

  const porMes = React.useMemo(() => {
    const meses = new Map<string, { mes: string; Posts: number; Vistas: number }>();
    for (const p of [...posts].sort((a, b) => a.creadoEn.localeCompare(b.creadoEn))) {
      const clave = p.creadoEn.slice(0, 7);
      const etiqueta = new Date(`${clave}-01T00:00:00`).toLocaleDateString("es", {
        month: "short",
      });
      const actual = meses.get(clave) ?? { mes: etiqueta, Posts: 0, Vistas: 0 };
      actual.Posts += 1;
      actual.Vistas += p.vistas;
      meses.set(clave, actual);
    }
    return [...meses.values()];
  }, [posts]);

  const porAutor = React.useMemo(
    () =>
      autores
        .map((a) => ({
          autor: a.nombre,
          Publicados: posts.filter((p) => p.autorId === a.id && p.estado === "publicado")
            .length,
        }))
        .filter((f) => f.Publicados > 0)
        .sort((a, b) => b.Publicados - a.Publicados),
    [autores, posts],
  );

  const masLeidos = [...publicados].sort((a, b) => b.vistas - a.vistas).slice(0, 4);

  // Mientras el store se hidrata desde localStorage se muestran skeletons, no
  // un flash de datos de ejemplo que después cambian solos.
  if (!hidratado) {
    return (
      <div role="status" aria-label="Cargando el resumen" className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Grid cols={4}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </Grid>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Panel"
        title="Resumen"
        description="Todo lo que ves acá sale de la Biblioteca de Diseño. Esta app no define un solo color propio."
        action={
          <Button asChild>
            <Link href="/posts">
              Ir a posts
              <ArrowRightIcon />
            </Link>
          </Button>
        }
        separated
      />

      <Grid cols={4}>
        <StatCard
          label="Posts totales"
          value={posts.length}
          icon={FileTextIcon}
        />
        <StatCard
          label="Publicados"
          value={publicados.length}
          icon={PenLineIcon}
        />
        <StatCard
          label="Vistas acumuladas"
          value={vistasTotales}
          trend={porMes.map((m) => m.Vistas)}
          icon={EyeIcon}
        />
        <StatCard label="Autores activos" value={porAutor.length} icon={UsersIcon} />
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Publicación y lectura</CardTitle>
          <CardDescription>
            Posts creados y vistas acumuladas, por mes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Esta página es Client Component, así que puede pasar una función
              directamente. Desde un Server Component habría que usar la prop
              `numberFormat`. */}
          <AreaChart
            data={porMes}
            index="mes"
            categories={["Vistas"]}
            valueFormatter={miles}
            chartClassName="h-72"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publicados por autor</CardTitle>
            <CardDescription>Una sola serie: sin leyenda.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={porAutor}
              index="autor"
              categories={["Publicados"]}
              layout="horizontal"
              numberFormat={{ maximumFractionDigits: 0 }}
              chartClassName="h-64"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Más leídos</CardTitle>
            <CardDescription>Entre los posts publicados</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {masLeidos.map((p) => (
              <Link
                key={p.id}
                href="/posts"
                className="flex items-start justify-between gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/55"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-ui-sm font-medium">{p.titulo}</span>
                  <span className="truncate text-caption text-muted-foreground">
                    {autorDe(p.autorId)?.nombre}
                  </span>
                </div>
                <span className="shrink-0 text-ui-sm tabular-nums text-muted-foreground">
                  {miles(p.vistas)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Section title="Borradores pendientes" description="Sin publicar todavía.">
        <div className="flex flex-col gap-2">
          {borradores.length === 0 ? (
            <p className="text-ui-sm text-muted-foreground">
              No hay borradores. Todo el contenido está publicado o archivado.
            </p>
          ) : (
            borradores.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-medium">{p.titulo}</span>
                    <span className="text-caption text-muted-foreground">
                      {autorDe(p.autorId)?.nombre} · {p.creadoEn}
                    </span>
                  </div>
                  <EstadoBadge estado={p.estado} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Section>
    </>
  );
}
