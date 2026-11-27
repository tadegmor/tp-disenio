package ar.utn.frsf.disenio.capital_humano.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler({CriterioBusquedaInvalidoException.class, SolicitudInvalidaException.class})
    public ProblemDetail solicitudInvalida(RuntimeException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        if (ex instanceof SolicitudInvalidaException sie && !sie.getDetalles().isEmpty()) {
            problema.setProperty("detalles", sie.getDetalles());
        }
        return problema;
    }

    @ExceptionHandler({PreguntaNoEncontradaException.class, RecursoNoEncontradoException.class})
    public ProblemDetail noEncontrado(RuntimeException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictoException.class)
    public ProblemDetail conflicto(ConflictoException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problema.setProperty("detalles", ex.getDetalles());
        return problema;
    }

    @ExceptionHandler(TransicionInvalidaException.class)
    public ProblemDetail transicionInvalida(TransicionInvalidaException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(PuestoNoEvaluableException.class)
    public ProblemDetail puestoNoEvaluable(PuestoNoEvaluableException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(422), ex.getMessage());
        problema.setProperty("detalles", ex.getCompetencias());
        return problema;
    }
}