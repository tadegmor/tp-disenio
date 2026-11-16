package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.PreguntaDTO;
import ar.utn.frsf.disenio.capital_humano.model.Factor;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class PreguntaMapper {

    public PreguntaDTO mapToDTO(Pregunta pregunta) {
        Factor factor = pregunta.getFactor();
        return new PreguntaDTO(
                pregunta.getId(),
                factor.getId(),
                factor.getNombre(),
                factor.getCompetencia().getNombre(),
                pregunta.getNombre(),
                pregunta.getEnunciado(),
                pregunta.getDescripcion(),
                pregunta.getTipo(),
                pregunta.getOpcionRespuesta().getId());
    }

    public List<PreguntaDTO> mapToDTO(List<Pregunta> preguntas) {
        return preguntas.stream().map(this::mapToDTO).toList();
    }
}