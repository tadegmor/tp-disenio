"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONSULTOR_POR_DEFECTO } from "@/app/config/navigation";
import { useSession } from "@/app/context/SessionContext";

const IDS_EJEMPLO_CANDIDATO = ["101", "102", "103"];

export default function LoginPage() {
  const router = useRouter();
  const { sesion, ingresarComoConsultor, ingresarComoCandidato } = useSession();

  const [nombreConsultor, setNombreConsultor] = useState(CONSULTOR_POR_DEFECTO);
  const [candidatoId, setCandidatoId] = useState("");
  const [nombreCandidato, setNombreCandidato] = useState("");
  const [errorCandidato, setErrorCandidato] = useState<string | null>(null);

  useEffect(() => {
    if (sesion?.rol === "CONSULTOR" && sesion.nombre) {
      setNombreConsultor(sesion.nombre);
    } else if (sesion?.rol === "CANDIDATO") {
      if (sesion.candidatoId) setCandidatoId(sesion.candidatoId);
      if (sesion.nombre) setNombreCandidato(sesion.nombre);
    }
  }, [sesion]);

  const handleSubmitConsultor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ingresarComoConsultor(nombreConsultor);
    router.push("/");
  };

  const handleSubmitCandidato = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idLimpio = candidatoId.trim();
    if (!idLimpio) {
      setErrorCandidato("Ingresá un ID de candidato para ver los cuestionarios pendientes.");
      return;
    }
    setErrorCandidato(null);
    ingresarComoCandidato(idLimpio, nombreCandidato);
    router.push(`/cuestionario?candidatoId=${encodeURIComponent(idLimpio)}`);
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-7">
        <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          Acceso rápido
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Seleccioná tu perfil en C@pital Humano
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresá como consultor para administrar y evaluar o como candidato con tu ID para ver cuestionarios pendientes.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Consultor</h2>
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Gestión y Evaluación
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Accedé al menú principal, gestión de preguntas (CU020) y evaluación de candidatos (CU025).
            </p>

            <form id="form-consultor" onSubmit={handleSubmitConsultor} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="nombre-consultor"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nombre del consultor
                </label>
                <input
                  id="nombre-consultor"
                  type="text"
                  value={nombreConsultor}
                  onChange={(e) => setNombreConsultor(e.target.value)}
                  placeholder="Ej. Pedro Martínez"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </form>
          </div>

          <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              form="form-consultor"
              className="inline-flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              Ingresar como Consultor
            </button>
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Candidato</h2>
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Cuestionarios
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Ingresá tu ID de candidato para filtrar y completar tus cuestionarios pendientes.
            </p>

            <form id="form-candidato" onSubmit={handleSubmitCandidato} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="candidato-id"
                  className="block text-sm font-medium text-slate-700"
                >
                  ID del candidato <span className="text-rose-600">*</span>
                </label>
                <input
                  id="candidato-id"
                  type="text"
                  value={candidatoId}
                  onChange={(e) => {
                    setCandidatoId(e.target.value);
                    if (errorCandidato) setErrorCandidato(null);
                  }}
                  placeholder="Ej. 101"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errorCandidato && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                    {errorCandidato}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">IDs de prueba:</span>
                  {IDS_EJEMPLO_CANDIDATO.map((idEjemplo) => (
                    <button
                      key={idEjemplo}
                      type="button"
                      onClick={() => {
                        setCandidatoId(idEjemplo);
                        setErrorCandidato(null);
                      }}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                    >
                      {idEjemplo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="nombre-candidato"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nombre (opcional)
                </label>
                <input
                  id="nombre-candidato"
                  type="text"
                  value={nombreCandidato}
                  onChange={(e) => setNombreCandidato(e.target.value)}
                  placeholder="Ej. Lucía Gómez"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </form>
          </div>

          <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              form="form-candidato"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Ver cuestionarios pendientes
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}