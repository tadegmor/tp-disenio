package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Sin ponderación: el candidato no debe conocer el puntaje de cada opción. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemOpcionDTO {
    private Long id;
    private String descripcion;
}
