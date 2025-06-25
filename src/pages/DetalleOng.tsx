export default function DetalleOng() {
  const ongData = {
    nombre: "Fundación Esperanza",
    ruc: "20123456789",
    estado: "Activo",
    fechaConstitucion: "2020-03-15",
    direccion: "Av. Los Olivos 123, Lima, Perú",
    telefono: "+51 1 234-5678",
    email: "contacto@fundacionesperanza.org",
    representanteLegal: "María García Rodríguez",
    objetivos:
      "Brindar apoyo educativo y alimentario a niños en situación de vulnerabilidad",
    beneficiarios: 150,
    proyectosActivos: 3,
  };

  const documentos = [
    { nombre: "Acta de Constitución", estado: "Validado", fecha: "2024-01-10" },
    { nombre: "Estatuto", estado: "Validado", fecha: "2024-01-10" },
    { nombre: "Registro SUNAT", estado: "Pendiente", fecha: "2024-01-12" },
    { nombre: "Certificado RENIEC", estado: "Validado", fecha: "2024-01-11" },
  ];

  return (
    <div className="">
      <h1 className="mb-3">Detalle de ONG</h1>
      <p className="text-muted mb-4">Información completa de la organización</p>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-building me-2"></i>Información General
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Nombre de la ONG:</strong>
                  <p>{ongData.nombre}</p>
                </div>
                <div className="col-md-6">
                  <strong>RUC:</strong>
                  <p>{ongData.ruc}</p>
                </div>
                <div className="col-md-6">
                  <strong>Estado:</strong>
                  <p>
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i>
                      {ongData.estado}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <strong>Fecha de Constitución:</strong>
                  <p>
                    <i className="fas fa-calendar-alt me-2"></i>
                    {ongData.fechaConstitucion}
                  </p>
                </div>
              </div>
              <hr />
              <strong>Representante Legal:</strong>
              <p>{ongData.representanteLegal}</p>

              <strong>Objetivos:</strong>
              <p>{ongData.objetivos}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">Información de Contacto</div>
            <div className="card-body">
              <p>
                <i className="fas fa-map-marker-alt me-2"></i>
                {ongData.direccion}
              </p>
              <p>
                <i className="fas fa-phone me-2"></i>
                {ongData.telefono}
              </p>
              <p>
                <i className="fas fa-envelope me-2"></i>
                {ongData.email}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-chart-bar me-2"></i>Estadísticas
            </div>
            <div className="card-body text-center">
              <p className="fs-4 text-primary">{ongData.beneficiarios}</p>
              <p className="text-muted">Beneficiarios</p>
              <p className="fs-4 text-success">{ongData.proyectosActivos}</p>
              <p className="text-muted">Proyectos Activos</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-file-alt me-2"></i>Documentos
            </div>
            <div className="card-body">
              {documentos.map((doc, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                  <div>
                    <p className="mb-0 fw-bold small">{doc.nombre}</p>
                    <small className="text-muted">{doc.fecha}</small>
                  </div>
                  <span
                    className={`badge ${
                      doc.estado === "Validado"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}>
                    {doc.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">Acciones</div>
            <div className="card-body d-grid gap-2">
              <button className="btn btn-primary w-100">Validar ONG</button>
              <button className="btn btn-outline-secondary w-100">
                Solicitar Documentos
              </button>
              <button className="btn btn-outline-secondary w-100">
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
