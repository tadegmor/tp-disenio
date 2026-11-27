import RoleGuard from "@/app/components/RoleGuard";
import GestionPreguntas from "@/app/components/GestionPreguntas";

export default function PreguntasPage() {
  return (
    <RoleGuard allowedRoles={["CONSULTOR"]}>
      <GestionPreguntas />
    </RoleGuard>
  );
}