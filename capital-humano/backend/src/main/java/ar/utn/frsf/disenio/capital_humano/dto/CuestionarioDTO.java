package ar.utn.frsf.disenio.capital_humano.dto;

import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** CU026 paso 1: el estado ya viene verificado (1.A / 1.B). */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuestionarioDTO {
    private Long cuestionarioId;
    private EstadoCuestionario estado;
    private String apellidoCandidato;
    private String nombreCandidato;
    private String nombrePuesto;
}
