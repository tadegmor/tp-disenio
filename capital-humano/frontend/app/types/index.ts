export type TipoPregunta = "OPCION_MULTIPLE" | "VERDADERO_FALSO" | "ESCALA";

/** Contrato del backend: GET /api/preguntas (PreguntaDTO de Spring Boot). */
export interface PreguntaDTO {
  id: number;
  factorId: number;
  factorNombre: string;
  competenciaNombre: string;
  nombre: string;
  enunciado: string;
  descripcion: string | null;
  tipo: TipoPregunta;
  opcionRespuestaId: number;
}

export interface CriteriosBusqueda {
  competencia: string;
  factor: string;
  nombre: string;
}

export const CRITERIOS_VACIOS: CriteriosBusqueda = {
  competencia: "",
  factor: "",
  nombre: "",
};

export type TipoMensaje = "exito" | "error" | "info";

export interface Mensaje {
  tipo: TipoMensaje;
  texto: string;
}
