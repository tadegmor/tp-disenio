package ar.utn.frsf.disenio.capital_humano.exception;

import java.util.List;

public class SolicitudInvalidaException extends RuntimeException {

    private final List<String> detalles;

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
        this.detalles = List.of();
    }

    public SolicitudInvalidaException(String mensaje, List<String> detalles) {
        super(mensaje);
        this.detalles = detalles == null ? List.of() : List.copyOf(detalles);
    }

    public List<String> getDetalles() {
        return detalles;
    }
}