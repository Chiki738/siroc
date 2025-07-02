// src/hooks/useValidacionesPorOngId.ts
import { useEffect, useState } from "react";
import { obtenerValidacionesPorOngId } from "../services/validacionesService";
import type { Validacion } from "../types/validacion";

export function useValidacionesPorOngId(ongId: number | string) {
  const [validaciones, setValidaciones] = useState<Validacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ongId) return;

    obtenerValidacionesPorOngId(ongId)
      .then((data) => setValidaciones(data))
      .catch(() => setValidaciones([]))
      .finally(() => setLoading(false));
  }, [ongId]);

  return { validaciones, loading };
}
