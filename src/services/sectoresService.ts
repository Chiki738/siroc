const BASE_URL = "http://localhost:8080/api/sectores";

// Obtener todos los sectores
export async function obtenerSectores() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Error al obtener sectores");
  return response.json();
}

// Obtener solo el nombre limpio del sector por ID
export async function obtenerNombreSectorPorId(id: number): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("No se pudo obtener el sector");

    const data = await response.json();
    // Eliminar cualquier texto como "(1)", "(12)", etc.
    const nombreLimpio = data.nombre.replace(/\s*\(\d+\)/, "").trim();
    return nombreLimpio;
  } catch (error) {
    console.error("Error al obtener sector:", error);
    return "No disponible";
  }
}
