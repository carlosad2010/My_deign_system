"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PenLineIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import {
  AppBody,
  AppContent,
  AppHeader,
  AppHeaderBar,
  AppMain,
  AppShell,
  AppSidebar,
  Avatar,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MobileNav,
  SidebarNav,
  TooltipProvider,
  type NavSection,
  type RenderLink,
} from "@ds/ui";

import { useStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme";

/** La librería no importa `next/link`; la app le dice cómo construir un link. */
const renderNextLink: RenderLink = ({ href, children, ...rest }) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <PenLineIcon className="size-5 text-primary" />
      <span>Redacción</span>
    </Link>
  );
}

function MenuUsuario() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Avatar size="sm">
          <AvatarFallback>LF</AvatarFallback>
        </Avatar>
        <span className="ds-sr-only">Abrir menú de usuario</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Lucía Ferrer</span>
            <span className="text-caption font-normal">lucia@ejemplo.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/ajustes">
            <SettingsIcon />
            Ajustes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <Link href="/login">
            <LogOutIcon />
            Cerrar sesión
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { posts } = useStore();

  const borradores = posts.filter((p) => p.estado === "borrador").length;

  // La navegación se arma en el render para que el contador de borradores del
  // badge siga al estado real, en vez de ser una constante.
  const nav: NavSection[] = [
    {
      items: [{ title: "Resumen", href: "/", icon: LayoutDashboardIcon }],
    },
    {
      title: "Contenido",
      items: [
        {
          title: "Posts",
          href: "/posts",
          icon: FileTextIcon,
          badge:
            borradores > 0 ? (
              <Badge variant="neutral">{borradores}</Badge>
            ) : undefined,
        },
        { title: "Autores", href: "/autores", icon: UsersIcon },
      ],
    },
    {
      title: "Configuración",
      items: [{ title: "Ajustes", href: "/ajustes", icon: SettingsIcon }],
    },
  ];

  return (
    <TooltipProvider>
      <AppShell>
        <AppHeader>
          <AppHeaderBar>
            <MobileNav
              sections={nav}
              activeHref={pathname}
              renderLink={renderNextLink}
              brand={<Marca />}
            />
            <Marca />
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              <MenuUsuario />
            </div>
          </AppHeaderBar>
        </AppHeader>

        <AppBody>
          <AppSidebar>
            <SidebarNav
              sections={nav}
              activeHref={pathname}
              renderLink={renderNextLink}
            />
          </AppSidebar>

          <AppMain>
            <AppContent>{children}</AppContent>
          </AppMain>
        </AppBody>
      </AppShell>
    </TooltipProvider>
  );
}

export { Shell };
