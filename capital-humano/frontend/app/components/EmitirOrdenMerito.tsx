"use client";

import { useRouter } from "next/navigation";
import { useOrdenMerito } from "../hooks/useOrdenMerito";
import type { CuestionarioDTO, OrdenMeritoDTO } from "../types";

function formatearFechaCorta(fechaIso: string | null): string {
  if (!fechaIso) return "-";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return fechaIso;
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

function formatearFechaCompleta(fechaIso: string): string {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return fechaIso;
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatearDatosAdicionales(c: CuestionarioDTO): string {
  const fini = formatearFechaCorta(c.fechaInicio);
  if (c.estado === "COMPLETO") {
    const ffin = formatearFechaCorta(c.fechaFin);
    return `FINI:${fini} - FFIN:${ffin} - ACC:${c.cantidadAccesos}`;
  }
  const uing = formatearFechaCorta(c.ultimoIngreso);
  return `FINI:${fini} - U.ING:${uing} - ACC:${c.cantidadAccesos} (${c.estado.replace("_", " ")})`;
}

function TablaGrupoMerito({
  filas,
  borderClass,
  headerBgClass,
  mostrarPuntaje,
  emptyText,
}: {
  filas: OrdenMeritoDTO[];
  borderClass: string;
  headerBgClass: string;
  mostrarPuntaje: boolean;
  emptyText: string;
}) {
  return (
    <div className={`overflow-x-auto rounded-lg border-2 ${borderClass} bg-white`}>
      <table className="w-full text-left text-sm">
        <thead className={`${headerBgClass} text-xs uppercase tracking-wide text-slate-700`}>
          <tr>
            <th className="px-4 py-2.5 font-semibold">Tipo Doc</th>
            <th className="px-4 py-2.5 font-semibold">Nro Doc</th>
            <th className="px-4 py-2.5 font-semibold">Apellido</th>
            <th className="px-4 py-2.5 font-semibold">Nombre</th>
            <th className="px-4 py-2.5 text-center font-semibold">Puntaje</th>
            <th className="px-4 py-2.5 font-semibold">Datos adicionales</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {filas.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-xs text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            filas.map((item) => (
              <tr
                key={`${item.candidato.numeroCandidato}-${item.cuestionario.estado}`}
                className="text-slate-800"
              >
                <td className="px-4 py-2.5">{item.candidato.tipoDocumento}</td>
                <td className="px-4 py-2.5">{item.candidato.numeroDocumento}</td>
                <td className="px-4 py-2.5 font-medium uppercase">{item.candidato.apellido}</td>
                <td className="px-4 py-2.5 uppercase">{item.candidato.nombre}</td>
                <td className="px-4 py-2.5 text-center font-semibold">
                  {mostrarPuntaje && item.puntajeObtenido != null
                    ? item.puntajeObtenido
                    : "-"}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-slate-600">
                  {formatearDatosAdicionales(item.cuestionario)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function EmitirOrdenMerito() {
  const router = useRouter();
  const {
    codigo,
    nombrePuesto,
    empresa,
    handleCodigoChange,
    handleNombrePuestoChange,
    handleEmpresaChange,
    puestos,
    busquedaRealizada,
    puestoSeleccionadoId,
    evaluaciones,
    evaluacionSeleccionada,
    setEvaluacionSeleccionada,
    errorEvaluacion,
    reporte,
    gruposReporte,
    cargando,
    errorGeneral,
    avisoSinResultados,
    mensajeImpresion,
    buscar,
    limpiarBusqueda,
    seleccionarPuesto,
    emitir,
    imprimir,
    volverABusqueda,
  } = useOrdenMerito();

  // ===================================================================
  // VISTA 3: LISTADO DEL ORDEN DE MÉRITO (CU 028.7)
  // ===================================================================
  if (reporte) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Emisión de Orden de Mérito
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ranking final de candidatos evaluados para el puesto seleccionado.
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold tracking-wide text-slate-900">
              ORDEN DE MÉRITO
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Empresa:</span>{" "}
                <span className="uppercase">{reporte.puesto.empresa}</span>
                <span className="mx-3 text-slate-300">|</span>
                <span className="font-semibold">Puesto:</span>{" "}
                <span className="uppercase">
                  {reporte.puesto.codigo} - {reporte.puesto.nombre}
                </span>
              </p>
              <p>
                <span className="font-semibold">Fecha de emisión:</span>{" "}
                {formatearFechaCompleta(reporte.fechaEmision)}
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {mensajeImpresion && (
              <div
                role="status"
                className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 print:hidden"
              >
                {mensajeImpresion}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <span aria-hidden="true">🏆</span>
                  Candidatos que conforman el orden de mérito :
                </h3>
                <TablaGrupoMerito
                  filas={gruposReporte.conformanOrden}
                  borderClass="border-emerald-600"
                  headerBgClass="bg-emerald-50"
                  mostrarPuntaje={true}
                  emptyText="Ningún candidato alcanzó las ponderaciones mínimas requeridas."
                />
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <span aria-hidden="true">⚠️</span>
                  Candidatos que no alcanzaron las ponderaciones mínimas:
                </h3>
                <TablaGrupoMerito
                  filas={gruposReporte.noAlcanzanMinimo}
                  borderClass="border-amber-600"
                  headerBgClass="bg-amber-50"
                  mostrarPuntaje={true}
                  emptyText="No hay candidatos con cuestionario completo por debajo del mínimo."
                />
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span aria-hidden="true">⏳</span>
                  Otros candidatos:
                </h3>
                <TablaGrupoMerito
                  filas={gruposReporte.otrosCandidatos}
                  borderClass="border-slate-500"
                  headerBgClass="bg-slate-100"
                  mostrarPuntaje={false}
                  emptyText="No hay candidatos en otros estados."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 print:hidden">
            <button
              type="button"
              onClick={volverABusqueda}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Volver a búsqueda
            </button>

            <button
              type="button"
              onClick={imprimir}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <span aria-hidden="true">🖨️</span>
              Imprimir
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Salir
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ===================================================================
  // VISTAS 1 Y 2: CRITERIOS DE BÚSQUEDA Y RESULTADOS (CU 028.1 / 028.4-6)
  // ===================================================================
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Emisión de Orden de Mérito
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Busque el puesto evaluado y emita el ranking de candidatos por orden de mérito.
      </p>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Criterios de búsqueda
          </h2>
        </div>

        <div className="px-6 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscar();
            }}
            className="mx-auto max-w-md space-y-5"
          >
            <div>
              <label
                htmlFor="filtro-codigo"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Código
              </label>
              <input
                id="filtro-codigo"
                type="text"
                tabIndex={1}
                value={codigo}
                onChange={(e) => handleCodigoChange(e.target.value)}
                placeholder="Ej: P001"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm uppercase text-slate-800 placeholder-slate-400 placeholder:normal-case focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="filtro-nombre"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Nombre del puesto
              </label>
              <input
                id="filtro-nombre"
                type="text"
                tabIndex={2}
                value={nombrePuesto}
                onChange={(e) => handleNombrePuestoChange(e.target.value)}
                placeholder="Ej: Desarrollador Java Senior"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm uppercase text-slate-800 placeholder-slate-400 placeholder:normal-case focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="filtro-empresa"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Empresa
              </label>
              <input
                id="filtro-empresa"
                type="text"
                tabIndex={3}
                value={empresa}
                onChange={(e) => handleEmpresaChange(e.target.value)}
                placeholder="Ej: Tech Solutions"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm uppercase text-slate-800 placeholder-slate-400 placeholder:normal-case focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Ingrese al menos un criterio. La búsqueda trae los puestos que
              contengan el texto indicado.
            </p>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="submit"
                tabIndex={4}
                disabled={cargando}
                className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {cargando ? "Buscando..." : "Buscar"}
              </button>

              {(codigo || nombrePuesto || empresa || busquedaRealizada) && (
                <button
                  type="button"
                  tabIndex={5}
                  onClick={limpiarBusqueda}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {errorGeneral && (
            <div
              role="alert"
              className="mx-auto mt-6 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
            >
              {errorGeneral}
            </div>
          )}

          {avisoSinResultados && (
            <div
              role="status"
              className="mx-auto mt-6 max-w-xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800"
            >
              {avisoSinResultados}
            </div>
          )}

          {busquedaRealizada && puestos.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h3 className="mb-4 text-center text-lg font-semibold text-slate-900">
                Resultados de búsqueda
              </h3>

              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-300">
                    <table
                      role="grid"
                      aria-label="Resultados de búsqueda de puestos"
                      className="w-full text-left text-sm"
                    >
                      <thead className="sticky top-0 bg-slate-100 text-xs font-semibold text-slate-700">
                        <tr>
                          <th className="border-b border-r border-slate-300 px-3 py-2">
                            Código
                          </th>
                          <th className="border-b border-r border-slate-300 px-3 py-2">
                            Nombre del puesto
                          </th>
                          <th className="border-b border-r border-slate-300 px-3 py-2">
                            Empresa
                          </th>
                          <th className="border-b border-r border-slate-300 px-3 py-2 text-center">
                            Candidatos
                          </th>
                          <th className="border-b border-slate-300 px-3 py-2 text-center">
                            Completas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {puestos.map((p) => {
                          const seleccionado = p.id === puestoSeleccionadoId;
                          return (
                            <tr
                              key={p.id}
                              tabIndex={0}
                              aria-selected={seleccionado}
                              onClick={() => seleccionarPuesto(p.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  seleccionarPuesto(p.id);
                                }
                              }}
                              className={`cursor-pointer transition-colors ${
                                seleccionado
                                  ? "bg-blue-100/80 text-blue-950"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <td className="border-r border-slate-200 px-3 py-2 font-mono">
                                {p.codigo}
                              </td>
                              <td className="border-r border-slate-200 px-3 py-2">
                                {p.nombre}
                              </td>
                              <td className="border-r border-slate-200 px-3 py-2">
                                {p.empresa}
                              </td>
                              <td className="border-r border-slate-200 px-3 py-2 text-center">
                                {p.cantidadCandidatos}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {p.evaluacionesCompletas}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 max-w-xs">
                    <label
                      htmlFor="select-evaluacion"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Seleccione evaluación para el reporte:
                    </label>
                    <select
                      id="select-evaluacion"
                      tabIndex={2}
                      disabled={puestoSeleccionadoId == null || cargando}
                      value={evaluacionSeleccionada}
                      onChange={(e) => setEvaluacionSeleccionada(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                        errorEvaluacion
                          ? "border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      } disabled:bg-slate-100 disabled:text-slate-400`}
                    >
                      {puestoSeleccionadoId == null ? (
                        <option value="TODAS">Seleccione</option>
                      ) : (
                        <>
                          <option value="TODAS">Todas</option>
                          {evaluaciones.map((ev, idx) => (
                            <option key={ev.id} value={String(ev.id)}>
                              Evaluación #{idx + 1} (
                              {formatearFechaCompleta(ev.fechaCreacion)} ·{" "}
                              {ev.cantidadCuestionarios} cand.)
                            </option>
                          ))}
                        </>
                      )}
                    </select>

                    {errorEvaluacion && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errorEvaluacion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end md:pt-8">
                  <button
                    type="button"
                    tabIndex={1}
                    disabled={
                      puestoSeleccionadoId == null ||
                      evaluaciones.length === 0 ||
                      cargando
                    }
                    onClick={emitir}
                    className={`rounded-lg px-7 py-2.5 text-sm font-medium text-white transition-colors ${
                      puestoSeleccionadoId != null && evaluaciones.length > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "cursor-not-allowed bg-slate-400"
                    }`}
                  >
                    Emitir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            tabIndex={6}
            onClick={() => router.push("/")}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Salir
          </button>
        </div>
      </section>
    </main>
  );
}