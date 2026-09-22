# Biblioteca de Diseño

Design System propio sobre **shadcn/ui** y **Tailwind CSS v4**, con patrones de
layout inspirados en **Taxonomy** y **Shadcn Space**, y visualización de datos
derivada de **Tremor**.

```
.
├── packages/ui          @ds/ui — la librería
│   └── src/
│       ├── styles/      tokens.css · globals.css
│       ├── lib/         cn() y las recetas de estado
│       ├── components/  primitivos (Radix)
│       ├── layouts/     shell, sidebar, container
│       ├── patterns/    page header, empty state, stat card
│       └── charts/      Recharts tematizado
├── apps/docs            @ds/docs — documentación viva (Next.js 16)
├── apps/example         @ds/example — app de ejemplo funcionando
└── scripts/             validador de tokens
```

## Arrancar

```bash
npm install
```

| Comando | Qué hace | Puerto |
|---|---|---|
| `npm run dev` | Documentación del sistema | 3100 |
| `npm run dev:app` | App de ejemplo | 3200 |
| `npm run build` | Build de producción de todo | |
| `npm run typecheck` | TypeScript en todos los workspaces | |
| `npm run tokens:validate` | Verifica el contrato de color | |

**La documentación** (<http://localhost:3100>) muestra el sistema pieza por
pieza: fundaciones, componentes, patrones y gráficos, cada uno con la decisión
de diseño que hay detrás.

**La app de ejemplo** (<http://localhost:3200>) muestra el sistema haciendo su
trabajo.

---

## App de ejemplo — «Redacción»

Un panel de blog con cuatro pantallas y estado real. No es una galería de
componentes: se puede crear un post, buscarlo, cambiarle el estado y borrarlo, y
todo se propaga.

| Pantalla | Qué demuestra |
|---|---|
| **Login** | `AuthLayout`, `PasswordInput`, validación, estado de carga y error de credenciales |
| **Resumen** | `StatCard`, `AreaChart` y `BarChart` alimentados por el estado real de la app |
| **Posts** | Toolbar con búsqueda y filtro, `Table` responsive, menú de acciones, diálogo de confirmación, y **dos** estados vacíos distintos |
| **Autores** | Grilla de cards con `Avatar`, `Badge` y `Progress` |
| **Ajustes** | Formularios completos: labels, ayuda contextual, validación y estados |

### Los dos layouts

El login **no** va dentro del `AppShell`: no tiene sidebar ni navegación, y su
única tarea es llevar a la persona por un camino. Por eso la app usa route
groups — `(app)/` lleva el shell, `(auth)/` el layout centrado — que agrupan
archivos sin aparecer en la URL.

> **El login es solo front-end.** No hay autenticación real detrás: la
> contraseña no se guarda, no se envía a ningún lado y no se persiste. La
> comprobación es una comparación local contra una credencial de demo
> (`lucia@ejemplo.com` / `redaccion`) y el «éxito» es navegar al panel. Si esto
> se conectara a un backend, la validación del cliente seguiría siendo una
> cortesía para el usuario, nunca un control de seguridad.

Detalles que vale la pena mirar en el código:

- **`app/(auth)/login/page.tsx`** — el error de credenciales no dice si falló el
  email o la contraseña: distinguirlos le confirma a un atacante qué cuentas
  existen. Al fallar la validación, el foco se mueve al primer campo con
  problema; sin eso, quien navega con teclado se queda en el botón sin saber qué
  pasó.

- **`lib/store.tsx`** — `useReducer` + `localStorage`, sin backend. El dato se
  carga en un efecto y no en el estado inicial: leer `localStorage` durante el
  render haría que servidor y cliente pinten cosas distintas y React tiraría un
  error de hidratación. Mientras tanto la UI muestra `Skeleton`, no un flash de
  datos de ejemplo.
- **`components/estado-badge.tsx`** — un único mapa estado de dominio →
  presentación. Si el badge de «publicado» vive en cuatro archivos, tarde o
  temprano uno queda verde y otro azul.
- **`components/post-dialog.tsx`** — validación que solo se muestra después del
  primer envío, `aria-invalid` disparando a la vez el estilo de error y el
  anuncio al lector de pantalla, y slug derivado del título hasta que el
  usuario lo toca a mano.
- **`app/posts/page.tsx`** — «no hay posts» y «tu búsqueda no encontró nada» son
  problemas distintos, con copy y salida distintas.

La app importa `@ds/ui` y nada más: **no define un solo color, tamaño ni radio
propio**. Es la prueba de que el sistema cubre una pantalla real.

## Usarlo en otro proyecto

```jsonc
// package.json de la app
"dependencies": { "@ds/ui": "*" }
```

```ts
// next.config.ts — se consume como fuente, sin paso de build propio
transpilePackages: ["@ds/ui"]
```

```css
/* app/globals.css — trae Tailwind, los tokens y la capa base */
@import "@ds/ui/styles.css";
```

```tsx
// app/layout.tsx — la tipografía la elige la app, no la librería
const sans = Inter({ subsets: ["latin"], variable: "--ds-font-sans" });
```

```tsx
import { Button, StatCard, AreaChart } from "@ds/ui";
```

---

## Las tres capas

**1 · Tokens.** Primitivos (`--ds-*`), roles semánticos (`--primary`,
`--border`, `--chart-1`) y el puente `@theme inline` hacia Tailwind. Un
componente nunca escribe un color literal: pide un rol. Por eso el tema oscuro
es una reasignación de variables y no una segunda hoja de estilos.

**2 · Componentes.** Primitivos accesibles sobre Radix, con variantes en CVA.
Todos componen las mismas recetas de `lib/states.ts` y toman su altura de la
misma tabla — por eso un `Input` y un `Button` alinean sin ajustes cuando
conviven en una fila de toolbar.

**3 · Layouts y patrones.** Piezas componibles (`AppShell` + `AppHeader` +
`AppSidebar` + `AppMain`) en lugar de un shell monolítico con una prop por cada
variación posible.

---

## Consistencia: dónde está garantizada

**Estados.** Viven una sola vez en [`lib/states.ts`](packages/ui/src/lib/states.ts).
La inconsistencia en un design system no entra por los colores, entra por los
estados: un botón con `ring-2`, un input con `ring-1`, un select con su propio
`outline`, y de golpe el foco se ve distinto en cada control. Cambiar el foco
del sistema entero es cambiar `focusRing`.

**Tamaño.** `controlHeight` define `sm: 32px · md: 36px · lg: 44px` y lo
consumen Button, Input y Select.

**Radius.** Todo deriva de `--radius` (10px) con `calc()`. Cambiar la base
reescala el sistema proporcionalmente.

**Tipografía.** Cada paso de la escala lleva pegados su interlineado, su
tracking y su peso vía `--text-*--line-height` y compañía. Pedir `text-h2` es
pedir el bloque tipográfico completo, no solo un `font-size`.

---

## Color

Los valores de datos están en **hex exacto** a propósito: son pasos validados
contra criterios de accesibilidad, y redondearlos a OKLCH invalidaría la
medición.

### Estado: dos tokens, no uno

Cada color de estado tiene un **fill** (para marcas) y un **text** (para
tipografía). No son el mismo valor y no pueden serlo:

| | fill | texto |
|---|---|---|
| warning | `#fab219` — 1.79:1 sobre blanco | `#7a5200` — 6.92:1 |
| success | `#0ca30c` — 3.35:1 | `#006300` — 7.54:1 |

El fill amarillo es perfectamente válido como marca y completamente ilegible
como texto. Por eso los badges de estado usan `bg-*-subtle` con `text-*-text`,
nunca el fill saturado con letras encima.

La misma lógica separa `--primary` (`#256abf`, fill de botón, 5.39:1 con texto
blanco) de `--chart-1` (`#2a78d6`, marca de datos). Son dos pasos de la misma
rampa azul: `#2a78d6` con texto blanco da 4.42:1, justo por debajo del mínimo.

### Datos

Ocho slots categóricos en **orden fijo**. El orden no es estético: es el
mecanismo que garantiza que dos series vecinas se distingan bajo daltonismo.
Los colores **no se ciclan** — la serie 9 no reusa el color de la serie 1, sale
en gris y avisa por consola.

Límite real de series: **ocho** en barras, líneas y áreas, donde solo se tocan
las vecinas. En scatter, bubble o mapas cualquier par puede quedar contiguo y
el tope validado es **tres**. Pasado eso, agrupar en «Otros» o facetar.

### El contrato es verificable

```bash
npm run tokens:validate
```

Parsea `tokens.css` y comprueba banda de luminosidad, piso de croma, separación
bajo protanopia/deuteranopia, piso de visión normal y contraste WCAG de cada
token de texto. Sale con código 1 si algo falla, así que se puede colgar de CI.

Tres hues quedan bajo 3:1 en tema claro (aqua, amarillo, magenta). Eso es legal
**solo** si el gráfico ofrece otro canal de lectura, y por eso todo gráfico trae
leyenda y un toggle a vista de tabla. No es una función extra: es la
contrapartida obligatoria de esa medición.

---

## Gráficos: por qué Tremor no es una dependencia

El paquete `@tremor/react` quedó en **3.18.7 (enero 2025)** con
`peerDependencies: react ^18.0.0`. Contra React 19 no instala. Además arrastra
`@headlessui/react` — una segunda librería de primitivos headless que
convivirían mal con Radix — y exige Tailwind v3 con su preset propio,
incompatible con la configuración CSS-first de v4.

Los gráficos de acá siguen el **enfoque actual de Tremor**: componentes
copy-paste sobre **Recharts**, cuyo código pasa a ser del proyecto, tematizados
con los tokens del sistema en lugar del preset de Tremor. La API mantiene la
ergonomía de Tremor (`data` · `index` · `categories` · `valueFormatter`).

### Especificaciones de marca

Fijas, en [`charts/chart-config.ts`](packages/ui/src/charts/chart-config.ts):
barras con tope de 24px y extremo redondeado de 4px sobre base cuadrada; líneas
de 2px con join redondo; marcadores de radio ≥ 4; área al 10% de opacidad;
rejilla hairline sólida y solo horizontal; gap de 2px en color de superficie
entre marcas que se tocan.

### Reglas que la API impone

- **Un solo eje.** No hay soporte para doble eje Y. Es el error de gráficos más
  común y simplemente no se puede cometer con estos componentes.
- **El texto nunca lleva el color del dato.** Las marcas llevan el color de
  serie; etiquetas, valores, leyenda y ejes usan tokens de tipografía. La
  identidad la carga el punto de color al lado del texto.
- **Leyenda con 2+ series, ninguna con una sola.** Con una serie hay un único
  color y el título ya dice qué se grafica.
- **`linear` por defecto.** La curva suave inventa valores intermedios que nunca
  se midieron; `monotone` hay que pedirlo.

### `numberFormat` vs `valueFormatter`

Los gráficos son Client Components (Recharts necesita el DOM) y **una función no
cruza la frontera Server → Client**. Por eso aceptan las dos formas:

```tsx
// Desde un Server Component — objeto serializable
<AreaChart numberFormat={{ maximumFractionDigits: 0 }} … />

// Desde un Client Component — control total
<AreaChart valueFormatter={(v) => `US$ ${v}`} … />
```

---

## Responsive

Todo componente es responsive por defecto. Los puntos donde eso costó una
decisión y no solo una clase:

- **Sidebar.** Bajo `md` no colapsa a un rail de iconos: se mueve completo a un
  drawer. Un rail sin etiquetas obliga a adivinar qué es cada cosa.
- **PageHeader.** En móvil las acciones bajan debajo del título y se estiran, en
  lugar de comprimir el título para hacerles lugar.
- **Dialog.** El footer apila en columna invertida: la acción primaria queda
  arriba, más cerca del pulgar.
- **Tabla.** Scroll horizontal contenido, con `tabIndex=0` y `role="region"` en
  el contenedor — sin eso, quien navega con teclado no puede ver las columnas
  cortadas.
- **`AppMain` lleva `min-w-0`.** Sin eso, una tabla o un gráfico ancho desborda
  el viewport en vez de scrollear internamente. Es el bug de layout más común en
  un shell con flex.

---

## Accesibilidad

- Foco solo en `:focus-visible`, con un anillo único de 3px que despeja 3:1
  contra la superficie en ambos temas.
- El color nunca es el único canal: los alerts y badges de estado llevan icono,
  el delta de un `StatCard` lleva flecha de dirección y período, los errores de
  formulario se disparan desde `aria-invalid` y exigen mensaje textual.
- `prefers-reduced-motion` neutraliza las animaciones sin romper los layouts que
  dependen de que `transitionend` llegue a dispararse.
- `tabular-nums` solo en columnas de tabla y ticks de eje. Un número grande y
  solo usa cifras proporcionales: forzarle tabulares le mete aire entre dígitos.

---

## Dependencias, y por qué cada una

Bajo la regla de no introducir componentes UI externos sin autorización, estas
son todas las que entran y su justificación:

| Paquete | Por qué |
|---|---|
| `@radix-ui/*` | La base headless de shadcn/ui. Implícito al elegir shadcn. |
| `recharts` | El motor de gráficos que Tremor usa internamente. No es un kit de UI. |
| `lucide-react` | Iconos, el default de shadcn. Se cambia en un archivo. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Utilidades de clases, sin UI propia. |
| `tw-animate-css` | Las animaciones de Tailwind v4, reemplazo de `tailwindcss-animate`. |
| `next-themes` | Solo en `apps/docs`, para el toggle de tema. La librería no lo usa. |

No hay ninguna otra librería de componentes.

---

## Qué falta

- **DataTable** con ordenamiento, selección de filas y paginación. Es un
  componente en sí mismo y no entró en esta primera pasada.
- **Toasts.** `sonner` es el candidato natural pero requiere autorización.
- **Canal de textura** para gráficos, como respaldo en impresión a escala de
  grises y `forced-colors`.
- **Tests.** No hay ninguno todavía; el validador de tokens es lo único
  automatizado.
