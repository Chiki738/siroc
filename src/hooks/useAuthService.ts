// src/hooks/useAuthService.ts
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export function useAuthService() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const success = await authService.login(email, password);
      if (success) {
        Swal.fire("Éxito", "Inicio de sesión correcto", "success");
        navigate("/Admin");
      } else {
        Swal.fire("Error", "Correo o contraseña incorrectos", "error");
      }
    } catch {
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
