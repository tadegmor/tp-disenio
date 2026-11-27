package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Evaluacion;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {

    /** Evaluación con su puesto y los candidatos de cada cuestionario (la usa la exportación a Excel). */
    @Query("""
            SELECT DISTINCT e FROM Evaluacion e
              JOIN FETCH e.puesto
              LEFT JOIN FETCH e.cuestionarios cu
              LEFT JOIN FETCH cu.candidato
            WHERE e.id = :id
            """)
    Optional<Evaluacion> buscarCompletaPorId(@Param("id") Long id);

    @Query("""
            SELECT DISTINCT e FROM Evaluacion e
              LEFT JOIN FETCH e.cuestionarios cu
              LEFT JOIN FETCH cu.candidato
            WHERE e.puesto.id = :puestoId
            ORDER BY e.fechaCreacion DESC
            """)
    List<Evaluacion> buscarPorPuesto(@Param("puestoId") Long puestoId);
}