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
public class PreguntaCuestionarioDTO {
    private Long preguntaId;
    private String enunciado;
    private List<OpcionCuestionarioDTO> opciones;
}
