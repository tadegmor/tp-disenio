package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.CompetenciaDTO;
import ar.utn.frsf.disenio.capital_humano.repository.CompetenciaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetenciaService {

    private final CompetenciaRepository competenciaRepository;

    public CompetenciaService(CompetenciaRepository competenciaRepository) {
        this.competenciaRepository = competenciaRepository;
    }

    @Transactional(readOnly = true)
    public List<CompetenciaDTO> listarTodas() {
        return competenciaRepository.findByActivaTrueOrderByNombreAsc().stream()
                .map(c -> new CompetenciaDTO(c.getId(), c.getNombre(), c.getDescripcion()))
                .toList();
    }
}