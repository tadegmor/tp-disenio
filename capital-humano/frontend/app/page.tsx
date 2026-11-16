import type { Metadata } from "next";
import GestionPreguntas from "./components/GestionPreguntas";

export const metadata: Metadata = {
  title: "Gestión de Preguntas | Capital Humano",
};

export default function PreguntasPage() {
  return <GestionPreguntas />;
}
