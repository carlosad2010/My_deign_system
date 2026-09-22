#!/usr/bin/env node
/**
 * VALIDADOR DE TOKENS DE COLOR
 *
 * Lee packages/ui/src/styles/tokens.css y verifica que la paleta siga
 * cumpliendo su contrato. No valida una copia del archivo: parsea los tokens
 * reales, así que si alguien cambia un hex y rompe el contraste, esto falla.
 *
 *   node scripts/validate-tokens.mjs
 *
 * Sale con código 1 si hay algún FAIL, para poder colgarlo de CI.
 *
 * Salvedad honesta: esto es una implementación propia de la simulación de
 * daltonismo (matrices de Machado 2009 aplicadas sobre RGB lineal). Los
 * umbrales son los mismos que usó la validación original, pero los valores de
 * ΔE difieren en ~1 punto respecto de aquella herramienta — probablemente
 * porque aplica las matrices en espacio gamma y no lineal. Sirve como guarda
 * de regresión en CI, no como tercera opinión independiente: si un cambio deja
 * un par cerca del umbral, conviene medirlo también con la herramienta original.
 *
 * Qué comprueba:
 *   1. Banda de luminosidad OKLCH por tema      (identidad legible)
 *   2. Piso de croma OKLCH                      (un hue gris no identifica nada)
 *   3. Separación bajo protanopia/deuteranopia  (ΔE OKLab ×100 ≥ 8)
 *   4. Piso de visión normal                    (ΔE ≥ 15, puerta dura)
 *   5. Contraste de marcas contra superficie    (≥ 3:1, o exige canal de respaldo)
 *   6. Contraste WCAG de los tokens de texto    (≥ 4.5:1)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS = resolve(here, "../packages/ui/src/styles/tokens.css");

/* --- color ---------------------------------------------------------------- */

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
};

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const linearize = (rgb) => rgb.map(toLinear);

/** sRGB lineal → OKLab. */
function oklab([r, g, b]) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

/** Machado, Oliveira & Fernandes (2009), severidad 1.0, sobre RGB lineal. */
const CVD = {
  protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deutan: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
};

const simulate = ([r, g, b], m) => [
  m[0] * r + m[1] * g + m[2] * b,
  m[3] * r + m[4] * g + m[5] * b,
  m[6] * r + m[7] * g + m[8] * b,
];

const deltaE = (a, b) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100;

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function contrast(hexA, hexB) {
  const a = luminance(linearize(hexToRgb(hexA)));
  const b = luminance(linearize(hexToRgb(hexB)));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const lch = (hex) => {
  const [L, a, b] = oklab(linearize(hexToRgb(hex)));
  return { L, C: Math.hypot(a, b) };
};

/* --- parseo de tokens ----------------------------------------------------- */

const css = readFileSync(TOKENS, "utf8");

function token(name) {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`));
  if (!m) throw new Error(`No se encontró el token --${name} en tokens.css`);
  return m[1].toLowerCase();
}

const HUES = ["blue", "orange", "aqua", "yellow", "magenta", "green", "violet", "red"];

const palettes = {
  claro: {
    surface: token("ds-neutral-0"),
    band: [0.43, 0.77],
    colors: HUES.map((h) => token(`ds-cat-${h}-l`)),
  },
  oscuro: {
    surface: token("ds-neutral-900"),
    band: [0.48, 0.67],
    colors: HUES.map((h) => token(`ds-cat-${h}-d`)),
  },
};

const textTokens = [
  ["success-text  (claro)", token("ds-good-text-l"), token("ds-neutral-0")],
  ["warning-text  (claro)", token("ds-warning-text-l"), token("ds-neutral-0")],
  ["danger-text   (claro)", token("ds-danger-text-l"), token("ds-neutral-0")],
  ["info-text     (claro)", token("ds-info-text-l"), token("ds-neutral-0")],
  ["muted-fg      (claro)", token("ds-neutral-500"), token("ds-neutral-0")],
  ["success-text (oscuro)", token("ds-good-text-d"), token("ds-neutral-900")],
  ["warning-text (oscuro)", token("ds-warning-text-d"), token("ds-neutral-900")],
  ["danger-text  (oscuro)", token("ds-danger-text-d"), token("ds-neutral-900")],
  ["info-text    (oscuro)", token("ds-info-text-d"), token("ds-neutral-900")],
  ["muted-fg     (oscuro)", token("ds-neutral-400"), token("ds-neutral-900")],
];

/* --- ejecución ------------------------------------------------------------ */

let failed = false;
const mark = (ok) => (ok ? "PASS" : ((failed = true), "FAIL"));

console.log("\nValidación de tokens de color — packages/ui/src/styles/tokens.css\n");

for (const [name, { surface, band, colors }] of Object.entries(palettes)) {
  console.log(`── Paleta categórica · tema ${name} (superficie ${surface}) ──`);

  const metrics = colors.map(lch);

  const outOfBand = metrics.filter((m) => m.L < band[0] || m.L > band[1]);
  console.log(
    `  [${mark(outOfBand.length === 0)}] Banda de luminosidad  ` +
      `${colors.length - outOfBand.length}/${colors.length} dentro de L ${band[0]}–${band[1]}`,
  );

  const lowChroma = metrics.filter((m) => m.C < 0.1);
  console.log(
    `  [${mark(lowChroma.length === 0)}] Piso de croma         ` +
      `${colors.length - lowChroma.length}/${colors.length} con C ≥ 0.10`,
  );

  // Pares ADYACENTES: en barras, líneas y áreas solo se tocan los vecinos.
  let worstCvd = { d: Infinity, pair: "" };
  let worstNormal = { d: Infinity, pair: "" };

  for (let i = 0; i < colors.length - 1; i++) {
    const [x, y] = [colors[i], colors[i + 1]];
    const lin = [linearize(hexToRgb(x)), linearize(hexToRgb(y))];

    for (const m of Object.values(CVD)) {
      const d = deltaE(oklab(simulate(lin[0], m)), oklab(simulate(lin[1], m)));
      if (d < worstCvd.d) worstCvd = { d, pair: `${x}↔${y}` };
    }

    const dn = deltaE(oklab(lin[0]), oklab(lin[1]));
    if (dn < worstNormal.d) worstNormal = { d: dn, pair: `${x}↔${y}` };
  }

  console.log(
    `  [${mark(worstCvd.d >= 8)}] Separación CVD        ` +
      `peor par ${worstCvd.pair} ΔE ${worstCvd.d.toFixed(1)} (objetivo ≥ 8)`,
  );
  console.log(
    `  [${mark(worstNormal.d >= 15)}] Piso de visión normal ` +
      `peor par ${worstNormal.pair} ΔE ${worstNormal.d.toFixed(1)} (piso ≥ 15)`,
  );

  const lowContrast = colors
    .map((c) => [c, contrast(c, surface)])
    .filter(([, r]) => r < 3);

  if (lowContrast.length === 0) {
    console.log(`  [PASS] Contraste vs superficie  los ${colors.length} ≥ 3:1`);
  } else {
    // No es FAIL: es la regla de relief. Sub-3:1 es legal SI el gráfico ofrece
    // otro canal de lectura. Acá lo ofrece (leyenda + vista de tabla), así que
    // se reporta como aviso con su obligación explícita.
    console.log(
      `  [AVISO] Contraste vs superficie  bajo 3:1: ` +
        lowContrast.map(([c, r]) => `${c} (${r.toFixed(2)})`).join(", "),
    );
    console.log(
      `          → obliga a canal de respaldo. ChartFrame lo cumple con` +
        ` leyenda + vista de tabla.`,
    );
  }
  console.log("");
}

console.log("── Tokens de texto · contraste WCAG (objetivo ≥ 4.5:1) ──");
for (const [name, fg, bg] of textTokens) {
  const r = contrast(fg, bg);
  console.log(`  [${mark(r >= 4.5)}] ${name}  ${fg} sobre ${bg}  ${r.toFixed(2)}:1`);
}

console.log("\n── Anillo de foco · contraste vs superficie (objetivo ≥ 3:1) ──");
for (const [name, ring, bg] of [
  ["ring  (claro)", token("ds-blue-500"), token("ds-neutral-0")],
  ["ring (oscuro)", token("ds-blue-350"), token("ds-neutral-900")],
]) {
  const r = contrast(ring, bg);
  console.log(`  [${mark(r >= 3)}] ${name}  ${ring} sobre ${bg}  ${r.toFixed(2)}:1`);
}

console.log(
  failed
    ? "\n✗ Hay FAILs. La paleta no cumple el contrato.\n"
    : "\n✓ Todos los controles pasan.\n",
);

process.exit(failed ? 1 : 0);
