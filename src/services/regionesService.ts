const BASE_URL = "http://localhost:8080/api/regiones";

// Obtener todas las regiones
export async function obtenerRegiones() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener regiones");
  return res.json();
}

// Obtener solo el nombre de una región por su ID
export async function obtenerNombreRegionPorId(id: number): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la región");

    const data = await res.json();
    return data.nombre;
  } catch (error) {
    console.error("Error al obtener región:", error);
    return "No disponible";
  }
}
