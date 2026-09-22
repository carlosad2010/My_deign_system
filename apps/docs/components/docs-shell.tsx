"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayersIcon } from "lucide-react";

import {
  AppBody,
  AppContent,
  AppHeader,
  AppHeaderBar,
  AppMain,
  AppShell,
  AppSidebar,
  Badge,
  MobileNav,
  SidebarNav,
  Toaster,
  TooltipProvider,
  type RenderLink,
} from "@ds/ui";

import { docsNav } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme";

/**
 * Acá se conecta el routing de Next con el `SidebarNav` de la librería. La
 * librería no importa `next/link`; la app le pasa cómo construir un link. Ese
 * es el punto de extensión que la mantiene usable fuera de Next.
 */
const renderNextLink: RenderLink = ({ href, children, ...rest }) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <LayersIcon className="size-5 text-primary" />
      <span>Biblioteca de Diseño</span>
    </Link>
  );
}

function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <AppShell>
        <AppHeader>
          <AppHeaderBar>
            <MobileNav
              sections={docsNav}
              activeHref={pathname}
              renderLink={renderNextLink}
              brand={<Brand />}
            />
            <Brand />
            <Badge variant="outline" className="hidden sm:inline-flex">
              v0.1.0
            </Badge>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
            </div>
          </AppHeaderBar>
        </AppHeader>

        <AppBody>
          <AppSidebar>
            <SidebarNav
              sections={docsNav}
              activeHref={pathname}
              renderLink={renderNextLink}
            />
          </AppSidebar>

          <AppMain>
            <AppContent>{children}</AppContent>
          </AppMain>
        </AppBody>

        {/* Un solo Toaster por aplicación, montado en la raíz del shell. */}
        <Toaster />
      </AppShell>
    </TooltipProvider>
  );
}

export { DocsShell };
