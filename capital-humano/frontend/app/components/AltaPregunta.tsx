"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAltaPregunta } from "../hooks/useAltaPregunta";
import Button from "./Button";
import GrillaOpciones from "./GrillaOpciones";

const INPUT_CLASE =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400";

export default function AltaPregunta() {
  const router = useRouter();
  const h = useAltaPregunta(() => router.push("/preguntas"));

  // Mantiene el texto en MAYÚSCULAS conservando la posición del cursor al editar en el medio
  const handleTextoMayusculas =
    (campo: "nombre" | "enunciado" | "descripcion") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const el = e.target;
      const inicio = el.selectionStart;
      const fin = el.selectionEnd;
      h.cambiarTexto(campo, el.value);
      requestAnimationFrame(() => {
        try {
          el.setSelectionRange(inicio, fin);
        } catch {
          /* ignora si el elemento perdió el foco */
        }
      });
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    h.aceptar();
  };

  const bloqueado = h.guardando || h.generandoIA;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Gestión de Preguntas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete los datos para registrar una nueva pregunta en el sistema.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-center text-lg font-medium text-slate-900">
              Alta de Pregunta
            </h2>
          </div>

          <div className="px-6 py-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Columna izquierda: datos de la pregunta */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="competencia"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Competencia (*)
                  </label>
                  <select
                    id="competencia"
                    value={h.form.competenciaId}
                    disabled={h.cargandoCatalogos || bloqueado}
                    onChange={(e) => h.seleccionarCompetencia(e.target.value)}
                    className={INPUT_CLASE}
                  >
                    <option value="">Seleccione una competencia...</option>
                    {h.competencias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="factor"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Factor (*)
                  </label>
                  <select
                    id="factor"
                    value={h.form.factorId}
                    disabled={
                      !h.form.competenciaId || h.cargandoFactores || bloqueado
                    }
                    onChange={(e) => h.seleccionarFactor(e.target.value)}
                    className={INPUT_CLASE}
                  >
                    <option value="">
                      {h.cargandoFactores
                        ? "Cargando factores..."
                        : "Seleccione un factor..."}
                    </option>
                    {h.factores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Nombre de Pregunta (*)
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={h.form.nombre}
                    disabled={bloqueado}
                    placeholder="INGRESE EL NOMBRE DE LA PREGUNTA"
                    onChange={handleTextoMayusculas("nombre")}
                    className={INPUT_CLASE}
                  />
                </div>

                <div>
                  <label
                    htmlFor="enunciado"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Pregunta (*)
                  </label>
                  <textarea
                    id="enunciado"
                    rows={3}
                    value={h.form.enunciado}
                    disabled={bloqueado}
                    placeholder="INGRESE EL ENUNCIADO DE LA PREGUNTA"
                    onChange={handleTextoMayusculas("enunciado")}
                    className={INPUT_CLASE}
                  />
                </div>

                <div>
                  <label
                    htmlFor="descripcion"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Descripción (opcional)
                  </label>
                  <textarea
                    id="descripcion"
                    rows={3}
                    value={h.form.descripcion}
                    disabled={bloqueado}
                    placeholder="INGRESE UNA DESCRIPCIÓN ADICIONAL"
                    onChange={handleTextoMayusculas("descripcion")}
                    className={INPUT_CLASE}
                  />
                </div>
              </div>

              {/* Columna derecha: opción de respuesta y grilla de ponderaciones */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="opcionRespuesta"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Opción de Respuesta (*)
                  </label>
                  <select
                    id="opcionRespuesta"
                    value={h.form.opcionRespuestaId}
                    disabled={h.cargandoCatalogos || bloqueado}
                    onChange={(e) => h.seleccionarOpcionRespuesta(e.target.value)}
                    className={INPUT_CLASE}
                  >
                    <option value="">Seleccione una opción de respuesta...</option>
                    {h.opciones.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {h.items.length > 0 && (
                  <GrillaOpciones
                    items={h.items}
                    onCambiarPonderacion={h.cambiarPonderacion}
                  />
                )}
              </div>
            </div>

            {/* Mensaje de error dentro de la página sin tapar campos ni botones */}
            {h.aviso && (
              <div
                role="alert"
                className="mt-6 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <div>
                  <p className="font-medium">{h.aviso.titulo}</p>
                  {h.aviso.detalles.length > 0 && (
                    <ul className="mt-1 list-disc pl-5">
                      {h.aviso.detalles.map((detalle) => (
                        <li key={detalle}>{detalle}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={h.cerrarAviso}
                  aria-label="Cerrar mensaje"
                  className="font-semibold text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            )}

            <p className="mt-6 text-xs text-slate-500">
              (*) Campos obligatorios
            </p>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              disabled={h.guardando}
              onClick={() => router.push("/preguntas/generar-ia")}
              >
              Generar con IA
            </Button>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={bloqueado}>
                {h.guardando ? "Guardando..." : "Aceptar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={h.guardando}
                onClick={h.cancelar}
              >
                Cancelar
              </Button>
            </div>
          </footer>
        </form>
      </main>

      {/* Pasos 6, 7 y 8: Cartel de confirmación tras crear la pregunta */}
      {h.preguntaCreada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-pregunta-creada"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3
              id="titulo-pregunta-creada"
              className="text-lg font-semibold text-slate-900"
            >
              Pregunta registrada
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              La Pregunta{" "}
              <span className="font-semibold text-slate-900">
                {h.preguntaCreada}
              </span>{" "}
              se ha creado correctamente. ¿Desea cargar otra?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={h.cancelar}
              >
                NO
              </Button>
              <Button
                type="button"
                autoFocus
                onClick={h.confirmarCargarOtra}
              >
                SÍ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}