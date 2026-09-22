"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "biblioteca-diseno";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Los dos iconos se renderizan siempre y se cruzan con la variante
          `dark`. Elegirlos en JS según el tema produce un mismatch de
          hidratación: el servidor no sabe qué tema tiene el cliente. */}
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
      <span className="ds-sr-only">Cambiar tema</span>
    </Button>
  );
}

export { ThemeProvider, ThemeToggle };
