import type { Autor, Post } from "./types";

export const autoresSeed: Autor[] = [
  { id: "a1", nombre: "Lucía Ferrer", email: "lucia@ejemplo.com", rol: "Administración" },
  { id: "a2", nombre: "Marco Ibáñez", email: "marco@ejemplo.com", rol: "Edición" },
  { id: "a3", nombre: "Sofía Quiroga", email: "sofia@ejemplo.com", rol: "Edición" },
  { id: "a4", nombre: "Diego Salas", email: "diego@ejemplo.com", rol: "Lectura" },
];

export const postsSeed: Post[] = [
  {
    id: "p1",
    titulo: "Cómo elegir la escala tipográfica de un producto",
    slug: "escala-tipografica",
    extracto:
      "Por qué un paso de tamaño sin su interlineado es media decisión, y cómo armar una escala que no se rompa en móvil.",
    autorId: "a1",
    estado: "publicado",
    vistas: 4820,
    creadoEn: "2026-09-14",
  },
  {
    id: "p2",
    titulo: "Tokens de color: fill y texto no son lo mismo",
    slug: "tokens-fill-vs-texto",
    extracto:
      "Un amarillo puede ser una marca perfecta y un color de texto ilegible. La diferencia se mide, no se estima.",
    autorId: "a1",
    estado: "publicado",
    vistas: 3910,
    creadoEn: "2026-09-02",
  },
  {
    id: "p3",
    titulo: "El estado de foco es donde se rompe la consistencia",
    slug: "estado-de-foco",
    extracto:
      "No son los colores los que desalinean un design system. Son los estados definidos cinco veces.",
    autorId: "a2",
    estado: "publicado",
    vistas: 2740,
    creadoEn: "2026-08-21",
  },
  {
    id: "p4",
    titulo: "Doble eje Y: el error de gráficos más común",
    slug: "doble-eje-y",
    extracto:
      "Dos medidas de escala distinta en un solo gráfico no comparan nada. Qué hacer en su lugar.",
    autorId: "a3",
    estado: "publicado",
    vistas: 5180,
    creadoEn: "2026-08-09",
  },
  {
    id: "p5",
    titulo: "Responsive no es apilar columnas",
    slug: "responsive-no-es-apilar",
    extracto:
      "Los casos donde el breakpoint obliga a una decisión de jerarquía y no solo a un cambio de grilla.",
    autorId: "a2",
    estado: "borrador",
    vistas: 0,
    creadoEn: "2026-09-18",
  },
  {
    id: "p6",
    titulo: "Estados vacíos que sirven para algo",
    slug: "estados-vacios",
    extracto:
      "«No hay datos» deja al usuario sin saber si es un error, un filtro mal puesto o una cuenta nueva.",
    autorId: "a3",
    estado: "borrador",
    vistas: 0,
    creadoEn: "2026-09-11",
  },
  {
    id: "p7",
    titulo: "Por qué dejamos de usar librerías de componentes",
    slug: "sin-librerias-de-componentes",
    extracto: "Un post viejo que ya no refleja cómo trabajamos.",
    autorId: "a4",
    estado: "archivado",
    vistas: 1260,
    creadoEn: "2026-05-30",
  },
  {
    id: "p8",
    titulo: "Accesibilidad: el color nunca va solo",
    slug: "color-nunca-va-solo",
    extracto:
      "Icono, etiqueta y posición. Tres canales antes de que el color tenga que cargar significado.",
    autorId: "a1",
    estado: "publicado",
    vistas: 3330,
    creadoEn: "2026-07-17",
  },
];
