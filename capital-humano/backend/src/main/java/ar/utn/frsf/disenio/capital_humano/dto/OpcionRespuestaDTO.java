package ar.utn.frsf.disenio.capital_humano.dto;

import java.util.List;

public record OpcionRespuestaDTO(
        Long id,
        String nombre,
        String descripcion,
        List<ItemOpcionDTO> items
) {
}