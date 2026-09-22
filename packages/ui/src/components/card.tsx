import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Card — la superficie base del sistema.
 *
 * Decisión de diseño: la jerarquía la carga el BORDE, no la sombra. Las cards
 * llevan `shadow-xs` y un borde de 1px; la elevación fuerte se reserva para
 * capas que flotan de verdad (popover, dialog). Así una grilla de 12 cards no
 * se ve como 12 objetos despegados de la página.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-lg border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Header con grilla de 2 columnas: el contenido ocupa la primera y `CardAction`
 * se ancla a la derecha sin necesidad de `absolute`.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min items-start gap-1.5 px-5 pt-5",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-h4 leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-ui-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-2 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      // `[&:not(:first-child)]` da el espacio superior solo si hay un header
      // arriba, para que una card de contenido puro no quede desbalanceada.
      className={cn("px-5 pb-5 [&:not(:first-child)]:pt-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex flex-wrap items-center gap-2 px-5 pb-5 [&:not(:first-child)]:pt-4",
        className,
      )}
      {...props}
    />
  );
}

/** Footer separado por una línea, para acciones de peso (guardar / eliminar). */
function CardFooterBordered({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex flex-wrap items-center gap-2 rounded-b-lg border-t bg-muted/40 px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardFooterBordered,
};
