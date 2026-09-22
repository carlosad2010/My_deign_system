import * as React from "react";

import { cn } from "../lib/utils";
import { disabled, focusRing, invalid, transitionBase } from "../lib/states";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-md border border-input bg-surface px-3 py-2",
        "text-base shadow-xs placeholder:text-muted-foreground sm:text-ui",
        transitionBase,
        focusRing,
        invalid,
        disabled,
        "disabled:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
