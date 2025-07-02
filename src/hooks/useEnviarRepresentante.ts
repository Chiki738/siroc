import { useState } from "react";
import { crearRepresentante } from "../services/representanteService";
import Swal from "sweetalert2";
import axios from "axios";

export const useEnviarRepresentante = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarRepresentante = async (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const datos = {
      dni: formData.get("dni") as string,
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      fechaNacimiento: formData.get("fechaNacimiento") as string,
    };

    try {
      setCargando(true);
      setError(null);
      const data = await crearRepresentante(datos);
      return data;
    } catch (err: unknown) {
      setError("Error al registrar representante.");
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          Swal.fire({
            icon: "warning",
            title: "DNI ya registrado",
            text: "Ya existe un representante con ese DNI.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: "Ocurrió un problema inesperado.",
          });
        }
      } else {
        console.error(err);
      }
    } finally {
      setCargando(false);
    }
  };

  return { enviarRepresentante, cargando, error };
};
