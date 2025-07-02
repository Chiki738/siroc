import { useMutation } from "@tanstack/react-query";
import { crearValidacion } from "../services/validacionesService";
import type { Validacion } from "../types/validacion";

export const useCrearValidacion = () => {
  return useMutation<Validacion, Error, string>({
    mutationFn: crearValidacion,
  });
};
