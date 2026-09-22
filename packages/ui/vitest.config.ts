import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],

    // `threads` y no el `forks` por defecto: en Windows, con una ruta que
    // tiene espacios y «ñ», los procesos hijo de `forks` tardan más que el
    // timeout en responder y el run falla sin llegar a ejecutar los tests.
    // Los threads no spawnean proceso nuevo y arrancan mucho más rápido.
    pool: "threads",

    // jsdom es pesado de levantar; el default de 5s se queda corto en el
    // primer arranque en frío.
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
