import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases y resuelve conflictos de Tailwind dando prioridad a la última.
 * Es lo que permite que cualquier componente acepte `className` y el consumidor
 * pueda sobreescribir un token sin pelear con la especificidad.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
