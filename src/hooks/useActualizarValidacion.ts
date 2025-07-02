import { useState } from "react";
import { actualizarEstadoValidacion } from "../services/validacionesService";
import Swal from "sweetalert2";

export function useActualizarValidacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizar = async (
    id: number,
    nuevoEstado: "Validada" | "Rechazada" | "Pendiente"
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener adminId desde localStorage
      const adminId = localStorage.getItem("adminId");
      if (!adminId) throw new Error("Admin no autenticado");

      // Construir el cuerpo a enviar
      const payload = {
        estadoValidacion: nuevoEstado,
        adminId: parseInt(adminId),
      };

      await actualizarEstadoValidacion(id, payload); // ← Se pasa el objeto completo

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La solicitud fue marcada como ${nuevoEstado}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch {
      setError("No se pudo actualizar el estado");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el estado.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { actualizar, loading, error };
}
