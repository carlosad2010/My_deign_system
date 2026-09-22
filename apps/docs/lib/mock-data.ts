/** Datos de ejemplo para la documentación. Nada de esto sale de una API real. */

export const monthlyTraffic = [
  { mes: "Ene", Visitas: 4210, Registros: 620, Conversiones: 148 },
  { mes: "Feb", Visitas: 4890, Registros: 710, Conversiones: 171 },
  { mes: "Mar", Visitas: 5310, Registros: 690, Conversiones: 165 },
  { mes: "Abr", Visitas: 6120, Registros: 880, Conversiones: 212 },
  { mes: "May", Visitas: 5940, Registros: 845, Conversiones: 198 },
  { mes: "Jun", Visitas: 7180, Registros: 1020, Conversiones: 256 },
  { mes: "Jul", Visitas: 7960, Registros: 1145, Conversiones: 289 },
  { mes: "Ago", Visitas: 7420, Registros: 1080, Conversiones: 271 },
  { mes: "Sep", Visitas: 8630, Registros: 1260, Conversiones: 324 },
];

export const channelBreakdown = [
  { canal: "Búsqueda orgánica", sesiones: 12840 },
  { canal: "Directo", sesiones: 7310 },
  { canal: "Redes sociales", sesiones: 4290 },
  { canal: "Email", sesiones: 2180 },
  { canal: "Referidos", sesiones: 1240 },
];

export const planDistribution = [
  { plan: "Gratuito", cuentas: 1840 },
  { plan: "Pro", cuentas: 920 },
  { plan: "Equipos", cuentas: 410 },
  { plan: "Enterprise", cuentas: 86 },
];

export const trendSeries = {
  ingresos: [42, 45, 44, 51, 49, 58, 62, 60, 71, 74, 79, 86],
  usuarios: [120, 132, 128, 145, 160, 158, 172, 181, 195, 204, 221, 238],
  churn: [4.8, 4.6, 4.9, 4.4, 4.1, 3.9, 4.0, 3.6, 3.4, 3.5, 3.1, 2.9],
};

export const teamMembers = [
  {
    nombre: "Lucía Ferrer",
    email: "lucia@ejemplo.com",
    rol: "Administración",
    estado: "activo" as const,
    posts: 42,
  },
  {
    nombre: "Marco Ibáñez",
    email: "marco@ejemplo.com",
    rol: "Edición",
    estado: "activo" as const,
    posts: 28,
  },
  {
    nombre: "Sofía Quiroga",
    email: "sofia@ejemplo.com",
    rol: "Edición",
    estado: "pendiente" as const,
    posts: 0,
  },
  {
    nombre: "Diego Salas",
    email: "diego@ejemplo.com",
    rol: "Lectura",
    estado: "suspendido" as const,
    posts: 11,
  },
];
