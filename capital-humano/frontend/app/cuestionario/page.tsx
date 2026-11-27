"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompletarCuestionario from "../components/CompletarCuestionario";
import RoleGuard from "../components/RoleGuard";
import { useSession } from "../context/SessionContext";
import { listarCuestionariosPorCandidato } from "../services/cuestionariosApi";
import type { CuestionarioDTO, EstadoCuestionario } from "../types/cuestionario";

const ESTADOS_PENDIENTES = new Set<EstadoCuestionario>(["ACTIVO", "EN_PROCESO"]);

function CuestionarioFlujoContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sesion } = useSession();

  const idDesdeQuery = searchParams.get("candidatoId")?.trim() ?? "";
  const idPorDefecto = idDesdeQuery || sesion?.candidatoId?.trim() || "";

  const [inputId, setInputId] = useState(idPorDefecto);
  const [cuestionarios, setCuestionarios] = useState<CuestionarioDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cuestionarioSeleccionadoId, setCuestionarioSeleccionadoId] = useState<number | null>(
    null,
  );
  // Al volver del CU026 se vuelve a consultar: el cuestionario pudo pasar a COMPLETO, INCOMPLETO o SIN_CONTESTAR
  const [recargas, setRecargas] = useState(0);

  useEffect(() => {
    setInputId(idPorDefecto);
    setCuestionarioSeleccionadoId(null);
  }, [idPorDefecto]);

  useEffect(() => {
    const limpio = idPorDefecto.trim();
    if (!limpio) {
      setCuestionarios([]);
      setError(null);
      return;
    }

    const candidatoNum = Number.parseInt(limpio, 10);
    if (!Number.isInteger(candidatoNum) || candidatoNum <= 0) {
      setCuestionarios([]);
      setError("El ID de candidato debe ser un número entero positivo.");
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    listarCuestionariosPorCandidato(candidatoNum)
      .then((data) => {
        if (!cancelado) setCuestionarios(data);
      })
      .catch((err: unknown) => {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los cuestionarios.");
          setCuestionarios([]);
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [idPorDefecto, recargas]);

  const pendientes = useMemo(() => {
    return cuestionarios.filter((c) => ESTADOS_PENDIENTES.has(c.estado));
  }, [cuestionarios]);

  const candidatoNombreCompleto = useMemo(() => {
    const primero = cuestionarios[0];
    if (!primero) return null;
    return `${primero.nombreCandidato} ${primero.apellidoCandidato}`.trim();
  }, [cuestionarios]);

  const volverAlListado = () => {
    setCuestionarioSeleccionadoId(null);
    setRecargas((n) => n + 1);
  };

  const aplicarCandidatoEnUrl = (valor: string) => {
    const limpio = valor.trim();
    setCuestionarioSeleccionadoId(null);
    if (limpio) {
      router.replace(`/cuestionario?candidatoId=${encodeURIComponent(limpio)}`);
    } else {
      router.replace("/cuestionario");
    }
  };

  if (cuestionarioSeleccionadoId !== null) {
    return (
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-4">
          <button
            type="button"
            onClick={volverAlListado}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Volver a cuestionarios pendientes
          </button>
        </div>
        <CompletarCuestionario cuestionarioId={cuestionarioSeleccionadoId} onSalir={volverAlListado} />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Portal de Candidato · Cuestionarios Pendientes
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Cuestionarios pendientes
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {idPorDefecto
              ? `Evaluaciones pendientes para ${
                  candidatoNombreCompleto ?? `el candidato ID "${idPorDefecto}"`
                }.`
              : "Ingresá un ID de candidato para consultar sus cuestionarios pendientes."}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            aplicarCandidatoEnUrl(inputId);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="ID candidato (ej. 101)"
            className="w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Buscar
          </button>
        </form>
      </div>

      {!idPorDefecto ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-800">No se especificó un ID de candidato</p>
        </div>
      ) : cargando ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Consultando cuestionarios en el servidor...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : pendientes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            No hay cuestionarios pendientes para el candidato ID &ldquo;{idPorDefecto}&rdquo;
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {pendientes.map((cuest) => (
            <article
              key={cuest.cuestionarioId}
              className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {cuest.estado}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    Cuestionario #{cuest.cuestionarioId}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {cuest.nombrePuesto}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCuestionarioSeleccionadoId(cuest.cuestionarioId)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Completar cuestionario
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default function CuestionarioPage() {
  const { listo } = useSession();
  if (!listo) return null;

  return (
    <RoleGuard allowedRoles={["CANDIDATO"]}>
      <Suspense fallback={<div className="p-8 text-sm text-slate-500">Cargando...</div>}>
        <CuestionarioFlujoContenido />
      </Suspense>
    </RoleGuard>
  );
}