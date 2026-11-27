package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CuestionarioRepository extends JpaRepository<Cuestionario, Long> {

    /** Todos los cuestionarios de los candidatos; qué estados bloquean lo decide el patrón State en el service. */
    @Query("SELECT c FROM Cuestionario c JOIN FETCH c.candidato cand WHERE cand.id IN :candidatoIds")
    List<Cuestionario> buscarPorCandidatos(@Param("candidatoIds") Collection<Long> candidatoIds);
    
    boolean existsByClaveIngreso(String claveIngreso);

    @Query("""
        SELECT DISTINCT c FROM Cuestionario c
          JOIN FETCH c.candidato cand
          JOIN FETCH c.evaluacion ev
        WHERE ev.id IN :evaluacionIds
          AND cand.eliminado = false
        """)
    List<Cuestionario> buscarPorEvaluaciones(@Param("evaluacionIds") Collection<Long> evaluacionIds);
}