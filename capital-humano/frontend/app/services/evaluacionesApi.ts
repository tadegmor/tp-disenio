import type {
  CandidatoDTO,
  CriteriosBusquedaCandidato,
  EvaluacionGeneradaDTO,
  EvaluarCandidatoRequestDTO,
  FinalizarEvaluacionRequestDTO,
  PuestoCompetenciasDTO,
  PuestoDTO,
  ResultadoEvaluacionDTO,
} from "../types/evaluacion";

// Ruta relativa: Next.js la reenvía al backend con los rewrites de next.config.ts (igual que preguntasApi.ts)
const API_BASE = "/api";
const EVALUACIONES_URL = `${API_BASE}/evaluaciones`;
const PUESTOS_URL = `${API_BASE}/puestos`;

export class ApiError extends Error {
  public readonly detalles: string[];

  constructor(
    message: string,
    public readonly status: number,
    detalles: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.detalles = detalles;
  }
}

/** El backend responde errores como ProblemDetail (campo "detail" y opcionalmente "detalles"). */
export async function leerError(res: Response): Promise<ApiError> {
  let detalle = "Ocurrió un error inesperado. Intente nuevamente.";
  let detalles: string[] = [];
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") detalle = body.detail;
    if (Array.isArray(body?.detalles)) {
      detalles = body.detalles.filter((item: unknown): item is string => typeof item === "string");
    }
  } catch {
    /* la respuesta no tenía cuerpo JSON */
  }
  return new ApiError(detalle, res.status, detalles);
}

export async function buscarCandidatos(
  criterios: CriteriosBusquedaCandidato,
): Promise<CandidatoDTO[]> {
  const params = new URLSearchParams();
  Object.entries(criterios).forEach(([clave, valor]) => {
    const limpio = valor.trim();
    if (limpio) params.set(clave, limpio);
  });

  const query = params.toString();
  const url = query ? `${EVALUACIONES_URL}/candidatos?${query}` : `${EVALUACIONES_URL}/candidatos`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function listarPuestos(): Promise<PuestoDTO[]> {
  const res = await fetch(PUESTOS_URL, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function obtenerCompetenciasPuesto(
  puestoId: number,
): Promise<PuestoCompetenciasDTO> {
  const res = await fetch(`${PUESTOS_URL}/${puestoId}/competencias`, {
    cache: "no-store",
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function verificarCuestionariosActivos(
  candidatoIds: number[],
): Promise<CandidatoDTO[]> {
  const res = await fetch(`${EVALUACIONES_URL}/verificar-activos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidatoIds),
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function prepararEvaluacion(
  payload: EvaluarCandidatoRequestDTO,
): Promise<ResultadoEvaluacionDTO[]> {
  const res = await fetch(`${EVALUACIONES_URL}/preparar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function finalizarEvaluacion(
  payload: FinalizarEvaluacionRequestDTO,
): Promise<EvaluacionGeneradaDTO> {
  const res = await fetch(EVALUACIONES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}