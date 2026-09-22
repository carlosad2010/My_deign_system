import type { Metadata } from "next";

import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Input,
  Label,
  PageHeader,
  Section,
  Separator,
  cn,
} from "@ds/ui";

import { Showcase, TokenRow } from "@/components/showcase";

export const metadata: Metadata = { title: "Fundaciones" };

/* -------------------------------------------------------------------------- */

function Swatch({ token, className }: { token: string; className?: string }) {
  return (
    <div
      className={cn("size-9 shrink-0 rounded-md border", className)}
      style={{ backgroundColor: `var(${token})` }}
    />
  );
}

const semanticRoles = [
  { token: "--background", usage: "Fondo de página" },
  { token: "--surface", usage: "Plano de card, tabla y gráfico" },
  { token: "--foreground", usage: "Texto principal" },
  { token: "--muted-foreground", usage: "Texto secundario · 4.84:1 en claro" },
  { token: "--primary", usage: "Acción principal · texto blanco 5.39:1" },
  { token: "--secondary", usage: "Acción secundaria" },
  { token: "--accent", usage: "Hover de ítems y filas" },
  { token: "--border", usage: "Líneas de separación" },
  { token: "--ring", usage: "Anillo de foco · 5.39:1 vs superficie" },
];

const stateRoles = [
  { token: "--success", text: "--success-text", usage: "Confirmación" },
  { token: "--warning", text: "--warning-text", usage: "Advertencia" },
  { token: "--destructive", text: "--destructive-text", usage: "Error y borrado" },
  { token: "--info", text: "--info-text", usage: "Información neutra" },
];

const typeScale = [
  { cls: "text-display", name: "display", use: "Hero de landing. Uno por vista." },
  { cls: "text-h1", name: "h1", use: "Título de página" },
  { cls: "text-h2", name: "h2", use: "Título de sección" },
  { cls: "text-h3", name: "h3", use: "Subsección" },
  { cls: "text-h4", name: "h4", use: "Título de card" },
  { cls: "text-body-lg", name: "body-lg", use: "Párrafo introductorio" },
  { cls: "text-body", name: "body", use: "Texto corrido · base del sistema" },
  { cls: "text-ui", name: "ui", use: "Botones, inputs, labels" },
  { cls: "text-ui-sm", name: "ui-sm", use: "Tablas, descripciones" },
  { cls: "text-caption", name: "caption", use: "Metadatos, badges" },
  { cls: "text-overline", name: "overline", use: "Encabezado de grupo" },
];

const radiusScale = [
  { cls: "rounded-xs", name: "xs", px: "4px", use: "Checkbox, chips" },
  { cls: "rounded-sm", name: "sm", px: "6px", use: "Badges, ítems de menú" },
  { cls: "rounded-md", name: "md", px: "8px", use: "Botones, inputs" },
  { cls: "rounded-lg", name: "lg", px: "10px", use: "Cards, tablas — base" },
  { cls: "rounded-xl", name: "xl", px: "14px", use: "Dialog, sheet" },
  { cls: "rounded-2xl", name: "2xl", px: "20px", use: "Contenedores destacados" },
];

/* -------------------------------------------------------------------------- */

export default function FoundationsPage() {
  return (
    <>
      <PageHeader
        title="Fundaciones"
        description="Las escalas que definen el sistema. Todo lo demás se construye pidiendo estos tokens; ningún componente inventa un valor propio."
        separated
      />

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Color · roles semánticos"
        description="Los componentes piden roles, nunca colores. Eso es lo que hace que el tema oscuro sea una reasignación de variables y no una segunda hoja de estilos."
      >
        <Card>
          <CardContent className="pt-5">
            {semanticRoles.map((r) => (
              <TokenRow
                key={r.token}
                name={r.token}
                usage={r.usage}
                swatch={<Swatch token={r.token} />}
              />
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Color · estados"
        description="Cada estado tiene dos tokens: el fill para marcas y el paso de texto que despeja 4.5:1. Son valores distintos a propósito."
      >
        <Card>
          <CardContent className="flex flex-col gap-4 pt-5">
            {stateRoles.map((r) => (
              <div key={r.token} className="flex flex-wrap items-center gap-4">
                <Swatch token={r.token} />
                <div className="flex min-w-48 flex-col">
                  <code className="font-mono text-ui-sm">{r.token}</code>
                  <code className="font-mono text-caption text-muted-foreground">
                    {r.text}
                  </code>
                </div>
                <span className="text-ui-sm text-muted-foreground">{r.usage}</span>
                <span
                  className="ml-auto text-ui-sm font-medium"
                  style={{ color: `var(${r.text})` }}
                >
                  Texto de ejemplo
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Por qué separados: <code className="font-mono">--warning</code>{" "}
          (<code className="font-mono">#fab219</code>) da 1.79:1 sobre blanco — es
          un fill perfectamente válido y un color de texto ilegible. El token de
          texto correspondiente es <code className="font-mono">#7a5200</code>, con
          6.92:1.
        </p>
      </Section>

      <Section
        title="Color · datos"
        description="Ocho slots categóricos en orden fijo. El orden no es estético: es el mecanismo que garantiza que dos series vecinas se distingan bajo daltonismo."
      >
        <Card>
          <CardContent className="flex flex-col gap-5 pt-5">
            <div>
              <h4 className="mb-3 text-overline uppercase text-muted-foreground">
                Categórica · identidad
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="size-14 rounded-md border"
                      style={{ backgroundColor: `var(--chart-${i + 1})` }}
                    />
                    <code className="font-mono text-caption text-muted-foreground">
                      {i + 1}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-overline uppercase text-muted-foreground">
                Ordinal / secuencial · magnitud
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="size-14 rounded-md border"
                      style={{ backgroundColor: `var(--chart-seq-${i + 1})` }}
                    />
                    <code className="font-mono text-caption text-muted-foreground">
                      {i + 1}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">Un hue por trabajo.</strong>{" "}
            Categórica para identidad (qué serie). Ordinal para orden (etapas de
            un embudo, tramos de tamaño). Secuencial para magnitud. Nunca pintes
            barras nominales según su valor: eso gasta el canal de identidad
            re-codificando lo que el largo de la barra ya dice.
          </p>
          <p className="max-w-reading border-l-2 border-warning/50 pl-3 text-ui-sm text-muted-foreground">
            <strong className="text-foreground">Límite real de series.</strong>{" "}
            Ocho en barras, líneas y áreas (donde solo se tocan las vecinas). En
            scatter, bubble o mapas cualquier par puede quedar contiguo, y ahí el
            tope validado es <strong className="text-foreground">tres</strong>.
            Pasado eso hay que agrupar en &ldquo;Otros&rdquo; o facetar, no
            agregar colores.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Tipografía"
        description="Cada paso lleva pegados su interlineado, su tracking y su peso. Pedir un tamaño es pedir el bloque tipográfico completo."
      >
        <Card>
          <CardContent className="flex flex-col divide-y pt-5">
            {typeScale.map((t) => (
              <div
                key={t.cls}
                className="flex flex-wrap items-baseline justify-between gap-3 py-3"
              >
                <span className={cn(t.cls, "min-w-0 truncate")}>
                  Diseño consistente
                </span>
                <div className="flex shrink-0 items-baseline gap-4">
                  <span className="text-ui-sm text-muted-foreground">{t.use}</span>
                  <code className="w-24 text-right font-mono text-caption text-muted-foreground">
                    {t.name}
                  </code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Spacing"
        description="Base de 4px. La escala de Tailwind sin modificar, más tokens semánticos para layout."
      >
        <Card>
          <CardContent className="flex flex-col gap-4 pt-5">
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                <div key={n} className="flex items-center gap-4">
                  <code className="w-12 shrink-0 font-mono text-caption text-muted-foreground">
                    {n}
                  </code>
                  <div
                    className="h-3 rounded-xs bg-primary/70"
                    style={{ width: `calc(var(--spacing) * ${n})` }}
                  />
                  <code className="font-mono text-caption text-muted-foreground">
                    {n * 4}px
                  </code>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <TokenRow
                name="--layout-gutter"
                value="16 / 24 / 32px"
                usage="Padding horizontal de página. Sube por breakpoint."
              />
              <TokenRow
                name="--layout-header-height"
                value="56px"
                usage="Alto del header. El sidebar lo usa para su offset sticky."
              />
              <TokenRow
                name="--layout-sidebar-width"
                value="256px"
                usage="Ancho del sidebar en ≥md"
              />
              <TokenRow
                name="--layout-content-max"
                value="1280px"
                usage="Techo de contenido de app"
              />
              <TokenRow
                name="--layout-prose-max"
                value="720px"
                usage="Techo de ancho de lectura"
              />
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Radius"
        description="Todo deriva de --radius (10px). Cambiar la base reescala el sistema entero de forma proporcional."
      >
        <Grid cols={3}>
          {radiusScale.map((r) => (
            <Card key={r.cls}>
              <CardContent className="flex items-center gap-4 pt-5">
                <div
                  className={cn(
                    "size-12 shrink-0 border-2 border-primary/50 bg-primary/10",
                    r.cls,
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <code className="font-mono text-ui-sm">{r.cls}</code>
                  <span className="text-caption text-muted-foreground">
                    {r.px} · {r.use}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Elevación"
        description="La jerarquía la carga el borde; la sombra solo separa lo que de verdad flota."
      >
        <Grid cols={4}>
          {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
            <div
              key={s}
              className={cn(
                "flex h-24 items-center justify-center rounded-lg border bg-surface",
                s,
              )}
            >
              <code className="font-mono text-ui-sm text-muted-foreground">{s}</code>
            </div>
          ))}
        </Grid>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          <code className="font-mono">xs</code> para cards y controles,{" "}
          <code className="font-mono">md</code> para popover y dropdown,{" "}
          <code className="font-mono">lg</code> para dialog y sheet. En tema
          oscuro las mismas sombras suben de opacidad: sobre un fondo oscuro una
          sombra al 4% es invisible.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Estados"
        description="Definidos una sola vez en lib/states.ts y compuestos por cada componente. Es el archivo que evita que cada control invente su propio foco."
      >
        <div className="flex flex-col gap-6">
          <Showcase
            title="Foco"
            description="Un único anillo para todo el sistema: 3px del color --ring al 55%, con 2px de offset."
            note="Solo :focus-visible, nunca :focus — así el usuario de mouse no ve un anillo en cada clic, pero quien navega con teclado nunca pierde de vista dónde está. Probalo con Tab."
          >
            <Button>Botón</Button>
            <Input placeholder="Input" className="w-44" />
            <Checkbox aria-label="Ejemplo" />
          </Showcase>

          <Showcase
            title="Deshabilitado"
            description="Opacidad al 50% y pointer-events en none."
            note="pointer-events: none no es decorativo: evita que un tooltip se dispare sobre un control que no responde, que es una de las formas más comunes de confundir a quien usa la interfaz."
          >
            <Button disabled>Primario</Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
            <Input placeholder="Deshabilitado" disabled className="w-44" />
          </Showcase>

          <Showcase
            title="Inválido"
            description="Borde y anillo en --destructive, activados por el atributo aria-invalid."
            note="El color es el canal secundario, no el único. El estilo se dispara desde aria-invalid — el mismo atributo que anuncia el error a un lector de pantalla — y siempre debe acompañarse de un mensaje textual. Un borde rojo solo no comunica nada a quien no distingue el rojo."
          >
            <div className="flex w-full max-w-sm flex-col gap-1.5">
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                aria-invalid
                aria-describedby="demo-email-error"
                defaultValue="no-es-un-email"
              />
              <p id="demo-email-error" className="text-ui-sm text-destructive-text">
                Ingresá un email válido, por ejemplo nombre@dominio.com
              </p>
            </div>
          </Showcase>

          <Showcase
            title="Escala de altura compartida"
            description="Button, Input y Select toman su altura de la misma tabla."
            note="Por eso alinean sin ajustes cuando conviven en una fila de toolbar. sm = 32px, md = 36px, lg = 44px (el mínimo de área táctil recomendado)."
          >
            <div className="flex w-full flex-col gap-3">
              {(["sm", "md", "lg"] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="w-10 justify-center">
                    {size}
                  </Badge>
                  <Input size={size} placeholder="Buscar…" className="w-48" />
                  <Button size={size}>Aplicar</Button>
                  <Button size={size} variant="outline">
                    Limpiar
                  </Button>
                </div>
              ))}
            </div>
          </Showcase>
        </div>
      </Section>
    </>
  );
}
