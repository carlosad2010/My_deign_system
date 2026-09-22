import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Placeholder de carga. Lleva `aria-hidden` y un `role="status"` en el
 * contenedor que lo agrupa (ver patterns/loading) para que el lector de
 * pantalla anuncie "cargando" una sola vez, no una por bloque.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-sm bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
