import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Registro() {
  const [step, setStep] = useState<number>(1);
  const [fileInputs, setFileInputs] = useState<{ file?: File }[]>([{}]);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formRef.current && formRef.current.checkValidity()) {
      Swal.fire({
        title: "¡Registro completado!",
        text: "Los documentos fueron subidos correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } else {
      formRef.current?.reportValidity();
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newInputs = [...fileInputs];
    newInputs[index] = { file: file ?? undefined };
    setFileInputs(newInputs);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">REGISTRO DE ONG</h2>

      <ul className="nav nav-pills mb-4 justify-content-center">
        <li className="nav-item">
          <span className={`nav-link ${step === 1 ? "active" : ""}`}>
            PASO 1: DATOS ONG
          </span>
        </li>
        <li className="nav-item">
          <span className={`nav-link ${step === 2 ? "active" : ""}`}>
            PASO 2: REPRESENTANTE
          </span>
        </li>
        <li className="nav-item">
          <span className={`nav-link ${step === 3 ? "active" : ""}`}>
            PASO 3: DOCUMENTOS
          </span>
        </li>
      </ul>

      <form ref={formRef}>
        {step === 1 && (
          <>
            <h4 className="mb-3">1. INFORMACIÓN DE LA ONG</h4>
            <div className="row">
              {[
                ["Razón Social", "razonSocial"],
                ["Tipo de Documento", "tipoDocumento"],
                ["Número de Documento", "numeroDocumento"],
                ["Estado", "estado"],
                ["Condición", "condicion"],
                ["Dirección", "direccion"],
                ["Ubigeo", "ubigeo"],
                ["Tipo de Calle", "viaTipo"],
                ["Nombre de Calle", "viaNombre"],
                ["Número", "numero"],
                ["Interior", "interior"],
                ["Distrito", "distrito"],
                ["Provincia", "provincia"],
                ["Departamento", "departamento"],
              ].map(([label, name]) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type="text"
                    className="form-control"
                    name={name}
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="mb-3">2. DATOS DEL REPRESENTANTE LEGAL</h4>
            <div className="row">
              {[
                ["Tipo de Documento", "tipoDocumentoRepresentante"],
                ["Número de Documento", "numeroDocumentoRepresentante"],
                ["Nombres", "nombres"],
                ["Apellido Paterno", "apellidoPaterno"],
                ["Apellido Materno", "apellidoMaterno"],
                ["Cargo", "cargo"],
                ["Fecha Desde", "fechaDesde"],
              ].map(([label, name]) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={name === "fechaDesde" ? "date" : "text"}
                    className="form-control"
                    name={name}
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handlePrev}>
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h4 className="mb-3">3. SUBIR DOCUMENTOS RELEVANTES</h4>
            <p className="text-muted">
              Adjunta los documentos en formato PDF. Puedes agregar más si lo
              necesitas.
            </p>

            {fileInputs.map((_, index) => (
              <div className="mb-3" key={index}>
                <label className="form-label fw-semibold">
                  Archivo PDF {index + 1}
                </label>
                <input
                  type="file"
                  className="form-control"
                  name={`archivo-${index}`}
                  accept=".pdf"
                  required
                  onChange={(e) =>
                    handleFileChange(index, e.target.files?.[0] ?? null)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mb-4"
              onClick={() => setFileInputs([...fileInputs, {}])}>
              + Agregar otro archivo
            </button>
            <br />
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handlePrev}>
              Atrás
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={handleFinish}>
              Finalizar Registro
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Registro;
