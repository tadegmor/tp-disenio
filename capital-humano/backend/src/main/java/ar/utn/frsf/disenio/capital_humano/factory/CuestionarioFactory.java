package ar.utn.frsf.disenio.capital_humano.factory;

import ar.utn.frsf.disenio.capital_humano.config.CuestionarioProperties;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Evaluacion;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Patrón Factory: único lugar donde se arma un cuestionario nuevo. Todos los cuestionarios de una
 * evaluación salen con los mismos parámetros (requisito "mismo modelo" del CU025).
 */
@Component
@RequiredArgsConstructor
public class CuestionarioFactory {

    private final CuestionarioProperties parametros;

    public Cuestionario crearActivo(Evaluacion evaluacion, Candidato candidato, String claveIngreso, LocalDateTime ahora) {
        Cuestionario cuestionario = new Cuestionario();
        cuestionario.setCandidato(candidato);
        cuestionario.setClaveIngreso(claveIngreso);
        cuestionario.setCantidadPreguntasPorFactor(parametros.getCantidadPreguntasPorFactor());
        cuestionario.setCantidadPreguntasPorBloque(parametros.getCantidadPreguntasPorBloque());
        cuestionario.setTiempoMaximoActivo(parametros.getTiempoMaximoActivoHoras());
        cuestionario.setTiempoMaximoCompletar(parametros.getTiempoMaximoCompletarMinutos());
        cuestionario.setCantidadMaximaAccesos(parametros.getCantidadMaximaAccesos());
        cuestionario.activar(ahora);
        evaluacion.agregarCuestionario(cuestionario);
        return cuestionario;
    }
}