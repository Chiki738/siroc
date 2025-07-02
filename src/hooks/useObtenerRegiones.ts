// useObtenerRegiones.ts
import { useEffect, useState } from "react";
import { obtenerRegiones } from "../services/regionesService"; // importa la función

interface Region {
  id: number;
  nombre: string;
}

export function useObtenerRegiones() {
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerRegiones()
      .then(setRegiones)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { regiones, loading, error };
}
