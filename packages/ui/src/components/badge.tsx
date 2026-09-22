import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { focusRing, transitionBase } from "../lib/states";

const badgeVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap",
    "rounded-sm border px-2 py-0.5 text-caption font-medium",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
    transitionBase,
    focusRing,
  ),
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border-strong bg-transparent text-foreground",
        primary: "border-transparent bg-primary-subtle text-primary-subtle-foreground",
        /**
         * Los variantes de estado usan el par `*-subtle` + `*-text`: fondo
         * lavado y tipografía en el paso que despeja 4.5:1. Nunca el fill
         * saturado con texto encima, que es donde se rompe el contraste.
         */
        success: "border-transparent bg-success-subtle text-success-text",
        warning: "border-transparent bg-warning-subtle text-warning-text",
        destructive: "border-transparent bg-destructive-subtle text-destructive-text",
        info: "border-transparent bg-info-subtle text-info-text",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
