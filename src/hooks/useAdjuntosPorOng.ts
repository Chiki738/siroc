// src/hooks/useAdjuntosPorOng.ts

import { useEffect, useState } from "react";
import { obtenerAdjuntosPorOng } from "../services/adjuntosService";
import type { Adjunto } from "../services/adjuntosService";

export function useAdjuntosPorOng(ongId: number | string) {
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ongId) return;

    setLoading(true);
    setError(null);

    obtenerAdjuntosPorOng(Number(ongId))
      .then((data) => setAdjuntos(data))
      .catch(() => setError("Error al cargar los adjuntos"))
      .finally(() => setLoading(false));
  }, [ongId]);

  return { adjuntos, loading, error };
}
