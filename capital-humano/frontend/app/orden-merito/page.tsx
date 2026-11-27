import type { Metadata } from "next";
import RoleGuard from "@/app/components/RoleGuard";
import EmitirOrdenMerito from "@/app/components/EmitirOrdenMerito";

export const metadata: Metadata = {
  title: "Emisión de Orden de Mérito | Capital Humano",
};

export default function OrdenMeritoPage() {
  return (
    <RoleGuard allowedRoles={["CONSULTOR"]}>
      <EmitirOrdenMerito />
    </RoleGuard>
  );
}