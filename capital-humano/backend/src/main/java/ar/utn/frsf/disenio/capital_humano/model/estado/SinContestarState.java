package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;

/** Estado final: no admite transiciones y el candidato puede volver a ser evaluado. */
final class SinContestarState extends EstadoCuestionarioBase {

    @Override
    public EstadoCuestionario getEstado() {
        return EstadoCuestionario.SIN_CONTESTAR;
    }

    @Override
    public boolean permiteNuevaEvaluacion() {
        return true;
    }
}