"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "../components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";
import { SidebarNav, type SidebarNavProps } from "./sidebar-nav";

export interface MobileNavProps extends Omit<SidebarNavProps, "onNavigate"> {
  /** Marca o título que va arriba del drawer. */
  brand?: React.ReactNode;
}

/**
 * El sidebar bajo el breakpoint `md`. Vive en el header y solo se muestra
 * ahí (`md:hidden`), espejando exactamente las secciones del sidebar de
 * escritorio — misma data, misma jerarquía, otro contenedor.
 *
 * Se cierra al navegar: un drawer que queda abierto sobre la página nueva
 * obliga a un segundo tap que nadie espera.
 */
function MobileNav({ brand, sections, ...navProps }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
          <span className="ds-sr-only">Abrir navegación</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader>
          <SheetTitle>{brand ?? "Menú"}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
          <SidebarNav
            sections={sections}
            onNavigate={() => setOpen(false)}
            {...navProps}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
