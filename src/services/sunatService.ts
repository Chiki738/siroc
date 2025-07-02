// src/services/sunatService.ts
export async function obtenerDatosSunatPorRuc(ruc: string) {
  try {
    const response = await fetch(`https://hexagonal-63ip.onrender.com/api/sunat/ruc/${ruc}`);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información del RUC");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al consultar SUNAT:", error);
    return null;
  }
}
