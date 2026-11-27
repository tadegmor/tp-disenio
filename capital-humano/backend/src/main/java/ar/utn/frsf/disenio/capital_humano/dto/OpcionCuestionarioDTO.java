package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ítem de opción que ve el candidato en el CU026. A diferencia de ItemOpcionDTO (CU021),
 * no lleva la ponderación: el candidato no debe conocer el puntaje de cada opción.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpcionCuestionarioDTO {
    private Long id;
    private String descripcion;
}
