// src/hooks/useValidaciones.ts
import { useState, useEffect } from "react";
import { obtenerValidaciones } from "../services/validacionesService";
import { obtenerTodasLasOngs } from "../services/ongsService";
import type { Ong } from "./useOngs";

export interface Validacion {
  id: number;
  ongId: number;
  adminId: number | null;
  estadoValidacion: "Pendiente" | "Validada" | "Rechazada" | string;
  comentario: string | null;
  fechaValidacion: string;
  nombreOng?: string; // añadimos nombre y ruc aquí
  rucOng?: string;
}

export function useValidaciones() {
  const [validaciones, setValidaciones] = useState<Validacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValidaciones() {
      try {
        const [validacionesData, ongsData] = await Promise.all([
          obtenerValidaciones(),
          obtenerTodasLasOngs(),
        ]);

        if (!validacionesData || !ongsData) {
          throw new Error("Datos incompletos");
        }

        // Relacionar ONG con Validación
        const validacionesConOng = validacionesData.map((v: Validacion) => {
          const ong = ongsData.find((o: Ong) => o.id === v.ongId);
          return {
            ...v,
            nombreOng: ong?.nombre || "Desconocido",
            rucOng: ong?.ruc || "N/A",
          };
        });

        setValidaciones(validacionesConOng);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al obtener validaciones");
      } finally {
        setLoading(false);
      }
    }
    fetchValidaciones();
  }, []);

  return { validaciones, loading, error, setValidaciones }; // 🔁 Añadir setValidaciones
}
