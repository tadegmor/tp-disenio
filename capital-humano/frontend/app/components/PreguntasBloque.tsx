import type { PreguntaCuestionarioDTO } from "../types/cuestionario";

const MSG_SIN_RESPONDER = "Seleccione una opción";

interface PreguntasBloqueProps {
  preguntas: PreguntaCuestionarioDTO[];
  respuestas: Record<number, number>;
  sinResponder: number[];
  deshabilitado: boolean;
  onResponder: (preguntaId: number, opcionId: number) => void;
}

/**
 * CU026 paso 5 (wireframes 026.4 y 026.5): un paso del wizard con su bloque de preguntas.
 * Todas las respuestas se eligen de las opciones de la pregunta, porque el puntaje (nota 3)
 * se calcula con la ponderación de la opción seleccionada.
 */
export default function PreguntasBloque({
  preguntas,
  respuestas,
  sinResponder,
  deshabilitado,
  onResponder,
}: PreguntasBloqueProps) {
  return (
    <div className="space-y-5">
      {preguntas.map((pregunta, indice) => {
        const id = pregunta.preguntaId;
        const falta = sinResponder.includes(id);

        return (
          <div key={id} className="grid gap-x-8 gap-y-3 sm:grid-cols-[3fr_2fr] sm:items-start">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">Pregunta {indice + 1}</p>
              <p
                id={`enunciado-${id}`}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
              >
                {pregunta.enunciado}
              </p>
            </div>

            <div>
              <label htmlFor={`respuesta-${id}`} className="mb-1.5 block text-xs font-medium text-slate-500">
                Respuesta
                {falta && (
                  <span aria-hidden="true" className="ml-1 text-red-600">
                    *
                  </span>
                )}
              </label>
              <select
                id={`respuesta-${id}`}
                value={respuestas[id] ?? ""}
                disabled={deshabilitado}
                onChange={(e) => onResponder(id, Number(e.target.value))}
                aria-invalid={falta}
                aria-describedby={falta ? `enunciado-${id} error-${id}` : `enunciado-${id}`}
                className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                  falta
                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              >
                <option value="" disabled>
                  Seleccionar respuesta
                </option>
                {pregunta.opciones.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
              {falta && (
                <p id={`error-${id}`} role="alert" className="mt-1 text-xs font-medium text-red-600">
                  {MSG_SIN_RESPONDER}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
