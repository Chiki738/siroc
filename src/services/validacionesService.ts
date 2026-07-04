import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const crearValidacion = async (ruc: string) => {
  const nuevaValidacion = {
    ruc,
    estadoValidacion: "Pendiente",
    fechaValidacion: new Date().toISOString(),
  };

  const response = await axios.post(
    `${API_ENDPOINTS.validaciones}/crear`,
    nuevaValidacion
  );
  return response.data;
};

export const obtenerValidaciones = async () => {
  const response = await axios.get(API_ENDPOINTS.validaciones);
  return response.data;
};

export const actualizarEstadoValidacion = async (
  id: number,
  data: {
    estadoValidacion: "Validada" | "Rechazada" | "Pendiente";
    adminId: number;
  }
) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.validaciones}/actualizar/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar validación:", error);
    throw error;
  }
};

export const obtenerValidacionesPorOngId = async (ongId: number | string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.validaciones}/ong/${ongId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener validaciones de ONG con ID ${ongId}:`,
      error
    );
    return [];
  }
};
