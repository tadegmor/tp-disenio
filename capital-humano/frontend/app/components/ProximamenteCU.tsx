import Link from "next/link";

interface ProximamenteCUProps {
  codigo: string;
  titulo: string;
  detalle?: string;
  volverHref: string;
}

/** Pantalla provisoria para CU cuya implementación todavía no está disponible. */
export default function ProximamenteCU({
  codigo,
  titulo,
  detalle,
  volverHref,
}: ProximamenteCUProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        En desarrollo
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {codigo}: {titulo}
      </h1>
      {detalle && <p className="text-sm text-slate-500">{detalle}</p>}
      <p className="text-sm text-slate-600">
        Esta funcionalidad todavía no está disponible.
      </p>
      <Link
        href={volverHref}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Volver a Gestión de Preguntas
      </Link>
    </main>
  );
}
