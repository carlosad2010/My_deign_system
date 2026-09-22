import Link from "next/link";
import {
  ArrowRightIcon,
  CircleAlertIcon,
  LayersIcon,
  PaletteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  PageHeader,
  Section,
} from "@ds/ui";

export default function IntroPage() {
  return (
    <>
      <PageHeader
        eyebrow="v0.1.0"
        title="Biblioteca de Diseño"
        description="Un Design System propio sobre shadcn/ui y Tailwind CSS, con patrones de layout inspirados en Taxonomy y Shadcn Space, y visualización de datos derivada de Tremor."
        action={
          <>
            <Button asChild>
              <Link href="/fundaciones">
                Ver fundaciones
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Ejemplo en contexto</Link>
            </Button>
          </>
        }
        separated
      />

      <Section
        title="Cómo está organizado"
        description="Tres capas. Cada una solo conoce a la de abajo, lo que permite cambiar el tema sin tocar componentes y cambiar componentes sin tocar pantallas."
      >
        <Grid cols={3}>
          <Card>
            <CardHeader>
              <PaletteIcon className="size-5 text-primary" />
              <CardTitle>1 · Tokens</CardTitle>
              <CardDescription>
                Primitivos, roles semánticos y puente a Tailwind.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-ui-sm text-muted-foreground">
              Un componente nunca escribe un color literal: pide un rol
              (<code className="font-mono text-caption">--primary</code>,{" "}
              <code className="font-mono text-caption">--border</code>). El tema
              oscuro reasigna roles, no reescribe clases.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <LayersIcon className="size-5 text-primary" />
              <CardTitle>2 · Componentes</CardTitle>
              <CardDescription>
                Primitivos accesibles sobre Radix, con variantes en CVA.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-ui-sm text-muted-foreground">
              Todos comparten las mismas recetas de estado y la misma escala de
              altura, así que alinean entre sí cuando conviven en una fila.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ShieldCheckIcon className="size-5 text-primary" />
              <CardTitle>3 · Patrones y layouts</CardTitle>
              <CardDescription>
                Composiciones completas: shell, headers, estados vacíos, KPIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-ui-sm text-muted-foreground">
              Piezas separadas en lugar de un shell monolítico con una prop por
              variación.
            </CardContent>
          </Card>
        </Grid>
      </Section>

      <Section title="Decisiones que conviene conocer">
        <div className="flex flex-col gap-3">
          <Alert variant="warning">
            <CircleAlertIcon />
            <AlertTitle>Tremor se usa como código fuente, no como paquete</AlertTitle>
            <AlertDescription>
              <p>
                El paquete <code className="font-mono">@tremor/react</code> quedó
                en 3.18.7 (enero 2025) con{" "}
                <code className="font-mono">peerDependencies: react ^18</code>, y
                arrastra <code className="font-mono">@headlessui/react</code> —
                una segunda librería de primitivos que chocaría con Radix.
                Además exige Tailwind v3 con su preset propio.
              </p>
              <p>
                Los gráficos de acá siguen el enfoque actual de Tremor
                (copy-paste sobre Recharts), tematizados con los tokens del
                sistema en lugar del preset de Tremor.
              </p>
            </AlertDescription>
          </Alert>

          <Alert variant="info">
            <ShieldCheckIcon />
            <AlertTitle>La paleta de datos está medida, no elegida a ojo</AlertTitle>
            <AlertDescription>
              Los ocho slots categóricos pasan banda de luminosidad, piso de
              croma, separación bajo protanopia y deuteranopia (ΔE ≥ 8) y piso de
              visión normal (ΔE ≥ 15) en ambos temas, contra las superficies
              reales del sistema. Tres hues quedan bajo 3:1 en tema claro, lo que
              obliga a un canal de respaldo — por eso todo gráfico trae leyenda y
              vista de tabla.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section
        title="Instalación en un proyecto nuevo"
        description="El paquete se consume como código fuente; no hay paso de build intermedio."
      >
        <Card>
          <CardContent className="pt-5">
            <pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-ui-sm">
              <code>{`// 1. package.json de la app
"dependencies": { "@ds/ui": "*" }

// 2. next.config.ts
transpilePackages: ["@ds/ui"]

// 3. app/globals.css  (trae Tailwind + tokens + base)
@import "@ds/ui/styles.css";

// 4. app/layout.tsx  (la fuente la elige la app, no la librería)
const sans = Inter({ variable: "--ds-font-sans" });

// 5. listo
import { Button, StatCard, AreaChart } from "@ds/ui";`}</code>
            </pre>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
