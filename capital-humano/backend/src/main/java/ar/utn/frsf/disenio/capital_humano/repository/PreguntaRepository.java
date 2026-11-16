package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository 
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    
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
}
