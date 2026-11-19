package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import java.time.LocalDateTime;

final class ActivoState extends EstadoCuestionarioBase {

    @Override
    public EstadoCuestionario getEstado() {
        return EstadoCuestionario.ACTIVO;
    }

    @Override
    public boolean permiteNuevaEvaluacion() {
        return false;
    }

    @Override
    public void iniciar(Cuestionario cuestionario, LocalDateTime ahora) {
        cuestionario.setFechaInicio(ahora);
        cuestionario.transicionarA(EstadoCuestionario.EN_PROCESO, ahora);
    }

    @Override
    public void vencer(Cuestionario cuestionario, LocalDateTime ahora) {
        if (cuestionario.superoTiempoMaximoActivo(ahora)) {
            cuestionario.transicionarA(EstadoCuestionario.SIN_CONTESTAR, ahora);
        }
    }
}