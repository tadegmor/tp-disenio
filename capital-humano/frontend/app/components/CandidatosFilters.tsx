import type { FormEvent } from "react";
import type { CriteriosBusquedaCandidato } from "../types/evaluacion";
import Button from "./Button";

const CAMPOS: {
  name: keyof CriteriosBusquedaCandidato;
  label: string;
  placeholder: string;
  maxLength: number;
  soloDigitos?: boolean;
}[] = [
  { name: "apellido", label: "Apellido", placeholder: "Ej: RODRIGUEZ", maxLength: 30 },
  { name: "nombre", label: "Nombre", placeholder: "Ej: CLAUDIO", maxLength: 30 },
  { name: "numeroCandidato", label: "Número de candidato", placeholder: "Ej: 010", maxLength: 20, soloDigitos: true },
];

interface CandidatosFiltersProps {
  filtros: CriteriosBusquedaCandidato;
  cargando: boolean;
  onCambio: (campo: keyof CriteriosBusquedaCandidato, valor: string) => void;
  onBuscar: () => void;
}

/** CU025 paso 2 (wireframe 025.2): datos en MAYÚSCULAS y número de candidato solo con dígitos. */
export default function CandidatosFilters({
  filtros,
  cargando,
  onCambio,
  onBuscar,
}: CandidatosFiltersProps) {
  function manejarSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onBuscar();
  }

  return (
    <form onSubmit={manejarSubmit} className="mx-auto w-full max-w-sm space-y-5" noValidate>
      {CAMPOS.map(({ name, label, placeholder, maxLength, soloDigitos }) => (
        <div key={name}>
          <label htmlFor={`filtro-${name}`} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
          <input
            id={`filtro-${name}`}
            name={name}
            type="text"
            inputMode={soloDigitos ? "numeric" : undefined}
            maxLength={maxLength}
            autoComplete="off"
            value={filtros[name]}
            placeholder={placeholder}
            onChange={(e) =>
              onCambio(name, soloDigitos ? e.target.value.replace(/\D/g, "") : e.target.value.toUpperCase())
            }
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      ))}

      <p className="text-xs text-slate-500">
        Puede dejar los filtros vacíos para ver todos los candidatos. La búsqueda trae los que contengan el texto indicado.
      </p>

      <div className="flex justify-center pt-1">
        <Button type="submit" disabled={cargando} className="min-w-32">
          {cargando ? "Buscando…" : "Buscar"}
        </Button>
      </div>
    </form>
  );
}