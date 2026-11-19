package ar.utn.frsf.disenio.capital_humano.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluacionGeneradaDTO {
    private Long evaluacionId;
    private Long puestoId;
    private String nombrePuesto;
    private String empresa;
    private LocalDateTime fechaCreacion;
    /** Nombre para el Excel: aaaa-mm-dd-hh-mm-NombreFunción.xls */
    private String nombreArchivo;
    private List<ResultadoEvaluacionDTO> candidatos;
}