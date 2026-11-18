import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Capital Humano</h1>
      <p className="mt-1 text-sm text-slate-500">Menú Principal del Sistema</p>

      <div className="mt-6 grid gap-3">
        <Link
          href="/preguntas"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-500 hover:shadow-md"
        >
          <span className="font-semibold text-blue-600">CU020 · Gestionar Preguntas</span>
          <p className="text-xs text-slate-500 mt-1">Buscar, crear, modificar o eliminar preguntas del sistema.</p>
        </Link>
      </div>
    </main>
  );
}