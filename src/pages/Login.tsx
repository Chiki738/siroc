import logo from "../assets/img/logo.png";
import { ArrowRight, Database, ShieldCheck, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuthService } from "../hooks/useAuthService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthService();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-label="Acceso a SIROC">
        <div className="auth-brand">
          <img src={logo} alt="SIROC" className="auth-logo" />
          <div>
            <p className="page-kicker">Validación institucional</p>
            <h1 className="auth-title">Control técnico para organizaciones civiles</h1>
            <p className="auth-copy mt-3">
              Registra, contrasta y revisa datos de organizaciones civiles con
              apoyo de fuentes oficiales como SUNAT y RENIEC.
            </p>
          </div>
          <div className="auth-highlights" aria-label="Capacidades del sistema">
            <span className="auth-highlight">
              <ShieldCheck size={20} aria-hidden="true" />
              Verificación documental centralizada
            </span>
            <span className="auth-highlight">
              <Database size={20} aria-hidden="true" />
              Consulta integrada de datos públicos
            </span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="page-kicker">Panel administrativo</p>
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">
            Accede para revisar solicitudes, validar expedientes y actualizar
            estados.
          </p>

          <label className="form-label fw-semibold" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="nombre@organizacion.gob.pe"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form-label fw-semibold" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary text-white w-100 mt-2 d-inline-flex align-items-center justify-content-center gap-2"
            disabled={loading}>
            {loading ? "Validando acceso..." : "Ingresar al panel"}
            {!loading && <ArrowRight size={18} aria-hidden="true" />}
          </button>

          <p className="text-center pt-4 mb-0 text-muted">
            ¿Necesitas registrar una organización?{" "}
            <Link
              to="/registro"
              className="text-primary fw-semibold text-decoration-none d-inline-flex align-items-center gap-1">
              <UserPlus size={16} aria-hidden="true" />
              Crear registro
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
