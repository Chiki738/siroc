import "../assets/styles/Login.css";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthService } from "../hooks/useAuthService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary bg-gradient">
      <div
        className="d-flex shadow rounded overflow-hidden bg-white"
        style={{ maxWidth: "750px", width: "100%" }}>
        {/* Columna izquierda */}
        <div
          className="p-4 bg-light d-flex flex-column justify-content-center align-items-center"
          style={{ width: "50%" }}>
          <img
            src={logo}
            alt="Logo"
            className="mb-3"
            style={{ width: "70%" }}
          />
          <p
            className="text-center text-black px-3"
            style={{ fontSize: "14px" }}>
            Plataforma para registrar y validar ONGs y asociaciones civiles en
            Perú.
            <br />
            Simplifica el proceso de verificación con datos de{" "}
            <strong>SUNAT</strong> y <strong>RENIEC</strong>.
          </p>
        </div>

        {/* Columna derecha */}
        <form
          className="p-5 d-flex flex-column justify-content-center"
          style={{ width: "50%" }}
          onSubmit={handleSubmit}>
          <h3 className="mb-4 text-center text-black fw-bold">
            INICIAR SESIÓN
          </h3>

          <input
            type="email"
            placeholder="Ingresar correo electrónico"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Ingresar contraseña"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary fw-bold text-white w-100 mt-2">
            Iniciar Sesión
          </button>

          <p className="text-center pt-4 mb-0" style={{ fontSize: "14px" }}>
            ¿Desea registrar una ONG?&nbsp;
            <Link
              to="/Registro"
              className="text-primary fw-semibold text-decoration-none">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
