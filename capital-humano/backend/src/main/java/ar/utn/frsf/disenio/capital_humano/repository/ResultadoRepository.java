package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Resultado;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultadoRepository extends JpaRepository<Resultado, Long> {

    @Query("""
            SELECT r FROM Resultado r
              JOIN FETCH r.cuestionario cu
              JOIN FETCH r.competencia comp
              JOIN FETCH cu.candidato cand
            WHERE cu.evaluacion.id = :evaluacionId
            """)
    List<Resultado> buscarPorEvaluacion(@Param("evaluacionId") Long evaluacionId);

    @Query("""
            SELECT r FROM Resultado r
              JOIN FETCH r.competencia
            WHERE r.cuestionario.id = :cuestionarioId
            """)
    List<Resultado> buscarPorCuestionario(@Param("cuestionarioId") Long cuestionarioId);
}