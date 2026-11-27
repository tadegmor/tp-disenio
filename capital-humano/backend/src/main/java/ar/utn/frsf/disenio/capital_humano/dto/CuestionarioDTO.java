package ar.utn.frsf.disenio.capital_humano.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuestionarioDTO {
    private String estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private LocalDateTime ultimoIngreso;
    private Integer cantidadAccesos;
}