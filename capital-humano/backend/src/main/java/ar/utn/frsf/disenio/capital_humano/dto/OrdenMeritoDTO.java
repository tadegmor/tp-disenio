package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenMeritoDTO {
    private CandidatoDTO candidato;
    private CuestionarioDTO cuestionario;
    private Double puntajeObtenido;
    private Boolean cumplePonderacionesMinimas;
}