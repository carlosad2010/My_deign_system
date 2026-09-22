"use client";

import * as React from "react";
import { UsersIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  DataTable,
  EmptyState,
  type DataTableColumn,
} from "biblioteca-diseno";

import { teamMembers } from "@/lib/mock-data";

type Miembro = (typeof teamMembers)[number];

const estadoVariant = {
  activo: "success",
  pendiente: "warning",
  suspendido: "destructive",
} as const;

// Se repiten los datos para que la paginación tenga algo que paginar.
const filas: Miembro[] = Array.from({ length: 3 }, (_, bloque) =>
  teamMembers.map((m) => ({ ...m, email: `${bloque}-${m.email}` })),
).flat();

const columnas: DataTableColumn<Miembro>[] = [
  {
    id: "nombre",
    header: "Autor",
    accessor: (m) => m.nombre,
    sortable: true,
    cell: (m) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback>
            {m.nombre
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{m.nombre}</span>
      </div>
    ),
  },
  {
    id: "rol",
    header: "Rol",
    accessor: (m) => m.rol,
    sortable: true,
    // Columna prescindible: se esconde en pantallas chicas.
    className: "hidden md:table-cell",
  },
  {
    id: "estado",
    header: "Estado",
    accessor: (m) => m.estado,
    sortable: true,
    cell: (m) => <Badge variant={estadoVariant[m.estado]}>{m.estado}</Badge>,
  },
  {
    id: "posts",
    header: "Posts",
    accessor: (m) => m.posts,
    sortable: true,
    numeric: true,
  },
];

export function DataTableDemo() {
  const [seleccion, setSeleccion] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <DataTable
        data={filas}
        columns={columnas}
        getRowId={(m) => m.email}
        caption="Autores del blog"
        initialSort={{ columnId: "posts", direction: "desc" }}
        selectable
        selected={seleccion}
        onSelectedChange={setSeleccion}
        pageSize={5}
        empty={
          <EmptyState
            icon={UsersIcon}
            title="Sin autores"
            description="Cuando invites a alguien va a aparecer acá."
          />
        }
      />

      {seleccion.length > 0 ? (
        <p className="text-ui-sm text-muted-foreground">
          Seleccionadas: {seleccion.length}
        </p>
      ) : null}
    </div>
  );
}
