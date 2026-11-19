package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {

    // ---- CU020 (sin cambios) ----
    @Query("""
            SELECT p FROM Pregunta p
            JOIN FETCH p.factor f
            JOIN FETCH f.competencia c
            JOIN FETCH p.opcionRespuesta o
            WHERE LOWER(c.nombre) LIKE LOWER (CONCAT('%', :competencia, '%'))
            AND LOWER (f.nombre) LIKE LOWER (CONCAT('%', :factor, '%'))
            AND LOWER (p.nombre) LIKE LOWER (CONCAT('%', :nombre, '%'))
            ORDER BY c.nombre, f.nombre, p.nombre
            """)
    List<Pregunta> buscarPreguntasPorFiltros(@Param("competencia") String competencia,
                                             @Param("factor") String factor,
                                             @Param("nombre") String nombre);

    // ---- CU025 (9.A) ----
    /**
     * Ids de las competencias (entre las indicadas) que tienen al menos un factor con
     * {@code minimoPreguntas} o más preguntas. Las preguntas eliminadas no cuentan
     * porque Pregunta tiene @SQLRestriction("eliminado = false").
     */
    @Query("""
            SELECT DISTINCT c.id
            FROM Pregunta p
              JOIN p.factor f
              JOIN f.competencia c
            WHERE c.id IN :competenciaIds
            GROUP BY f.id, c.id
            HAVING COUNT(p.id) >= :minimoPreguntas
            """)
    List<Long> competenciasConFactoresEvaluables(@Param("competenciaIds") Collection<Long> competenciaIds,
                                                 @Param("minimoPreguntas") long minimoPreguntas);
}