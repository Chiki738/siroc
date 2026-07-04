import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const crearRepresentante = async (representante: {
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
}) => {
  const response = await axios.post(
    `${API_ENDPOINTS.representantes}/crear`,
    representante
  );
  return response.data;
};

export const obtenerRepresentantePorId = async (id: number | string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.representantes}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener representante con ID ${id}:`, error);
    return null;
  }
};

export const obtenerTodosLosRepresentantes = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.representantes);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los representantes:", error);
    return [];
  }
};
