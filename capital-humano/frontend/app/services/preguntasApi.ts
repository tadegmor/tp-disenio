import type {
  CompetenciaDTO,
  CriteriosBusqueda,
  FactorDTO,
  OpcionRespuestaDTO,
  PreguntaDTO,
} from "../types";

const PREGUNTAS_URL = "/api/preguntas";
const COMPETENCIAS_URL = "/api/competencias";
const OPCIONES_URL = "/api/opciones-respuesta";

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

async function leerError(res: Response): Promise<ApiError> {
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

// ============================================================================
// CU020 - Gestionar Preguntas
// ============================================================================

export async function buscarPreguntas(
  criterios: CriteriosBusqueda,
): Promise<PreguntaDTO[]> {
  const params = new URLSearchParams();
  Object.entries(criterios).forEach(([clave, valor]) => {
    const limpio = valor.trim();
    if (limpio) params.set(clave, limpio);
  });

  const res = await fetch(`${PREGUNTAS_URL}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function eliminarPregunta(id: number): Promise<void> {
  const res = await fetch(`${PREGUNTAS_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw await leerError(res);
}

// ============================================================================
// CU021 - Dar de Alta Pregunta
// ============================================================================

/** GestorCompetencia.listarTodas() */
export async function listarCompetencias(): Promise<CompetenciaDTO[]> {
  const res = await fetch(COMPETENCIAS_URL, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** GestorOpciones.listarActivas() — devuelve cada opción con sus ítems incluidos */
export async function listarOpcionesActivas(): Promise<OpcionRespuestaDTO[]> {
  const res = await fetch(`${OPCIONES_URL}/activas`, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** GestorFactor.buscarPorCompetencia(competenciaId) */
export async function buscarFactoresPorCompetencia(
  competenciaId: number,
): Promise<FactorDTO[]> {
  const res = await fetch(`${COMPETENCIAS_URL}/${competenciaId}/factores`, {
    cache: "no-store",
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** GestorPregunta.generarPreguntaConIA(competenciaId, factorId) */
export async function generarPreguntaConIA(
  competenciaId: number,
  factorId: number,
): Promise<PreguntaDTO> {
  const res = await fetch(`${PREGUNTAS_URL}/generar-ia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ competenciaId, factorId }),
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** GestorPregunta.darAlta(dto) */
export async function darAltaPregunta(dto: PreguntaDTO): Promise<PreguntaDTO> {
  const res = await fetch(PREGUNTAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}