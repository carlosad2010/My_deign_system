/**
 * RECETAS DE ESTADO
 *
 * El problema que resuelve este archivo: en un design system, la inconsistencia
 * no entra por los colores — entra por los estados. Un botón con `ring-2`, un
 * input con `ring-1`, un select con `outline` propio, y de repente el foco se ve
 * distinto en cada control.
 *
 * Acá viven los estados una sola vez. Todo componente interactivo compone estas
 * constantes en lugar de escribir sus propias clases de foco/disabled/inválido.
 * Si querés cambiar el foco del sistema entero, se cambia en `focusRing`.
 */

/** Anillo de foco canónico. Solo `focus-visible`, nunca `focus`. */
export const focusRing = [
  "outline-none",
  "focus-visible:ring-[3px]",
  "focus-visible:ring-ring/55",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
].join(" ");

/**
 * Variante del anillo para controles que viven sobre una superficie elevada
 * (dentro de un popover/dialog), donde el offset debe leer contra esa superficie
 * y no contra el fondo de página.
 */
export const focusRingOnSurface = [
  "outline-none",
  "focus-visible:ring-[3px]",
  "focus-visible:ring-ring/55",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-popover",
].join(" ");

/**
 * Foco para ítems de lista/menú, donde un anillo con offset rompería el ritmo
 * vertical. Se marca con fondo, no con borde.
 */
export const focusItem = [
  "outline-none",
  "focus-visible:bg-accent",
  "focus-visible:text-accent-foreground",
  "data-highlighted:bg-accent",
  "data-highlighted:text-accent-foreground",
].join(" ");

/** Deshabilitado. `pointer-events-none` evita el tooltip fantasma en hover. */
export const disabled = [
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "data-disabled:pointer-events-none",
  "data-disabled:opacity-50",
].join(" ");

/**
 * Inválido. Nota de accesibilidad: el color es el canal secundario, no el
 * único — el componente debe además exponer `aria-invalid` y un mensaje de
 * error textual. El borde rojo solo no comunica nada a un lector de pantalla
 * ni a alguien con daltonismo.
 */
export const invalid = [
  "aria-invalid:border-destructive",
  "aria-invalid:ring-destructive/25",
  "dark:aria-invalid:ring-destructive/35",
].join(" ");

/** Transición estándar de superficie: color y sombra, nunca layout. */
export const transitionBase =
  "transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-standard";

/**
 * Escala de tamaño compartida por todos los controles de formulario y acción.
 * Que Button, Input, Select y Badge tomen su altura de la misma tabla es lo que
 * hace que se alineen cuando conviven en una fila.
 *
 * Las alturas son múltiplos de 4px y respetan el mínimo de 44px de área táctil
 * en `lg` (ver README §Accesibilidad — en `sm`/`md` el patrón asume puntero o
 * un contenedor con padding propio).
 */
export const controlHeight = {
  sm: "h-8",   /* 32px */
  md: "h-9",   /* 36px */
  lg: "h-11",  /* 44px */
} as const;

export type ControlSize = keyof typeof controlHeight;
