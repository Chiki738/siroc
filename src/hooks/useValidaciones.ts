import { useState, useEffect } from "react";
import { obtenerValidaciones } from "../services/validacionesService";
import { obtenerTodasLasOngs } from "../services/ongsService";
import type { Ong } from "./useOngs";
import type { Validacion } from "../types/validacion";

export type { Validacion } from "../types/validacion";

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

  return { validaciones, loading, error, setValidaciones };
}
