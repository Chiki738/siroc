import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";

import { useOngPorId } from "../hooks/useObtenerOngPorId";
import { useRepresentantePorId } from "../hooks/useRepresentantePorId";
import { useValidacionesPorOngId } from "../hooks/useValidacionesPorOngId";
import { useRegionPorId } from "../hooks/useRegionPorId";
import { useSectorPorId } from "../hooks/useSectorPorId";
import { useSunatPorRuc } from "../hooks/useSunatPorRuc";
import { useAdjuntosPorOng } from "../hooks/useAdjuntosPorOng";

import { useActualizarValidacion } from "../hooks/useActualizarValidacion";
import type { Validacion } from "../types/validacion";

function compararTexto(a = "", b = "") {
  return (
    a
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") ===
    b
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  );
}

export default function DetalleOng() {
  const { id } = useParams();

  const { ong, loading, error } = useOngPorId(id || "");
  const { representante, loading: loadingRep } = useRepresentantePorId(
    ong?.representanteId || ""
  );
  const { validaciones: validacionesOriginales, loading: loadingValidaciones } =
    useValidacionesPorOngId(ong?.id || "");
  const { region, loading: loadingRegion } = useRegionPorId(
    ong?.regionId || ""
  );
  const { sector, loading: loadingSector } = useSectorPorId(
    ong?.sectorId || ""
  );
  const { sunatData, loading: loadingSunat } = useSunatPorRuc(ong?.ruc || "");
  const { adjuntos: documentos, loading: loadingDocumentos } =
    useAdjuntosPorOng(ong?.id || "");

  const [validaciones, setValidaciones] = useState<Validacion[]>(
    validacionesOriginales
  );

  useEffect(() => {
    setValidaciones(validacionesOriginales);
  }, [validacionesOriginales]);

  const { actualizar } = useActualizarValidacion();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Validacion | null>(null);

  useEffect(() => {
    if (sunatData === null && ong?.ruc) {
      Swal.fire({
        icon: "error",
        title: "Empresa no existente",
        text: "El RUC ingresado no se encuentra registrado en SUNAT.",
      });
    }
  }, [sunatData, ong?.ruc]);

  if (
    loading ||
    loadingRep ||
    loadingValidaciones ||
    loadingRegion ||
    loadingSector ||
    loadingSunat ||
    loadingDocumentos
  )
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  if (!ong || error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <XCircle size={64} className="text-danger mb-3" />
          <p className="fs-5 text-muted">Error al cargar la ONG</p>
        </div>
      </div>
    );

  const estadoFinal =
    validaciones.length > 0
      ? validaciones[validaciones.length - 1].estadoValidacion
      : "Pendiente";

  const estadoClase =
    estadoFinal === "Validada"
      ? "bg-success"
      : estadoFinal === "Rechazada"
      ? "bg-danger"
      : "bg-warning text-dark";

  const verificarDato = (valorLocal: string, valorSunat?: string) => {
    if (!sunatData || !valorSunat)
      return <span className="text-danger">❌</span>;
    return compararTexto(valorLocal, valorSunat) ? (
      <span className="text-success">✅</span>
    ) : (
      <span className="text-danger">❌</span>
    );
  };

  const handleUpdateEstado = async (
    nuevoEstado: "Validada" | "Rechazada" | "Pendiente"
  ) => {
    if (!selected) return;

    // Confirmación antes de actualizar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await actualizar(selected.id, nuevoEstado);
      if (success) {
        setShowModal(false);
        setValidaciones((prev) => {
          if (prev.length === 0) return prev;
          const nuevos = [...prev];
          nuevos[nuevos.length - 1] = {
            ...nuevos[nuevos.length - 1],
            estadoValidacion: nuevoEstado,
          };
          return nuevos;
        });
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `El estado se cambió a ${nuevoEstado}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el estado",
        });
      }
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="mb-4">
          <h1 className="display-5 fw-bold text-dark mb-2">Detalle de ONG</h1>
          <p className="text-muted">Información completa de la organización</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Información General */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <div className="d-flex align-items-center">
                  <Building size={20} className="text-muted me-2" />
                  <h5 className="card-title mb-0">Información General</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      Nombre de la ONG:
                    </label>
                    <div className="d-flex align-items-center">
                      <p className="mb-0 me-2">{ong.nombre}</p>
                      {verificarDato(ong.nombre, sunatData?.razonSocial)}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      RUC:
                    </label>
                    <p className="mb-0">{ong.ruc}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      Estado:
                    </label>
                    <div>
                      <span
                        className={`badge ${estadoClase} d-inline-flex align-items-center`}>
                        <CheckCircle size={16} className="me-1" />
                        {estadoFinal}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      Fecha de Constitución:
                    </label>
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="text-muted me-2" />
                      <p className="mb-0">
                        {new Date(ong.fechaRegistro).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      Región:
                    </label>
                    <div className="d-flex align-items-center">
                      <p className="mb-0 me-2">{region}</p>
                      {verificarDato(region, sunatData?.departamento)}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-muted">
                      Sector:
                    </label>
                    <div className="d-flex align-items-center">
                      <p className="mb-0 me-2">{sector}</p>
                      {verificarDato(sector, sunatData?.actividadEconomica)}
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div>
                  <h5 className="fw-semibold mb-3">Representante Legal:</h5>
                  {representante ? (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-muted">
                            Nombre:
                          </label>
                          <p className="mb-0">
                            {representante.nombres} {representante.apellidos}
                          </p>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-muted">
                            DNI:
                          </label>
                          <p className="mb-0">{representante.dni}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-muted">
                            Fecha de Nacimiento:
                          </label>
                          <p className="mb-0">
                            {new Date(
                              representante.fechaNacimiento
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-muted">
                            Verificado RENIEC:
                          </label>
                          <p className="mb-0">
                            {representante.verificadoReniec ? "Sí" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <div className="d-flex align-items-center">
                  <FileText size={20} className="text-muted me-2" />
                  <h5 className="card-title mb-0">Documentos</h5>
                </div>
              </div>
              <div className="card-body">
                {documentos.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="list-group-item d-flex justify-content-between align-items-center border rounded mb-2 p-3">
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-semibold">{doc.descripcion}</p>
                        </div>
                        <a
                          href={doc.urlArchivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm d-flex align-items-center">
                          <ExternalLink size={16} className="me-1" />
                          Ver documento
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <FileText size={48} className="text-muted mb-3" />
                    <p className="text-muted">Sin archivos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Información de Contacto</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <MapPin size={20} className="text-muted me-3" />
                  <p className="mb-0">
                    {sunatData?.direccion || "No encontrado"}
                  </p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Phone size={20} className="text-muted me-3" />
                  <p className="mb-0">No encontrado</p>
                </div>
                <div className="d-flex align-items-center">
                  <Mail size={20} className="text-muted me-3" />
                  <p className="mb-0">No encontrado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Acciones</h5>
              </div>
              <div className="card-body">
                <button
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={() => {
                    if (validaciones.length > 0) {
                      setSelected(validaciones[validaciones.length - 1]);
                      setShowModal(true);
                    } else {
                      Swal.fire({
                        icon: "warning",
                        title: "Sin validaciones",
                        text: "No hay validaciones para cambiar estado",
                      });
                    }
                  }}>
                  <Edit size={16} className="me-2" />
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Estado - {ong?.nombre}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Selecciona el nuevo estado:</p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center"
                    onClick={() => handleUpdateEstado("Validada")}>
                    <CheckCircle size={20} className="me-2" />
                    Validada
                  </button>
                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={() => handleUpdateEstado("Rechazada")}>
                    <XCircle size={20} className="me-2" />
                    Rechazada
                  </button>
                  <button
                    className="btn btn-warning d-flex align-items-center justify-content-center"
                    onClick={() => handleUpdateEstado("Pendiente")}>
                    <Clock size={20} className="me-2" />
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
    </div>
  );
}
