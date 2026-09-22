import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme";
import { DocsShell } from "@/components/docs-shell";

/**
 * Las fuentes se inyectan como variables CSS que el Design System ya espera
 * (`--ds-font-sans` / `--ds-font-mono`). La librería no sabe qué fuente es ni de
 * dónde viene: define el hueco y la app lo llena. Cambiar de Inter a otra cara
 * es cambiar estas dos líneas, sin tocar un solo componente.
 */
const sans = Inter({
  subsets: ["latin"],
  variable: "--ds-font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--ds-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Biblioteca de Diseño",
    template: "%s · Biblioteca de Diseño",
  },
  description:
    "Design System propio sobre shadcn/ui, Tailwind CSS y Tremor, con patrones de layout inspirados en Taxonomy y Shadcn Space.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <ThemeProvider>
          <DocsShell>{children}</DocsShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
