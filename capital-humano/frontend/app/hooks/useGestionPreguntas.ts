"use client";

import { useCallback, useRef, useState } from "react";
import { ApiError, buscarPreguntas, eliminarPregunta } from "../services/preguntasApi";
import {
  CRITERIOS_VACIOS,
  type CriteriosBusqueda,
  type Mensaje,
  type PreguntaDTO,
} from "../types";

function textoDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.";
}

export function useGestionPreguntas() {
  const [criterios, setCriterios] = useState<CriteriosBusqueda>(CRITERIOS_VACIOS);
  // null = todavía no se buscó (vista "Búsqueda"); array = vista "Resultados de búsqueda"
  const [resultados, setResultados] = useState<PreguntaDTO[] | null>(null);
  const [seleccionadaId, setSeleccionadaId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmandoBaja, setConfirmandoBaja] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const ultimosCriterios = useRef<CriteriosBusqueda | null>(null);

  // Paso 3 del CU: el botón Buscar se habilita con al menos un criterio ingresado
  const puedeBuscar = Object.values(criterios).some((v) => v.trim() !== "");
  const seleccionada = resultados?.find((p) => p.id === seleccionadaId) ?? null;

  const ejecutarBusqueda = useCallback(async (c: CriteriosBusqueda) => {
    setCargando(true);
    try {
      const data = await buscarPreguntas(c);
      ultimosCriterios.current = c;
      setResultados(data);
      setSeleccionadaId(null);
    } catch (error) {
      setMensaje({ tipo: "error", texto: textoDeError(error) });
    } finally {
      setCargando(false);
    }
  }, []);

  const cambiarCriterio = useCallback(
    (campo: keyof CriteriosBusqueda, valor: string) => {
        setCriterios((prev) => ({ ...prev, [campo]: valor }));
        setMensaje((prev) => (prev?.tipo === "error" ? null : prev));
    },
    [] 
  );

  const buscar = useCallback(async () => {
    if(cargando) return;
    if(!puedeBuscar) {
      setMensaje({
        tipo: "error",
        texto: "Debe ingresar al menos un dato para realizar la búsqueda.",
      });
      return;
    }
    setMensaje(null);
    await ejecutarBusqueda({ ...criterios });
  }, [puedeBuscar, cargando, criterios, ejecutarBusqueda, setMensaje]);

  const nuevaBusqueda = useCallback(() => {
    setResultados(null);
    setSeleccionadaId(null);
    setMensaje(null);
  }, []);

  const solicitarBaja = useCallback(() => {
    if (seleccionadaId !== null) setConfirmandoBaja(true);
  }, [seleccionadaId]);

  const cancelarBaja = useCallback(() => setConfirmandoBaja(false), []);

  // CU023 + 5.B.2: elimina y actualiza la grilla repitiendo la última búsqueda
  const confirmarBaja = useCallback(async () => {
    if (!seleccionada || seleccionada.id == null) return;
    setEliminando(true);
    try {
        await eliminarPregunta(seleccionada.id);
        setConfirmandoBaja(false);
      setMensaje({
        tipo: "exito",
        texto: `Los datos de la pregunta ${seleccionada.nombre} han sido eliminados del sistema.`,
      });
      if (ultimosCriterios.current) {
        await ejecutarBusqueda(ultimosCriterios.current);
      }
    } catch (error) {
      setConfirmandoBaja(false);
      setMensaje({ tipo: "error", texto: textoDeError(error) });
    } finally {
      setEliminando(false);
    }
  }, [seleccionada, ejecutarBusqueda]);

  return {
    criterios,
    resultados,
    seleccionada,
    seleccionadaId,
    cargando,
    eliminando,
    confirmandoBaja,
    mensaje,
    puedeBuscar,
    cambiarCriterio,
    buscar,
    nuevaBusqueda,
    seleccionar: setSeleccionadaId,
    solicitarBaja,
    cancelarBaja,
    confirmarBaja,
    cerrarMensaje: () => setMensaje(null),
  };
}
