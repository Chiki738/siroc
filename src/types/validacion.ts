// src/types/validacion.ts
export interface Validacion {
  id: number;
  ruc: string;
  estadoValidacion: string;
  comentario?: string;
  fechaValidacion: string;
}
