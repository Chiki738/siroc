export const subirAdjunto = async (
  file: File,
  descripcion: string,
  ruc: string
) => {
  // 1. Subir a Uploadcare
  const formDataUploadcare = new FormData();
  formDataUploadcare.append("UPLOADCARE_PUB_KEY", "1cecbfdc229099b90529");
  formDataUploadcare.append("UPLOADCARE_STORE", "1");
  formDataUploadcare.append("file", file);

  const uploadcareRes = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formDataUploadcare,
  });

  if (!uploadcareRes.ok) {
    throw new Error("Error al subir el archivo a Uploadcare");
  }

  const uploadcareData = await uploadcareRes.json();
  const urlArchivo = `https://ucarecdn.com/${uploadcareData.file}/`;

  // 2. Enviar al backend
  const jsonBody = {
    descripcion,
    urlArchivo,
    ruc,
  };

  const backendRes = await fetch("http://localhost:8080/api/adjuntos/crear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });

  if (!backendRes.ok) {
    throw new Error("Error al registrar el adjunto en el backend");
  }

  return await backendRes.json();
};

export interface Adjunto {
  id: number;
  ongId: number;
  urlArchivo: string;
  descripcion: string;
}

export const obtenerAdjuntosPorOng = async (
  ongId: number
): Promise<Adjunto[]> => {
  const res = await fetch(`http://localhost:8080/api/adjuntos/ong/${ongId}`);
  if (!res.ok) {
    throw new Error("Error al obtener adjuntos de la ONG");
  }
  return await res.json();
};
