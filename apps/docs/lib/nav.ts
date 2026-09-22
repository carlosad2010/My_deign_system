import {
  BookOpenIcon,
  ChartPieIcon,
  ComponentIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  PaletteIcon,
} from "lucide-react";

import type { NavSection } from "@ds/ui";

export const docsNav: NavSection[] = [
  {
    items: [{ title: "Introducción", href: "/", icon: BookOpenIcon }],
  },
  {
    title: "Base",
    items: [
      { title: "Fundaciones", href: "/fundaciones", icon: PaletteIcon },
      { title: "Componentes", href: "/componentes", icon: ComponentIcon },
    ],
  },
  {
    title: "Composición",
    items: [
      { title: "Patrones", href: "/patrones", icon: LayoutTemplateIcon },
      { title: "Datos", href: "/datos", icon: ChartPieIcon },
    ],
  },
  {
    title: "En contexto",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    ],
  },
];
