import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo y nombre */}
        <Link className="navbar-brand d-flex align-items-center" to="/admin">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "200px", marginRight: "10px" }}
          />
        </Link>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Solicitudes
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/validaciones">
                Validaciones
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>

          {/* Botón de cierre de sesión */}
          <Link to="/" className="btn btn-outline-danger">
            Cerrar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
