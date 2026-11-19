package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatoDTO {
    private Long id;
    private String apellido;
    private String nombre;
    private String tipoDocumento;
    private String numeroDocumento;
    private String numeroCandidato;
    /** Solo se completa en la validación 6.A: estado del cuestionario que impide una nueva evaluación. */
    private String estadoCuestionario;
}