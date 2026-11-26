"use client";

import { useCallback, useEffect, useState } from "react";
import { emitirAlertaSonora } from "../services/alertaSonora";
import {
  completarCuestionario,
  consultarCuestionario,
  iniciarCuestionario,
  obtenerInstrucciones,
} from "../services/cuestionariosApi";
import { ApiError } from "../services/evaluacionesApi";
import type { BloqueCuestionarioDTO, CuestionarioDTO } from "../types/cuestionario";

export type PasoCU026 = "CARGANDO" | "INSTRUCCIONES" | "WIZARD";

/** Avisos modales: 1.A (incompleto), 1.B (sin contestar) y paso 8 (completo). */
export type AvisoCU026 = "INCOMPLETO" | "SIN_CONTESTAR" | "COMPLETO";

export function useCompletarCuestionario(cuestionarioId: number) {
  const [paso, setPaso] = useState<PasoCU026>("CARGANDO");
  const [cuestionario, setCuestionario] = useState<CuestionarioDTO | null>(null);
  const [instrucciones, setInstrucciones] = useState("");
  const [bloque, setBloque] = useState<BloqueCuestionarioDTO | null>(null);

  // preguntaId -> itemOpcionId del bloque que se está respondiendo
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  // 6.A: preguntas del bloque que quedaron sin responder
  const [sinResponder, setSinResponder] = useState<number[]>([]);
  // Se renueva en cada validación fallida para que la pantalla enfoque la primera pregunta sin responder
  const [preguntaAEnfocar, setPreguntaAEnfocar] = useState<{ preguntaId: number } | null>(null);
  const [aviso, setAviso] = useState<AvisoCU026 | null>(null);

  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detallesError, setDetallesError] = useState<string[]>([]);

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

  const mostrarBloque = useCallback((nuevo: BloqueCuestionarioDTO) => {
    setBloque(nuevo);
    setRespuestas({});
    setSinResponder([]);
    setPaso("WIZARD");
  }, []);

  // Paso 1: al ingresar se consulta el cuestionario y se decide por su estado
  const cargarCuestionario = useCallback(
    async (esVigente: () => boolean = () => true) => {
      limpiarAlertas();
      setAviso(null);
      setPaso("CARGANDO");
      setCargando(true);
      try {
        const consultado = await consultarCuestionario(cuestionarioId);
        if (!esVigente()) return;
        setCuestionario(consultado);

        switch (consultado.estado) {
          case "INCOMPLETO": // 1.A
          case "SIN_CONTESTAR": // 1.B
            setAviso(consultado.estado);
            emitirAlertaSonora();
            break;
          case "EN_PROCESO": {
            // 1.C: se posiciona en el bloque que aún no fue respondido
            const pendiente = await iniciarCuestionario(cuestionarioId);
            if (esVigente()) mostrarBloque(pendiente);
            break;
          }
          case "ACTIVO": {
            const texto = await obtenerInstrucciones();
            if (!esVigente()) return;
            setInstrucciones(texto);
            setPaso("INSTRUCCIONES");
            break;
          }
          default:
            setErrorMsg("No existe un cuestionario activo o en proceso para el candidato.");
        }
      } catch (err: unknown) {
        if (esVigente()) mostrarError(err, "No se pudo recuperar el cuestionario.");
      } finally {
        if (esVigente()) setCargando(false);
      }
    },
    [cuestionarioId, limpiarAlertas, mostrarError, mostrarBloque],
  );

  useEffect(() => {
    let activo = true;
    void cargarCuestionario(() => activo);
    return () => {
      activo = false;
    };
  }, [cargarCuestionario]);

  // Paso 2 -> 3: el actor acepta las instrucciones y se genera el cuestionario
  const aceptarInstrucciones = useCallback(async () => {
    limpiarAlertas();
    setCargando(true);
    try {
      mostrarBloque(await iniciarCuestionario(cuestionarioId));
    } catch (err: unknown) {
      mostrarError(err, "No se pudo iniciar el cuestionario.");
    } finally {
      setCargando(false);
    }
  }, [cuestionarioId, limpiarAlertas, mostrarError, mostrarBloque]);

  const responder = useCallback((preguntaId: number, opcionId: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcionId }));
    setSinResponder((prev) => prev.filter((id) => id !== preguntaId));
  }, []);

  // Pasos 5-8: Siguiente / Finalizar
  const avanzar = useCallback(async () => {
    if (!bloque) return;
    limpiarAlertas();

    // 6: valida que se hayan respondido todas las preguntas del bloque
    const faltantes = bloque.preguntas
      .filter((p) => respuestas[p.preguntaId] === undefined)
      .map((p) => p.preguntaId);
    setSinResponder(faltantes);
    if (faltantes.length > 0) {
      setPreguntaAEnfocar({ preguntaId: faltantes[0] });
      emitirAlertaSonora(); // 6.A.2
      return;
    }

    setCargando(true);
    try {
      await completarCuestionario(cuestionarioId, bloque.bloqueId, {
        respuestas: bloque.preguntas.map((p) => ({
          preguntaId: p.preguntaId,
          itemOpcionId: respuestas[p.preguntaId],
        })),
      });

      if (bloque.numero === bloque.cantidadBloques) {
        setAviso("COMPLETO"); // 8
      } else {
        mostrarBloque(await iniciarCuestionario(cuestionarioId)); // 8.A
      }
    } catch (err: unknown) {
      mostrarError(err, "No se pudo guardar el bloque de respuestas.");
    } finally {
      setCargando(false);
    }
  }, [bloque, respuestas, cuestionarioId, limpiarAlertas, mostrarError, mostrarBloque]);

  return {
    paso,
    cuestionario,
    instrucciones,
    bloque,
    respuestas,
    sinResponder,
    preguntaAEnfocar,
    aviso,
    cargando,
    errorMsg,
    detallesError,
    esUltimoBloque: bloque !== null && bloque.numero === bloque.cantidadBloques,
    aceptarInstrucciones,
    responder,
    avanzar,
    volverAlCuestionario: () => void cargarCuestionario(),
    limpiarAlertas,
  };
}
