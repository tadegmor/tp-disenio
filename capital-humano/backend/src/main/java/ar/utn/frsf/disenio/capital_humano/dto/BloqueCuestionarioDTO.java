package ar.utn.frsf.disenio.capital_humano.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** CU026 pasos 4, 1.C y 8.A: el paso del wizard que se presenta. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloqueCuestionarioDTO {
    private Long bloqueId;
    private Integer numero;
    private Integer cantidadBloques;
    private List<PreguntaCuestionarioDTO> preguntas;
}
