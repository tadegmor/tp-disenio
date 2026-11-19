"use client";

export interface Mensaje {
  tipo: "exito" | "error" | "info" | "advertencia";
  texto: string;
}

interface FeedbackProps {
  mensaje: Mensaje;
  onCerrar: () => void;
  detalles?: string[];
}

export default function Feedback({ mensaje, onCerrar, detalles = [] }: FeedbackProps) {
  const estilosPorTipo: Record<Mensaje["tipo"], string> = {
    exito: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-900",
    advertencia: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div
      role="alert"
      className={`mb-6 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${estilosPorTipo[mensaje.tipo]}`}
    >
      <div>
        <p>{mensaje.texto}</p>
        {detalles.length > 0 && (
          <ul className="mt-1 list-disc pl-5">
            {detalles.map((d) => <li key={d}>{d}</li>)}
          </ul>
        )}
      </div>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar mensaje"
        className="rounded px-1.5 py-0.5 text-xs font-semibold opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}