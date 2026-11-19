package ar.utn.frsf.disenio.capital_humano.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuestoCompetenciasDTO {
    private Long puestoId;
    private String codigo;
    private String nombre;
    private String empresa;
    private List<CompetenciaRequeridaDTO> competencias;
    private List<String> competenciasNoEvaluables;
    /** true si el puesto tiene competencias y todas son evaluables. */
    private boolean evaluable;
}