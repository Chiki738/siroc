import { useEffect, useState } from "react";
import { obtenerNombreSectorPorId } from "../services/sectoresService";

export function useSectorPorId(id: number | string) {
  const [sector, setSector] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    obtenerNombreSectorPorId(Number(id))
      .then(setSector)
      .finally(() => setLoading(false));
  }, [id]);

  return { sector, loading };
}
