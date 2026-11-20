"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  buscarCandidatos,
  finalizarEvaluacion,
  listarPuestos,
  obtenerCompetenciasPuesto,
  prepararEvaluacion,
  verificarCuestionariosActivos,
} from "../services/evaluacionesApi";
import { descargarPlanillaEvaluacion } from "../services/exportarPlanilla";
import type {
  CandidatoDTO,
  CriteriosBusquedaCandidato,
  EvaluacionGeneradaDTO,
  PuestoCompetenciasDTO,
  PuestoDTO,
  ResultadoEvaluacionDTO,
} from "../types/evaluacion";

export type PasoCU025 = "SELECCION" | "PREPARADA" | "FINALIZADA";

const FILTROS_INICIALES: CriteriosBusquedaCandidato = {
  apellido: "",
  nombre: "",
  numeroCandidato: "",
};

export function useEvaluarCandidato() {
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

  // Avisos modales: 6.A (candidatos con cuestionario activo) y 9.A (competencias no evaluables)
  const [bloqueados, setBloqueados] = useState<CandidatoDTO[]>([]);
  const [noEvaluables, setNoEvaluables] = useState<string[] | null>(null);

  // Errores de validación en línea: 4.A / 10.A
  const [faltaSeleccion, setFaltaSeleccion] = useState(false);
  const [faltaPuesto, setFaltaPuesto] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detallesError, setDetallesError] = useState<string[]>([]);

  const peticionPuestoRef = useRef(0);

  const limpiarAlertas = useCallback(() => {
    setErrorMsg(null);
    setDetallesError([]);
  }, []);

  const mostrarError = useCallback((err: unknown, porDefecto: string) => {
    if (err instanceof ApiError) {
      setErrorMsg(err.message);
      setDetallesError(err.detalles);
    } else {
      setErrorMsg(porDefecto);
      setDetallesError([]);
    }
  }, []);

  // Carga automática de los desplegables y de la grilla inicial
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
  }, [mostrarError]);

  const cambiarFiltro = useCallback(
    (campo: keyof CriteriosBusquedaCandidato, valor: string) =>
      setFiltros((prev) => ({ ...prev, [campo]: valor })),
    [],
  );

  const buscar = useCallback(async () => {
    limpiarAlertas();
    setBloqueados([]);
    setCargando(true);
    try {
      setCandidatos(await buscarCandidatos(filtros));
    } catch (err: unknown) {
      mostrarError(err, "Error al buscar candidatos.");
    } finally {
      setCargando(false);
    }
  }, [filtros, limpiarAlertas, mostrarError]);

  const alternarCandidato = useCallback((id: number) => {
    setFaltaSeleccion(false);
    setSeleccionadosIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const cambiarPuesto = useCallback(
    async (nuevoIdStr: string) => {
      limpiarAlertas();
      setDetallePuesto(null);
      setFaltaPuesto(false);
      // Cualquier cambio invalida la consulta anterior que siga en vuelo
      const token = ++peticionPuestoRef.current;

      if (!nuevoIdStr) {
        setPuestoId("");
        setCargando(false);
        return;
      }

      const id = Number(nuevoIdStr);
      setPuestoId(id);
      setCargando(true);
      try {
        const info = await obtenerCompetenciasPuesto(id);
        if (token !== peticionPuestoRef.current) return;
        setDetallePuesto(info);
        if (info.competencias.length === 0) {
          setErrorMsg("El puesto seleccionado no tiene competencias asociadas.");
        } else if (!info.evaluable) {
          // 9.A: se informan las competencias que no pueden evaluarse
          setNoEvaluables(info.competenciasNoEvaluables);
        }
      } catch (err: unknown) {
        if (token !== peticionPuestoRef.current) return;
        mostrarError(err, "No se pudieron consultar las competencias del puesto.");
      } finally {
        if (token === peticionPuestoRef.current) setCargando(false);
      }
    },
    [limpiarAlertas, mostrarError],
  );

  const preparar = useCallback(async () => {
    limpiarAlertas();
    setBloqueados([]);

    const sinCandidatos = seleccionadosIds.length === 0;
    setFaltaSeleccion(sinCandidatos);
    setFaltaPuesto(puestoId === "");
    if (sinCandidatos || puestoId === "") return;

    setCargando(true);
    try {
      const enCurso = await verificarCuestionariosActivos(seleccionadosIds);
      if (enCurso.length > 0) {
        setBloqueados(enCurso); // 6.A
        return;
      }
      setPreparados(await prepararEvaluacion({ puestoId, candidatoIds: seleccionadosIds }));
      setPaso("PREPARADA");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 422) {
        setNoEvaluables(err.detalles); // 9.A informado por el backend
      } else {
        mostrarError(err, "No se pudo preparar la evaluación.");
      }
    } finally {
      setCargando(false);
    }
  }, [seleccionadosIds, puestoId, limpiarAlertas, mostrarError]);

  const finalizar = useCallback(async () => {
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
  }, [puestoId, preparados, limpiarAlertas, mostrarError]);

  const cancelarPreparacion = useCallback(() => {
    limpiarAlertas();
    setPreparados([]);
    setPaso("SELECCION");
  }, [limpiarAlertas]);

  const reiniciarFlujo = useCallback(async () => {
    limpiarAlertas();
    setBloqueados([]);
    setNoEvaluables(null);
    setPreparados([]);
    setEvaluacionGenerada(null);
    setArchivoExportado(false);
    setSeleccionadosIds([]);
    setPuestoId("");
    setDetallePuesto(null);
    setFaltaSeleccion(false);
    setFaltaPuesto(false);
    setPaso("SELECCION");
    try {
      setCandidatos(await buscarCandidatos(filtros));
    } catch {
      // si falla la recarga se mantiene la lista actual
    }
  }, [filtros, limpiarAlertas]);

  const exportarExcel = useCallback(() => {
    if (!evaluacionGenerada) return;
    descargarPlanillaEvaluacion(evaluacionGenerada);
    setArchivoExportado(true);
  }, [evaluacionGenerada]);

  return {
    paso,
    filtros,
    candidatos,
    seleccionadosIds,
    puestos,
    puestoId,
    detallePuesto,
    preparados,
    evaluacionGenerada,
    archivoExportado,
    bloqueados,
    noEvaluables,
    faltaSeleccion,
    faltaPuesto,
    cargando,
    errorMsg,
    detallesError,
    cambiarFiltro,
    buscar,
    alternarCandidato,
    cambiarPuesto,
    preparar,
    finalizar,
    cancelarPreparacion,
    reiniciarFlujo,
    exportarExcel,
    limpiarAlertas,
    cerrarBloqueados: () => setBloqueados([]),
  };
}