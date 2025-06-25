import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Solicitud {
  id: number;
  nombreOng: string;
  ruc: string;
  fechaSolicitud: string;
  estado: "pendiente" | "validado" | "rechazado";
  responsable: string;
}

export default function ListaSolicitudes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(
    null
  );

  const solicitudes: Solicitud[] = [
    {
      id: 1,
      nombreOng: "Fundación Esperanza",
      ruc: "20123456789",
      fechaSolicitud: "2024-01-15",
      estado: "pendiente",
      responsable: "María García",
    },
    {
      id: 2,
      nombreOng: "Asociación Ayuda Social",
      ruc: "20987654321",
      fechaSolicitud: "2024-01-14",
      estado: "validado",
      responsable: "Juan Pérez",
    },
    {
      id: 3,
      nombreOng: "ONG Desarrollo Comunitario",
      ruc: "20456789123",
      fechaSolicitud: "2024-01-13",
      estado: "rechazado",
      responsable: "Ana López",
    },
  ];

  const getEstadoBadge = (estado: Solicitud["estado"]) => {
    switch (estado) {
      case "pendiente":
        return (
          <span className="badge bg-warning text-dark">
            <i className="fas fa-clock me-1"></i>Pendiente
          </span>
        );
      case "validado":
        return (
          <span className="badge bg-success">
            <i className="fas fa-check-circle me-1"></i>Validado
          </span>
        );
      case "rechazado":
        return (
          <span className="badge bg-danger">
            <i className="fas fa-times-circle me-1"></i>Rechazado
          </span>
        );
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Lista de Solicitudes</h1>
          <p className="text-muted">
            Gestiona las solicitudes de validación de ONGs
          </p>
        </div>
        <a href="/admin/detalle-ong/nuevo" className="btn btn-primary">
          <i className="fas fa-plus me-1"></i>Nueva Solicitud
        </a>
      </div>

      <div className="card">
        <div className="card-header fw-bold">
          <i className="fas fa-file-alt me-2 text-primary"></i>Solicitudes de
          Validación
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre ONG</th>
                  <th>RUC</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td>{s.nombreOng}</td>
                    <td>{s.ruc}</td>
                    <td>{s.fechaSolicitud}</td>
                    <td>{getEstadoBadge(s.estado)}</td>
                    <td>{s.responsable}</td>
                    <td>
                      <a
                        href={`/admin/detalle-ong/${s.id}`}
                        className="btn btn-outline-secondary btn-sm me-2">
                        <i className="fas fa-eye me-1"></i>Ver
                      </a>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setSelectedSolicitud(s);
                          setShowModal(true);
                        }}>
                        <i className="fas fa-pen me-1"></i>Cambiar Estado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedSolicitud && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Cambiar Estado - {selectedSolicitud.nombreOng}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Selecciona el nuevo estado para esta solicitud:</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-success">
                    <i className="fas fa-check-circle me-2"></i>Aprobar
                  </button>
                  <button className="btn btn-danger">
                    <i className="fas fa-times-circle me-2"></i>Rechazar
                  </button>
                  <button className="btn btn-warning text-dark">
                    <i className="fas fa-clock me-2"></i>Marcar como Pendiente
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
