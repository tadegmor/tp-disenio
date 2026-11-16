import type { CriteriosBusqueda, PreguntaDTO } from "../types";

const BASE_URL = "/api/preguntas";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** El backend responde errores como ProblemDetail (campo "detail"). */
async function leerError(res: Response): Promise<ApiError> {
  let detalle = "Ocurrió un error inesperado. Intente nuevamente.";
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") detalle = body.detail;
  } catch {
    /* la respuesta no tenía cuerpo JSON */
  }
  return new ApiError(detalle, res.status);
}

export async function buscarPreguntas(
  criterios: CriteriosBusqueda,
): Promise<PreguntaDTO[]> {
  const params = new URLSearchParams();
  Object.entries(criterios).forEach(([clave, valor]) => {
    const limpio = valor.trim();
    if (limpio) params.set(clave, limpio);
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

export async function eliminarPregunta(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw await leerError(res);
}
