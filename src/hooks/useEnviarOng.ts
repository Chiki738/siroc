// src/hooks/useEnviarOng.ts
import { enviarOng } from "../services/ongsService";

export const useEnviarOng = () => {
  const enviar = async (form: HTMLFormElement) => {
    return await enviarOng(form);
  };

  return { enviarOng: enviar };
};
