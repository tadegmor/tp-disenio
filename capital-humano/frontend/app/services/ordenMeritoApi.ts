import type {
  EvaluacionOpcion,
  OrdenMeritoDTO,
  PuestoDTO,
} from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let mensaje = `Error HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) mensaje = data.message;
      else if (data?.error) mensaje = data.error;
    } catch {
      const text = await res.text();
      if (text) mensaje = text;
    }
    throw new Error(mensaje);
  }
  return res.json() as Promise<T>;
}

export async function buscarPuestosOrdenMerito(filtros: {
  codigo?: string;
  nombre?: string;
  empresa?: string;
}): Promise<PuestoDTO[]> {
  const params = new URLSearchParams();
  if (filtros.codigo?.trim()) params.set("codigo", filtros.codigo.trim());
  if (filtros.nombre?.trim()) params.set("nombre", filtros.nombre.trim());
  if (filtros.empresa?.trim()) params.set("empresa", filtros.empresa.trim());

  const res = await fetch(`${API_BASE}/informes/puestos?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<PuestoDTO[]>(res);
}

export async function listarEvaluacionesPorPuesto(
  puestoId: number
): Promise<EvaluacionOpcion[]> {
  const res = await fetch(`${API_BASE}/informes/puestos/${puestoId}/evaluaciones`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<EvaluacionOpcion[]>(res);
}

function construirParamsEmision(
  puestoId: number,
  evaluacionIds: number[]
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("puestoId", String(puestoId));
  evaluacionIds.forEach((id) => params.append("evaluacionIds", String(id)));
  return params;
}

export async function emitirOrdenMerito(
  puestoId: number,
  evaluacionIds: number[]
): Promise<OrdenMeritoDTO[]> {
  const params = construirParamsEmision(puestoId, evaluacionIds);
  const res = await fetch(`${API_BASE}/informes/orden-merito?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<OrdenMeritoDTO[]>(res);
}

export async function registrarImpresionOrdenMerito(
  puestoId: number,
  evaluacionIds: number[]
): Promise<{ mensaje: string }> {
  const params = construirParamsEmision(puestoId, evaluacionIds);
  const res = await fetch(
    `${API_BASE}/informes/orden-merito/imprimir?${params.toString()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  return handleResponse<{ mensaje: string }>(res);
}