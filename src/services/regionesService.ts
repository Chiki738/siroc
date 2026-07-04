import { API_ENDPOINTS } from "../config/api";

export async function obtenerRegiones() {
  const res = await fetch(API_ENDPOINTS.regiones);
  if (!res.ok) throw new Error("Error al obtener regiones");
  return res.json();
}

export async function obtenerNombreRegionPorId(id: number): Promise<string> {
  try {
    const res = await fetch(`${API_ENDPOINTS.regiones}/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la región");

    const data = await res.json();
    return data.nombre;
  } catch (error) {
    console.error("Error al obtener región:", error);
    return "No disponible";
  }
}
