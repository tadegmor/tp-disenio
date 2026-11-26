package ar.utn.frsf.disenio.capital_humano.repository;

import ar.utn.frsf.disenio.capital_humano.model.OpcionRespuesta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OpcionRespuestaRepository extends JpaRepository<OpcionRespuesta, Long> {

    @Query("SELECT DISTINCT o FROM OpcionRespuesta o LEFT JOIN FETCH o.items WHERE o.activa = true ORDER BY o.nombre ASC")
    List<OpcionRespuesta> listarActivasConItems();
}