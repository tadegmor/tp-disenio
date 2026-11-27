import type {
  BloqueCuestionarioDTO,
  CompletarBloqueRequestDTO,
  CuestionarioDTO,
} from "../types/cuestionario";
import { leerError } from "./evaluacionesApi";

// Ruta relativa: Next.js la reenvía al backend con los rewrites de next.config.ts (igual que evaluacionesApi.ts)
const CUESTIONARIOS_URL = "/api/cuestionario";


/** Lista los cuestionarios asociados a un candidato desde el backend. */
export async function listarCuestionariosPorCandidato(
  candidatoId: number,
): Promise<CuestionarioDTO[]> {
  const res = await fetch(`${CUESTIONARIOS_URL}?candidatoId=${encodeURIComponent(candidatoId)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** Paso 1: el backend verifica accesos y tiempos (1.A / 1.B) antes de devolver el estado. */
export async function consultarCuestionario(cuestionarioId: number): Promise<CuestionarioDTO> {
  const res = await fetch(`${CUESTIONARIOS_URL}/${cuestionarioId}`, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** Paso 1: las instrucciones se toman del repositorio de configuraciones del sistema. */
export async function obtenerInstrucciones(): Promise<string> {
  const res = await fetch(`${CUESTIONARIOS_URL}/instrucciones`, { cache: "no-store" });
  if (!res.ok) throw await leerError(res);
  return res.text();
}

/** Pasos 3-4 (ACTIVO: genera los bloques), 1.C y 8.A (EN_PROCESO: devuelve el bloque sin responder). */
export async function iniciarCuestionario(cuestionarioId: number): Promise<BloqueCuestionarioDTO> {
  const res = await fetch(`${CUESTIONARIOS_URL}/${cuestionarioId}/iniciar`, { method: "POST" });
  if (!res.ok) throw await leerError(res);
  return res.json();
}

/** Pasos 7-8: guarda el bloque contestado; si es el último el backend calcula los resultados. */
export async function completarCuestionario(
  cuestionarioId: number,
  bloqueId: number,
  payload: CompletarBloqueRequestDTO,
): Promise<void> {
  const res = await fetch(`${CUESTIONARIOS_URL}/${cuestionarioId}/bloques/${bloqueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await leerError(res);
}
