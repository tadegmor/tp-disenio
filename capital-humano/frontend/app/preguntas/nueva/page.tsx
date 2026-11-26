import RoleGuard from "@/app/components/RoleGuard";
import ProximamenteCU from "@/app/components/ProximamenteCU";

// Provisorio hasta implementar el CU021 (Dar de alta pregunta)
export default function NuevaPreguntaPage() {
  return (
    <RoleGuard allowedRoles={["CONSULTOR"]}>
    <ProximamenteCU
      codigo="CU021"
      titulo="Dar de alta pregunta"
      volverHref="/preguntas"
    />
    </RoleGuard>
  );
}
