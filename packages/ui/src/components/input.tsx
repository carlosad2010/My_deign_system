import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import {
  controlHeight,
  disabled,
  focusRing,
  invalid,
  transitionBase,
} from "../lib/states";

const inputVariants = cva(
  cn(
    "flex w-full min-w-0 rounded-md border border-input bg-surface text-foreground shadow-xs",
    "placeholder:text-muted-foreground",
    // iOS hace zoom si el input mide menos de 16px: se fuerza 16px en móvil y
    // se baja al paso de UI desde `sm` en adelante.
    "text-base sm:text-ui",
    "file:inline-flex file:border-0 file:bg-transparent file:text-ui-sm file:font-medium",
    "selection:bg-primary selection:text-primary-foreground",
    transitionBase,
    focusRing,
    invalid,
    disabled,
    "disabled:bg-muted",
  ),
  {
    variants: {
      size: {
        sm: cn(controlHeight.sm, "rounded-sm px-2.5 py-1"),
        md: cn(controlHeight.md, "px-3 py-1"),
        lg: cn(controlHeight.lg, "px-3.5 py-2"),
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

function Input({ className, size, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
