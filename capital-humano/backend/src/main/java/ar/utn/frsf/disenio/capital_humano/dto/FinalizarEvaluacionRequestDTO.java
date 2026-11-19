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
public class FinalizarEvaluacionRequestDTO {
    private Long puestoId;
    private List<CandidatoClaveDTO> candidatos;
}