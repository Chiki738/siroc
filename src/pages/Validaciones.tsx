function Validaciones() {
  return (
    <div className="">
      <h1 className="mb-2">Validaciones RENIEC y SUNAT</h1>
      <p className="text-muted">
        Verificación automática de datos con entidades oficiales
      </p>

      {/* Formulario de búsqueda */}
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-search me-2"></i>Buscar ONG para Validar
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="ruc" className="form-label">
                RUC
              </label>
              <input
                type="text"
                id="ruc"
                className="form-control"
                placeholder="20123456789"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="nombre" className="form-label">
                Nombre de la ONG
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                placeholder="Fundación Esperanza"
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100">
                <i className="fas fa-search me-2"></i>Buscar y Validar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Validación RENIEC */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <i className="fas fa-shield-alt text-primary me-2"></i>Validación
              RENIEC
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>
                  <strong>Estado de Validación</strong>
                </span>
                <span className="badge bg-success">
                  <i className="fas fa-check-circle me-1"></i>Completado
                </span>
              </div>
              <hr />
              <p>
                <strong>Representante Legal:</strong> María García Rodríguez
              </p>
              <p>
                <strong>DNI:</strong> 12345678
              </p>
              <p>
                <strong>Fecha de Validación:</strong> 2024-01-15 10:30
              </p>
              <p>
                <strong>Resultado:</strong>{" "}
                <span className="text-success">Válido</span>
              </p>
              <button className="btn btn-outline-secondary w-100 mt-3">
                Ver Detalles Completos
              </button>
            </div>
          </div>
        </div>

        {/* Validación SUNAT */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <i className="fas fa-building text-success me-2"></i>Validación
              SUNAT
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>
                  <strong>Estado de Validación</strong>
                </span>
                <span className="badge bg-primary">
                  <i className="fas fa-spinner fa-spin me-1"></i>En Proceso
                </span>
              </div>
              <hr />
              <p>
                <strong>RUC:</strong> 20123456789
              </p>
              <p>
                <strong>Razón Social:</strong> Fundación Esperanza
              </p>
              <p>
                <strong>Fecha de Validación:</strong> 2024-01-15 11:00
              </p>
              <p>
                <strong>Resultado:</strong>{" "}
                <span className="text-primary">En proceso</span>
              </p>
              <button className="btn btn-outline-secondary w-100 mt-3">
                Ver Detalles Completos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="card mt-5">
        <div className="card-header">Resumen de Validación</div>
        <div className="card-body">
          <p className="text-muted">
            Estado general del proceso de validación para Fundación Esperanza
          </p>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="border p-3 rounded">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p className="mb-0">RENIEC</p>
                <small className="text-muted">Validado</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-3 rounded">
                <i className="fas fa-spinner fa-spin fa-2x text-primary mb-2"></i>
                <p className="mb-0">SUNAT</p>
                <small className="text-muted">En Proceso</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-3 rounded">
                <i className="fas fa-exclamation-circle fa-2x text-warning mb-2"></i>
                <p className="mb-0">Estado General</p>
                <small className="text-muted">Pendiente</small>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-success btn-lg">
              Finalizar Validación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Validaciones;
