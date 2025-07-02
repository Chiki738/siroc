// src/services/reniecService.ts

import type { DatosReniec } from "../types/Reniec";

export async function obtenerDatosReniecPorDni(
  dni: string
): Promise<DatosReniec | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/reniec/dni/${dni}`);
    if (!response.ok)
      throw new Error("No se pudo obtener la información de RENIEC");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos de RENIEC:", error);
    return null;
  }
}
