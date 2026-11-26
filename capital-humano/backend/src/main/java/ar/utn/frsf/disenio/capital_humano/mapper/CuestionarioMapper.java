package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.BloqueCuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.ItemOpcionDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PreguntaCuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.model.BloqueCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.ItemOpcion;
import ar.utn.frsf.disenio.capital_humano.model.PonderacionOpcion;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import java.util.Comparator;
import org.springframework.stereotype.Component;

@Component
public class CuestionarioMapper {

    public CuestionarioDTO mapToDTO(Cuestionario cuestionario) {
        Candidato candidato = cuestionario.getCandidato();
        return CuestionarioDTO.builder()
                .cuestionarioId(cuestionario.getId())
                .estado(cuestionario.getEstado())
                .apellidoCandidato(candidato.getApellido())
                .nombreCandidato(candidato.getNombre())
                .nombrePuesto(cuestionario.getEvaluacion().getPuesto().getNombre())
                .build();
    }

    public BloqueCuestionarioDTO mapToDTO(BloqueCuestionario bloque) {
        return BloqueCuestionarioDTO.builder()
                .bloqueId(bloque.getId())
                .numero(bloque.getNumero())
                .cantidadBloques(bloque.getCuestionario().getBloques().size())
                .preguntas(bloque.getPreguntas().stream().map(this::mapToDTO).toList())
                .build();
    }

    private PreguntaCuestionarioDTO mapToDTO(Pregunta pregunta) {
        return PreguntaCuestionarioDTO.builder()
                .preguntaId(pregunta.getId())
                .enunciado(pregunta.getEnunciado())
                .opciones(pregunta.getPonderaciones().stream()
                        .map(PonderacionOpcion::getItemOpcion)
                        .sorted(Comparator.comparing(ItemOpcion::getOrden))
                        .map(item -> new ItemOpcionDTO(item.getId(), item.getDescripcion()))
                        .toList())
                .build();
    }
}
