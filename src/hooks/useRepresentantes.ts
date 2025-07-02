import { useEffect, useState } from "react";
import { obtenerTodosLosRepresentantes } from "../services/representanteService";

export const useRepresentantes = () => {
  const [representantes, setRepresentantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTodosLosRepresentantes();
        setRepresentantes(data);
      } catch {
        setError("Error al cargar los representantes.");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  return { representantes, cargando, error };
};
