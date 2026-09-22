import { ArchiveIcon, CircleCheckIcon, PencilLineIcon } from "lucide-react";

import { Badge } from "biblioteca-diseno";

import type { EstadoPost } from "@/lib/types";

/**
 * Un único lugar que traduce estado de dominio → presentación. Si el badge de
 * "publicado" vive en cuatro archivos, en algún momento uno queda verde y otro
 * azul. Acá el mapa es la fuente de verdad.
 *
 * Cada estado lleva icono además de color: el color no puede ser el único
 * canal que comunica el estado.
 */
const MAPA = {
  publicado: {
    variant: "success",
    icon: CircleCheckIcon,
    label: "Publicado",
  },
  borrador: {
    variant: "warning",
    icon: PencilLineIcon,
    label: "Borrador",
  },
  archivado: {
    variant: "neutral",
    icon: ArchiveIcon,
    label: "Archivado",
  },
} as const;

export function EstadoBadge({ estado }: { estado: EstadoPost }) {
  const { variant, icon: Icon, label } = MAPA[estado];
  return (
    <Badge variant={variant}>
      <Icon />
      {label}
    </Badge>
  );
}

export const etiquetaEstado = (estado: EstadoPost) => MAPA[estado].label;
