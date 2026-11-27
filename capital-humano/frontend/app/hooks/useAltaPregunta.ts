"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  buscarFactoresPorCompetencia,
  darAltaPregunta,
  generarPreguntaConIA,
  listarCompetencias,
  listarOpcionesActivas,
} from "../services/preguntasApi";
import type {
  CompetenciaDTO,
  FactorDTO,
  ItemOpcionDTO,
  OpcionRespuestaDTO,
  PreguntaDTO,
} from "../types";

export interface AvisoAlta {
  titulo: string;
  detalles: string[];
}

interface FormularioAlta {
  competenciaId: string;
  factorId: string;
  nombre: string;
  enunciado: string;
  descripcion: string;
  opcionRespuestaId: string;
}

const FORMULARIO_VACIO: FormularioAlta = {
  competenciaId: "",
  factorId: "",
  nombre: "",
  enunciado: "",
  descripcion: "",
  opcionRespuestaId: "",
};

function extraerAviso(error: unknown, fallback: string): AvisoAlta {
  if (error instanceof ApiError) {
    return {
      titulo: error.message,
      detalles: error.detalles,
    };
  }
  return {
    titulo: fallback,
    detalles: [],
  };
}

export function useAltaPregunta(onVolver: () => void) {
  const [form, setForm] = useState<FormularioAlta>(FORMULARIO_VACIO);
  const [competencias, setCompetencias] = useState<CompetenciaDTO[]>([]);
  const [factores, setFactores] = useState<FactorDTO[]>([]);
  const [opciones, setOpciones] = useState<OpcionRespuestaDTO[]>([]);
  const [items, setItems] = useState<ItemOpcionDTO[]>([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(false);
  const [cargandoFactores, setCargandoFactores] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [generandoIA, setGenerandoIA] = useState(false);

  const [aviso, setAviso] = useState<AvisoAlta | null>(null);
  const [preguntaCreada, setPreguntaCreada] = useState<string | null>(null);

  // Pasos 1 y 2: cargar competencias y opciones de respuesta activas (con sus ítems)
  const cargarCatalogos = useCallback(async () => {
    setCargandoCatalogos(true);
    try {
      const [comps, ops] = await Promise.all([
        listarCompetencias(),
        listarOpcionesActivas(),
      ]);
      setCompetencias(comps);
      setOpciones(ops);
    } catch (error) {
      setAviso(
        extraerAviso(
          error,
          "No se pudieron cargar las competencias y opciones de respuesta.",
        ),
      );
    } finally {
      setCargandoCatalogos(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  // Pasos 3 y 4: al elegir competencia, cargar sus factores
  const seleccionarCompetencia = useCallback(async (competenciaId: string) => {
    setForm((prev) => ({ ...prev, competenciaId, factorId: "" }));
    setFactores([]);
    setAviso(null);
    if (!competenciaId) return;

    setCargandoFactores(true);
    try {
      const lista = await buscarFactoresPorCompetencia(Number(competenciaId));
      setFactores(lista);
    } catch (error) {
      setAviso(
        extraerAviso(
          error,
          "No se pudieron cargar los factores de la competencia seleccionada.",
        ),
      );
    } finally {
      setCargandoFactores(false);
    }
  }, []);

  const seleccionarFactor = useCallback((factorId: string) => {
    setForm((prev) => ({ ...prev, factorId }));
    setAviso(null);
  }, []);

  // Requerimiento especial: ingreso literal SIEMPRE en mayúsculas
  const cambiarTexto = useCallback(
    (campo: "nombre" | "enunciado" | "descripcion", valor: string) => {
      setForm((prev) => ({ ...prev, [campo]: valor.toUpperCase() }));
      setAviso(null);
    },
    [],
  );

  // Opt 4.A: al elegir opción de respuesta, arma la grilla desde el catálogo ya cargado
  const seleccionarOpcionRespuesta = useCallback(
    (opcionRespuestaId: string) => {
      setForm((prev) => ({ ...prev, opcionRespuestaId }));
      setAviso(null);

      const seleccionada = opciones.find(
        (o) => o.id === Number(opcionRespuestaId),
      );
      if (!seleccionada) {
        setItems([]);
        return;
      }

      const ordenados = [...seleccionada.items]
        .sort((a, b) => a.orden - b.orden)
        .map((it) => ({ ...it, ponderacion: null }));
      setItems(ordenados);
    },
    [opciones],
  );

  const cambiarPonderacion = useCallback(
    (itemId: number, valor: string) => {
      const ponderacion = valor === "" ? null : Number(valor);
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, ponderacion } : it)),
      );
      setAviso(null);
    },
    [],
  );

  // Opt 1.A (CU033): Generar pregunta con IA
  const generarConIA = useCallback(async () => {
    if (generandoIA || guardando) return;
    setAviso(null);

    const faltantes: string[] = [];
    if (!form.competenciaId) faltantes.push("Competencia");
    if (!form.factorId) faltantes.push("Factor");
    if (faltantes.length > 0) {
      setAviso({
        titulo: "Para generar con IA debe seleccionar previamente:",
        detalles: faltantes,
      });
      return;
    }

    setGenerandoIA(true);
    try {
      const sugerida = await generarPreguntaConIA(
        Number(form.competenciaId),
        Number(form.factorId),
      );
      const opCatalogo = opciones.find(
        (o) => o.id === sugerida.opcionRespuesta?.id,
      );

      setForm((prev) => ({
        ...prev,
        nombre: (sugerida.nombre ?? "").toUpperCase(),
        enunciado: (sugerida.enunciado ?? "").toUpperCase(),
        descripcion: (sugerida.descripcion ?? "").toUpperCase(),
        opcionRespuestaId: opCatalogo ? String(opCatalogo.id) : "",
      }));

      if (opCatalogo) {
        const itemsSugeridos = sugerida.opcionRespuesta?.items ?? [];
        const combinados = [...opCatalogo.items]
          .sort((a, b) => a.orden - b.orden)
          .map((it) => {
            const match = itemsSugeridos.find((x) => x.id === it.id);
            return {
              ...it,
              ponderacion: match?.ponderacion ?? null,
            };
          });
        setItems(combinados);
      } else {
        setItems([]);
      }
    } catch (error) {
      setAviso(
        extraerAviso(
          error,
          "No se pudo generar la pregunta con IA. Intente nuevamente.",
        ),
      );
    } finally {
      setGenerandoIA(false);
    }
  }, [form.competenciaId, form.factorId, generandoIA, guardando, opciones]);

  // Paso 5: presiona Aceptar -> GestorPregunta.darAlta(dto)
  const aceptar = useCallback(async () => {
    if (guardando || generandoIA) return;
    setAviso(null);

    const opcionSeleccionada = opciones.find(
      (o) => o.id === Number(form.opcionRespuestaId),
    );

    const dto: PreguntaDTO = {
      id: null,
      factorId: form.factorId ? Number(form.factorId) : null,
      nombre: form.nombre.trim(),
      enunciado: form.enunciado.trim(),
      descripcion: form.descripcion.trim() ? form.descripcion.trim() : null,
      tipo: null,
      opcionRespuesta: opcionSeleccionada
        ? {
            id: opcionSeleccionada.id,
            nombre: opcionSeleccionada.nombre,
            descripcion: opcionSeleccionada.descripcion,
            items,
          }
        : null,
    };

    setGuardando(true);
    try {
      const creada = await darAltaPregunta(dto);
      setPreguntaCreada(creada.nombre);
    } catch (error) {
      setAviso(
        extraerAviso(
          error,
          "No se pudo registrar la pregunta. Verifique los datos e intente nuevamente.",
        ),
      );
    } finally {
      setGuardando(false);
    }
  }, [form, generandoIA, guardando, items, opciones]);

  // Paso 8.B: El actor selecciona "SÍ" -> vuelve al paso 1
  const confirmarCargarOtra = useCallback(() => {
    setPreguntaCreada(null);
    setAviso(null);
    setForm(FORMULARIO_VACIO);
    setFactores([]);
    setItems([]);
    cargarCatalogos();
  }, [cargarCatalogos]);

  // Paso 8.A ("NO") y Break ("Cancelar") -> vuelve a CU020
  const cancelar = useCallback(() => {
    onVolver();
  }, [onVolver]);

  return {
    form,
    competencias,
    factores,
    opciones,
    items,
    cargandoCatalogos,
    cargandoFactores,
    guardando,
    generandoIA,
    aviso,
    preguntaCreada,
    seleccionarCompetencia,
    seleccionarFactor,
    cambiarTexto,
    seleccionarOpcionRespuesta,
    cambiarPonderacion,
    generarConIA,
    aceptar,
    confirmarCargarOtra,
    cancelar,
    cerrarAviso: () => setAviso(null),
  };
}