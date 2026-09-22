"use client";

import * as React from "react";

import { autoresSeed, postsSeed } from "./seed";
import type { Autor, BorradorPost, EstadoPost, Post } from "./types";

/**
 * Estado de la app.
 *
 * Es deliberadamente un `useReducer` sobre memoria + localStorage, sin backend:
 * el objetivo de este MVP es mostrar el Design System funcionando, no montar
 * una arquitectura de datos. Todo lo que se crea, edita o borra vive en el
 * navegador.
 *
 * El dato persistido se carga en un efecto y NO en el estado inicial: leer
 * localStorage durante el render haría que el servidor y el cliente pinten
 * cosas distintas y React tiraría un error de hidratación.
 */

const CLAVE = "ds-example:v1";

type Estado = { posts: Post[]; autores: Autor[]; hidratado: boolean };

type Accion =
  | { tipo: "hidratar"; posts: Post[] }
  | { tipo: "crear"; borrador: BorradorPost }
  | { tipo: "actualizar"; id: string; cambios: Partial<Post> }
  | { tipo: "eliminar"; id: string }
  | { tipo: "reiniciar" };

const estadoInicial: Estado = {
  posts: postsSeed,
  autores: autoresSeed,
  hidratado: false,
};

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "hidratar":
      return { ...estado, posts: accion.posts, hidratado: true };

    case "crear": {
      const nuevo: Post = {
        ...accion.borrador,
        id: `p${Date.now()}`,
        vistas: 0,
        creadoEn: new Date().toISOString().slice(0, 10),
      };
      return { ...estado, posts: [nuevo, ...estado.posts] };
    }

    case "actualizar":
      return {
        ...estado,
        posts: estado.posts.map((p) =>
          p.id === accion.id ? { ...p, ...accion.cambios } : p,
        ),
      };

    case "eliminar":
      return { ...estado, posts: estado.posts.filter((p) => p.id !== accion.id) };

    case "reiniciar":
      return { ...estado, posts: postsSeed };
  }
}

type Contexto = Estado & {
  crear: (borrador: BorradorPost) => void;
  actualizar: (id: string, cambios: Partial<Post>) => void;
  eliminar: (id: string) => void;
  reiniciar: () => void;
  autorDe: (autorId: string) => Autor | undefined;
};

const StoreContext = React.createContext<Contexto | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [estado, dispatch] = React.useReducer(reducer, estadoInicial);

  // Carga: después del primer render, ya en el cliente.
  React.useEffect(() => {
    try {
      const crudo = window.localStorage.getItem(CLAVE);
      if (crudo) dispatch({ tipo: "hidratar", posts: JSON.parse(crudo) });
      else dispatch({ tipo: "hidratar", posts: postsSeed });
    } catch {
      // Ventana privada, almacenamiento bloqueado o JSON corrupto: se sigue
      // con los datos de ejemplo en memoria. La app no depende de esto.
      dispatch({ tipo: "hidratar", posts: postsSeed });
    }
  }, []);

  // Guardado: solo una vez hidratado, para no pisar lo guardado con el seed.
  React.useEffect(() => {
    if (!estado.hidratado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado.posts));
    } catch {
      /* sin persistencia; la sesión sigue funcionando igual */
    }
  }, [estado.posts, estado.hidratado]);

  const valor = React.useMemo<Contexto>(
    () => ({
      ...estado,
      crear: (borrador) => dispatch({ tipo: "crear", borrador }),
      actualizar: (id, cambios) => dispatch({ tipo: "actualizar", id, cambios }),
      eliminar: (id) => dispatch({ tipo: "eliminar", id }),
      reiniciar: () => dispatch({ tipo: "reiniciar" }),
      autorDe: (autorId) => estado.autores.find((a) => a.id === autorId),
    }),
    [estado],
  );

  return <StoreContext value={valor}>{children}</StoreContext>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}

/* --- utilidades de dominio ------------------------------------------------ */

export const ESTADOS: EstadoPost[] = ["publicado", "borrador", "archivado"];

export function slugificar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
