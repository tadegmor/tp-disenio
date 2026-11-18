import ProximamenteCU from "../../../components/ProximamenteCU";

// En Next.js 15+ params es una Promise
export default async function ModificarPreguntaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProximamenteCU
      codigo="CU022"
      titulo="Modificar pregunta"
      detalle={`Pregunta #${id}`}
      volverHref="/preguntas"
    />
  );
}
