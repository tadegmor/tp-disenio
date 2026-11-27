import RoleGuard from "@/app/components/RoleGuard";
import type { Metadata } from "next";
import AltaPregunta from "@/app/components/AltaPregunta";

export const metadata: Metadata = {
  title: "Alta de Pregunta | Capital Humano",
};

export default function NuevaPreguntaPage() {
  return (
    <RoleGuard allowedRoles={["CONSULTOR"]}>
    <AltaPregunta/>
    </RoleGuard>
  );
}