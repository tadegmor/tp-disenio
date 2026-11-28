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

export type RolUsuario = "CONSULTOR" | "CANDIDATO";

export interface SesionMiniLogin {
  rol: RolUsuario;
  nombre: string;
  /** Número de candidato con el que ingresó (no es el id de la base). */
  numeroCandidato?: string;
}

export type EstadoCuestionario =
  | "PENDIENTE"
  | "COMPLETADO"
  | "ACTIVO"
  | "SIN_CONTESTAR"
  | "EN_PROCESO"
  | "INCOMPLETO"
  | "COMPLETO";

export interface CuestionarioPendiente {
  id: string;
  candidatoId: string;
  titulo: string;
  puesto: string;
  estado: EstadoCuestionario;
  fechaAsignacion: string;
}

// =====================================================================
// CU028 - Emitir Orden de Mérito
// =====================================================================

export interface PuestoDTO {
  id: number;
  codigo: string;
  nombre: string;
  empresa: string;
  cantidadCandidatos: number;
  evaluacionesCompletas: number;
}

export interface EvaluacionOpcion {
  id: number;
  fechaCreacion: string;
  cantidadCuestionarios: number;
}

export interface CandidatoDTO {
  id: number;
  apellido: string;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroCandidato: string;
  estadoCuestionario?: string | null;
}

export interface CuestionarioDTO {
  estado: EstadoCuestionario;
  fechaInicio: string | null;
  fechaFin: string | null;
  ultimoIngreso: string | null;
  cantidadAccesos: number;
}

export interface OrdenMeritoDTO {
  candidato: CandidatoDTO;
  cuestionario: CuestionarioDTO;
  puntajeObtenido: number | null;
  cumplePonderacionesMinimas: boolean;
}