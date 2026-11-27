package ar.utn.frsf.disenio.capital_humano.dto;

public record FactorDTO(
        Long id,
        String nombre,
        String descripcion,
        Long competenciaId
) {
}