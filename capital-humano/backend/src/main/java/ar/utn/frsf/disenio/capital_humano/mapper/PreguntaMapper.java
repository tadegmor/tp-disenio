package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.ItemOpcionDTO;
import ar.utn.frsf.disenio.capital_humano.dto.OpcionRespuestaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PreguntaDTO;
import ar.utn.frsf.disenio.capital_humano.model.Factor;
import ar.utn.frsf.disenio.capital_humano.model.OpcionRespuesta;
import ar.utn.frsf.disenio.capital_humano.model.PonderacionOpcion;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
                mapOpcionRespuesta(pregunta));
    }

    public List<PreguntaDTO> mapToDTO(List<Pregunta> preguntas) {
        return preguntas.stream().map(this::mapToDTO).toList();
    }

    private OpcionRespuestaDTO mapOpcionRespuesta(Pregunta pregunta) {
        OpcionRespuesta opcion = pregunta.getOpcionRespuesta();
        if (opcion == null) {
            return null;
        }

        // Indexamos las ponderaciones de esta pregunta por el id del ItemOpcion
        Map<Long, Double> ponderacionesPorItem = pregunta.getPonderaciones().stream()
                .collect(Collectors.toMap(
                        po -> po.getItemOpcion().getId(),
                        PonderacionOpcion::getPonderacion));

        List<ItemOpcionDTO> itemsDTO = opcion.getItems().stream()
                .map(item -> new ItemOpcionDTO(
                        item.getId(),
                        item.getOrden(),
                        item.getDescripcion(),
                        ponderacionesPorItem.get(item.getId())))
                .toList();

        return new OpcionRespuestaDTO(
                opcion.getId(),
                opcion.getNombre(),
                opcion.getDescripcion(),
                itemsDTO);
    }
}