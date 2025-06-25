import "../assets/styles/Login.css";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="formLogin d-flex flex-column justify-content-center align-items-center text-center bg-secondary bg-gradient">
      <div
        className="d-flex flex-row justify-content-center "
        style={{ height: "300px" }}>
        <div
          style={{ width: "25%" }}
          className="bg-light p-3 border shadow-lg rounded-start">
          <img
            src={logo}
            className="img-fluid"
            alt="Logo"
            style={{ width: "80%" }}
          />
          <p className="text-black mt-3">
            Plataforma para registrar y validar ONGs y asociaciones civiles en
            Perú. Simplifica el proceso de verificación con datos de SUNAT y
            RENIEC.
          </p>
        </div>
        <form
          className="d-flex flex-column p-4 gap-3 shadow-lg border rounded-end bg-white"
          style={{ width: "28%" }}>
          <h3 className="text-black">INICIAR SESIÓN</h3>

          <input
            type="email"
            placeholder="Ingresar correo electrónico"
            className="form-control mb-3"
            required
          />

          <input
            type="password"
            placeholder="Ingresar contraseña"
            className="form-control mb-3"
            required
          />

          <Link
            to="/Admin"
            className="btn bg-primary px-4 py-1 text-white fw-bold btnLogin rounded-3 border-success mt-2">
            <strong>Iniciar Sesion</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
