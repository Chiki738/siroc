import { useEffect, useState } from "react";
import { obtenerRepresentantePorId } from "../services/representanteService";

interface Representante {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  verificadoReniec: boolean;
}

export function useRepresentantePorId(id: number | string) {
  const [representante, setRepresentante] = useState<Representante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerRepresentantePorId(id);
      if (data) {
        setRepresentante(data);
      } else {
        setError("No se pudo obtener el representante");
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  return { representante, loading, error };
}