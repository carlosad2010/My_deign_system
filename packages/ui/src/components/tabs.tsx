"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { disabled, focusRing, transitionBase } from "../lib/states";

const Tabs = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
);

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      /** Pastilla sobre fondo apagado. Para cambiar de vista dentro de una card. */
      pill: "h-9 w-fit justify-center rounded-md bg-muted p-1 text-muted-foreground",
      /**
       * Subrayado. El patrón de navegación de sección de Taxonomy: se apoya en
       * una línea inferior que corre a todo el ancho del contenedor.
       */
      underline:
        "h-10 w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 text-muted-foreground",
    },
  },
  defaultVariants: { variant: "pill" },
});

const TabsListContext = React.createContext<"pill" | "underline">("pill");

function TabsList({
  className,
  variant = "pill",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider value={variant ?? "pill"}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsListContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap text-ui-sm font-medium",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        transitionBase,
        focusRing,
        disabled,
        variant === "pill" && [
          "h-7 rounded-sm px-2.5",
          "data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        ],
        variant === "underline" && [
          "h-10 flex-none rounded-none border-b-2 border-transparent px-1 pb-2.5",
          // -mb-px monta el borde del trigger sobre el de la lista, para que la
          // línea activa reemplace a la inactiva en vez de apilarse debajo.
          "-mb-px",
          "hover:text-foreground",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
        ],
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
