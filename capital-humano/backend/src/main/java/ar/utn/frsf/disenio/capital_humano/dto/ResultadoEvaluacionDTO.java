package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultadoEvaluacionDTO {
    /** null mientras la evaluación está solo preparada (todavía no se guardó). */
    private Long cuestionarioId;
    private Long candidatoId;
    private String apellidoCandidato;
    private String nombreCandidato;
    private String numeroCandidato;
    private String tipoDocumento;
    private String numeroDocumento;
    private String claveIngreso;
}