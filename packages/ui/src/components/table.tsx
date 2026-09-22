import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Responsive: una tabla no se "apila" bien de forma automática, así que la
 * estrategia acá es scroll horizontal contenido. El wrapper lleva `tabindex=0`
 * y `role="region"` para que el área scrolleable sea alcanzable por teclado —
 * sin eso, un usuario que navega con Tab no puede ver las columnas cortadas.
 */
function Table({
  className,
  containerClassName,
  caption,
  ...props
}: React.ComponentProps<"table"> & {
  containerClassName?: string;
  /** Accesible: describe la tabla. Se renderiza visualmente oculto. */
  caption?: string;
}) {
  return (
    <div
      data-slot="table-container"
      role="region"
      tabIndex={0}
      aria-label={caption}
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/55",
        containerClassName,
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-ui-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-muted/50", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors duration-(--duration-fast)",
        "hover:bg-muted/40 data-[state=selected]:bg-primary-subtle",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  numeric,
  ...props
}: React.ComponentProps<"th"> & { numeric?: boolean }) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      className={cn(
        "h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground",
        "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  numeric,
  ...props
}: React.ComponentProps<"td"> & { numeric?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      // `data-numeric` engancha la regla de `tabular-nums` del layer base: las
      // columnas de números alinean verticalmente sin pedirlo en cada celda.
      data-numeric={numeric ? "true" : undefined}
      className={cn(
        "px-3 py-2.5 align-middle",
        "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-ui-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
