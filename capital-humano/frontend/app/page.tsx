import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Capital Humano</h1>
          <p className="mt-1 text-sm text-slate-500">Sistema de Evaluación de Candidatos · Menú Principal</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-400">Consultor</span>
          <p className="text-sm font-semibold text-slate-700">Pedro Martínez</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/preguntas"
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              CU020
            </span>
            <span className="text-slate-400 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
            Gestionar Preguntas
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Buscar, crear, modificar o eliminar preguntas del sistema de evaluación.
          </p>
        </Link>

        <Link
          href="/evaluaciones/nuevo"
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              CU025
            </span>
            <span className="text-slate-400 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-emerald-600">
            Evaluar Candidatos
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Selección de candidatos, validación de cuestionarios activos y asignación de puestos.
          </p>
        </Link>
      </div>
    </main>
  );
}