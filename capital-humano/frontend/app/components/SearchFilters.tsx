import type { FormEvent } from "react";
import type { CriteriosBusqueda } from "../types";
import Button from "./Button";

const CAMPOS: {
  name: keyof CriteriosBusqueda;
  label: string;
  placeholder: string;
}[] = [
  { name: "competencia", label: "Competencia", placeholder: "Ej: Lealtad" },
  { name: "factor", label: "Factor", placeholder: "Ej: Compromiso" },
  { name: "nombre", label: "Nombre de pregunta", placeholder: "Ej: Logro de objetivos" },
];

interface SearchFiltersProps {
  criterios: CriteriosBusqueda;
  puedeBuscar: boolean;
  cargando: boolean;
  onCambio: (campo: keyof CriteriosBusqueda, valor: string) => void;
  onBuscar: () => void;
}

export default function SearchFilters({
  criterios,
  puedeBuscar,
  cargando,
  onCambio,
  onBuscar,
}: SearchFiltersProps) {
  function manejarSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onBuscar();
  }

  return (
    <form onSubmit={manejarSubmit} className="mx-auto w-full max-w-sm space-y-5" noValidate>
      {CAMPOS.map(({ name, label, placeholder }) => (
        <div key={name}>
          <label htmlFor={`filtro-${name}`} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
          <input
            id={`filtro-${name}`}
            name={name}
            type="text"
            maxLength={30}
            autoComplete="off"
            value={criterios[name]}
            placeholder={placeholder}
            onChange={(e) => onCambio(name, e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      ))}

      <p className="text-xs text-slate-500">
        Ingrese al menos un criterio. La búsqueda trae las preguntas que contengan el texto indicado.
      </p>

      <div className="flex justify-center pt-1">
        <Button type="submit" disabled={cargando} className="min-w-32">
          {cargando ? "Buscando…" : "Buscar"}
        </Button>
      </div>
    </form>
  );
}
