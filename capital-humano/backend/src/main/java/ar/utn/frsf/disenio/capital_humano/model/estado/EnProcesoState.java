package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import java.time.LocalDateTime;

final class EnProcesoState extends EstadoCuestionarioBase {

    @Override
    public EstadoCuestionario getEstado() {
        return EstadoCuestionario.EN_PROCESO;
    }

    @Override
    public boolean permiteNuevaEvaluacion() {
        return false;
    }

    @Override
    public void completar(Cuestionario cuestionario, LocalDateTime ahora) {
        cuestionario.setFechaFin(ahora);
        cuestionario.transicionarA(EstadoCuestionario.COMPLETO, ahora);
    }

    @Override
    public void vencer(Cuestionario cuestionario, LocalDateTime ahora) {
        if (cuestionario.superoTiempoMaximoCompletar(ahora)) {
            cuestionario.transicionarA(EstadoCuestionario.INCOMPLETO, ahora);
        }
    }
}