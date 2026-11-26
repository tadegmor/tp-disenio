export type TipoPregunta = "OPCION_MULTIPLE" | "VERDADERO_FALSO" | "ESCALA";

export interface CompetenciaDTO {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
}

export interface FactorDTO {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  nroOrden: number;
  competenciaId: number;
}

export interface ItemOpcionDTO {
  id: number;
  orden: number;
  descripcion: string;
  ponderacion: number | null;
}

export interface OpcionRespuestaDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  items: ItemOpcionDTO[];
}

/* Contrato unificado para CU020 y CU021 (coincide con PreguntaDTO de los diagramas). */
export interface PreguntaDTO {
  id?: number | null;
  factorId: number | null;
  factorNombre?: string;
  competenciaNombre?: string;
  nombre: string;
  enunciado: string;
  descripcion: string | null;
  tipo?: TipoPregunta | null;
  opcionRespuesta?: OpcionRespuestaDTO | null;
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