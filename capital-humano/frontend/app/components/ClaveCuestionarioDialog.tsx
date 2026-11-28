"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { emitirAlertaSonora } from "../services/alertaSonora";
import { validarClaveCuestionario } from "../services/cuestionariosApi";
import { ApiError } from "../services/evaluacionesApi";
import Button from "./Button";

interface ClaveCuestionarioDialogProps {
  cuestionarioId: number;
  nombrePuesto: string;
  onValidada: () => void;
  onCancelar: () => void;
}

/**
 * CU001 3.A: antes de completar el cuestionario el candidato ingresa la clave que recibió con la
 * evaluación (Excel del CU025). La clave se ve con asteriscos y la valida el backend.
 */
export default function ClaveCuestionarioDialog({
  cuestionarioId,
  nombrePuesto,
  onValidada,
  onCancelar,
}: ClaveCuestionarioDialogProps) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validando, setValidando] = useState(false);
  const claveRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    claveRef.current?.focus();
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !validando) onCancelar();
    };
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [validando, onCancelar]);

  async function manejarSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setValidando(true);
    try {
      await validarClaveCuestionario(cuestionarioId, clave);
      onValidada();
    } catch (err: unknown) {
      // 3.A.2.2 a 3.A.2.5: mensaje de error, alerta sonora y se blanquea el campo
      setError(err instanceof ApiError ? err.message : "No se pudo validar la clave. Intente nuevamente.");
      emitirAlertaSonora();
      setClave("");
      claveRef.current?.focus();
    } finally {
      setValidando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-clave"
        onSubmit={manejarSubmit}
        noValidate
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 id="titulo-clave" className="text-lg font-semibold text-slate-900">
          Clave de ingreso
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Cuestionario <span className="font-medium text-slate-900">{nombrePuesto}</span>
        </p>

        <label htmlFor="clave-cuestionario" className="mt-5 mb-1.5 block text-sm font-medium text-slate-700">
          Clave <span className="text-red-600">*</span>
        </label>
        <input
          id="clave-cuestionario"
          ref={claveRef}
          type="password"
          maxLength={8}
          autoComplete="off"
          value={clave}
          onChange={(e) => {
            setClave(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
            if (error) setError(null);
          }}
          aria-invalid={error !== null}
          aria-describedby={error ? "error-clave" : "ayuda-clave"}
          className={`block w-full rounded-lg border bg-white px-3 py-2 font-mono text-sm tracking-widest text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
        />
        {error ? (
          <p id="error-clave" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {error}
          </p>
        ) : (
          <p id="ayuda-clave" className="mt-1.5 text-xs text-slate-500">
            Es la clave de 8 caracteres que recibió junto con la evaluación.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancelar} disabled={validando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={validando || clave.length === 0}>
            {validando ? "Verificando…" : "Aceptar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
