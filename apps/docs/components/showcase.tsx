import * as React from "react";

import { cn } from "biblioteca-diseno";

/**
 * Contenedor de ejemplo. Existe para que cada demo de la documentación se vea
 * sobre la misma superficie y con el mismo padding — si cada página inventa su
 * propio marco, la doc de un design system termina siendo inconsistente, que es
 * justo lo contrario de lo que debería demostrar.
 */
function Showcase({
  title,
  description,
  note,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Regla o decisión de diseño que este ejemplo demuestra. */
  note?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3" {...props}>
      {title || description ? (
        <div className="flex flex-col gap-1">
          {title ? <h3 className="text-h4">{title}</h3> : null}
          {description ? (
            <p className="max-w-reading text-ui-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg border bg-surface p-5",
          className,
        )}
      >
        {children}
      </div>

      {note ? (
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}

/** Ficha de token: muestra el valor y para qué sirve. */
function TokenRow({
  name,
  value,
  usage,
  swatch,
}: {
  name: string;
  value?: string;
  usage: string;
  swatch?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b py-2.5 last:border-b-0">
      {swatch}
      <code className="w-48 shrink-0 font-mono text-ui-sm text-foreground">
        {name}
      </code>
      {value ? (
        <code className="hidden w-32 shrink-0 font-mono text-caption text-muted-foreground md:block">
          {value}
        </code>
      ) : null}
      <span className="text-ui-sm text-muted-foreground">{usage}</span>
    </div>
  );
}

export { Showcase, TokenRow };
