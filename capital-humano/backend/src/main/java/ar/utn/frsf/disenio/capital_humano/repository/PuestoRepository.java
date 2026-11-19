package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Long> {

    Optional<Puesto> findByIdAndEliminadoFalse(Long id);

    /** Búsqueda "contiene" sobre puestos no eliminados. Un filtro vacío ("") coincide con todo. */
    @Query("""
            SELECT p FROM Puesto p
            WHERE p.eliminado = false
              AND LOWER(p.codigo) LIKE LOWER(CONCAT('%', :codigo, '%'))
              AND LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))
              AND LOWER(p.empresa) LIKE LOWER(CONCAT('%', :empresa, '%'))
            ORDER BY p.empresa, p.nombre
            """)
    List<Puesto> buscarPorFiltros(@Param("codigo") String codigo,
                                  @Param("nombre") String nombre,
                                  @Param("empresa") String empresa);
}