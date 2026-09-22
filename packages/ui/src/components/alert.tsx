import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const alertVariants = cva(
  cn(
    "relative grid w-full items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-ui",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr]",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5",
  ),
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface text-foreground [&>svg]:text-muted-foreground",
        info: "border-info/25 bg-info-subtle text-info-text [&>svg]:text-info-text",
        success: "border-success/25 bg-success-subtle text-success-text [&>svg]:text-success-text",
        warning: "border-warning/35 bg-warning-subtle text-warning-text [&>svg]:text-warning-text",
        destructive:
          "border-destructive/25 bg-destructive-subtle text-destructive-text [&>svg]:text-destructive-text",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

/**
 * El `role` cambia según la severidad: `alert` interrumpe al lector de pantalla
 * (para errores), `status` espera a que termine lo que está leyendo. Un alert
 * informativo que interrumpe es tan molesto como un modal innecesario.
 *
 * Accesibilidad: el color nunca va solo. Cada variante debería llevar su icono
 * (`<CircleAlert/>`, `<CircleCheck/>`…) más el texto del título.
 */
function Alert({ className, variant, role, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={role ?? (variant === "destructive" ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-ui-sm opacity-90 [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
