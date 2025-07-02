// src/hooks/useReniecPorDni.ts

import { useEffect, useState } from "react";
import { obtenerDatosReniecPorDni } from "../services/reniecService";
import type { DatosReniec } from "../types/Reniec";

export function useReniecPorDni(dni: string) {
  const [data, setData] = useState<DatosReniec | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dni) return;

    const fetchData = async () => {
      const result = await obtenerDatosReniecPorDni(dni);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [dni]);

  return { reniecData: data, loading };
}
