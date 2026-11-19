import type { Metadata } from "next";
import EvaluarCandidato from "../../components/EvaluarCandidato";

export const metadata: Metadata = {
  title: "Evaluar a Candidato | C@pital Humano",
};

export default function NuevaEvaluacionPage() {
  return <EvaluarCandidato />;
}