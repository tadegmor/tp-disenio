"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface EstadoCuestionarioDialogProps {
  titulo: string;
  mensaje: ReactNode;
  estado: string;
  claseEstado: string;
  /** Botón Aceptar del pie. */
  children: ReactNode;
}

/** Aviso con el estado final del cuestionario (wireframes 026.1A, 026.1B y 026.8). Mismo marco que AvisoDialog. */
export default function EstadoCuestionarioDialog({
  titulo,
  mensaje,
  estado,
  claseEstado,
  children,
}: EstadoCuestionarioDialogProps) {
  const pieRef = useRef<HTMLDivElement>(null);

  // Se monta solo cuando hay un aviso: enfoca el primer botón para que <Enter> lo active
  useEffect(() => {
    pieRef.current?.querySelector("button")?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-estado-cuestionario"
        aria-describedby="detalle-estado-cuestionario"
        className="w-full max-w-md rounded-xl bg-white text-center shadow-xl"
      >
        <div className="px-6 pt-6 pb-5">
          <h3 id="titulo-estado-cuestionario" className="text-lg font-semibold text-slate-900">
            {titulo}
          </h3>
          <div id="detalle-estado-cuestionario" className="mt-2 text-sm text-slate-600">
            <p>{mensaje}</p>
            <p className="mt-5 text-base text-slate-800">
              Estado: <span className={`font-semibold ${claseEstado}`}>{estado}</span>
            </p>
          </div>
        </div>

        <div ref={pieRef} className="flex justify-center gap-3 border-t border-slate-100 px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
