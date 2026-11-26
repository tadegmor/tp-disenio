"use client";

import Link from "next/link";
import RoleGuard from "@/app/components/RoleGuard";
import { useSession } from "@/app/context/SessionContext";
import { NAV_ITEMS } from "./config/navigation";

export default function HomePage() {
  const { sesion } = useSession();

  const casosDeUso = NAV_ITEMS.filter((item) => {
      if (!item.codigo) return false;
      if (!item.roles || item.roles.length === 0) return true;
      return sesion ? item.roles.includes(sesion.rol) : false;
  });

  return (
    <RoleGuard allowedRoles={["CONSULTOR"]}>
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">C@pital Humano</h1>
      <p className="mt-1 text-sm text-slate-500">Menú principal del sistema</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {casosDeUso.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {item.codigo}
            </span>
            <h2 className="mt-1 text-base font-semibold text-slate-900">{item.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  </RoleGuard>
);
}