import type { Metadata } from "next";
import {
  FileTextIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Grid,
  Input,
  PageHeader,
  Section,
  StatCard,
} from "@ds/ui";

import { trendSeries } from "@/lib/mock-data";
import { Showcase } from "@/components/showcase";
import { DataTableDemo } from "@/components/data-table-demo";
import { ToastDemo } from "@/components/toast-demo";

export const metadata: Metadata = { title: "Patrones" };

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        title="Patrones"
        description="Composiciones que resuelven un problema recurrente completo, no una pieza de UI aislada."
        separated
      />

      {/* ------------------------------------------------------------------ */}
      <Section
        title="PageHeader"
        description="El encabezado de vista de Taxonomy: eyebrow, título, descripción y acciones."
      >
        <Card>
          <CardContent className="pt-5">
            <PageHeader
              eyebrow="Contenido"
              title="Posts"
              description="Administrá las entradas del blog, su estado de publicación y sus autores."
              action={
                <>
                  <Button variant="outline">
                    <SearchIcon />
                    Filtrar
                  </Button>
                  <Button>
                    <PlusIcon />
                    Nuevo post
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Detalle responsive: en móvil el bloque de acciones baja debajo del
          título y los botones se estiran, en lugar de comprimir el título a dos
          palabras por línea. Angostá la ventana para verlo.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="StatCard"
        description="El contrato de stat tile: label · value · delta · trend."
      >
        <Grid cols={4}>
          <StatCard
            label="Ingresos del mes"
            value={86400}
            delta={8.4}
            deltaLabel="vs. agosto"
            trend={trendSeries.ingresos}
            icon={FileTextIcon}
          />
          <StatCard
            label="Usuarios activos"
            value={23800}
            delta={7.9}
            deltaLabel="vs. agosto"
            trend={trendSeries.usuarios}
            icon={UsersIcon}
          />
          <StatCard
            label="Tasa de abandono"
            value="2,9%"
            delta={-16.2}
            deltaLabel="vs. agosto"
            lowerIsBetter
            trend={trendSeries.churn}
          />
          <StatCard
            label="Posts publicados"
            value={324}
            delta={0.02}
            deltaLabel="vs. agosto"
          />
        </Grid>
        <div className="flex flex-col gap-2">
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">Mirá la tercera tarjeta.</strong>{" "}
            &ldquo;Tasa de abandono&rdquo; bajó 16,2% y el delta se pinta{" "}
            <strong className="text-success-text">verde</strong>, porque lleva{" "}
            <code className="font-mono">lowerIsBetter</code>. Sin esa prop, una
            mejora se mostraría en rojo. El contrato es{" "}
            <em>color = dirección × si subir es bueno</em>, no{" "}
            <em>color = signo</em>.
          </p>
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            El delta siempre lleva icono de dirección y el período de
            comparación. Un porcentaje verde sin referencia temporal no dice nada,
            y el color solo no llega a un lector de pantalla ni a alguien que no
            distingue verde de rojo.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="EmptyState"
        description="El EmptyPlaceholder de Taxonomy. El borde punteado dice 'acá va a haber algo'."
      >
        <Grid cols={2}>
          <EmptyState
            icon={FileTextIcon}
            title="Todavía no hay posts"
            description="Cuando publiques tu primera entrada va a aparecer en esta lista, junto con sus métricas de lectura."
            action={
              <Button>
                <PlusIcon />
                Crear el primer post
              </Button>
            }
          />
          <EmptyState
            icon={SearchIcon}
            title="Sin resultados para «design system»"
            description="Revisá la ortografía o probá con un término más general."
            action={
              <Button variant="outline">Limpiar la búsqueda</Button>
            }
          />
        </Grid>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Regla de copy: el título dice qué falta, la descripción dice cómo
          resolverlo, la acción es el primer paso. &ldquo;No hay datos&rdquo; sin
          más deja al usuario sin saber si es un error, un filtro mal puesto o
          una cuenta nueva.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Section y Grid"
        description="El ritmo vertical y la grilla responsive del sistema."
      >
        <Card>
          <CardHeader>
            <CardTitle>Grid cols={3}</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={3}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex h-20 items-center justify-center rounded-md border border-dashed text-ui-sm text-muted-foreground"
                >
                  Celda {n}
                </div>
              ))}
            </Grid>
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Los breakpoints intermedios se derivan para que nunca quede una columna
          huérfana muy angosta: <code className="font-mono">cols=3</code> va 1 →
          2 → 3, no 1 → 3.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Toolbar"
        description="La prueba de que la escala de altura compartida funciona."
      >
        <Card>
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Buscar posts…"
                className="w-full sm:w-64"
              />
              <Button variant="outline">
                <SearchIcon />
                Filtros
              </Button>
              <Button variant="outline">Exportar</Button>
              <div className="ml-auto flex items-center gap-2">
                <Button>
                  <PlusIcon />
                  Nuevo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Input y Button miden 36px los dos porque toman la altura de la misma
          tabla en <code className="font-mono">lib/states.ts</code>. No hay un
          solo ajuste manual de alineación en esta fila.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="AppShell"
        description="El layout que estás usando ahora mismo."
      >
        <Card>
          <CardContent className="pt-5">
            <pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-ui-sm">
              <code>{`<AppShell>
  <AppHeader>
    <AppHeaderBar>
      <MobileNav sections={nav} />   {/* solo <md */}
      <Brand />
      <ThemeToggle className="ml-auto" />
    </AppHeaderBar>
  </AppHeader>

  <AppBody>
    <AppSidebar>                    {/* solo ≥md */}
      <SidebarNav sections={nav} activeHref={pathname} />
    </AppSidebar>
    <AppMain>
      <AppContent>{children}</AppContent>
    </AppMain>
  </AppBody>
</AppShell>`}</code>
            </pre>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2">
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <code className="font-mono">AppMain</code> lleva{" "}
            <code className="font-mono">min-w-0</code>. Sin eso, una tabla o un
            gráfico ancho desborda el viewport en lugar de scrollear internamente
            — es el bug de layout más común en un shell con flex.
          </p>
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            Bajo <code className="font-mono">md</code> el sidebar no colapsa a un
            rail de iconos: se mueve completo a un drawer. Un rail de iconos sin
            etiqueta obliga a adivinar qué es cada cosa.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="DataTable"
        description="Orden, selección y paginación sin librería de tablas externa. Probá ordenar por Posts, seleccionar filas y pasar de página."
      >
        <DataTableDemo />

        <div className="flex flex-col gap-2">
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">Orden en ciclo de tres:</strong>{" "}
            ascendente → descendente → sin orden. El tercer clic devuelve la
            tabla a su orden natural, que a veces es el que importa (el que vino
            de la API). La columna activa expone{" "}
            <code className="font-mono">aria-sort</code>: la flechita sola no le
            dice nada a un lector de pantalla.
          </p>
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">
              «Seleccionar todas» alcanza solo la página visible.
            </strong>{" "}
            Marcar cuatro mil filas invisibles con un clic es un accidente
            esperando ocurrir. Lo seleccionado en otras páginas se conserva.
          </p>
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">Los vacíos van al final</strong>{" "}
            en los dos sentidos del orden: «sin dato» no es ni el mayor ni el
            menor. Y el orden usa{" "}
            <code className="font-mono">localeCompare</code> con locale español,
            porque un comparador ingenuo manda la «ñ» detrás de la «z».
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Toasts"
        description="Confirmaciones efímeras. Construidos sobre sonner, tematizados con los tokens del sistema."
      >
        <Showcase note="Cuándo NO usar un toast: para errores que el usuario tiene que resolver. Un toast se va solo y no vuelve. Un error de formulario va al lado del campo; un fallo que bloquea la tarea va en un Alert dentro de la página. El toast confirma lo que ya pasó, no pide acción.">
          <ToastDemo />
        </Showcase>

        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Cada tipo lleva su icono, misma regla que en <code className="font-mono">Alert</code>:
          el color no puede ser el único canal que comunica si algo salió bien o
          mal. Los colores llegan por variables CSS, así que el tema oscuro
          funciona solo.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Lo que sigue">
        <EmptyState
          icon={InboxIcon}
          title="Canal de textura para gráficos"
          description="El respaldo de identidad para impresión en escala de grises y forced-colors. Es lo único que queda pendiente de la hoja de ruta original."
        />
      </Section>
    </>
  );
}
