"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";

import { cn } from "../lib/utils";
import {
  controlHeight,
  disabled,
  focusRing,
  transitionBase,
} from "../lib/states";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium",
    // Los iconos heredan tamaño del control salvo que se les pase uno explícito.
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    transitionBase,
    focusRing,
    disabled,
  ),
  {
    variants: {
      variant: {
        /** Acción principal. Un solo `primary` por vista. */
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-active",
        /** Acción secundaria de igual peso visual pero menor jerarquía. */
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70",
        /** Acción sobre superficie: la que se usa en toolbars y cards. */
        outline:
          "border border-input bg-surface text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
        /** Sin contenedor. Para acciones terciarias y de icono. */
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/70",
        /** Navegación inline dentro de un párrafo. */
        link: "text-info-text underline-offset-4 hover:underline",
        /**
         * Acción destructiva. Usa el fill medido para despejar 4.5:1 con su
         * texto; el rojo de estado (`--destructive-text`) es para tipografía.
         */
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/45",
      },
      size: {
        sm: cn(controlHeight.sm, "gap-1.5 rounded-sm px-3 text-ui-sm"),
        md: cn(controlHeight.md, "px-4 text-ui"),
        lg: cn(controlHeight.lg, "px-5 text-body"),
        icon: cn(controlHeight.md, "w-9 px-0"),
        "icon-sm": cn(controlHeight.sm, "w-8 rounded-sm px-0"),
        "icon-lg": cn(controlHeight.lg, "w-11 px-0"),
      },
      /** Ocupa todo el ancho del contenedor. Útil en formularios móviles. */
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Renderiza el hijo en lugar de un `<button>`, conservando los estilos. */
  asChild?: boolean;
  /**
   * Operación en curso: muestra un spinner y bloquea el botón.
   *
   * Se ignora con `asChild`, porque Slot espera exactamente un hijo y el
   * spinner sería un segundo elemento.
   */
  loading?: boolean;
  /** Texto que reemplaza al contenido mientras carga. Opcional. */
  loadingText?: string;
}

function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  loading = false,
  loadingText,
  type,
  formAction,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const cargando = loading && !asChild;

  /**
   * El default es `button` para que un botón suelto dentro de un `<form>` no
   * lo envíe sin querer — la causa clásica de «se recargó la página sola».
   *
   * Pero si viene `formAction`, ese default rompe el botón en silencio:
   * `formAction` SOLO tiene efecto en un botón de envío, así que con
   * `type="button"` el navegador lo ignora y el clic no hace absolutamente
   * nada. Pasar `formAction` es una declaración de intención inequívoca, así
   * que manda sobre el default.
   */
  const tipoResuelto = type ?? (formAction ? "submit" : "button");

  return (
    <Comp
      data-slot="button"
      type={asChild ? type : tipoResuelto}
      formAction={formAction}
      // `disabled` evita el doble envío; `aria-busy` es lo que comunica
      // "esperá, está pasando algo" a un lector de pantalla. El spinner solo
      // es información visual.
      disabled={cargando || disabled}
      aria-busy={cargando || undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {cargando ? (
        <>
          <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
