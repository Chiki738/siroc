import { useEffect, useState } from "react";
import { obtenerDatosSunatPorRuc } from "../services/sunatService";
import type { DatosSunat } from "../types/DatosSunat";

export function useSunatPorRuc(ruc: string) {
  const [data, setData] = useState<DatosSunat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ruc) return;

    const fetchData = async () => {
      const result = await obtenerDatosSunatPorRuc(ruc);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [ruc]);

  return { sunatData: data, loading };
}
