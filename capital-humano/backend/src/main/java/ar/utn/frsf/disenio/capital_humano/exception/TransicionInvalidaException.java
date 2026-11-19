package ar.utn.frsf.disenio.capital_humano.exception;

import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;

public class TransicionInvalidaException extends IllegalStateException {

    public TransicionInvalidaException(EstadoCuestionario estado, String accion) {
        super("No se puede " + accion + " un cuestionario en estado " + estado);
    }
}