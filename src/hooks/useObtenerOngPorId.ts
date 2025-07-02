// src/hooks/useOngPorId.ts
import { useEffect, useState } from "react";
import { obtenerOngPorId } from "../services/ongsService";
import type { Ong } from "../types/Ong";

export function useOngPorId(id: number | string) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOng = async () => {
      setLoading(true);
      const data = await obtenerOngPorId(id);
      if (data) {
        setOng(data);
      } else {
        setError("No se pudo cargar la ONG");
      }
      setLoading(false);
    };
    fetchOng();
  }, [id]);

  return { ong, loading, error };
}
