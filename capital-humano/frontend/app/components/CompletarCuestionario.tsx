"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { type AvisoCU026, useCompletarCuestionario } from "../hooks/useCompletarCuestionario";
import AppHeader from "./AppHeader";
import Button from "./Button";
import EstadoCuestionarioDialog from "./EstadoCuestionarioDialog";
import Feedback from "./Feedback";
import PreguntasBloque from "./PreguntasBloque";

// Textos de los wireframes 026.1A, 026.1B y 026.8; los colores del estado siguen la paleta de Feedback
const AVISOS: Record<AvisoCU026, { titulo: string; mensaje: ReactNode; estado: string; claseEstado: string }> = {
  INCOMPLETO: {
    titulo: "Su cuestionario ha finalizado por exceder el tiempo límite",
    mensaje: (
      <>
        El tiempo máximo para completar el <strong>cuestionario</strong> ha sido <strong>excedido</strong>.
      </>
    ),
    estado: "Incompleto",
    claseEstado: "text-red-600",
  },
  SIN_CONTESTAR: {
    titulo: "Su cuestionario ha expirado por inactividad",
    mensaje: "Se ha alcanzado el tiempo máximo permitido. El progreso se ha guardado automáticamente.",
    estado: "Sin contestar",
    claseEstado: "text-amber-700",
  },
  COMPLETO: {
    titulo: "Su cuestionario ha finalizado correctamente",
    mensaje: "Resultados guardados exitosamente.",
    estado: "Completado",
    claseEstado: "text-emerald-700",
  },
};

interface CompletarCuestionarioProps {
  cuestionarioId: number;
  ocultarHeader?: boolean;
}

export default function CompletarCuestionario({
  cuestionarioId,
  ocultarHeader = false,
}: CompletarCuestionarioProps) {
  const router = useRouter();
  const cu = useCompletarCuestionario(cuestionarioId);
  const alertaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cu.errorMsg) {
      alertaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [cu.errorMsg]);

  // 6.A.3: vuelve al paso 5 posicionado en la primera pregunta sin responder
  useEffect(() => {
    if (cu.preguntaAEnfocar) {
      document.getElementById(`respuesta-${cu.preguntaAEnfocar.preguntaId}`)?.focus();
    }
  }, [cu.preguntaAEnfocar]);

  const candidato = cu.cuestionario
    ? `${cu.cuestionario.nombreCandidato} ${cu.cuestionario.apellidoCandidato}`
    : "—";
  const aviso = cu.aviso ? AVISOS[cu.aviso] : null;
  const salir = () => router.push("/");

  return (
    <div className="flex-1 bg-slate-50">
      <AppHeader usuario={candidato} rol="Candidato" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Cuestionario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Responda todas las preguntas de cada bloque. Una vez enviado un bloque no podrá volver a él.
          </p>
        </div>

        <div ref={alertaRef}>
          {cu.errorMsg && (
            <Feedback
              mensaje={{ tipo: "error", texto: cu.errorMsg }}
              onCerrar={cu.limpiarAlertas}
              detalles={cu.detallesError}
            />
          )}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-center text-lg font-medium text-slate-900">
              Cuestionario {cu.cuestionario?.nombrePuesto ?? ""}
            </h2>
          </div>

          <div className="px-6 py-8">
            {cu.paso === "CARGANDO" && (
              <p className="text-center text-sm text-slate-500" aria-live="polite">
                {cu.cargando ? "Cargando cuestionario…" : ""}
              </p>
            )}

            {/* Paso 1 - wireframe 026.1 */}
            {cu.paso === "INSTRUCCIONES" && (
              <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-slate-200">
                <p className="bg-slate-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Instrucciones
                </p>
                <p className="min-h-40 whitespace-pre-line px-5 py-4 text-sm text-slate-700">
                  {cu.instrucciones}
                </p>
              </div>
            )}

            {/* Pasos 4-5 - wireframes 026.4, 026.5 y 026.6A */}
            {cu.paso === "WIZARD" && cu.bloque && (
              <PreguntasBloque
                preguntas={cu.bloque.preguntas}
                respuestas={cu.respuestas}
                sinResponder={cu.sinResponder}
                deshabilitado={cu.cargando}
                onResponder={cu.responder}
              />
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            {cu.paso === "CARGANDO" && (
              <Button className="ml-auto" onClick={salir}>
                Salir
              </Button>
            )}

            {cu.paso === "INSTRUCCIONES" && (
              <div className="flex w-full justify-center gap-3">
                <Button disabled={cu.cargando} onClick={cu.aceptarInstrucciones}>
                  Aceptar
                </Button>
                {/* 2.A: el CU termina */}
                <Button variant="secondary" disabled={cu.cargando} onClick={salir}>
                  Cancelar
                </Button>
              </div>
            )}

            {cu.paso === "WIZARD" && cu.bloque && (
              <>
                <p className="text-sm text-slate-600" aria-live="polite">
                  Bloque {cu.bloque.numero} de {cu.bloque.cantidadBloques}
                </p>
                <div className="flex gap-3">
                  <Button disabled={cu.cargando} onClick={cu.avanzar}>
                    {cu.esUltimoBloque ? "Finalizar" : "Siguiente"}
                  </Button>
                  {/* Los bloques ya enviados quedan guardados: al volver a ingresar sigue en 1.C */}
                  <Button variant="secondary" disabled={cu.cargando} onClick={salir}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </footer>
        </section>
      </main>

      {/* 1.A, 1.B y paso 8: el CU finaliza */}
      {aviso && (
        <EstadoCuestionarioDialog
          titulo={aviso.titulo}
          mensaje={aviso.mensaje}
          estado={aviso.estado}
          claseEstado={aviso.claseEstado}
        >
          {cu.aviso === "SIN_CONTESTAR" ? (
            <>
              <Button onClick={cu.volverAlCuestionario}>Volver al cuestionario</Button>
              <Button variant="secondary" onClick={salir}>
                Salir
              </Button>
            </>
          ) : (
            <Button onClick={salir}>Aceptar</Button>
          )}
        </EstadoCuestionarioDialog>
      )}
    </div>
  );
}
