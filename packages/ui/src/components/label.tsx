"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-ui-sm font-medium leading-none",
        // Cuando el control asociado está deshabilitado, el label se apaga con
        // él. `group-data-disabled` cubre el caso del wrapper Radix.
        "group-data-disabled/field:pointer-events-none group-data-disabled/field:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
