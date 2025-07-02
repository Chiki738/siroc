// src/hooks/useRegionPorId.ts
import { useEffect, useState } from "react";
import { obtenerNombreRegionPorId } from "../services/regionesService";

export function useRegionPorId(id: number | string) {
  const [region, setRegion] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    obtenerNombreRegionPorId(Number(id))
      .then(setRegion)
      .finally(() => setLoading(false));
  }, [id]);

  return { region, loading };
}
