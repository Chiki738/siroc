import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, Clock, Eye, FileText, Pencil, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useActualizarValidacion } from "../hooks/useActualizarValidacion";
import { useOngs } from "../hooks/useOngs";
import { useValidaciones } from "../hooks/useValidaciones";
import type { Validacion } from "../hooks/useValidaciones";

interface Solicitud {
  id: number;
  ongId: number;
  nombreOng: string;
  ruc: string;
  fechaSolicitud: string;
  estado: string;
  responsable: string;
}

const estados = {
  pendiente: {
    label: "Pendiente",
    className: "bg-warning text-dark",
    icon: Clock,
  },
  validada: {
    label: "Validada",
    className: "bg-success",
    icon: CheckCircle,
  },
  validado: {
    label: "Validada",
    className: "bg-success",
    icon: CheckCircle,
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-danger",
    icon: XCircle,
  },
  rechazado: {
    label: "Rechazada",
    className: "bg-danger",
    icon: XCircle,
  },
} as const;

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
  const alertShownRef = useRef(false);

  const solicitudes: Solicitud[] = useMemo(
    () =>
      validaciones.map((validacion) => {
        const ong = ongs.find((item) => item.id === validacion.ongId);
        return {
          id: validacion.id,
          ongId: validacion.ongId,
          nombreOng: ong?.nombre || "Organización no identificada",
          ruc: ong?.ruc || "N/D",
          fechaSolicitud: new Date(
            validacion.fechaValidacion
          ).toLocaleDateString("es-PE"),
          estado: validacion.estadoValidacion.toLowerCase(),
          responsable: validacion.adminId
            ? `Administrador #${validacion.adminId}`
            : "Sin asignar",
        };
      }),
    [ongs, validaciones]
  );

  const totalPendientes = solicitudes.filter(
    (solicitud) => solicitud.estado === "pendiente"
  ).length;
  const totalValidadas = solicitudes.filter((solicitud) =>
    ["validada", "validado"].includes(solicitud.estado)
  ).length;
  const totalRechazadas = solicitudes.filter((solicitud) =>
    ["rechazada", "rechazado"].includes(solicitud.estado)
  ).length;

  useEffect(() => {
    if (!loadingOngs && !loadingVal && !alertShownRef.current) {
      Swal.fire({
        title: "Solicitudes pendientes",
        text:
          totalPendientes > 0
            ? `Tienes ${totalPendientes} solicitud(es) pendientes.`
            : "No hay solicitudes pendientes por revisar.",
        icon: totalPendientes > 0 ? "warning" : "success",
        timer: 4000,
        showConfirmButton: false,
      });

      alertShownRef.current = true;
    }
  }, [loadingOngs, loadingVal, totalPendientes]);

  if (loadingOngs || loadingVal) {
    return <p className="text-muted">Cargando solicitudes...</p>;
  }

  const handleUpdateEstado = async (
    nuevoEstado: "Validada" | "Rechazada" | "Pendiente"
  ) => {
    if (!selected) return;

    try {
      const adminId = Number.parseInt(localStorage.getItem("adminId") || "0");
      if (!adminId) {
        Swal.fire("Error", "Administrador no autenticado", "error");
        return;
      }

      await actualizar(selected.id, nuevoEstado);
      setShowModal(false);

      setValidaciones((prev: Validacion[]) =>
        prev.map((validacion: Validacion) =>
          validacion.id === selected.id
            ? {
                ...validacion,
                estadoValidacion: nuevoEstado,
                adminId,
              }
            : validacion
        )
      );
    } catch {
      Swal.fire("Error", "No se pudo actualizar el estado.", "error");
    }
  };

  const renderBadge = (estado: string) => {
    const status = estados[estado as keyof typeof estados];
    if (!status) return <span className="badge bg-secondary">{estado}</span>;

    const Icon = status.icon;
    return (
      <span className={`badge status-badge ${status.className}`}>
        <Icon size={14} aria-hidden="true" />
        {status.label}
      </span>
    );
  };

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="page-kicker">Bandeja operativa</p>
          <h1 className="page-title">Solicitudes de validación</h1>
          <p className="page-description">
            Revisa expedientes, consulta el detalle de cada organización y
            actualiza el estado de validación.
          </p>
        </div>
      </header>

      <div className="metric-grid">
        <article className="metric-card">
          <p className="metric-label">Pendientes</p>
          <p className="metric-value">{totalPendientes}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Validadas</p>
          <p className="metric-value">{totalValidadas}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Rechazadas</p>
          <p className="metric-value">{totalRechazadas}</p>
        </article>
      </div>

      <div className="card section-card">
        <div className="card-header d-flex align-items-center gap-2">
          <FileText size={18} className="text-primary" aria-hidden="true" />
          Expedientes recibidos
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Organización</th>
                  <th>RUC</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td>#{solicitud.id}</td>
                    <td className="fw-semibold">{solicitud.nombreOng}</td>
                    <td>{solicitud.ruc}</td>
                    <td>{solicitud.fechaSolicitud}</td>
                    <td>{renderBadge(solicitud.estado)}</td>
                    <td>{solicitud.responsable}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          to={`/admin/ong/${solicitud.ongId}`}
                          className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1">
                          <Eye size={16} aria-hidden="true" />
                          Ver
                        </Link>
                        <button
                          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => {
                            setSelected(solicitud);
                            setShowModal(true);
                          }}>
                          <Pencil size={16} aria-hidden="true" />
                          Cambiar estado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {solicitudes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No hay solicitudes registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selected && (
        <div className="modal d-block modal-backdrop-shell" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">
                  Cambiar estado de {selected.nombreOng}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <p className="text-muted">
                  Selecciona el nuevo estado para esta solicitud.
                </p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleUpdateEstado("Validada")}>
                    <CheckCircle size={18} aria-hidden="true" />
                    Validada
                  </button>
                  <button
                    className="btn btn-danger d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleUpdateEstado("Rechazada")}>
                    <XCircle size={18} aria-hidden="true" />
                    Rechazada
                  </button>
                  <button
                    className="btn btn-warning text-dark d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleUpdateEstado("Pendiente")}>
                    <Clock size={18} aria-hidden="true" />
                    Pendiente
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
    </section>
  );
}
