function Dashboard() {
  return (
    <div className="container my-5">
      <h1 className="mb-2">Dashboard de Estadísticas</h1>
      <p className="text-muted">
        Resumen general del sistema de validación de ONGs
      </p>

      {/* Métricas Principales */}
      <div className="row text-center mb-4">
        {[
          { color: "primary", label: "Total ONGs", value: 156 },
          { color: "success", label: "Validaciones Aprobadas", value: 128 },
          { color: "danger", label: "Validaciones Rechazadas", value: 18 },
          { color: "warning", label: "Pendientes", value: 10 },
        ].map((metric, index) => (
          <div className="col-md-3" key={index}>
            <div className="card">
              <div className="card-body">
                <h2 className={`text-${metric.color}`}>{metric.value}</h2>
                <p className="text-muted">{metric.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas y Notificaciones */}
      <div className="card mt-4">
        <div className="card-header">
          <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
          Alertas y Notificaciones
        </div>
        <div className="card-body">
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <div>
              <strong>10 validaciones pendientes</strong>
              <p className="mb-0">Requieren revisión manual</p>
            </div>
            <button className="btn btn-outline-secondary btn-sm">
              Ver Detalles
            </button>
          </div>

          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
              <strong>3 nuevas solicitudes hoy</strong>
              <p className="mb-0">
                Fundación Esperanza, ONG Educativa, Centro Social
              </p>
            </div>
            <button className="btn btn-outline-secondary btn-sm">
              Revisar
            </button>
          </div>

          <div className="alert alert-success d-flex justify-content-between align-items-center">
            <div>
              <strong>Sistema funcionando correctamente</strong>
              <p className="mb-0">
                Todas las conexiones con RENIEC y SUNAT activas
              </p>
            </div>
            <span className="badge bg-success">Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
