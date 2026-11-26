package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.ItemOpcionDTO;
import ar.utn.frsf.disenio.capital_humano.dto.OpcionRespuestaDTO;
import ar.utn.frsf.disenio.capital_humano.model.OpcionRespuesta;
import ar.utn.frsf.disenio.capital_humano.repository.OpcionRespuestaRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OpcionRespuestaService {

    private final OpcionRespuestaRepository opcionRespuestaRepository;

    public OpcionRespuestaService(OpcionRespuestaRepository opcionRespuestaRepository) {
        this.opcionRespuestaRepository = opcionRespuestaRepository;
    }

    @Transactional(readOnly = true)
    public List<OpcionRespuestaDTO> listarActivas() {
        return opcionRespuestaRepository.listarActivasConItems().stream()
                .map(this::mapToDTO)
                .toList();
    }

    private OpcionRespuestaDTO mapToDTO(OpcionRespuesta opcion) {
        List<ItemOpcionDTO> items = opcion.getItems().stream()
                .sorted(Comparator.comparing(item -> item.getOrden()))
                .map(item -> new ItemOpcionDTO(
                        item.getId(),
                        item.getOrden(),
                        item.getDescripcion(),
                        null))
                .toList();

        return new OpcionRespuestaDTO(
                opcion.getId(),
                opcion.getNombre(),
                opcion.getDescripcion(),
                items);
    }
}