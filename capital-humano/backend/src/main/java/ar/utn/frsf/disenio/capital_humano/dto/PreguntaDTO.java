package ar.utn.frsf.disenio.capital_humano.dto;

import ar.utn.frsf.disenio.capital_humano.model.TipoPregunta;

public record PreguntaDTO(
        Long id,
        Long factorId,
        String factorNombre,
        String competenciaNombre,
        String nombre,
        String enunciado,
        String descripcion,
        TipoPregunta tipo,
        OpcionRespuestaDTO opcionRespuesta
) {
}