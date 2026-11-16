"use client";

import { useEffect, useRef } from "react";
import type { PreguntaDTO } from "../types";
import Button from "./Button";

interface ConfirmDeleteDialogProps {
  pregunta: PreguntaDTO | null;
  eliminando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** CU023 paso 2: confirmación con los botones ELIMINAR / CANCELAR. */
export default function ConfirmDeleteDialog({
  pregunta,
  eliminando,
  onConfirmar,
  onCancelar,
}: ConfirmDeleteDialogProps) {
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pregunta) return;
    cancelarRef.current?.focus();
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !eliminando) onCancelar();
    };
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [pregunta, eliminando, onCancelar]);

  if (!pregunta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-baja"
        aria-describedby="detalle-baja"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 id="titulo-baja" className="text-lg font-semibold text-slate-900">
          Eliminar pregunta
        </h3>
        <p id="detalle-baja" className="mt-2 text-sm text-slate-600">
          Los datos de la pregunta{" "}
          <span className="font-medium text-slate-900">{pregunta.nombre}</span> serán eliminados del
          sistema.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelarRef} variant="secondary" onClick={onCancelar} disabled={eliminando}>
            CANCELAR
          </Button>
          <Button variant="danger" onClick={onConfirmar} disabled={eliminando}>
            {eliminando ? "ELIMINANDO…" : "ELIMINAR"}
          </Button>
        </div>
      </div>
    </div>
  );
}
