// src/hooks/useAdjuntosPorOng.ts

import { useEffect, useState } from "react";
import { obtenerAdjuntosPorOng } from "../services/adjuntosService";
import type { Adjunto } from "../services/adjuntosService";

export function useAdjuntosPorOng(ongId: number | string) {
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarAdjuntos = async () => {
      if (!ongId) {
        if (activo) {
          setAdjuntos([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await obtenerAdjuntosPorOng(Number(ongId));
        if (activo) setAdjuntos(data);
      } catch {
        if (activo) setError("Error al cargar los adjuntos");
      } finally {
        if (activo) setLoading(false);
      }
    };

    void cargarAdjuntos();

    return () => {
      activo = false;
    };
  }, [ongId]);

  return { adjuntos, loading, error };
}
