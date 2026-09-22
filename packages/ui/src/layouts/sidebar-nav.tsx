"use client";

import * as React from "react";

import { cn } from "../lib/utils";
import { disabled as disabledState, focusRing, transitionBase } from "../lib/states";

export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Contador o etiqueta al final de la fila (ej. cantidad de pendientes). */
  badge?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

/**
 * Cómo se resuelve el link.
 *
 * La librería NO importa `next/link`: eso la ataría a Next y rompería su uso en
 * Vite, Remix o Storybook. En su lugar acepta un `renderLink`, y la app pasa su
 * propio componente de routing. Por defecto cae a un `<a>` nativo.
 */
export type RenderLink = (props: {
  href: string;
  className: string;
  children: React.ReactNode;
  "aria-current"?: "page";
  "aria-disabled"?: boolean;
  target?: string;
  rel?: string;
}) => React.ReactNode;

const defaultRenderLink: RenderLink = ({ href, ...rest }) => (
  <a href={href} {...rest} />
);

const navItemClass = cn(
  "group flex items-center gap-2.5 rounded-md px-3 py-2 text-ui-sm font-medium",
  "[&_svg]:size-4 [&_svg]:shrink-0",
  transitionBase,
  focusRing,
  disabledState,
);

export interface SidebarNavProps extends React.ComponentProps<"nav"> {
  sections: NavSection[];
  /** Ruta activa. La comparación es exacta; el consumidor decide la política. */
  activeHref?: string;
  renderLink?: RenderLink;
  /** Se dispara al elegir un ítem. Lo usa el drawer móvil para cerrarse. */
  onNavigate?: () => void;
}

function SidebarNav({
  sections,
  activeHref,
  renderLink = defaultRenderLink,
  onNavigate,
  className,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      data-slot="sidebar-nav"
      aria-label="Navegación principal"
      className={cn("flex flex-col gap-6 p-4", className)}
      {...props}
    >
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="flex flex-col gap-1">
          {section.title ? (
            <h4 className="px-3 pb-1 text-overline uppercase text-muted-foreground">
              {section.title}
            </h4>
          ) : null}

          {section.items.map((item) => {
            const isActive = activeHref === item.href;
            const Icon = item.icon;

            const content = (
              <>
                {Icon ? (
                  <Icon
                    className={cn(
                      isActive ? "text-primary" : "text-muted-foreground",
                      "group-hover:text-current",
                    )}
                  />
                ) : null}
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge ? (
                  <span className="ml-auto shrink-0">{item.badge}</span>
                ) : null}
              </>
            );

            const className = cn(
              navItemClass,
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              item.disabled && "pointer-events-none opacity-50",
            );

            // Un ítem deshabilitado no puede ser un link navegable: se degrada a
            // un span con aria-disabled, no un <a> que igual responde a Enter.
            if (item.disabled) {
              return (
                <span key={item.href} aria-disabled="true" className={className}>
                  {content}
                </span>
              );
            }

            return (
              <React.Fragment key={item.href}>
                <span onClick={onNavigate} className="contents">
                  {renderLink({
                    href: item.href,
                    className,
                    // `aria-current="page"` es lo que comunica "estás acá" a un
                    // lector de pantalla. El fondo gris solo no lo hace.
                    ...(isActive ? { "aria-current": "page" as const } : {}),
                    ...(item.external
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {}),
                    children: content,
                  })}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export { SidebarNav, navItemClass };
