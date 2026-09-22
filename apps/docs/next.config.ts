import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El Design System se consume como código fuente TS/TSX, sin paso de build
  // propio. Eso mantiene el loop de desarrollo en un solo `next dev`: editás un
  // componente en packages/ui y el HMR lo refleja al instante.
  transpilePackages: ["@ds/ui"],
};

export default nextConfig;
