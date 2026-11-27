import type { EvaluacionGeneradaDTO } from "../types/evaluacion";

export interface ResultadoExportacion {
  /** Nombre del archivo exportado según el CU025. */
  nombreArchivo: string;
}

/** El consultor cerró el cuadro "Guardar como" sin guardar (CU025 16.A: vuelve a la pregunta de exportación). */
export class ExportacionCancelada extends Error {
  constructor() {
    super("Exportación cancelada por el usuario");
    this.name = "ExportacionCancelada";
  }
}

// File System Access API (Chrome, Edge, Opera). No está en lib.dom, se tipa lo mínimo que se usa.
interface ManejadorArchivo {
  name: string;
  createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }>;
}
type SelectorGuardado = (opciones: {
  suggestedName: string;
  startIn?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}) => Promise<ManejadorArchivo>;

function escaparHtml(valor: string | number | null | undefined): string {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function construirPlanilla(evaluacion: EvaluacionGeneradaDTO): Blob {
  const filas = evaluacion.candidatos
    .map(
      (c) => `
        <tr>
          <td>${escaparHtml(c.apellidoCandidato)}</td>
          <td>${escaparHtml(c.nombreCandidato)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.tipoDocumento)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.numeroDocumento)}</td>
          <td style="mso-number-format:'\\@'">${escaparHtml(c.claveIngreso)}</td>
        </tr>`,
    )
    .join("");

  const contenidoXls = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Tipo documento</th>
              <th>Nro documento</th>
              <th>Clave de ingreso</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </body>
    </html>
  `.trim();

  return new Blob(["\ufeff", contenidoXls], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
}

function descargarConEnlace(blob: Blob, nombreArchivo: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/**
 * CU025 pasos 15-17. Con "Guardar como" (Chrome/Edge) el consultor elige dónde guardar el archivo.
 * En otros navegadores se descarga con enlace directo.
 * Debe llamarse directamente desde un click: el selector exige un gesto del usuario.
 */
export async function exportarPlanillaEvaluacion(
  evaluacion: EvaluacionGeneradaDTO,
): Promise<ResultadoExportacion> {
  const blob = construirPlanilla(evaluacion);
  const selector = (window as unknown as { showSaveFilePicker?: SelectorGuardado }).showSaveFilePicker;
  if (!selector) {
    descargarConEnlace(blob, evaluacion.nombreArchivo);
    return { nombreArchivo: evaluacion.nombreArchivo };
  }

  try {
    const archivo = await selector.call(window, {
      suggestedName: evaluacion.nombreArchivo,
      startIn: "documents",
      types: [{ description: "Microsoft Excel (*.xls)", accept: { "application/vnd.ms-excel": [".xls"] } }],
    });
    const escritura = await archivo.createWritable();
    await escritura.write(blob);
    await escritura.close();

    return { nombreArchivo: evaluacion.nombreArchivo };
  } catch (err: unknown) {
    const nombreError =
      err instanceof Error ? err.name : (err as { name?: string } | null)?.name;
    if (nombreError === "AbortError") {
      throw new ExportacionCancelada();
    }
    throw err;
  }
}