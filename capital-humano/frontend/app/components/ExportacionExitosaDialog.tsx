"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

interface ExportacionExitosaDialogProps {
  abierto: boolean;
  nombreArchivo: string;
  onAceptar: () => void;
}

/** CU025 paso 18: confirmación de exportación y retorno a la pantalla principal. */
export default function ExportacionExitosaDialog({
  abierto,
  nombreArchivo,
  onAceptar,
}: ExportacionExitosaDialogProps) {
  const aceptarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (abierto) aceptarRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-exportacion"
        aria-describedby="detalle-exportacion"
        className="w-full max-w-md rounded-2xl border-2 border-slate-800 bg-white p-6 text-center shadow-xl"
      >
        <h3
          id="titulo-exportacion"
          className="border-b border-slate-300 pb-3 text-lg font-medium text-slate-900"
        >
          Archivos exportados <span className="font-semibold text-emerald-700">correctamente</span>
        </h3>

        <div id="detalle-exportacion" className="mt-4 space-y-3 text-sm">
            <p className="font-medium text-slate-800">Nombre del archivo:</p>
            <p className="mt-0.5 font-mono text-xs text-slate-600 break-all">{nombreArchivo}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button ref={aceptarRef} onClick={onAceptar}>
            ACEPTAR
          </Button>
        </div>
      </div>
    </div>
  );
}
