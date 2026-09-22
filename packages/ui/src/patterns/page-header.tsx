import * as React from "react";

import { cn } from "../lib/utils";
import { Separator } from "../components/separator";

export interface PageHeaderProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Acciones primarias de la vista. En móvil bajan y ocupan el ancho. */
  action?: React.ReactNode;
  /** Migas de pan o cualquier cosa que vaya sobre el título. */
  eyebrow?: React.ReactNode;
  /** Línea divisoria inferior. Útil cuando abajo sigue contenido denso. */
  separated?: boolean;
}

/**
 * PAGE HEADER — el encabezado de vista de Taxonomy.
 *
 * Detalle responsive que importa: en móvil el bloque de acciones pasa a
 * `w-full` y se coloca DEBAJO del título, en lugar de comprimir el título a dos
 * palabras por línea para dejarle lugar a un botón. Es la diferencia entre un
 * header que aguanta un título largo y uno que se rompe.
 */
function PageHeader({
  title,
  description,
  action,
  eyebrow,
  separated = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          {eyebrow ? (
            <div className="text-overline uppercase text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-h1 text-balance">{title}</h1>
          {description ? (
            <p className="max-w-reading text-body text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 [&>*]:grow sm:[&>*]:grow-0">
            {action}
          </div>
        ) : null}
      </div>

      {separated ? <Separator /> : null}
    </div>
  );
}

export { PageHeader };
