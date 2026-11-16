package ar.utn.frsf.disenio.capital_humano.exception;

public class PreguntaNoEncontradaException extends RuntimeException {
    public PreguntaNoEncontradaException(Long id) {
        super("No existe la pregunta con id " + id);
    }
}