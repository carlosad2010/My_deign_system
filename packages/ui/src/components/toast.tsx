"use client";

import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";

/**
 * TOASTS
 *
 * Construido sobre `sonner`, tematizado con los tokens del sistema en lugar de
 * su paleta propia. Los colores llegan por variables CSS, así que el tema
 * oscuro funciona solo: cuando `.dark` reasigna `--popover`, el toast cambia
 * con todo lo demás sin que sonner se entere.
 *
 * Cada tipo lleva SIEMPRE su icono. Es la misma regla que en `Alert`: el color
 * no puede ser el único canal que comunica si algo salió bien o mal.
 *
 * Cuándo NO usar un toast: para errores que el usuario tiene que resolver. Un
 * toast se va solo y no vuelve. Un error de formulario va al lado del campo;
 * un fallo que bloquea la tarea va en un `Alert` dentro de la página. El toast
 * es para confirmar lo que ya pasó («Post publicado»), no para pedir acción.
 */

export interface ToasterProps extends React.ComponentProps<typeof Sonner> {}

function Toaster({ position = "bottom-right", ...props }: ToasterProps) {
  return (
    <Sonner
      position={position}
      // `richColors` apagado a propósito: encendido, sonner impone SU paleta
      // de éxito/error y pisa los tokens del sistema.
      icons={{
        success: <CircleCheckIcon className="size-4 text-success-text" />,
        error: <CircleAlertIcon className="size-4 text-destructive-text" />,
        warning: <TriangleAlertIcon className="size-4 text-warning-text" />,
        info: <InfoIcon className="size-4 text-info-text" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "font-sans shadow-md border bg-popover text-popover-foreground rounded-md",
          title: "text-ui-sm font-medium",
          description: "text-ui-sm text-muted-foreground",
          actionButton: "text-ui-sm font-medium",
          cancelButton: "text-ui-sm text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
