const spanishWordMap: Record<string, string> = {
  unico: "Único",
  dueno: "Dueño",
  duenos: "Dueños",
  oficial: "Oficial",
  equipo: "Equipo",
  especial: "Especial",
  ingreso: "Ingreso",
  servicio: "Servicio",
  automatico: "Automático",
  manual: "Manual",
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  nuevo: "Nuevo",
  usado: "Usado",
  seminuevo: "Seminuevo",
  garantia: "Garantía",
  financiacion: "Financiación",
  entrega: "Entrega",
  revision: "Revisión",
  historial: "Historial",
  documentacion: "Documentación",
  transferencia: "Transferencia",
  patente: "Patente",
  kilometraje: "Kilometraje",
  original: "Original",
  completo: "Completo",
  premium: "Premium",
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  navideno: "Navideño",
  navidenas: "Navidenas",
};

export function formatTagName(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => {
      const lowerWord = word.toLowerCase();
      if (spanishWordMap[lowerWord]) {
        return spanishWordMap[lowerWord];
      }
      const capitalized =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return capitalized
        .replace(/unico/gi, "Único")
        .replace(/dueno/gi, "Dueño")
        .replace(/oficial/gi, "Oficial")
        .replace(/equipo/gi, "Equipo")
        .replace(/especial/gi, "Especial")
        .replace(/ingreso/gi, "Ingreso")
        .replace(/servicio/gi, "Servicio")
        .replace(/navideno/gi, "Navideño")
        .replace(/navidenas/gi, "Navideñas");
    })
    .join(" ");
}

export function slugifyTagName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
