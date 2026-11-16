interface AppHeaderProps {
  usuario: string;
  onCerrarSesion?: () => void;
}

export default function AppHeader({ usuario, onCerrarSesion }: AppHeaderProps) {
  const iniciales = usuario
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white">
            CH
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Capital Humano</p>
            <p className="text-xs text-slate-500">Evaluación de candidatos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-slate-600 sm:block">
            Consultor: <span className="font-medium text-slate-900">{usuario}</span>
          </p>
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-600"
          >
            {iniciales}
          </div>
          <button
            type="button"
            onClick={onCerrarSesion}
            aria-label="Cerrar sesión"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
