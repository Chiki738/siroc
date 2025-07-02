import { useState, useEffect } from "react";
import { obtenerTodasLasOngs } from "../services/ongsService"; // Ajusta la ruta según tu proyecto

export interface Ong {
  id: number;
  nombre: string;
  ruc: string;
  representanteId: string;
  sectorId: number;
  regionId: number;
  fechaRegistro: string;
}

export function useOngs() {
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOngs() {
      try {
        const data = await obtenerTodasLasOngs();
        if (!data) throw new Error("No se recibieron ONGs");
        setOngs(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al obtener ONGs");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOngs();
  }, []);

  return { ongs, loading, error };
}
