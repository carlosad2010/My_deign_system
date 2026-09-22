import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const containerVariants = cva("mx-auto w-full px-gutter", {
  variants: {
    width: {
      /** Ancho de app: dashboards, tablas, grillas de cards. */
      content: "max-w-content",
      /** Ancho de lectura: docs, artículos, formularios largos. */
      reading: "max-w-reading",
      /** Sin techo: hero a sangre, tablas muy anchas. */
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "content" },
});

export interface ContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof containerVariants> {}

function Container({ className, width, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ width }), className)}
      {...props}
    />
  );
}

/**
 * Grilla responsive por defecto del sistema. `cols` describe el máximo en
 * desktop; los breakpoints intermedios se derivan para que nunca haya una
 * columna huérfana muy angosta.
 */
function Grid({
  className,
  cols = 3,
  ...props
}: React.ComponentProps<"div"> & { cols?: 2 | 3 | 4 }) {
  return (
    <div
      data-slot="grid"
      className={cn(
        "grid gap-4 md:gap-5",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Bloque de sección con título opcional. Es el separador de ritmo vertical:
 * en lugar de que cada página invente sus márgenes, apila `Section`.
 */
function Section({
  className,
  title,
  description,
  action,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      data-slot="section"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {title || description || action ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title ? <h2 className="text-h3">{title}</h2> : null}
            {description ? (
              <p className="max-w-reading text-ui-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export { Container, Grid, Section, containerVariants };
