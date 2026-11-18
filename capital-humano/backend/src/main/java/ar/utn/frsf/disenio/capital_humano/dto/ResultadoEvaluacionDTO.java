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
    private Long cuestionarioId;
    private String apellidoCandidato;
    private String nombreCandidato;
    private String tipoDocumento;
    private String numeroDocumento;
    private String claveIngreso;
}