import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useObtenerRegiones } from "../hooks/useObtenerRegiones";
import { useObtenerSectores } from "../hooks/useObtenerSectores";
import { useEnviarRepresentante } from "../hooks/useEnviarRepresentante";
import { useEnviarOng } from "../hooks/useEnviarOng";
import { useSubirAdjuntos } from "../hooks/useSubirAdjuntos";
import { useCrearValidacion } from "../hooks/useCrearValidacion";

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

      // ✅ Obtener RUC del formulario
      const ruc = formStep2Ref.current.ruc?.value;
      if (ruc) {
        crearValidacion(ruc);
      }
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">REGISTRO DE ONG</h2>

      <ul className="nav nav-pills mb-4 justify-content-center">
        {["REPRESENTANTE", "DATOS ONG", "DOCUMENTOS"].map((label, i) => (
          <li className="nav-item" key={i}>
            <span className={`nav-link ${step === i + 1 ? "active" : ""}`}>
              PASO {i + 1}: {label}
            </span>
          </li>
        ))}
      </ul>

      {/* Paso 1 */}
      {step === 1 && (
        <form ref={formStep1Ref}>
          <h4 className="mb-3">1. DATOS DEL REPRESENTANTE</h4>
          <div className="row">
            {[
              ["DNI", "dni", "text", "\\d{8}", "Debe tener 8 dígitos"],
              ["Nombres", "nombres", "text", ".+", "Campo requerido"],
              ["Apellidos", "apellidos", "text", ".+", "Campo requerido"],
              ["Fecha de Nacimiento", "fechaNacimiento", "date", "", ""],
            ].map(([label, name, type, pattern, title]) => (
              <div className="col-md-6 mb-3" key={name}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type={type as string}
                  className="form-control"
                  name={name}
                  required
                  pattern={pattern as string}
                  title={title}
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
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={() => setStep(2)}>
            Omitir
          </button>
        </form>
      )}

      {/* Paso 2 */}
      {step === 2 && (
        <form ref={formStep2Ref}>
          <h4 className="mb-3">2. INFORMACIÓN DE LA ONG</h4>
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
                <div>Cargando sectores...</div>
              ) : errorSectores ? (
                <div>Error al cargar sectores</div>
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
                DNI Representante
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
                <div>Cargando regiones...</div>
              ) : errorRegiones ? (
                <div>Error al cargar regiones</div>
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
                Fecha de Registro
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
            className="btn btn-primary"
            onClick={handleNext}>
            Siguiente
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={() => setStep(3)}>
            Omitir
          </button>
        </form>
      )}

      {/* Paso 3 */}
      {step === 3 && (
        <form
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
                title: "¡Registro completado!",
                text: "La ONG y los documentos fueron registrados correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
              }).then(() => navigate("/"));
            } catch {
              Swal.fire("Error", "No se pudo subir los documentos.", "error");
            }
          }}>
          <h4 className="mb-3">3. SUBIR DOCUMENTOS</h4>
          <p className="text-muted">Adjunta documentos en PDF.</p>

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
            className="btn btn-outline-primary btn-sm mb-3"
            onClick={() => setFileInputs([...fileInputs, {}])}>
            + Agregar otro archivo
          </button>
          <br />
          <button type="submit" className="btn btn-success">
            Finalizar Registro
          </button>
        </form>
      )}
    </div>
  );
}

export default Registro;
