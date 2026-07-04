import logo from "../assets/img/logo.png";
import { BarChart3, ClipboardList, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Solicitudes", icon: ClipboardList, end: true },
  { to: "/admin/validaciones", label: "Validaciones", icon: ShieldCheck, end: false },
  { to: "/admin/dashboard", label: "Dashboard", icon: BarChart3, end: false },
] as const;

function Header() {
  return (
    <nav className="navbar navbar-expand-lg siroc-navbar sticky-top">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
          <img src={logo} alt="SIROC" className="siroc-brand-logo" />
          <span className="siroc-brand-kicker d-none d-md-inline">
            Gestión de validaciones
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir navegación">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  className={({ isActive }) =>
                    `siroc-nav-link ${isActive ? "active" : ""}`
                  }
                  end={end}
                  to={to}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link to="/" className="btn btn-outline-danger d-inline-flex align-items-center gap-2">
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
