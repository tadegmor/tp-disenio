import type { Metadata } from "next";
import CompletarCuestionario from "../components/CompletarCuestionario";
import RoleGuard from "../components/RoleGuard";
import { CUESTIONARIO_CANDIDATO_ID } from "../config/navigation";

export const metadata: Metadata = {
  title: "Cuestionario | C@pital Humano",
};

export default function CuestionarioPage() {
  return (
    <RoleGuard allowedRoles={["CANDIDATO"]}>
      <CompletarCuestionario cuestionarioId={CUESTIONARIO_CANDIDATO_ID} />
    </RoleGuard>
  );
}
