package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.FactorDTO;
import ar.utn.frsf.disenio.capital_humano.repository.FactorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FactorService {

    private final FactorRepository factorRepository;

    public FactorService(FactorRepository factorRepository) {
        this.factorRepository = factorRepository;
    }

    @Transactional(readOnly = true)
    public List<FactorDTO> buscarPorCompetencia(Long competenciaId) {
        return factorRepository.findByCompetenciaIdOrderByNombreAsc(competenciaId).stream()
                .map(f -> new FactorDTO(
                        f.getId(),
                        f.getNombre(),
                        f.getDescripcion(),
                        f.getCompetencia().getId()))
                .toList();
    }
}