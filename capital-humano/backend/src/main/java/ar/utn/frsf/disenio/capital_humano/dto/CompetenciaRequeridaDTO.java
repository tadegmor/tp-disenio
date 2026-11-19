package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetenciaRequeridaDTO {
    private Long competenciaId;
    private String nombre;
    private Integer ponderacion;
    /** true si la competencia tiene al menos un factor con las preguntas necesarias para evaluarse. */
    private boolean evaluable;
}