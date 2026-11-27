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

    // ---- CU021 (5.C.1 y 5.C.2) ----
    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
            FROM Pregunta p
            WHERE p.factor.id = :factorId
              AND UPPER(TRIM(p.nombre)) = UPPER(TRIM(:nombre))
            """)
    boolean existePorNombre(@Param("factorId") Long factorId,
                            @Param("nombre") String nombre);

    @Query("""
            SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
            FROM Pregunta p
            WHERE p.factor.id = :factorId
              AND UPPER(TRIM(p.enunciado)) = UPPER(TRIM(:enunciado))
            """)
    boolean existePorEnunciado(@Param("factorId") Long factorId,
                               @Param("enunciado") String enunciado);

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

    // ---- CU026 (paso 3) ----
    /** Preguntas activas de todos los factores de las competencias indicadas. */
    @Query("""
            SELECT p FROM Pregunta p
              JOIN FETCH p.factor f
            WHERE f.competencia.id IN :competenciaIds
            """)
    List<Pregunta> buscarPorCompetencias(@Param("competenciaIds") Collection<Long> competenciaIds);
}