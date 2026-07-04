import { DASHBOARD_URL } from "../config/app";

function Dashboard() {
  return (
    <section>
      <header className="page-header">
        <div>
          <p className="page-kicker">Analítica</p>
          <h1 className="page-title">Dashboard de seguimiento</h1>
          <p className="page-description">
            Monitorea solicitudes, validaciones aprobadas, rechazos y tendencias
            operativas del sistema.
          </p>
        </div>
      </header>

      <div className="dashboard-frame">
        <iframe src={DASHBOARD_URL} title="Dashboard de seguimiento SIROC" />
      </div>
    </section>
  );
}

export default Dashboard;
