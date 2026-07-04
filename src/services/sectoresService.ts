import { API_ENDPOINTS } from "../config/api";

export async function obtenerSectores() {
  const response = await fetch(API_ENDPOINTS.sectores);
  if (!response.ok) throw new Error("Error al obtener sectores");
  return response.json();
}

export async function obtenerNombreSectorPorId(id: number): Promise<string> {
  try {
    const response = await fetch(`${API_ENDPOINTS.sectores}/${id}`);
    if (!response.ok) throw new Error("No se pudo obtener el sector");

    const data = await response.json();
    const nombreLimpio = data.nombre.replace(/\s*\(\d+\)/, "").trim();
    return nombreLimpio;
  } catch (error) {
    console.error("Error al obtener sector:", error);
    return "No disponible";
  }
}
