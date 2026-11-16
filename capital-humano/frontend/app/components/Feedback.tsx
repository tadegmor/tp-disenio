import type { Mensaje, TipoMensaje } from "../types";

const ESTILOS: Record<TipoMensaje, string> = {
  exito: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

interface FeedbackProps {
  mensaje: Mensaje;
  onCerrar: () => void;
}

export default function Feedback({ mensaje, onCerrar }: FeedbackProps) {
  return (
    <div
      role={mensaje.tipo === "error" ? "alert" : "status"}
      className={`mb-6 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${ESTILOS[mensaje.tipo]}`}
    >
      <p>{mensaje.texto}</p>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar mensaje"
        className="-mr-1 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}
