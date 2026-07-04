import { API_ENDPOINTS } from "../config/api";

export const enviarOng = async (form: HTMLFormElement) => {
  const formData = new FormData(form);

  const fecha = formData.get("fecha_registro") as string;
  if (!fecha) {
    console.error("Fecha de registro no proporcionada");
    return null;
  }

  const ahora = new Date();
  const hora = ahora.toTimeString().split(" ")[0];
  const fechaRegistro = `${fecha}T${hora}`;

  const body = {
    nombre: formData.get("nombre"),
    ruc: formData.get("ruc"),
    representanteId: formData.get("representante_id"),
    sectorId: Number(formData.get("sector_id")),
    regionId: Number(formData.get("region_id")),
    fechaRegistro,
  };

  try {
    const res = await fetch(`${API_ENDPOINTS.ongs}/crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error al registrar ONG");
    return await res.json();
  } catch (error) {
    console.error("Error al enviar ONG:", error);
    return null;
  }
};

export const obtenerTodasLasOngs = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.ongs);
    if (!res.ok) throw new Error("Error al obtener ONGs");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener ONGs:", error);
    return null;
  }
};

export const obtenerOngPorId = async (id: number | string) => {
  try {
    const res = await fetch(`${API_ENDPOINTS.ongs}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener ONG con ID ${id}`);
    return await res.json();
  } catch (error) {
    console.error(`Error al obtener ONG por ID ${id}:`, error);
    return null;
  }
};
