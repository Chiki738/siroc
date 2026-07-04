const DEFAULT_API_BASE_URL = "https://hexagonal-63ip.onrender.com/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE_URL;

export const UPLOADCARE_PUBLIC_KEY =
  import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY ?? "1cecbfdc229099b90529";

export const API_ENDPOINTS = {
  adjuntos: `${API_BASE_URL}/adjuntos`,
  auth: `${API_BASE_URL}/auth`,
  ongs: `${API_BASE_URL}/ongs`,
  regiones: `${API_BASE_URL}/regiones`,
  reniec: `${API_BASE_URL}/reniec`,
  representantes: `${API_BASE_URL}/representantes`,
  sectores: `${API_BASE_URL}/sectores`,
  sunat: `${API_BASE_URL}/sunat`,
  validaciones: `${API_BASE_URL}/validaciones`,
} as const;
