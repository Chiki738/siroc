import { Building2, CheckCircle, Clock, ShieldCheck, XCircle } from "lucide-react";
import { useOngs } from "../hooks/useOngs";
import { useRepresentantePorId } from "../hooks/useRepresentantePorId";
import type { Ong } from "../types/Ong";

function Validaciones() {
  const { ongs, loading, error } = useOngs();

  if (loading) return <p className="text-muted">Cargando validaciones...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="page-kicker">Control cruzado</p>
          <h1 className="page-title">Validaciones RENIEC y SUNAT</h1>
          <p className="page-description">
            Visualiza el estado técnico de cada organización y de su
            representante legal.
          </p>
        </div>
      </header>

      <div className="row g-4">
        {ongs.map((ong: Ong) => (
          <OngCard key={ong.id} ong={ong} />
        ))}
        {ongs.length === 0 && (
          <div className="col-12">
            <div className="section-card p-4 text-center text-muted">
              No hay organizaciones registradas para validar.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function OngCard({ ong }: { ong: Ong }) {
  const { representante, loading, error } = useRepresentantePorId(
    ong.representanteId
  );
  const rucCompleto = ong.ruc.length === 11;

  if (loading) {
    return (
      <div className="col-lg-6">
        <div className="section-card p-4 text-muted">
          Cargando representante de {ong.nombre}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-lg-6">
        <div className="section-card p-4 text-danger">
          No se pudo cargar el representante de {ong.nombre}.
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-6">
      <article className="card section-card h-100">
        <div className="card-header d-flex align-items-center gap-2">
          <ShieldCheck size={18} className="text-primary" aria-hidden="true" />
          Validación de {ong.nombre}
        </div>
        <div className="card-body">
          <ValidationBlock
            title="RENIEC"
            icon={ShieldCheck}
            completed={Boolean(representante?.verificadoReniec)}
            statusLabel={
              representante?.verificadoReniec ? "Completada" : "Pendiente"
            }
            rows={[
              [
                "Representante legal",
                representante
                  ? `${representante.nombres} ${representante.apellidos}`
                  : "No disponible",
              ],
              ["DNI", representante?.dni ?? "No disponible"],
              [
                "Resultado",
                representante?.verificadoReniec ? "Válido" : "Pendiente",
              ],
            ]}
          />

          <hr className="my-4" />

          <ValidationBlock
            title="SUNAT"
            icon={Building2}
            completed={rucCompleto}
            statusLabel={rucCompleto ? "Completada" : "En proceso"}
            rows={[
              ["RUC", ong.ruc],
              ["Razón social", ong.nombre],
              ["Resultado", rucCompleto ? "Válido" : "En proceso"],
            ]}
          />
        </div>
      </article>
    </div>
  );
}

function ValidationBlock({
  title,
  icon: Icon,
  completed,
  statusLabel,
  rows,
}: {
  title: string;
  icon: typeof ShieldCheck;
  completed: boolean;
  statusLabel: string;
  rows: [string, string][];
}) {
  const StatusIcon = completed ? CheckCircle : Clock;

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h6 mb-0 d-flex align-items-center gap-2">
          <Icon size={18} aria-hidden="true" />
          {title}
        </h2>
        <span
          className={`badge status-badge ${
            completed ? "bg-success" : "bg-warning text-dark"
          }`}>
          <StatusIcon size={14} aria-hidden="true" />
          {statusLabel}
        </span>
      </div>
      <dl className="row mb-0">
        {rows.map(([label, value]) => (
          <div className="col-sm-6 mb-3" key={label}>
            <dt className="text-muted small">{label}</dt>
            <dd className="mb-0 fw-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {!completed && (
        <p className="mb-0 text-muted d-flex align-items-center gap-2">
          <XCircle size={16} aria-hidden="true" />
          Requiere revisión administrativa.
        </p>
      )}
    </section>
  );
}

export default Validaciones;
