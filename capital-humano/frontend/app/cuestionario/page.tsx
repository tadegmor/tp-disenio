"use client";

import CompletarCuestionario from "../components/CompletarCuestionario";
import RoleGuard from "../components/RoleGuard";
import { useSession } from "../context/SessionContext";

function resolverCuestionarioId(candidatoId?: string): number {
  if (!candidatoId) return 1;
  const parsed = Number.parseInt(candidatoId, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function CuestionarioPage() {
  const { sesion, listo } = useSession();

  if (!listo) {
    return null;
  }

  const cuestionarioId = resolverCuestionarioId(sesion?.candidatoId);

  return (
    <RoleGuard allowedRoles={["CANDIDATO"]}>
      <CompletarCuestionario cuestionarioId={cuestionarioId} />
    </RoleGuard>
  );
}