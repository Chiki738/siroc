import { useCallback } from "react";
import { subirAdjunto } from "../services/adjuntosService";

export const useSubirAdjuntos = () => {
  const subir = useCallback(
    async (file: File, descripcion: string, ruc: string) => {
      return await subirAdjunto(file, descripcion, ruc);
    },
    []
  );

  return { subir };
};
