import ProximamenteCU from "../../components/ProximamenteCU";

// En Next.js 15+ params es una Promise
export default async function GenerarPreguntaIAPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProximamenteCU
      codigo="CU033"
      titulo="Generar pregunta con IA"
      detalle={`Pregunta #${id}`}
      volverHref="/preguntas/nueva"
    />
  );
}