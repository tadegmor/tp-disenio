package ar.utn.frsf.disenio.capital_humano.exception;

import java.util.List;

/** Conflicto con el estado actual del sistema (HTTP 409). "detalles" lista a los involucrados. */
public class ConflictoException extends RuntimeException {

    private final List<String> detalles;

    public ConflictoException(String mensaje, List<String> detalles) {
        super(mensaje);
        this.detalles = List.copyOf(detalles);
    }

    public List<String> getDetalles() {
        return detalles;
    }
}