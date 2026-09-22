# biblioteca-diseno

Design System sobre **shadcn/ui** y **Tailwind CSS v4**, con patrones de layout
inspirados en Taxonomy y visualización de datos derivada de Tremor.

Trae 23 componentes, 6 layouts, 4 patrones y 5 gráficos, todos sobre Radix UI.

## Instalación

```bash
npm install biblioteca-diseno
```

Peers que tenés que tener en el proyecto: `react@^19`, `react-dom@^19` y
`tailwindcss@^4`.

### El paquete se distribuye como código fuente

No trae JavaScript compilado: se publican los `.tsx` y los transpila tu
bundler. Es una decisión, no un descuido — mantiene el código legible y
permite leerlo desde `node_modules` cuando algo no se comporta como esperás.

La contrapartida es que **hay que declararlo**:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ["biblioteca-diseno"],
};
```

Si usás Vite u otro bundler, aseguráte de que no excluya el paquete de la
transpilación.

### Estilos

Una sola línea. Trae Tailwind, los tokens y la capa base:

```css
/* app/globals.css */
@import "biblioteca-diseno/styles.css";
```

**Reemplazá tu CSS global, no lo agregues.** Si ya definís `--background`,
`--foreground` o un reset con `* { margin: 0 }`, va a chocar: el sistema
define esos mismos nombres con otro significado y su propia capa base.

### Tipografía

La librería define el hueco; la app elige la fuente:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--ds-font-sans" });
```

### Tema oscuro

Se activa con la clase `.dark` en `<html>`, no con `prefers-color-scheme`: el
usuario manda sobre el sistema operativo. Con `next-themes`:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```

## Uso

```tsx
import { Button, Card, CardContent, DataTable, toast } from "biblioteca-diseno";

export function Ejemplo() {
  return (
    <Card>
      <CardContent className="pt-5">
        <Button loading={false} onClick={() => toast.success("Listo")}>
          Guardar
        </Button>
      </CardContent>
    </Card>
  );
}
```

Montá un solo `<Toaster />` en la raíz de la app.

## Qué trae

**Primitivos** — Button, Badge, Card, Input, PasswordInput, Textarea, Label,
Select, Checkbox, Switch, Alert, Avatar, Separator, Skeleton, Progress,
ScrollArea, Table, Tabs, Tooltip, Dialog, Sheet, DropdownMenu, Toaster.

**Layouts** — AppShell (header + sidebar responsive), AuthLayout (pantalla de
acceso), SidebarNav, MobileNav, Container, Grid, Section.

**Patrones** — PageHeader, EmptyState, StatCard, DataTable.

**Gráficos** — AreaChart, BarChart, LineChart, DonutChart, Sparkline.

## Principios que el paquete impone

- **Los componentes piden roles, nunca colores.** Por eso el tema oscuro es una
  reasignación de variables y no una segunda hoja de estilos.
- **Los estados viven una sola vez.** Foco, disabled e inválido se definen en
  un archivo y todos los componentes los componen. Cambiar el foco del sistema
  entero es editar una constante.
- **Cada color de estado tiene dos tokens**, fill y texto: el amarillo de marca
  da 1.79:1 sobre blanco y es perfectamente ilegible como tipografía.
- **La paleta de datos no cicla colores.** Pasada la octava serie sale en gris
  y avisa por consola: si dos entidades distintas se pintan igual, el gráfico
  miente.
- **Un solo eje.** No hay soporte para doble eje Y en los gráficos.
- **El color nunca va solo.** Alerts, badges de estado y deltas llevan siempre
  icono y etiqueta.

## Personalizarlo

Todo deriva de tokens CSS. Para cambiar la identidad visual, redefinilos
después del import:

```css
@import "biblioteca-diseno/styles.css";

:root {
  --radius: 0.375rem;      /* reescala TODOS los radios del sistema */
  --primary: #7c3aed;
  --ring: #7c3aed;
}
```

Si cambiás los colores de datos (`--chart-1` … `--chart-8`), validalos: la
paleta que viene pasa banda de luminosidad, piso de croma, separación bajo
protanopia y deuteranopia, y contraste contra las superficies reales. Cambiar
un hex a ojo rompe esas garantías en silencio.

## Licencia

MIT
