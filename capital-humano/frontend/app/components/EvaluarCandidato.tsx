"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEvaluarCandidato } from "../hooks/useEvaluarCandidato";
import type { CandidatoDTO } from "../types/evaluacion";
import AvisoDialog from "./AvisoDialog";
import Button from "./Button";
import CandidatosFilters from "./CandidatosFilters";
import CandidatosTable from "./CandidatosTable";
import Feedback from "./Feedback";

const MSG_SIN_CANDIDATOS = "(*) Debe seleccionar uno o más candidatos";
const MSG_SIN_PUESTO = "(*) Debe seleccionar un puesto";

// Mismo estilo de encabezado que ResultsTable (CU020)
const ENCABEZADO = "sticky top-0 z-10 bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600";
const TH = "px-4 py-3 font-semibold";

const nombreCompleto = (c: CandidatoDTO) => `${c.apellido} ${c.nombre}`.toUpperCase();

export default function EvaluarCandidato() {
  const router = useRouter();
  const ev = useEvaluarCandidato();
  const alertaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ev.errorMsg) {
      alertaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [ev.errorMsg]);

  const unBloqueado = ev.bloqueados.length === 1 ? ev.bloqueados[0] : null;

  return (
    <div className="flex-1 bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Evaluar a Candidato
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Seleccione candidatos y un puesto evaluable para generar las claves de acceso.
          </p>
        </div>

        <div ref={alertaRef}>
          {ev.errorMsg && (
            <Feedback
              mensaje={{ tipo: "error", texto: ev.errorMsg }}
              onCerrar={ev.limpiarAlertas}
              detalles={ev.detallesError}
            />
          )}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-center text-lg font-medium text-slate-900">
              {ev.paso === "SELECCION" && "Selección de candidatos y puesto"}
              {ev.paso === "PREPARADA" && "Candidatos a evaluar"}
              {ev.paso === "FINALIZADA" && "Evaluación generada"}
            </h2>
          </div>

          <div className="space-y-6 px-6 py-8">
            {ev.paso === "SELECCION" && (
              <>
                <CandidatosFilters
                  filtros={ev.filtros}
                  cargando={ev.cargando}
                  onCambio={ev.cambiarFiltro}
                  onBuscar={ev.buscar}
                />

                <div className="space-y-2">
                  <CandidatosTable
                    candidatos={ev.candidatos}
                    seleccionadosIds={ev.seleccionadosIds}
                    onAlternar={ev.alternarCandidato}
                  />
                  <p className="text-xs text-slate-500" aria-live="polite">
                    {ev.seleccionadosIds.length}{" "}
                    {ev.seleccionadosIds.length === 1
                      ? "candidato seleccionado"
                      : "candidatos seleccionados"}
                  </p>
                  {ev.faltaSeleccion && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {MSG_SIN_CANDIDATOS}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="puesto" className="block text-sm font-medium text-slate-700">
                    Puesto a evaluar
                  </label>
                  <select
                    id="puesto"
                    value={ev.puestoId}
                    onChange={(e) => ev.cambiarPuesto(e.target.value)}
                    aria-invalid={ev.faltaPuesto}
                    aria-describedby={ev.faltaPuesto ? "error-puesto" : undefined}
                    className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                      ev.faltaPuesto
                        ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  >
                    <option value="">Seleccione un puesto...</option>
                    {ev.puestos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} — {p.nombre} ({p.empresa})
                      </option>
                    ))}
                  </select>
                  {ev.faltaPuesto && (
                    <p id="error-puesto" role="alert" className="text-xs font-medium text-red-600">
                      {MSG_SIN_PUESTO}
                    </p>
                  )}

                  {ev.detallePuesto && (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <caption className="bg-slate-50 px-4 py-2 text-left text-xs font-medium text-slate-600">
                          Competencias asociadas al puesto
                        </caption>
                        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                          <tr>
                            <th scope="col" className={TH}>Competencia</th>
                            <th scope="col" className={`${TH} text-center`}>Ponderación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {ev.detallePuesto.competencias.map((comp) => (
                            <tr key={comp.competenciaId}>
                              <td className="px-4 py-3">{comp.nombre.toUpperCase()}</td>
                              <td className="px-4 py-3 text-center">{comp.ponderacion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {ev.paso === "PREPARADA" && (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="max-h-80 overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={ENCABEZADO}>
                      <tr>
                        <th scope="col" className={TH}>N°</th>
                        <th scope="col" className={TH}>Candidato</th>
                        <th scope="col" className={TH}>Clave de ingreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {ev.preparados.map((item) => (
                        <tr key={item.candidatoId}>
                          <td className="px-4 py-3">{item.numeroCandidato}</td>
                          <td className="px-4 py-3">
                            {item.apellidoCandidato}, {item.nombreCandidato}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold">{item.claveIngreso}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {ev.paso === "FINALIZADA" && ev.evaluacionGenerada && (
              <div className="space-y-5 text-sm">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                  <p className="font-medium">
                    Evaluación #{ev.evaluacionGenerada.evaluacionId} creada para{" "}
                    {ev.evaluacionGenerada.nombrePuesto} ({ev.evaluacionGenerada.empresa}).
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="max-h-80 overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className={ENCABEZADO}>
                        <tr>
                          <th scope="col" className={TH}>Apellido</th>
                          <th scope="col" className={TH}>Nombre</th>
                          <th scope="col" className={TH}>Tipo documento</th>
                          <th scope="col" className={TH}>Nro documento</th>
                          <th scope="col" className={TH}>Clave de ingreso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {ev.evaluacionGenerada.candidatos.map((c) => (
                          <tr key={c.candidatoId}>
                            <td className="px-4 py-3">{c.apellidoCandidato}</td>
                            <td className="px-4 py-3">{c.nombreCandidato}</td>
                            <td className="px-4 py-3">{c.tipoDocumento}</td>
                            <td className="px-4 py-3">{c.numeroDocumento}</td>
                            <td className="px-4 py-3 font-mono font-semibold">{c.claveIngreso}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-800">
                    ¿Desea exportar la lista de candidatos con sus claves a un archivo Excel?
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Nombre de archivo:{" "}
                    <span className="font-mono">{ev.evaluacionGenerada.nombreArchivo}</span>
                  </p>
                  {ev.archivoExportado && (
                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      Planilla exportada ({ev.evaluacionGenerada.nombreArchivo}).
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button onClick={ev.exportarExcel}>Sí</Button>
                    <Button variant="secondary" onClick={() => router.push("/")}>
                      No
                    </Button>
                    {/* Atajo extra al wireframe: arrancar otra evaluación sin salir del CU */}
                    <Button variant="secondary" onClick={ev.reiniciarFlujo}>
                      Nueva evaluación
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <div>
              {ev.paso === "SELECCION" && (
                <Button disabled={ev.cargando} onClick={ev.preparar}>
                  Siguiente
                </Button>
              )}

              {ev.paso === "PREPARADA" && (
                <div className="flex gap-3">
                  <Button disabled={ev.cargando} onClick={ev.finalizar}>
                    Finalizar
                  </Button>
                  <Button variant="secondary" disabled={ev.cargando} onClick={ev.cancelarPreparacion}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            <Button onClick={() => router.push("/")}>Salir</Button>
          </footer>
        </section>
      </main>

      {/* 6.A - Cuestionario activo */}
      <AvisoDialog
        abierto={ev.bloqueados.length > 0}
        titulo="Cuestionario activo"
        mensaje={
          unBloqueado
            ? `El candidato ${nombreCompleto(unBloqueado)} posee cuestionario activo o en proceso y no puede ser evaluado nuevamente.`
            : "Los siguientes candidatos poseen cuestionario activo o en proceso y no pueden ser evaluados nuevamente:"
        }
        items={unBloqueado ? [] : ev.bloqueados.map(nombreCompleto)}
        onAceptar={ev.cerrarBloqueados}
      />

      {/* 9.A - Puesto no evaluable: Aceptar finaliza el CU y vuelve a la pantalla principal (9.A.3) */}
      <AvisoDialog
        abierto={ev.noEvaluables !== null}
        titulo="Puesto no evaluable"
        mensaje="El puesto seleccionado posee competencias sin factores aptos para ser evaluados:"
        items={(ev.noEvaluables ?? []).map((nombre) => nombre.toUpperCase())}
        onAceptar={() => router.push("/")}
      />
    </div>
  );
}