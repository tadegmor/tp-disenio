import type { PreguntaDTO } from "../types";

interface ResultsTableProps {
  preguntas: PreguntaDTO[];
  seleccionadaId: number | null;
  onSeleccionar: (id: number) => void;
}

export default function ResultsTable({
  preguntas,
  seleccionadaId,
  onSeleccionar,
}: ResultsTableProps) {
  if (preguntas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No se encontraron preguntas</p>
        <p className="mt-1 text-sm text-slate-500">
          Ninguna pregunta coincide con los criterios ingresados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs text-slate-500">
        {preguntas.length} {preguntas.length === 1 ? "resultado" : "resultados"} · seleccione una
        pregunta para modificarla o eliminarla
      </p>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="max-h-80 overflow-y-auto">
          <table
            role="grid"
            aria-label="Resultados de la búsqueda de preguntas"
            className="w-full table-fixed text-left text-sm"
          >
            <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="w-1/4 px-4 py-3 font-semibold">Competencia</th>
                <th scope="col" className="w-1/4 px-4 py-3 font-semibold">Factor</th>
                <th scope="col" className="w-1/2 px-4 py-3 font-semibold">Nombre de pregunta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {preguntas.map((p) => {
                const activa = p.id === seleccionadaId;
                return (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    aria-selected={activa}
                    onClick={() => onSeleccionar(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSeleccionar(p.id);
                      }
                    }}
                    className={`cursor-pointer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                      activa ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <td className="truncate px-4 py-3" title={p.competenciaNombre}>{p.competenciaNombre}</td>
                    <td className="truncate px-4 py-3" title={p.factorNombre}>{p.factorNombre}</td>
                    <td className="truncate px-4 py-3 font-medium" title={p.nombre}>{p.nombre}</td>
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
