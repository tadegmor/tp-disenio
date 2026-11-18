package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
    @Query("SELECT c FROM Candidato c WHERE " +
           "(:apellido IS NULL OR LOWER(c.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))) AND " +
           "(:nombre IS NULL OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:numeroCandidato IS NULL OR c.numeroCandidato LIKE CONCAT('%', :numeroCandidato, '%')) AND " +
           "c.eliminado = false")
    List<Candidato> buscarPorFiltros(@Param("apellido") String apellido,
                                      @Param("nombre") String nombre,
                                      @Param("numeroCandidato") String numeroCandidato);
}