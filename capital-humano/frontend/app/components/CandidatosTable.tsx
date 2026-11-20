import type { CandidatoDTO } from "../types/evaluacion";

interface CandidatosTableProps {
  candidatos: CandidatoDTO[];
  seleccionadosIds: number[];
  onAlternar: (id: number) => void;
}

/** Grilla de candidatos con selección múltiple. Mismo estilo que ResultsTable (CU020). */
export default function CandidatosTable({
  candidatos,
  seleccionadosIds,
  onAlternar,
}: CandidatosTableProps) {
  if (candidatos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No se encontraron candidatos</p>
        <p className="mt-1 text-sm text-slate-500">
          Ningún candidato coincide con los criterios ingresados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs text-slate-500">
        {candidatos.length} {candidatos.length === 1 ? "resultado" : "resultados"} · marque los
        candidatos que desea evaluar
      </p>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="max-h-80 overflow-auto">
          <table aria-label="Resultados de la búsqueda de candidatos" className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="w-14 px-4 py-3 font-semibold">Sel.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Apellido</th>
                <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
                <th scope="col" className="px-4 py-3 font-semibold">Número de candidato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidatos.map((c) => {
                const activo = seleccionadosIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onAlternar(c.id)}
                    className={`cursor-pointer transition-colors ${
                      activo ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={activo}
                        onChange={() => onAlternar(c.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Seleccionar ${c.apellido} ${c.nombre}`}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{c.apellido}</td>
                    <td className="px-4 py-3">{c.nombre}</td>
                    <td className="px-4 py-3">{c.numeroCandidato}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}