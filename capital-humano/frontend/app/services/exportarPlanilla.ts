import type { EvaluacionGeneradaDTO } from "../types/evaluacion";

function escaparHtml(valor: string | number | null | undefined): string {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** CU025 pasos 14-17: planilla con los candidatos y sus claves (tabla HTML que Excel abre como .xls). */
export function descargarPlanillaEvaluacion(evaluacion: EvaluacionGeneradaDTO) {
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

  const blob = new Blob(["\ufeff", contenidoXls], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = evaluacion.nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}