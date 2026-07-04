import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, FilePlus, FileText, UserRound } from "lucide-react";
import Swal from "sweetalert2";
import { useObtenerRegiones } from "../hooks/useObtenerRegiones";
import { useObtenerSectores } from "../hooks/useObtenerSectores";
import { useEnviarRepresentante } from "../hooks/useEnviarRepresentante";
import { useEnviarOng } from "../hooks/useEnviarOng";
import { useSubirAdjuntos } from "../hooks/useSubirAdjuntos";
import { useCrearValidacion } from "../hooks/useCrearValidacion";

const steps = [
  { label: "Representante", icon: UserRound },
  { label: "Datos de la ONG", icon: Building2 },
  { label: "Documentos", icon: FileText },
] as const;

function Registro() {
  const [step, setStep] = useState<number>(1);
  const [fileInputs, setFileInputs] = useState<{ file?: File }[]>([{}]);
  const navigate = useNavigate();
  const { subir } = useSubirAdjuntos();

  const formStep1Ref = useRef<HTMLFormElement>(null);
  const formStep2Ref = useRef<HTMLFormElement>(null);
  const formStep3Ref = useRef<HTMLFormElement>(null);

  const {
    regiones,
    loading: cargandoRegiones,
    error: errorRegiones,
  } = useObtenerRegiones();
  const {
    sectores,
    loading: cargandoSectores,
    error: errorSectores,
  } = useObtenerSectores();

  const { enviarRepresentante } = useEnviarRepresentante();
  const { enviarOng: enviarOngHook } = useEnviarOng();
  const { mutate: crearValidacion } = useCrearValidacion();

  const isFormFilled = (form: HTMLFormElement | null) => {
    if (!form) return false;
    const inputs = Array.from(form.elements) as HTMLInputElement[];
    return inputs.some((el) => el.value?.trim() !== "");
  };

  const handleNext = async () => {
    const currentForm =
      step === 1 ? formStep1Ref.current : formStep2Ref.current;
    const tieneDatos = isFormFilled(currentForm);

    if (tieneDatos && currentForm && !currentForm.checkValidity()) {
      currentForm.reportValidity();
      return;
    }

    if (step === 1 && tieneDatos && formStep1Ref.current) {
      const data = await enviarRepresentante(formStep1Ref.current);
      if (!data) return;
    }

    if (step === 2 && tieneDatos && formStep2Ref.current) {
      const ongData = await enviarOngHook(formStep2Ref.current);
      if (!ongData) return;

      const ruc = formStep2Ref.current.ruc?.value;
      if (ruc) {
        crearValidacion(ruc);
      }
    }

    setStep((prev) => prev + 1);
  };

  return (
    <main className="app-main">
      <div className="registration-shell">
        <header className="page-header">
          <div>
            <p className="page-kicker">Alta institucional</p>
            <h1 className="page-title">Registrar organización civil</h1>
            <p className="page-description">
              Completa los datos del representante, registra la información
              legal de la organización y adjunta la documentación requerida.
            </p>
          </div>
        </header>

        <ol className="step-list">
          {steps.map(({ label, icon: Icon }, index) => (
            <li
              className={`step-item ${step === index + 1 ? "active" : ""}`}
              key={label}>
              <span className="step-number">{index + 1}</span>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form ref={formStep1Ref} className="form-panel">
            <h2 className="h4 mb-1">Datos del representante legal</h2>
            <p className="field-hint mb-4">
              Registra la identidad de la persona responsable ante la
              organización.
            </p>
            <div className="row">
              {[
                ["DNI", "dni", "text", "\\d{8}", "Debe tener 8 dígitos"],
                ["Nombres", "nombres", "text", ".+", "Campo requerido"],
                ["Apellidos", "apellidos", "text", ".+", "Campo requerido"],
                ["Fecha de nacimiento", "fechaNacimiento", "date", "", ""],
              ].map(([label, name, type, pattern, title]) => (
                <div className="col-md-6 mb-3" key={name}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    name={name}
                    required
                    pattern={pattern}
                    title={title}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={handleNext}>
              Siguiente
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => setStep(2)}>
              Omitir
            </button>
          </form>
        )}

        {step === 2 && (
          <form ref={formStep2Ref} className="form-panel">
            <h2 className="h4 mb-1">Información legal de la organización</h2>
            <p className="field-hint mb-4">
              Estos datos serán contrastados con la información disponible en
              SUNAT.
            </p>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  required
                  pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{1,100}$"
                  title="Solo letras y espacios."
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">RUC</label>
                <input
                  type="text"
                  className="form-control"
                  name="ruc"
                  required
                  pattern="\d{11}"
                  title="Debe tener 11 dígitos."
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Sector</label>
                {cargandoSectores ? (
                  <div className="field-hint">Cargando sectores...</div>
                ) : errorSectores ? (
                  <div className="text-danger">Error al cargar sectores</div>
                ) : (
                  <select className="form-select" name="sector_id" required>
                    <option value="">Seleccione un sector</option>
                    {sectores.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.nombre.replace(/\s\(\d+\)/, "")}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  DNI del representante
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="representante_id"
                  required
                  pattern="\d{8}"
                  title="Debe contener 8 dígitos."
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Región</label>
                {cargandoRegiones ? (
                  <div className="field-hint">Cargando regiones...</div>
                ) : errorRegiones ? (
                  <div className="text-danger">Error al cargar regiones</div>
                ) : (
                  <select className="form-select" name="region_id" required>
                    <option value="">Seleccione una región</option>
                    {regiones.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Fecha de registro
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_registro"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={handleNext}>
              Siguiente
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => setStep(3)}>
              Omitir
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            className="form-panel"
            ref={formStep3Ref}
            onSubmit={async (e) => {
              e.preventDefault();
              if (!formStep3Ref.current?.checkValidity()) {
                formStep3Ref.current?.reportValidity();
                return;
              }

              const rucInput = formStep3Ref.current?.ruc?.value;
              if (!rucInput) {
                Swal.fire("Error", "Debe ingresar el RUC", "error");
                return;
              }

              const archivos = fileInputs
                .map((item) => item.file)
                .filter((file): file is File => !!file);

              try {
                for (const file of archivos) {
                  await subir(file, "Documento PDF", rucInput);
                }

                Swal.fire({
                  title: "Registro completado",
                  text: "La organización y sus documentos fueron registrados correctamente.",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                }).then(() => navigate("/"));
              } catch {
                Swal.fire("Error", "No se pudo subir los documentos.", "error");
              }
            }}>
            <h2 className="h4 mb-1">Documentos de sustento</h2>
            <p className="field-hint mb-4">
              Adjunta los documentos PDF que respaldan el registro de la
              organización.
            </p>

            <div className="mb-3">
              <label className="form-label fw-semibold">RUC de la ONG</label>
              <input
                type="text"
                name="ruc"
                className="form-control"
                required
                pattern="\d{11}"
                title="Debe contener 11 dígitos"
              />
            </div>

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
                    setFileInputs((prev) =>
                      prev.map((item, i) =>
                        i === index ? { file: e.target.files?.[0] } : item
                      )
                    )
                  }
                />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mb-3 d-inline-flex align-items-center gap-2"
              onClick={() => setFileInputs([...fileInputs, {}])}>
              <FilePlus size={16} aria-hidden="true" />
              Agregar otro archivo
            </button>
            <br />
            <button
              type="submit"
              className="btn btn-success d-inline-flex align-items-center gap-2">
              Finalizar registro
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Registro;
