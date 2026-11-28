package ar.utn.frsf.disenio.capital_humano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Clave de ingreso que el candidato recibió en el Excel del CU025 (CU001 3.A). */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidarClaveRequestDTO {
    private String clave;
}
