/** Mismos valores que el enum EstadoCuestionario del backend. */
export type EstadoCuestionario =
  | "ACTIVO"
  | "SIN_CONTESTAR"
  | "EN_PROCESO"
  | "INCOMPLETO"
  | "COMPLETO";

/** Respuesta de consultarCuestionario (paso 1): el estado ya viene verificado (1.A / 1.B). */
export interface CuestionarioDTO {
  cuestionarioId: number;
  estado: EstadoCuestionario;
  apellidoCandidato: string;
  nombreCandidato: string;
  nombrePuesto: string;
}

/** Sin ponderación: el candidato no debe conocer el puntaje de cada opción. */
export interface OpcionRespuestaDTO {
  id: number;
  nombre: string;
}

export interface PreguntaCuestionarioDTO {
  preguntaId: number;
  enunciado: string;
  opciones: OpcionRespuestaDTO[];
}

/** Paso del wizard que devuelve iniciarCuestionario (pasos 4, 1.C y 8.A). */
export interface BloqueCuestionarioDTO {
  bloqueId: number;
  numero: number;
  cantidadBloques: number;
  preguntas: PreguntaCuestionarioDTO[];
}

export interface RespuestaDTO {
  preguntaId: number;
  opcionRespuestaId: number;
}

export interface CompletarBloqueRequestDTO {
  respuestas: RespuestaDTO[];
}
