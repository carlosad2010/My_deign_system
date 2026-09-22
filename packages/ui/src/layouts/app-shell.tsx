import * as React from "react";

import { cn } from "../lib/utils";

/**
 * APP SHELL — patrón de layout inspirado en Taxonomy y Shadcn Space.
 *
 * Anatomía:
 *
 *   ┌──────────────────────────────────────────┐
 *   │ AppHeader        sticky, alto = --spacing-header
 *   ├────────────┬─────────────────────────────┤
 *   │ AppSidebar │ AppMain                     │
 *   │ sticky     │ scroll natural de la página │
 *   │ ≥md only   │                             │
 *   └────────────┴─────────────────────────────┘
 *
 * Por qué los componentes son piezas separadas y no un solo `<AppShell>` con
 * props: un shell monolítico obliga a agregar una prop por cada variación
 * (¿sidebar colapsable? ¿header doble? ¿sin sidebar?). Componiendo, una vista
 * de marketing usa Header + Main y una de dashboard suma Sidebar, sin que el
 * componente sepa de ambos casos.
 *
 * Responsive: el sidebar desaparece bajo `md` y su contenido se sirve desde el
 * header dentro de un Sheet (ver `MobileNav`). No se colapsa a iconos: un rail
 * de iconos sin label es peor que un drawer.
 */
function AppShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell"
      className={cn("flex min-h-dvh flex-col bg-background", className)}
      {...props}
    />
  );
}

function AppHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "sticky top-0 z-40 w-full border-b",
        // El translúcido con blur es lo que hace que el contenido se sienta
        // "debajo" del header al scrollear. `supports-` evita un header
        // semitransparente e ilegible donde no hay backdrop-filter.
        "bg-background/85 supports-[backdrop-filter]:backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

/** Fila interna del header: alto fijo del token + gutter responsive. */
function AppHeaderBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-header-bar"
      className={cn(
        "flex h-header items-center gap-4 px-gutter",
        className,
      )}
      {...props}
    />
  );
}

function AppBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-body"
      className={cn("flex flex-1 items-start", className)}
      {...props}
    />
  );
}

function AppSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="app-sidebar"
      // `sticky top-header` + altura calculada = el sidebar scrollea por dentro
      // y nunca empuja el footer ni se corta contra el header.
      className={cn(
        "sticky top-header hidden h-[calc(100dvh-var(--layout-header-height))] w-sidebar shrink-0",
        "overflow-y-auto border-r bg-sidebar text-sidebar-foreground md:block",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function AppMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="app-main"
      // `min-w-0` es obligatorio: sin él, una tabla o un chart ancho dentro de
      // un hijo flex desborda el viewport en lugar de scrollear internamente.
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  );
}

/** Zona de contenido con ancho máximo y ritmo vertical consistente. */
function AppContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-content"
      className={cn(
        "mx-auto w-full max-w-content px-gutter py-6 md:py-8",
        "flex flex-col gap-6 md:gap-8",
        className,
      )}
      {...props}
    />
  );
}

export {
  AppShell,
  AppHeader,
  AppHeaderBar,
  AppBody,
  AppSidebar,
  AppMain,
  AppContent,
};
