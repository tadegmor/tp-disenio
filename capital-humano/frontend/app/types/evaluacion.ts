export interface CriteriosBusquedaCandidato {
  apellido: string;
  nombre: string;
  numeroCandidato: string;
}

export interface CandidatoDTO {
  id: number;
  apellido: string;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroCandidato: string;
  estadoCuestionario: string | null;
}

export interface PuestoDTO {
  id: number;
  codigo: string;
  nombre: string;
  empresa: string;
}

export interface CompetenciaRequeridaDTO {
  competenciaId: number;
  nombre: string;
  ponderacion: number;
  evaluable: boolean;
}

export interface PuestoCompetenciasDTO {
  puestoId: number;
  codigo: string;
  nombre: string;
  empresa: string;
  competencias: CompetenciaRequeridaDTO[];
  competenciasNoEvaluables: string[];
  evaluable: boolean;
}

export interface EvaluarCandidatoRequestDTO {
  puestoId: number;
  candidatoIds: number[];
}

export interface ResultadoEvaluacionDTO {
  cuestionarioId: number | null;
  candidatoId: number;
  apellidoCandidato: string;
  nombreCandidato: string;
  numeroCandidato: string;
  tipoDocumento: string;
  numeroDocumento: string;
  claveIngreso: string;
}

export interface CandidatoClaveDTO {
  candidatoId: number;
  claveIngreso: string;
}

export interface FinalizarEvaluacionRequestDTO {
  puestoId: number;
  candidatos: CandidatoClaveDTO[];
}

export interface EvaluacionGeneradaDTO {
  evaluacionId: number;
  puestoId: number;
  nombrePuesto: string;
  empresa: string;
  fechaCreacion: string;
  nombreArchivo: string;
  candidatos: ResultadoEvaluacionDTO[];
}