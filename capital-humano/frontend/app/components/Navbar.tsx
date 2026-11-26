"use client";

import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/app/config/navigation";
import { useSession } from "@/app/context/SessionContext";

function estaActivo(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function claseLink(activo: boolean): string {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
    activo
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function resolverHref(href: string, candidatoId?: string): string {
  if (href === "/cuestionarios" && candidatoId?.trim()) {
    return `/cuestionarios?candidatoId=${encodeURIComponent(candidatoId.trim())}`;
  }
  return href;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sesion, cerrarSesion } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const itemsVisibles = NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return sesion ? item.roles.includes(sesion.rol) : false;
  });

  const nombreMostrar = sesion?.nombre ?? "Invitado";
  const etiquetaRol =
    sesion?.rol === "CANDIDATO"
      ? `Candidato${sesion.candidatoId ? ` #${sesion.candidatoId}` : ""}`
      : sesion?.rol === "CONSULTOR"
      ? "Consultor"
      : "Sin rol";

  const iniciales =
    nombreMostrar
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "IN";

  const manejarCerrarSesion = () => {
    setMenuAbierto(false);
    cerrarSesion();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={sesion?.rol === "CANDIDATO" ? resolverHref("/cuestionarios", sesion.candidatoId) : "/"}
          onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold text-white">
            CH
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-slate-900">C@pital Humano</span>
            <span className="block text-xs text-slate-500">Evaluación de candidatos</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
          {itemsVisibles.map((item) => {
            const hrefFinal = resolverHref(item.href, sesion?.candidatoId);
            const activo = estaActivo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={hrefFinal}
                aria-current={activo ? "page" : undefined}
                className={claseLink(activo)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-slate-600 lg:block">
            {etiquetaRol}: <span className="font-medium text-slate-900">{nombreMostrar}</span>
          </p>
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-600"
          >
            {iniciales}
          </div>
          <button
            type="button"
            onClick={manejarCerrarSesion}
            aria-label="Cambiar rol o cerrar sesión"
            title="Cambiar rol o cerrar sesión"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label="Abrir menú de navegación"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={menuAbierto ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label="Navegación principal"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {itemsVisibles.map((item) => {
              const hrefFinal = resolverHref(item.href, sesion?.candidatoId);
              const activo = estaActivo(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={hrefFinal}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activo ? "page" : undefined}
                    className={`block ${claseLink(activo)}`}
                  >
                    {item.label}
                    {item.codigo && (
                      <span className="ml-2 text-xs font-normal text-slate-400">{item.codigo}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}