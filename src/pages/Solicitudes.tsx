// src/pages/Solicitudes.tsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useOngs } from "../hooks/useOngs";
import { useValidaciones } from "../hooks/useValidaciones";
import type { Validacion } from "../hooks/useValidaciones";
import { useActualizarValidacion } from "../hooks/useActualizarValidacion";
import { Link } from "react-router-dom"; // 👈 Asegúrate de importar esto arriba

interface Solicitud {
  id: number;
  nombreOng: string;
  ruc: string;
  fechaSolicitud: string;
  estado: string;
  responsable: string;
}

export default function Solicitudes() {
  const { ongs, loading: loadingOngs } = useOngs();
  const {
    validaciones,
    loading: loadingVal,
    setValidaciones,
  } = useValidaciones();
  const { actualizar } = useActualizarValidacion();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (!loadingOngs && !loadingVal && !alertShown) {
      const pendientes = validaciones.filter(
        (v) => v.estadoValidacion.toLowerCase() === "pendiente"
      ).length;

      Swal.fire({
        title: "Solicitudes pendientes",
        text: `Tienes ${pendientes} solicitud(es) pendientes.`,
        icon: pendientes > 0 ? "warning" : "success",
        timer: 4000,
        showConfirmButton: false,
      });

      setAlertShown(true);
    }
  }, [loadingOngs, loadingVal, alertShown, validaciones]);

  if (loadingOngs || loadingVal) return <p>Cargando solicitudes...</p>;

  const solicitudes: Solicitud[] = validaciones.map((v) => {
    const ong = ongs.find((o) => o.id === v.ongId);
    return {
      id: v.id,
      nombreOng: ong?.nombre || "Desconocido",
      ruc: ong?.ruc || "N/A",
      fechaSolicitud: new Date(v.fechaValidacion).toLocaleDateString(),
      estado: v.estadoValidacion.toLowerCase(),
      responsable: v.adminId ? `Admin #${v.adminId}` : "No asignado",
    };
  });

  const handleUpdateEstado = async (
    nuevoEstado: "Validada" | "Rechazada" | "Pendiente"
  ) => {
    if (!selected) return;
    try {
      const adminId = parseInt(localStorage.getItem("adminId") || "0");
      if (!adminId) {
        Swal.fire("Error", "Admin no autenticado", "error");
        return;
      }

      await actualizar(selected.id, nuevoEstado);

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La solicitud fue marcada como ${nuevoEstado}`,
        timer: 3000,
        showConfirmButton: false,
      });

      setShowModal(false);

      // ✅ Actualizar estado y responsable localmente
      setValidaciones((prev: Validacion[]) =>
        prev.map((v: Validacion) =>
          v.id === selected.id
            ? {
                ...v,
                estadoValidacion: nuevoEstado,
                adminId: adminId,
              }
            : v
        )
      );
    } catch {
      Swal.fire("Error", "No se pudo actualizar el estado.", "error");
    }
  };

  const getBadge = (e: string) => {
    switch (e) {
      case "pendiente":
        return (
          <span className="badge bg-warning text-dark">
            <i className="fas fa-clock me-1" />
            Pendiente
          </span>
        );
      case "validada":
      case "validado":
        return (
          <span className="badge bg-success">
            <i className="fas fa-check-circle me-1" />
            Validado
          </span>
        );
      case "rechazada":
      case "rechazado":
        return (
          <span className="badge bg-danger">
            <i className="fas fa-times-circle me-1" />
            Rechazado
          </span>
        );
      default:
        return <span className="badge bg-secondary">{e}</span>;
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Lista de Solicitudes</h1>
          <p className="text-muted">Gestiona las solicitudes de validación</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header fw-bold">
          <i className="fas fa-file-alt me-2 text-primary" />
          Solicitudes de Validación
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
                    <td>{getBadge(s.estado)}</td>
                    <td>{s.responsable}</td>
                    <td>
                      <Link
                        to={`/admin/ong/${s.id}`} // 👈 Esta es la ruta correcta definida en App.tsx
                        className="btn btn-outline-secondary btn-sm me-2">
                        <i className="fas fa-eye me-1" />
                        Ver
                      </Link>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setSelected(s);
                          setShowModal(true);
                        }}>
                        <i className="fas fa-pen me-1" />
                        Cambiar Estado
                      </button>
                    </td>
                  </tr>
                ))}
                {solicitudes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No hay solicitudes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selected && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Cambiar Estado - {selected.nombreOng}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Selecciona el nuevo estado:</p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpdateEstado("Validada")}>
                    <i className="fas fa-check-circle me-2" /> Validada
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleUpdateEstado("Rechazada")}>
                    <i className="fas fa-times-circle me-2" /> Rechazada
                  </button>
                  <button
                    className="btn btn-warning text-dark"
                    onClick={() => handleUpdateEstado("Pendiente")}>
                    <i className="fas fa-clock me-2" /> Pendiente
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
