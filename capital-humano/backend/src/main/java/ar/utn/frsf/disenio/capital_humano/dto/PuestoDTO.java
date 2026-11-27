package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuestoDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String empresa;
    private Integer cantidadCandidatos;
    private Integer evaluacionesCompletas;
}