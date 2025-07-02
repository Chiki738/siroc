import { useOngs } from "../hooks/useOngs";
import { useRepresentantePorId } from "../hooks/useRepresentantePorId";

interface Ong {
  id: number;
  nombre: string;
  ruc: string;
  representanteId: string;
  sectorId: number;
  regionId: number;
  fechaRegistro: string;
}

function Validaciones() {
  const { ongs } = useOngs() as { ongs: Ong[] };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {ongs.map((ong) => (
          <OngCard key={ong.id} ong={ong} />
        ))}
      </div>
    </div>
  );
}

function OngCard({ ong }: { ong: Ong }) {
  const { representante, loading, error } = useRepresentantePorId(
    ong.representanteId
  );

  if (loading) return <p>Cargando representante...</p>;
  if (error) return <p>Error cargando representante</p>;

  return (
    <div className="col-lg-6">
      <div className="card mb-4 shadow-sm">
        {/* Validación RENIEC */}
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <i className="fas fa-shield-alt me-2"></i>Validación RENIEC
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <strong>Estado de Validación</strong>
            <span
              className={`badge ${
                representante?.verificadoReniec ? "bg-success" : "bg-warning"
              }`}>
              <i
                className={`fas ${
                  representante?.verificadoReniec
                    ? "fa-check-circle"
                    : "fa-exclamation-circle"
                } me-1`}></i>
              {representante?.verificadoReniec ? "Completado" : "Pendiente"}
            </span>
          </div>
          <hr />
          <p>
            <strong>Representante Legal:</strong>{" "}
            {representante
              ? `${representante.nombres} ${representante.apellidos}`
              : "N/D"}
          </p>
          <p>
            <strong>DNI:</strong> {representante ? representante.dni : "N/D"}
          </p>
          <p>
            <strong>Fecha de Validación:</strong> 2024-01-15 10:30
          </p>
          <p>
            <strong>Resultado:</strong>{" "}
            <span
              className={
                representante?.verificadoReniec
                  ? "text-success"
                  : "text-warning"
              }>
              {representante?.verificadoReniec ? "Válido" : "Pendiente"}
            </span>
          </p>
        </div>

        {/* Validación SUNAT */}
        <div className="card-header bg-success text-white d-flex align-items-center mt-4">
          <i className="fas fa-building me-2"></i>Validación SUNAT
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <strong>Estado de Validación</strong>
            <span
              className={`badge ${
                ong.ruc.length === 11 ? "bg-success" : "bg-primary"
              }`}>
              <i
                className={`fas ${
                  ong.ruc.length === 11
                    ? "fa-check-circle"
                    : "fa-spinner fa-spin"
                } me-1`}></i>
              {ong.ruc.length === 11 ? "Completado" : "En Proceso"}
            </span>
          </div>
          <hr />
          <p>
            <strong>RUC:</strong> {ong.ruc}
          </p>
          <p>
            <strong>Razón Social:</strong> {ong.nombre}
          </p>
          <p>
            <strong>Fecha de Validación:</strong> 2024-01-15 11:00
          </p>
          <p>
            <strong>Resultado:</strong>{" "}
            <span
              className={
                ong.ruc.length === 11 ? "text-success" : "text-primary"
              }>
              {ong.ruc.length === 11 ? "Válido" : "En proceso"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Validaciones;
