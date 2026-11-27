"use client";

import { useMemo, useState } from "react";
import {
  buscarPuestosOrdenMerito,
  emitirOrdenMerito,
  listarEvaluacionesPorPuesto,
  registrarImpresionOrdenMerito,
} from "../services/ordenMeritoApi";
import type {
  EstadoCuestionario,
  EvaluacionOpcion,
  OrdenMeritoDTO,
  PuestoDTO,
} from "../types";

const ORDEN_ESTADOS_NO_COMPLETOS: EstadoCuestionario[] = [
  "EN_PROCESO",
  "ACTIVO",
  "INCOMPLETO",
  "SIN_CONTESTAR",
];

export interface ReporteEmitido {
  puesto: PuestoDTO;
  fechaEmision: string;
  resultados: OrdenMeritoDTO[];
}

export function useOrdenMerito() {
  const [codigo, setCodigo] = useState("");
  const [nombrePuesto, setNombrePuesto] = useState("");
  const [empresa, setEmpresa] = useState("");

  const [puestos, setPuestos] = useState<PuestoDTO[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [puestoSeleccionadoId, setPuestoSeleccionadoId] = useState<number | null>(null);

  const [evaluaciones, setEvaluaciones] = useState<EvaluacionOpcion[]>([]);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState<string>("TODAS");
  const [errorEvaluacion, setErrorEvaluacion] = useState<string | null>(null);

  const [reporte, setReporte] = useState<ReporteEmitido | null>(null);
  const [evaluacionIdsEmitidos, setEvaluacionIdsEmitidos] = useState<number[]>([]);

  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [avisoSinResultados, setAvisoSinResultados] = useState<string | null>(null);
  const [mensajeImpresion, setMensajeImpresion] = useState<string | null>(null);

  const handleCodigoChange = (val: string) => {
    setCodigo(val.toUpperCase().slice(0, 100));
    if (errorGeneral) setErrorGeneral(null);
  };

  const handleNombrePuestoChange = (val: string) => {
    setNombrePuesto(val.toUpperCase().slice(0, 30));
    if (errorGeneral) setErrorGeneral(null);
  };

  const handleEmpresaChange = (val: string) => {
    setEmpresa(val.toUpperCase().slice(0, 30));
    if (errorGeneral) setErrorGeneral(null);
  };

  const buscar = async () => {
    setErrorGeneral(null);
    setAvisoSinResultados(null);
    setErrorEvaluacion(null);

    if (!codigo.trim() && !nombrePuesto.trim() && !empresa.trim()) {
      setErrorGeneral("Debe ingresar al menos un criterio de búsqueda");
      return;
    }

    setCargando(true);
    try {
      const lista = await buscarPuestosOrdenMerito({
        codigo,
        nombre: nombrePuesto,
        empresa,
      });
      setPuestos(lista);
      setBusquedaRealizada(true);
      setPuestoSeleccionadoId(null);
      setEvaluaciones([]);
      setEvaluacionSeleccionada("TODAS");

      if (lista.length === 0) {
        setAvisoSinResultados("No existen puestos para los criterios ingresados.");
      }
    } catch (err) {
      setErrorGeneral(
        err instanceof Error ? err.message : "Error al buscar los puestos."
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarBusqueda = () => {
    setCodigo("");
    setNombrePuesto("");
    setEmpresa("");
    setPuestos([]);
    setBusquedaRealizada(false);
    setPuestoSeleccionadoId(null);
    setEvaluaciones([]);
    setEvaluacionSeleccionada("TODAS");
    setErrorEvaluacion(null);
    setErrorGeneral(null);
    setAvisoSinResultados(null);
  };

  const seleccionarPuesto = async (puestoId: number) => {
    setPuestoSeleccionadoId(puestoId);
    setErrorEvaluacion(null);
    setErrorGeneral(null);
    setEvaluacionSeleccionada("TODAS");

    setCargando(true);
    try {
      const evals = await listarEvaluacionesPorPuesto(puestoId);
      setEvaluaciones(evals);
      if (evals.length === 0) {
        setErrorEvaluacion("(*) El puesto no posee evaluaciones");
      }
    } catch (err) {
      setErrorGeneral(
        err instanceof Error
          ? err.message
          : "Error al obtener las evaluaciones del puesto."
      );
    } finally {
      setCargando(false);
    }
  };

  const emitir = async () => {
    if (puestoSeleccionadoId == null) return;
    const puesto = puestos.find((p) => p.id === puestoSeleccionadoId);
    if (!puesto) return;

    if (evaluaciones.length === 0) {
      setErrorEvaluacion("(*) El puesto no posee evaluaciones");
      return;
    }

    const ids =
      evaluacionSeleccionada === "TODAS"
        ? evaluaciones.map((e) => e.id)
        : [Number(evaluacionSeleccionada)];

    setCargando(true);
    setErrorGeneral(null);
    setMensajeImpresion(null);
    try {
      const filas = await emitirOrdenMerito(puesto.id, ids);
      setReporte({
        puesto,
        fechaEmision: new Date().toISOString(),
        resultados: filas,
      });
      setEvaluacionIdsEmitidos(ids);
    } catch (err) {
      setErrorGeneral(
        err instanceof Error ? err.message : "No se pudo emitir el orden de mérito."
      );
    } finally {
      setCargando(false);
    }
  };

  const imprimir = async () => {
    if (!reporte) return;
    try {
      await registrarImpresionOrdenMerito(reporte.puesto.id, evaluacionIdsEmitidos);
    } catch {
      // Continúa con la impresión en el navegador si falla el registro remoto
    }
    if (typeof window !== "undefined") {
      window.print();
    }
    setMensajeImpresion("Reporte impreso correctamente.");
  };

  const volverABusqueda = () => {
    setReporte(null);
    setMensajeImpresion(null);
  };

  const gruposReporte = useMemo(() => {
    if (!reporte) {
      return {
        conformanOrden: [] as OrdenMeritoDTO[],
        noAlcanzanMinimo: [] as OrdenMeritoDTO[],
        otrosCandidatos: [] as OrdenMeritoDTO[],
      };
    }

    const conformanOrden = reporte.resultados
      .filter(
        (r) =>
          r.cuestionario.estado === "COMPLETO" && r.cumplePonderacionesMinimas
      )
      .sort((a, b) => (b.puntajeObtenido ?? 0) - (a.puntajeObtenido ?? 0));

    const noAlcanzanMinimo = reporte.resultados
      .filter(
        (r) =>
          r.cuestionario.estado === "COMPLETO" && !r.cumplePonderacionesMinimas
      )
      .sort((a, b) => (b.puntajeObtenido ?? 0) - (a.puntajeObtenido ?? 0));

    const otrosCandidatos = reporte.resultados
      .filter((r) => r.cuestionario.estado !== "COMPLETO")
      .sort(
        (a, b) =>
          ORDEN_ESTADOS_NO_COMPLETOS.indexOf(a.cuestionario.estado) -
          ORDEN_ESTADOS_NO_COMPLETOS.indexOf(b.cuestionario.estado)
      );

    return { conformanOrden, noAlcanzanMinimo, otrosCandidatos };
  }, [reporte]);

  return {
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
  };
}