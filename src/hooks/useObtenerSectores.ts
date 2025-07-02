import { useEffect, useState } from "react";
import { obtenerSectores } from "../services/sectoresService";

interface Sector {
  id: number;
  nombre: string;
}

export function useObtenerSectores() {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerSectores()
      .then((data) => {
        setSectores(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { sectores, loading, error };
}
