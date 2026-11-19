package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.PuestoCompetencia;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PuestoCompetenciaRepository extends JpaRepository<PuestoCompetencia, Long> {

    @Query("""
            SELECT pc FROM PuestoCompetencia pc
              JOIN FETCH pc.competencia c
            WHERE pc.puesto.id = :puestoId
            ORDER BY c.nombre
            """)
    List<PuestoCompetencia> buscarPorPuesto(@Param("puestoId") Long puestoId);
}