"use client";

import { useRouter } from "next/navigation";
import { useGestionPreguntas } from "../hooks/useGestionPreguntas";
import AppHeader from "./AppHeader";
import Button from "./Button";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import Feedback from "./Feedback";
import ResultsTable from "./ResultsTable";
import SearchFilters from "./SearchFilters";

// TODO: reemplazar por el usuario autenticado (CU001)
const USUARIO_ACTUAL = "Pedro Martinez";

export default function GestionPreguntas() {
  const router = useRouter();
  const g = useGestionPreguntas();
  const enResultados = g.resultados !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Gestión de Preguntas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Busque, cree, modifique o elimine las preguntas del sistema.
          </p>
        </div>

        {g.mensaje && <Feedback mensaje={g.mensaje} onCerrar={g.cerrarMensaje} />}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-center text-lg font-medium text-slate-900">
              {enResultados ? "Resultados de búsqueda" : "Búsqueda"}
            </h2>
          </div>

          <div className="px-6 py-8">
            {g.resultados === null ? (
              <SearchFilters
                criterios={g.criterios}
                puedeBuscar={g.puedeBuscar}
                cargando={g.cargando}
                onCambio={g.cambiarCriterio}
                onBuscar={g.buscar}
              />
            ) : (
              <div className="space-y-6">
                <ResultsTable
                  preguntas={g.resultados}
                  seleccionadaId={g.seleccionadaId}
                  onSeleccionar={g.seleccionar}
                />
                <div className="flex justify-center gap-3">
                  <Button
                    disabled={g.seleccionada === null}
                    // CU022 - Modificar pregunta
                    onClick={() => g.seleccionada && router.push(`/preguntas/${g.seleccionada.id}/editar`)}
                  >
                    Modificar
                  </Button>
                  <Button
                    variant="danger"
                    disabled={g.seleccionada === null}
                    onClick={g.solicitarBaja}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            {enResultados ? (
              // Atajo extra al wireframe: volver a los filtros sin salir del CU
              <Button variant="secondary" onClick={g.nuevaBusqueda}>
                Nueva búsqueda
              </Button>
            ) : (
              // CU021 - Dar de alta pregunta
              <Button onClick={() => router.push("/preguntas/nueva")}>Nuevo</Button>
            )}
            <Button onClick={() => router.push("/")}>Salir</Button>
          </footer>
        </section>
      </main>

      <ConfirmDeleteDialog
        pregunta={g.confirmandoBaja ? g.seleccionada : null}
        eliminando={g.eliminando}
        onConfirmar={g.confirmarBaja}
        onCancelar={g.cancelarBaja}
      />
    </div>
  );
}
