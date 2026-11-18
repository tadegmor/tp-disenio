package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CuestionarioRepository extends JpaRepository<Cuestionario, Long> {
    @Query("SELECT c FROM Cuestionario c WHERE c.candidato.id IN :candidatoIds AND c.estado IN ('ACTIVO', 'EN_PROCESO')")
    List<Cuestionario> buscarActivosPorCandidatos(@Param("candidatoIds") List<Long> candidatoIds);
}