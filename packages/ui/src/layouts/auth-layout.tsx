import * as React from "react";

import { cn } from "../lib/utils";

/**
 * AUTH LAYOUT — la pantalla de acceso.
 *
 * Es el otro layout del sistema, y existe porque una pantalla de login NO es
 * una página de la app: no tiene sidebar, no tiene navegación, y su única
 * tarea es llevar a la persona por un camino. Meterla dentro del `AppShell`
 * con la navegación deshabilitada es peor que darle su propio layout.
 *
 * Decisiones:
 * - Centrado vertical con `min-h-dvh` y `place-items-center`, no con márgenes
 *   fijos: así el formulario queda centrado tanto en un monitor alto como en
 *   un teléfono, sin saltos.
 * - `dvh` y no `vh`: en móvil la barra del navegador aparece y desaparece, y
 *   `vh` deja el contenido cortado debajo de ella.
 * - El ancho máximo del contenido es de lectura, no de app: un formulario de
 *   dos campos estirado a 1280px es incómodo de recorrer con la vista.
 */
function AuthLayout({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="auth-layout"
      className={cn(
        // `relative` para que un control esquinero (cambiar tema, volver) se
        // posicione contra la pantalla de acceso y no contra el viewport.
        "relative grid min-h-dvh place-items-center bg-background px-gutter py-10",
        className,
      )}
      {...props}
    />
  );
}

/** Columna del formulario: marca arriba, contenido, pie abajo. */
function AuthPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="auth-panel"
      className={cn("flex w-full max-w-sm flex-col gap-6", className)}
      {...props}
    />
  );
}

/** Encabezado: marca opcional, título y descripción. */
function AuthHeader({
  brand,
  title,
  description,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  brand?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div
      data-slot="auth-header"
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...props}
    >
      {brand}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-h2 text-balance">{title}</h1>
        {description ? (
          <p className="text-ui-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Pie: enlaces legales o de ayuda, siempre por debajo de la tarjeta. */
function AuthFooter({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="auth-footer"
      className={cn(
        "text-center text-caption text-balance text-muted-foreground",
        "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { AuthLayout, AuthPanel, AuthHeader, AuthFooter };
