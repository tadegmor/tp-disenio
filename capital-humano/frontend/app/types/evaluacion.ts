export interface CandidatoDTO {
  id: number;
  apellido: string;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroCandidato: string;
}

export interface PuestoDTO {
  id: number;
  nombre: string;
  empresa: string;
  competencias: CompetenciaDTO[];
}

export interface CompetenciaDTO {
  id: number;
  nombre: string;
  ponderacion: number;
  factores: FactorDTO[];
}

export interface FactorDTO {
  id: number;
  nombre: string;
  evaluable: boolean;
}

export interface CuestionarioDTO {
  id: number;
  candidato: CandidatoDTO;
  claveIngreso: string;
}