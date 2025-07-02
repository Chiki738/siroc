// src/services/validacionesService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/validaciones";

export const crearValidacion = async (ruc: string) => {
  const nuevaValidacion = {
    ruc,
    estadoValidacion: "Pendiente",
    fechaValidacion: new Date().toISOString(),
  };

  const response = await axios.post(`${API_URL}/crear`, nuevaValidacion);
  return response.data;
};

export const obtenerValidaciones = async () => {
  const response = await axios.get(API_URL);
  return response.data; // Devuelve el arreglo de validaciones
};

// ✅ Nueva función para actualizar el estado de una validación
// ✅ Ahora espera un objeto
export const actualizarEstadoValidacion = async (
  id: number,
  data: {
    estadoValidacion: "Validada" | "Rechazada" | "Pendiente";
    adminId: number;
  }
) => {
  try {
    const response = await axios.put(`${API_URL}/actualizar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar validación:", error);
    throw error;
  }
};

// ✅ Obtener validaciones por ID de ONG
export const obtenerValidacionesPorOngId = async (ongId: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/ong/${ongId}`);
    return response.data; // Devuelve el arreglo de validaciones de esa ONG
  } catch (error) {
    console.error(
      `❌ Error al obtener validaciones de ONG con ID ${ongId}:`,
      error
    );
    return [];
  }
};
