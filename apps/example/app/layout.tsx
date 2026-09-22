import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme";
import { StoreProvider } from "@/lib/store";

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
  title: { default: "Redacción", template: "%s · Redacción" },
  description:
    "Panel de ejemplo construido íntegramente con la Biblioteca de Diseño.",
};

/**
 * El layout raíz solo monta providers. El chrome de la aplicación (header,
 * sidebar) vive en `(app)/layout.tsx`, porque hay pantallas — el login — que
 * NO lo llevan. Los paréntesis marcan un route group: agrupan archivos sin
 * aparecer en la URL, así `/` y `/login` conviven con layouts distintos.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <ThemeProvider>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
