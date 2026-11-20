"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

interface AvisoDialogProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  items?: string[];
  onAceptar: () => void;
}

/** Aviso modal con un único botón Aceptar (wireframes 025.6A.1 y 025.9A). Mismo marco que ConfirmDeleteDialog. */
export default function AvisoDialog({
  abierto,
  titulo,
  mensaje,
  items = [],
  onAceptar,
}: AvisoDialogProps) {
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
        aria-labelledby="titulo-aviso"
        aria-describedby="detalle-aviso"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 id="titulo-aviso" className="text-lg font-semibold text-slate-900">
          {titulo}
        </h3>
        <div id="detalle-aviso" className="mt-2 text-sm text-slate-600">
          <p>{mensaje}</p>
          {items.length > 0 && (
            <ul className="mt-2 list-disc pl-5 font-medium text-slate-900">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button ref={aceptarRef} onClick={onAceptar}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}