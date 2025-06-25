function Historial() {
  return (
    <div className="">
      <h1 className="mb-2">Historial de Validaciones</h1>
      <p className="text-muted">
        Registro completo de todas las validaciones realizadas
      </p>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-filter me-2"></i>Filtros de Búsqueda
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Buscar ONG</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre o RUC"
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Tipo de Validación</label>
              <select className="form-select">
                <option selected>Todos los tipos</option>
                <option>Completa</option>
                <option>RENIEC</option>
                <option>SUNAT</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Resultado</label>
              <select className="form-select">
                <option selected>Todos los resultados</option>
                <option>Aprobado</option>
                <option>Rechazado</option>
                <option>Pendiente</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary me-2 w-100">
                <i className="fas fa-search me-2"></i>Filtrar
              </button>
              <button className="btn btn-outline-secondary">
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row text-center mb-4">
        {[
          { color: "success", label: "Aprobadas", value: 12 },
          { color: "danger", label: "Rechazadas", value: 3 },
          { color: "warning", label: "Pendientes", value: 5 },
          { color: "primary", label: "Total", value: 20 },
        ].map((stat, i) => (
          <div key={i} className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h2 className={`text-${stat.color}`}>{stat.value}</h2>
                <p className="text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="card-header">
          <i className="fas fa-history me-2"></i>Historial Completo
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <i className="fas fa-calendar-alt me-2"></i>Fecha
                  </th>
                  <th>
                    <i className="fas fa-building me-2"></i>ONG
                  </th>
                  <th>RUC</th>
                  <th>Tipo</th>
                  <th>Resultado</th>
                  <th>
                    <i className="fas fa-user me-2"></i>Responsable
                  </th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Datos mockeados */}
                <tr>
                  <td>2024-01-15 14:30</td>
                  <td>Fundación Esperanza</td>
                  <td>20123456789</td>
                  <td>
                    <span className="badge bg-info text-dark">Completa</span>
                  </td>
                  <td>
                    <span className="badge bg-success">Aprobado</span>
                  </td>
                  <td>María García</td>
                  <td>Validación exitosa en RENIEC y SUNAT</td>
                </tr>
                <tr>
                  <td>2024-01-14 16:45</td>
                  <td>Asociación Ayuda Social</td>
                  <td>20987654321</td>
                  <td>
                    <span className="badge bg-secondary">RENIEC</span>
                  </td>
                  <td>
                    <span className="badge bg-success">Aprobado</span>
                  </td>
                  <td>Juan Pérez</td>
                  <td>Documentos de identidad verificados</td>
                </tr>
                <tr>
                  <td>2024-01-14 10:15</td>
                  <td>ONG Desarrollo Comunitario</td>
                  <td>20456789123</td>
                  <td>
                    <span className="badge bg-warning text-dark">SUNAT</span>
                  </td>
                  <td>
                    <span className="badge bg-danger">Rechazado</span>
                  </td>
                  <td>Ana López</td>
                  <td>RUC inactivo en SUNAT</td>
                </tr>
                <tr>
                  <td>2024-01-13 09:20</td>
                  <td>Centro de Apoyo Familiar</td>
                  <td>20789123456</td>
                  <td>
                    <span className="badge bg-info text-dark">Completa</span>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      Pendiente
                    </span>
                  </td>
                  <td>Carlos Ruiz</td>
                  <td>Esperando respuesta de RENIEC</td>
                </tr>
                <tr>
                  <td>2024-01-12 11:30</td>
                  <td>Fundación Educativa</td>
                  <td>20321654987</td>
                  <td>
                    <span className="badge bg-secondary">RENIEC</span>
                  </td>
                  <td>
                    <span className="badge bg-success">Aprobado</span>
                  </td>
                  <td>Laura Mendoza</td>
                  <td>Representante legal verificado</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">Mostrando 1-5 de 20 registros</small>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item">
                  <a className="page-link" href="#">
                    Anterior
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    Siguiente
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historial;
