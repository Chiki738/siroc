export type EstadoValidacion = "Pendiente" | "Validada" | "Rechazada";

export interface Validacion {
  id: number;
  ongId: number;
  adminId: number | null;
  ruc?: string;
  estadoValidacion: EstadoValidacion | string;
  comentario?: string | null;
  fechaValidacion: string;
  nombreOng?: string;
  rucOng?: string;
}
