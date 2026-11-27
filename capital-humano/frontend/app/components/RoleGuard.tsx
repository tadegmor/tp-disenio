"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/context/SessionContext";
import type { RolUsuario } from "@/app/types";

interface RoleGuardProps {
  allowedRoles: RolUsuario[];
  children: ReactNode;
}

function resolverDestinoPorRol(
  rol: RolUsuario,
  candidatoId?: string
): string {
  if (rol === "CANDIDATO") {
    if (candidatoId?.trim()) {
      return `/cuestionario?candidatoId=${encodeURIComponent(candidatoId.trim())}`;
    }
    return "/cuestionario";
  }
  return "/";
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { sesion, listo, tieneRol } = useSession();

  const autorizado = listo && sesion !== null && tieneRol(allowedRoles);

  useEffect(() => {
    if (!listo) return;

    if (!sesion) {
      router.replace("/login");
      return;
    }

    if (!tieneRol(allowedRoles)) {
      router.replace(resolverDestinoPorRol(sesion.rol, sesion.candidatoId));
    }
  }, [listo, sesion, allowedRoles, tieneRol, router]);

  if (!listo) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-12">
        <p className="text-sm text-slate-500">Verificando sesión...</p>
      </div>
    );
  }

  if (!autorizado) {
    return null;
  }

  return <>{children}</>;
}