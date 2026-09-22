import type { Metadata } from "next";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  PlusIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";

import {
  AreaChart,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DonutChart,
  Grid,
  PageHeader,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "biblioteca-diseno";

import {
  channelBreakdown,
  monthlyTraffic,
  planDistribution,
  teamMembers,
  trendSeries,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

// Objeto serializable, no una función: así la página sigue siendo un Server
// Component y no hace falta marcarla "use client" solo para formatear números.
const enteros = { maximumFractionDigits: 0 } as const;

// Esta sí es una función, y está bien: se usa para formatear texto que esta
// misma página renderiza en el servidor. El problema es pasar una función COMO
// PROP a un Client Component, no tenerla.
const miles = (v: number) =>
  new Intl.NumberFormat("es", { maximumFractionDigits: 0 }).format(v);

const estadoBadge = {
  activo: { variant: "success" as const, icon: CircleCheckIcon, label: "Activo" },
  pendiente: { variant: "warning" as const, icon: TriangleAlertIcon, label: "Pendiente" },
  suspendido: { variant: "destructive" as const, icon: CircleAlertIcon, label: "Suspendido" },
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Septiembre 2026"
        title="Resumen"
        description="Todo en esta pantalla sale del Design System, sin una sola clase de color escrita a mano."
        action={
          <>
            {/* Los filtros van en una fila arriba de los gráficos, no
                desperdigados entre las tarjetas. */}
            <Select defaultValue="9m">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="9m">Últimos 9 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <DownloadIcon />
              Exportar
            </Button>
            <Button>
              <PlusIcon />
              Nuevo post
            </Button>
          </>
        }
        separated
      />

      {/* KPIs ------------------------------------------------------------- */}
      <Grid cols={4}>
        <StatCard
          label="Visitas totales"
          value={58660}
          delta={16.3}
          deltaLabel="vs. período anterior"
          trend={trendSeries.usuarios}
          icon={EyeIcon}
        />
        <StatCard
          label="Registros"
          value={8250}
          delta={9.1}
          deltaLabel="vs. período anterior"
          trend={trendSeries.ingresos}
          icon={UsersIcon}
        />
        <StatCard
          label="Posts publicados"
          value={324}
          delta={4.2}
          deltaLabel="vs. período anterior"
          icon={FileTextIcon}
        />
        <StatCard
          label="Tasa de abandono"
          value="2,9%"
          delta={-16.2}
          deltaLabel="vs. período anterior"
          lowerIsBetter
          trend={trendSeries.churn}
        />
      </Grid>

      {/* Gráfico principal ------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución del tráfico</CardTitle>
          <CardDescription>
            Visitas y registros mes a mes, con el detalle en tabla a un clic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area">
            <TabsList variant="underline">
              <TabsTrigger value="area">Tendencia</TabsTrigger>
              <TabsTrigger value="canales">Canales</TabsTrigger>
            </TabsList>

            <TabsContent value="area" className="pt-5">
              <AreaChart
                data={monthlyTraffic}
                index="mes"
                categories={["Visitas", "Registros"]}
                numberFormat={enteros}
                chartClassName="h-80"
              />
            </TabsContent>

            <TabsContent value="canales" className="pt-5">
              <AreaChart
                data={monthlyTraffic}
                index="mes"
                categories={["Conversiones", "Registros", "Visitas"]}
                numberFormat={enteros}
                stack
                chartClassName="h-80"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fila secundaria -------------------------------------------------- */}
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sesiones por canal</CardTitle>
            <CardDescription>
              Una sola serie: sin leyenda, el título ya dice qué se mide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={planDistribution}
              index="plan"
              category="cuentas"
              centerLabel="Cuentas"
              numberFormat={enteros}
              chartClassName="h-64"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top canales</CardTitle>
            <CardDescription>Ordenado por sesiones</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {channelBreakdown.map((c, i) => {
              const max = channelBreakdown[0]!.sesiones;
              const pct = (c.sesiones / max) * 100;
              return (
                <div key={c.canal} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-ui-sm">{c.canal}</span>
                    <span className="shrink-0 text-ui-sm font-medium tabular-nums">
                      {miles(c.sesiones)}
                    </span>
                  </div>
                  {/* Barra nominal: todas del mismo hue. Colorearlas por valor
                      gastaría el canal de identidad re-codificando el largo. */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-chart-1"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tabla ------------------------------------------------------------ */}
      <Section title="Autores" description="Con estado y actividad.">
        <Table caption="Autores del blog y su actividad">
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead numeric>Posts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((m) => {
              const badge = estadoBadge[m.estado];
              const Icon = badge.icon;
              return (
                <TableRow key={m.email}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {m.nombre
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{m.nombre}</span>
                        <span className="truncate text-caption text-muted-foreground">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.rol}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>
                      <Icon />
                      {badge.label}
                    </Badge>
                  </TableCell>
                  <TableCell numeric>{m.posts}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>
    </>
  );
}
