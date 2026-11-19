package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

    /** Búsqueda "contiene". Un filtro vacío ("") coincide con todo; el service nunca pasa null. */
    @Query("""
            SELECT c FROM Candidato c
            WHERE c.eliminado = false
              AND LOWER(c.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))
              AND LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))
              AND c.numeroCandidato LIKE CONCAT('%', :numeroCandidato, '%')
            ORDER BY c.apellido, c.nombre
            """)
    List<Candidato> buscarPorFiltros(@Param("apellido") String apellido,
                                     @Param("nombre") String nombre,
                                     @Param("numeroCandidato") String numeroCandidato);

    List<Candidato> findAllByIdInAndEliminadoFalse(Collection<Long> ids);
}