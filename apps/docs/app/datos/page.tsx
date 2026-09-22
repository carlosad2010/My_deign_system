import type { Metadata } from "next";

import {
  AreaChart,
  BarChart,
  Card,
  CardContent,
  DonutChart,
  Grid,
  LineChart,
  PageHeader,
  Section,
} from "@ds/ui";

import {
  channelBreakdown,
  monthlyTraffic,
  planDistribution,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Datos" };

// Objeto serializable, no una función: así la página sigue siendo un Server
// Component y no hace falta marcarla "use client" solo para formatear números.
const enteros = { maximumFractionDigits: 0 } as const;

export default function DataPage() {
  return (
    <>
      <PageHeader
        title="Visualización de datos"
        description="Componentes derivados de Tremor sobre Recharts, tematizados con los tokens del sistema. La API mantiene la ergonomía de Tremor; el color y las marcas son del Design System."
        separated
      />

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Área"
        description="Serie temporal. Crosshair y tooltip vienen por defecto."
      >
        <Card>
          <CardContent className="pt-5">
            <AreaChart
              title="Tráfico del blog"
              description="Últimos 9 meses"
              data={monthlyTraffic}
              index="mes"
              categories={["Visitas", "Registros"]}
              numberFormat={enteros}
            />
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          El botón <strong className="text-foreground">Tabla</strong> no es un
          extra: tres hues de la paleta quedan bajo 3:1 contra la superficie
          clara, y esa medición obliga a un canal de respaldo. Además da acceso
          real a los valores exactos — un <code className="font-mono">&lt;svg&gt;</code>{" "}
          de Recharts no es navegable por lector de pantalla.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Área apilada"
        description="Con total en el tooltip y gap de superficie entre segmentos."
      >
        <Card>
          <CardContent className="pt-5">
            <AreaChart
              title="Composición del embudo"
              data={monthlyTraffic}
              index="mes"
              categories={["Conversiones", "Registros", "Visitas"]}
              numberFormat={enteros}
              stack
            />
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Barras">
        <Grid cols={2}>
          <Card>
            <CardContent className="pt-5">
              <BarChart
                title="Sesiones por canal"
                description="Nombres largos: layout horizontal"
                data={channelBreakdown}
                index="canal"
                categories={["sesiones"]}
                layout="horizontal"
                numberFormat={enteros}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <BarChart
                title="Registros por mes"
                description="Columnas, una serie"
                data={monthlyTraffic}
                index="mes"
                categories={["Registros"]}
                numberFormat={enteros}
              />
            </CardContent>
          </Card>
        </Grid>
        <div className="flex flex-col gap-2">
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            Con <strong className="text-foreground">una sola serie</strong> no se
            dibuja leyenda: hay un único color y el título ya dice qué se está
            graficando. Una caja con un solo swatch repite el título y gasta
            espacio.
          </p>
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            Las barras tienen tope de 24px de grosor y extremo redondeado de 4px
            con base cuadrada sobre el cero. Lo que sobra de la banda queda como
            aire, no como relleno.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Barras apiladas">
        <Card>
          <CardContent className="pt-5">
            <BarChart
              title="Embudo mensual"
              data={monthlyTraffic}
              index="mes"
              categories={["Visitas", "Registros", "Conversiones"]}
              numberFormat={enteros}
              stack
            />
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          En un stack los segmentos <strong className="text-foreground">no</strong>{" "}
          se redondean: el &ldquo;extremo de dato&rdquo; de un segmento interior
          no existe, y redondearlo dibuja una muesca que parece un dato. La
          separación la hace el gap de 2px en color de superficie, que no agrega
          tinta — la quita.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Línea y donut">
        <Grid cols={2}>
          <Card>
            <CardContent className="pt-5">
              <LineChart
                title="Conversiones"
                description="Tres series"
                data={monthlyTraffic}
                index="mes"
                categories={["Visitas", "Registros", "Conversiones"]}
                numberFormat={enteros}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <DonutChart
                title="Cuentas por plan"
                description="Parte de un total"
                data={planDistribution}
                index="plan"
                category="cuentas"
                centerLabel="Cuentas"
                numberFormat={enteros}
              />
            </CardContent>
          </Card>
        </Grid>
        <p className="max-w-reading border-l-2 border-warning/50 pl-3 text-ui-sm text-muted-foreground">
          <strong className="text-foreground">Cuándo no usar un donut.</strong>{" "}
          Comparar ángulos es más difícil que comparar longitudes. Sirve para
          &ldquo;cuánto del total es X&rdquo; con pocas porciones; para comparar
          categorías entre sí, una barra siempre se lee mejor. Con más de cinco
          porciones, agrupá la cola en &ldquo;Otros&rdquo;.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Curva"
        description="linear por defecto, y es una decisión deliberada."
      >
        <Grid cols={2}>
          <Card>
            <CardContent className="pt-5">
              <LineChart
                title="linear"
                data={monthlyTraffic}
                index="mes"
                categories={["Visitas"]}
                numberFormat={enteros}
                curve="linear"
                showDots
                chartClassName="h-56"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <LineChart
                title="monotone"
                data={monthlyTraffic}
                index="mes"
                categories={["Visitas"]}
                numberFormat={enteros}
                curve="monotone"
                showDots
                chartClassName="h-56"
              />
            </CardContent>
          </Card>
        </Grid>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          La curva suave es más linda y miente un poco: inventa valores
          intermedios que nunca se midieron. Por eso el default es{" "}
          <code className="font-mono">linear</code> y{" "}
          <code className="font-mono">monotone</code> hay que pedirlo.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Reglas que los componentes imponen solos">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-5 text-ui-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Un solo eje.</strong> No hay
              soporte para doble eje Y. Dos medidas de escala distinta van en dos
              gráficos o indexadas a una base común. Es el error de gráficos más
              frecuente y la API simplemente no lo permite.
            </p>
            <p>
              <strong className="text-foreground">Los colores no ciclan.</strong>{" "}
              La serie 9 no reusa el color de la serie 1: sale en gris y avisa por
              consola en desarrollo. Si dos entidades distintas se pintan igual, el
              gráfico miente.
            </p>
            <p>
              <strong className="text-foreground">
                El texto nunca lleva el color del dato.
              </strong>{" "}
              Marcas en color de serie; etiquetas, valores, leyenda y ejes en
              tokens de tipografía. La identidad la carga el punto de color al
              lado del texto, no la letra.
            </p>
            <p>
              <strong className="text-foreground">Grilla recesiva.</strong>{" "}
              Hairline de 1px, sólida, nunca punteada, y solo horizontal: las
              verticales compiten con las marcas sin ayudar a leer una magnitud.
            </p>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
