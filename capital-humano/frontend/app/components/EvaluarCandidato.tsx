"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import Feedback from "./Feedback";
import {
  ApiError,
  buscarCandidatos,
  finalizarEvaluacion,
  listarPuestos,
  obtenerCompetenciasPuesto,
  prepararEvaluacion,
  verificarCuestionariosActivos,
} from "../services/evaluacionesApi";
import type {
  CandidatoDTO,
  CriteriosBusquedaCandidato,
  EvaluacionGeneradaDTO,
  PuestoCompetenciasDTO,
  PuestoDTO,
  ResultadoEvaluacionDTO,
} from "../types/evaluacion";

type PasoCU025 = "SELECCION" | "PREPARADA" | "FINALIZADA";

const FILTROS_INICIALES: CriteriosBusquedaCandidato = {
  apellido: "",
  nombre: "",
  numeroCandidato: "",
};

function escaparHtml(valor: string | number | null | undefined): string {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function descargarPlanillaEvaluacion(evaluacion: EvaluacionGeneradaDTO) {
  const filas = evaluacion.candidatos
    .map(
      (c) => `
        <tr>
          <td>${escaparHtml(c.apellidoCandidato)}</td>
          <td>${escaparHtml(c.nombreCandidato)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.tipoDocumento)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.numeroDocumento)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.claveIngreso)}</td>
        </tr>`,
    )
    .join("");

  const contenidoXls = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Tipo documento</th>
              <th>Nro documento</th>
              <th>Clave de ingreso</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </body>
    </html>
  `.trim();

  const blob = new Blob(["\ufeff", contenidoXls], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = evaluacion.nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

export default function EvaluarCandidato() {
  const router = useRouter();

  const [paso, setPaso] = useState<PasoCU025>("SELECCION");
  const [filtros, setFiltros] = useState<CriteriosBusquedaCandidato>(FILTROS_INICIALES);
  const [candidatos, setCandidatos] = useState<CandidatoDTO[]>([]);
  const [seleccionadosIds, setSeleccionadosIds] = useState<number[]>([]);

  const [puestos, setPuestos] = useState<PuestoDTO[]>([]);
  const [puestoId, setPuestoId] = useState<number | "">("");
  const [detallePuesto, setDetallePuesto] = useState<PuestoCompetenciasDTO | null>(null);

  const [preparados, setPreparados] = useState<ResultadoEvaluacionDTO[]>([]);
  const [evaluacionGenerada, setEvaluacionGenerada] = useState<EvaluacionGeneradaDTO | null>(null);
  const [archivoExportado, setArchivoExportado] = useState(false);

  const [bloqueados, setBloqueados] = useState<CandidatoDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detallesError, setDetallesError] = useState<string[]>([]);

  const alertaRef = useRef<HTMLDivElement>(null);
  const peticionPuestoRef = useRef(0);

  useEffect(() => {
    if (errorMsg) {
      alertaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  useEffect(() => {
    let activo = true;
    Promise.all([listarPuestos(), buscarCandidatos(FILTROS_INICIALES)])
      .then(([listaPuestos, listaCandidatos]) => {
        if (!activo) return;
        setPuestos(listaPuestos);
        setCandidatos(listaCandidatos);
      })
      .catch((err: unknown) => {
        if (!activo) return;
        mostrarError(err, "No se pudieron cargar los datos iniciales.");
      });
    return () => {
      activo = false;
    };
  }, []);

  function limpiarAlertas() {
    setErrorMsg(null);
    setDetallesError([]);
  }

  function mostrarError(err: unknown, porDefecto: string) {
    if (err instanceof ApiError) {
      setErrorMsg(err.message);
      setDetallesError(err.detalles);
    } else {
      setErrorMsg(porDefecto);
      setDetallesError([]);
    }
  }

  async function manejarBuscar(e: FormEvent) {
    e.preventDefault();
    limpiarAlertas();
    setBloqueados([]);
    setCargando(true);
    try {
      const data = await buscarCandidatos(filtros);
      setCandidatos(data);
    } catch (err: unknown) {
      mostrarError(err, "Error al buscar candidatos.");
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambioPuesto(nuevoIdStr: string) {
    limpiarAlertas();
    setDetallePuesto(null);
    if (!nuevoIdStr) {
      setPuestoId("");
      return;
    }
    const id = Number(nuevoIdStr);
    setPuestoId(id);
    const token = ++peticionPuestoRef.current;
    setCargando(true);
    try {
      const info = await obtenerCompetenciasPuesto(id);
      if (token !== peticionPuestoRef.current) return;
      setDetallePuesto(info);
    } catch (err: unknown) {
      if (token !== peticionPuestoRef.current) return;
      mostrarError(err, "No se pudieron consultar las competencias del puesto.");
    } finally {
      if (token === peticionPuestoRef.current) {
        setCargando(false);
      }
    }
  }

  function alternarCandidato(id: number) {
    setSeleccionadosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  async function manejarPreparar() {
    limpiarAlertas();
    setBloqueados([]);

    if (seleccionadosIds.length === 0) {
      setErrorMsg("Seleccione al menos un candidato para evaluar.");
      return;
    }
    if (puestoId === "") {
      setErrorMsg("Seleccione un puesto para la evaluación.");
      return;
    }

    setCargando(true);
    try {
      const enCurso = await verificarCuestionariosActivos(seleccionadosIds);
      if (enCurso.length > 0) {
        setBloqueados(enCurso);
        setErrorMsg(
          "Existen candidatos con cuestionarios activos o en proceso que no pueden evaluarse nuevamente.",
        );
        return;
      }

      const listaPreparada = await prepararEvaluacion({
        puestoId,
        candidatoIds: seleccionadosIds,
      });
      setPreparados(listaPreparada);
      setPaso("PREPARADA");
    } catch (err: unknown) {
      mostrarError(err, "No se pudo preparar la evaluación.");
    } finally {
      setCargando(false);
    }
  }

  async function manejarFinalizar() {
    if (puestoId === "" || preparados.length === 0) return;
    limpiarAlertas();
    setCargando(true);
    try {
      const generada = await finalizarEvaluacion({
        puestoId,
        candidatos: preparados.map((item) => ({
          candidatoId: item.candidatoId,
          claveIngreso: item.claveIngreso,
        })),
      });
      setEvaluacionGenerada(generada);
      setArchivoExportado(false);
      setPaso("FINALIZADA");
    } catch (err: unknown) {
      mostrarError(err, "No se pudo finalizar la evaluación.");
    } finally {
      setCargando(false);
    }
  }

  function cancelarPreparacion() {
    limpiarAlertas();
    setPreparados([]);
    setPaso("SELECCION");
  }

  async function reiniciarFlujo() {
    limpiarAlertas();
    setBloqueados([]);
    setPreparados([]);
    setEvaluacionGenerada(null);
    setArchivoExportado(false);
    setSeleccionadosIds([]);
    setPuestoId("");
    setDetallePuesto(null);
    setPaso("SELECCION");
    try {
      const listaCandidatos = await buscarCandidatos(filtros);
      setCandidatos(listaCandidatos);
    } catch {
      // Si falla la recarga silenciosa, se mantiene la lista actual
    }
  }

  function manejarExportarExcel(evaluacion: EvaluacionGeneradaDTO) {
    descargarPlanillaEvaluacion(evaluacion);
    setArchivoExportado(true);
  }

  const detallesAlerta = [
    ...detallesError,
    ...bloqueados.map(
      (b) => `${b.apellido}, ${b.nombre} (N° ${b.numeroCandidato}) — ${b.estadoCuestionario}`,
    ),
  ];

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
          {errorMsg && (
            <Feedback
              mensaje={{ tipo: "error", texto: errorMsg }}
              onCerrar={limpiarAlertas}
              detalles={detallesAlerta}
            />
          )}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-center text-lg font-medium text-slate-900">
              {paso === "SELECCION" && "Selección de candidatos y puesto"}
              {paso === "PREPARADA" && "Claves generadas (pendiente de confirmar)"}
              {paso === "FINALIZADA" && "Evaluación generada"}
            </h2>
          </div>

          <div className="space-y-6 px-6 py-8">
            {paso === "SELECCION" && (
              <>
                <form onSubmit={manejarBuscar} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <input
                    type="text"
                    placeholder="Apellido"
                    aria-label="Apellido"
                    maxLength={30}
                    autoComplete="off"
                    value={filtros.apellido}
                    onChange={(e) =>
                      setFiltros({ ...filtros, apellido: e.target.value.toUpperCase() })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Nombre"
                    aria-label="Nombre"
                    maxLength={30}
                    autoComplete="off"
                    value={filtros.nombre}
                    onChange={(e) =>
                      setFiltros({ ...filtros, nombre: e.target.value.toUpperCase() })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="N° Candidato"
                    aria-label="N° Candidato"
                    inputMode="numeric"
                    maxLength={20}
                    autoComplete="off"
                    value={filtros.numeroCandidato}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        numeroCandidato: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                  <Button type="submit" disabled={cargando}>
                    Buscar
                  </Button>
                </form>

                <div className="space-y-2">
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5">Sel.</th>
                          <th className="px-4 py-2.5">N°</th>
                          <th className="px-4 py-2.5">Apellido y Nombre</th>
                          <th className="px-4 py-2.5">Documento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {candidatos.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5">
                              <input
                                type="checkbox"
                                checked={seleccionadosIds.includes(c.id)}
                                onChange={() => alternarCandidato(c.id)}
                              />
                            </td>
                            <td className="px-4 py-2.5">{c.numeroCandidato}</td>
                            <td className="px-4 py-2.5">
                              {c.apellido}, {c.nombre}
                            </td>
                            <td className="px-4 py-2.5">
                              {c.tipoDocumento} {c.numeroDocumento}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-500" aria-live="polite">
                    {seleccionadosIds.length}{" "}
                    {seleccionadosIds.length === 1
                      ? "candidato seleccionado"
                      : "candidatos seleccionados"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="puesto" className="block text-sm font-medium text-slate-700">
                    Puesto a evaluar
                  </label>
                  <select
                    id="puesto"
                    value={puestoId}
                    onChange={(e) => manejarCambioPuesto(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="">Seleccione un puesto...</option>
                    {puestos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} — {p.nombre} ({p.empresa})
                      </option>
                    ))}
                  </select>

                  {detallePuesto && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                      <p className="font-medium text-slate-800">
                        Estado del puesto:{" "}
                        {detallePuesto.evaluable ? "Evaluable" : "No evaluable"}
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        {detallePuesto.competencias.map((comp) => (
                          <li key={comp.competenciaId}>
                            {comp.nombre} (Ponderación: {comp.ponderacion}) —{" "}
                            {comp.evaluable ? "Apta" : "Sin factor apto"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {paso === "PREPARADA" && (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5">N°</th>
                      <th className="px-4 py-2.5">Candidato</th>
                      <th className="px-4 py-2.5">Clave de ingreso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preparados.map((item) => (
                      <tr key={item.candidatoId}>
                        <td className="px-4 py-2.5">{item.numeroCandidato}</td>
                        <td className="px-4 py-2.5">
                          {item.apellidoCandidato}, {item.nombreCandidato}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-semibold">
                          {item.claveIngreso}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {paso === "FINALIZADA" && evaluacionGenerada && (
              <div className="space-y-5 text-sm">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="font-semibold">
                    Evaluación #{evaluacionGenerada.evaluacionId} creada para{" "}
                    {evaluacionGenerada.nombrePuesto} ({evaluacionGenerada.empresa}).
                  </p>
                  <p className="mt-1">
                    Archivo sugerido:{" "}
                    <span className="font-mono">{evaluacionGenerada.nombreArchivo}</span>
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5">Apellido</th>
                        <th className="px-4 py-2.5">Nombre</th>
                        <th className="px-4 py-2.5">Tipo documento</th>
                        <th className="px-4 py-2.5">Nro documento</th>
                        <th className="px-4 py-2.5">Clave de ingreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {evaluacionGenerada.candidatos.map((c) => (
                        <tr key={c.candidatoId}>
                          <td className="px-4 py-2.5">{c.apellidoCandidato}</td>
                          <td className="px-4 py-2.5">{c.nombreCandidato}</td>
                          <td className="px-4 py-2.5">{c.tipoDocumento}</td>
                          <td className="px-4 py-2.5">{c.numeroDocumento}</td>
                          <td className="px-4 py-2.5 font-mono font-semibold">
                            {c.claveIngreso}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-800">
                    ¿Desea exportar la lista de candidatos con sus claves a un archivo Excel?
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Nombre de archivo:{" "}
                    <span className="font-mono">{evaluacionGenerada.nombreArchivo}</span>
                  </p>
                  {archivoExportado && (
                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      Planilla exportada ({evaluacionGenerada.nombreArchivo}).
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button onClick={() => manejarExportarExcel(evaluacionGenerada)}>
                      Exportar a Excel
                    </Button>
                    <Button variant="secondary" onClick={() => router.push("/")}>
                      No exportar (Finalizar)
                    </Button>
                    <Button variant="secondary" onClick={reiniciarFlujo}>
                      Nueva evaluación
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <div>
              {paso === "SELECCION" && (
                <Button disabled={cargando} onClick={manejarPreparar}>
                  Preparar evaluación
                </Button>
              )}

              {paso === "PREPARADA" && (
                <div className="flex gap-3">
                  <Button disabled={cargando} onClick={manejarFinalizar}>
                    Finalizar
                  </Button>
                  <Button variant="secondary" disabled={cargando} onClick={cancelarPreparacion}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            <Button onClick={() => router.push("/")}>Salir</Button>
          </footer>
        </section>
      </main>
    </div>
  );
}