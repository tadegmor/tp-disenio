package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.exception.TransicionInvalidaException;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import java.time.LocalDateTime;

/** Comportamiento por defecto: las transiciones no permitidas lanzan excepción y vencer() no hace nada. */
abstract class EstadoCuestionarioBase implements EstadoCuestionarioState {

    @Override
    public void iniciar(Cuestionario cuestionario, LocalDateTime ahora) {
        throw new TransicionInvalidaException(getEstado(), "iniciar");
    }

    @Override
    public void completar(Cuestionario cuestionario, LocalDateTime ahora) {
        throw new TransicionInvalidaException(getEstado(), "completar");
    }

    @Override
    public void vencer(Cuestionario cuestionario, LocalDateTime ahora) {
        // no hay plazo que vencer en este estado
    }
}