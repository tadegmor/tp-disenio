import type { Metadata } from "next";
import CompletarCuestionario from "../components/CompletarCuestionario";
import { CUESTIONARIO_CANDIDATO_ID } from "../config/navigation";

export const metadata: Metadata = {
  title: "Cuestionario | C@pital Humano",
};

export default function CuestionarioPage() {
  return <CompletarCuestionario cuestionarioId={CUESTIONARIO_CANDIDATO_ID} />;
}
