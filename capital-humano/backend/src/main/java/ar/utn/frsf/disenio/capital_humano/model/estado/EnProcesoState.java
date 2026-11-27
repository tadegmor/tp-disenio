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

    /** CU026 1.C y 8.A: ya fue iniciado, se retoma en el bloque pendiente sin cambiar de estado. */
    @Override
    public void iniciar(Cuestionario cuestionario, LocalDateTime ahora) {
        // no hay transición
    }

    @Override
    public void completar(Cuestionario cuestionario, LocalDateTime ahora) {
        cuestionario.setFechaFin(ahora);
        cuestionario.transicionarA(EstadoCuestionario.COMPLETO, ahora);
    }

    /** CU026 1.A: tiempo máximo para completar o cantidad máxima de accesos superados. */
    @Override
    public void vencer(Cuestionario cuestionario, LocalDateTime ahora) {
        if (cuestionario.superoTiempoMaximoCompletar(ahora) || cuestionario.superoCantidadMaximaAccesos()) {
            cuestionario.transicionarA(EstadoCuestionario.INCOMPLETO, ahora);
        }
    }
}