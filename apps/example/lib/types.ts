export type EstadoPost = "publicado" | "borrador" | "archivado";

export type Post = {
  id: string;
  titulo: string;
  slug: string;
  extracto: string;
  autorId: string;
  estado: EstadoPost;
  vistas: number;
  /** ISO date (YYYY-MM-DD). */
  creadoEn: string;
};

export type Autor = {
  id: string;
  nombre: string;
  email: string;
  rol: "Administración" | "Edición" | "Lectura";
};

/** Datos de un post tal como los carga el formulario, antes de existir. */
export type BorradorPost = Pick<
  Post,
  "titulo" | "slug" | "extracto" | "autorId" | "estado"
>;
