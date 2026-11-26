package ar.utn.frsf.disenio.capital_humano.dto;

public record ItemOpcionDTO(
        Long id,
        Integer orden,
        String descripcion,
        Double ponderacion
) {
}