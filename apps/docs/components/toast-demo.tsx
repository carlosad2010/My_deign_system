"use client";

import { Button, toast } from "biblioteca-diseno";

export function ToastDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => toast.success("Post publicado", {
          description: "Ya es visible en el blog público.",
        })}
      >
        Éxito
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.error("No se pudo guardar", {
          description: "La conexión se interrumpió.",
        })}
      >
        Error
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.warning("Faltan metadatos", {
          description: "Sin descripción, el post no se indexa bien.",
        })}
      >
        Advertencia
      </Button>

      <Button variant="outline" onClick={() => toast.info("Hay una versión nueva.")}>
        Info
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.success("Autor eliminado", {
            action: { label: "Deshacer", onClick: () => toast("Restaurado") },
          })
        }
      >
        Con deshacer
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1800)), {
            loading: "Exportando…",
            success: "Exportación lista",
            error: "Falló la exportación",
          })
        }
      >
        Promesa
      </Button>
    </>
  );
}
