package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FiltroCandidatoDTO {
    private String apellido;
    private String nombre;
    private String numeroCandidato;
}