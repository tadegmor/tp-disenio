package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Factor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactorRepository extends JpaRepository<Factor, Long> {

    List<Factor> findByCompetenciaIdOrderByNombreAsc(Long competenciaId);
}