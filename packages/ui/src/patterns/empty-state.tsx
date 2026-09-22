import * as React from "react";

import { cn } from "../lib/utils";

export interface EmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * EMPTY STATE — el `EmptyPlaceholder` de Taxonomy.
 *
 * El borde punteado es intencional y semántico: comunica "acá va a haber algo",
 * a diferencia del borde sólido de una Card, que comunica "esto es contenido".
 *
 * Regla de copy (ver skill de UX copy si se quiere profundizar): el título dice
 * qué falta, la descripción dice cómo resolverlo, y la acción es el primer paso.
 * "No hay datos" solo no ayuda a nadie.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      ) : null}

      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-h4">{title}</h3>
        {description ? (
          <p className="text-ui-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export { EmptyState };
