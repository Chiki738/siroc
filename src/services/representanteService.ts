import axios from "axios";

const API_URL = "https://hexagonal-63ip.onrender.com/api/representantes";

// Crear un representante
export const crearRepresentante = async (representante: {
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
}) => {
  const response = await axios.post(`${API_URL}/crear`, representante);
  return response.data;
};

// Obtener un representante por ID
export const obtenerRepresentantePorId = async (id: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener representante con ID ${id}:`, error);
    return null;
  }
};

// Obtener todos los representantes
export const obtenerTodosLosRepresentantes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los representantes:", error);
    return [];
  }
};
