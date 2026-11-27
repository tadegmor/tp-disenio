"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleGuard from "@/app/components/RoleGuard";
import { useSession } from "@/app/context/SessionContext";
import type { CuestionarioPendiente } from "@/app/types";

// Datos iniciales de demostración mientras se conecta con el flujo real del backend
const CUESTIONARIOS_INICIALES: CuestionarioPendiente[] = [
  {
    id: "cuest-101-a",
    candidatoId: "101",
    titulo: "Evaluación Técnica Backend y APIs",
    puesto: "Desarrollador Java / Spring Boot",
    estado: "PENDIENTE",
    fechaAsignacion: "2026-11-20",
  },
  {
    id: "cuest-101-b",
    candidatoId: "101",
    titulo: "Razonamiento Lógico y Resolución de Problemas",
    puesto: "Desarrollador Java / Spring Boot",
    estado: "PENDIENTE",
    fechaAsignacion: "2026-11-21",
  },
  {
    id: "cuest-101-c",
    candidatoId: "101",
    titulo: "Cuestionario Introductorio de Perfil",
    puesto: "Desarrollador Java / Spring Boot",
    estado: "COMPLETADO",
    fechaAsignacion: "2026-11-15",
  },
  {
    id: "cuest-102-a",
    candidatoId: "102",
    titulo: "Evaluación de Análisis Funcional y Modelado",
    puesto: "Analista de Sistemas",
    estado: "PENDIENTE",
    fechaAsignacion: "2026-11-22",
  },
  {
    id: "cuest-103-a",
    candidatoId: "103",
    titulo: "Evaluación de Arquitectura Frontend",
    puesto: "Desarrollador Frontend",
    estado: "PENDIENTE",
    fechaAsignacion: "2026-11-23",
  },
];

function CuestionariosPendientesContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sesion } = useSession();

  const idDesdeQuery = searchParams.get("candidatoId")?.trim() ?? "";
  const idPorDefecto = idDesdeQuery || sesion?.candidatoId?.trim() || "";

  const [filtroId, setFiltroId] = useState(idPorDefecto);
  const [cuestionarios] = useState<CuestionarioPendiente[]>(CUESTIONARIOS_INICIALES);

  useEffect(() => {
    setFiltroId(idPorDefecto);
  }, [idPorDefecto]);

  const idNormalizado = filtroId.trim().toLowerCase();

  const cuestionariosPendientes = useMemo(() => {
    if (!idNormalizado) return [];
    return cuestionarios.filter(
      (item) =>
        item.candidatoId.trim().toLowerCase() === idNormalizado &&
        item.estado === "PENDIENTE"
    );
  }, [cuestionarios, idNormalizado]);

  const aplicarFiltroEnUrl = (nuevoId: string) => {
    const limpio = nuevoId.trim();
    setFiltroId(limpio);
    if (limpio) {
      router.replace(`/cuestionarios?candidatoId=${encodeURIComponent(limpio)}`);
    } else {
      router.replace("/cuestionarios");
    }
  };

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
            {filtroId
              ? `Mostrando cuestionarios pendientes asignados al candidato ID "${filtroId}".`
              : "Ingresá o seleccioná un ID de candidato para filtrar sus cuestionarios pendientes."}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            aplicarFiltroEnUrl(filtroId);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="filtro-candidato-id" className="sr-only">
            ID de candidato
          </label>
          <input
            id="filtro-candidato-id"
            type="text"
            value={filtroId}
            onChange={(e) => setFiltroId(e.target.value)}
            placeholder="ID candidato (ej. 101)"
            className="w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900"
          >
            Filtrar
          </button>
        </form>
      </div>

      {!filtroId.trim() ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-800">
            No se especificó un ID de candidato
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Ingresá un ID arriba (por ejemplo <span className="font-mono">101</span>) o volvé a{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-blue-600 underline hover:text-blue-700"
            >
              seleccionar perfil
            </button>
            .
          </p>
        </div>
      ) : cuestionariosPendientes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            No hay cuestionarios pendientes para el ID &ldquo;{filtroId}&rdquo;
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Ya completaste todas las evaluaciones asignadas o este ID no tiene pendientes activos.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {cuestionariosPendientes.map((cuest) => {
            return (
              <article
                key={cuest.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                        Pendiente
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        Candidato ID: {cuest.candidatoId}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        Asignado: {cuest.fechaAsignacion}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      {cuest.titulo}
                    </h2>
                    <p className="text-sm text-slate-600">Puesto: {cuest.puesto}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CU026 - Completar Cuestionario */}
                    <button
                      type="button"
                      onClick={() => router.push("/cuestionario")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Completar cuestionario
                    </button>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function CuestionariosPage() {
  return (
    <RoleGuard allowedRoles={["CANDIDATO", "CONSULTOR"]}>
      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-12">
            <p className="text-sm text-slate-500">Cargando cuestionarios...</p>
          </div>
        }
      >
        <CuestionariosPendientesContenido />
      </Suspense>
    </RoleGuard>
  );
}