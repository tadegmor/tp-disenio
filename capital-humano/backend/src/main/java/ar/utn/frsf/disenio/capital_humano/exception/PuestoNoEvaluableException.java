package ar.utn.frsf.disenio.capital_humano.exception;

import java.util.List;

/** CU025 9.A: el puesto tiene competencias sin ningún factor apto para ser evaluado (HTTP 422). */
public class PuestoNoEvaluableException extends RuntimeException {

    private final List<String> competencias;

    public PuestoNoEvaluableException(List<String> competencias) {
        super("El puesto seleccionado posee competencias sin factores aptos para ser evaluados");
        this.competencias = List.copyOf(competencias);
    }

    public List<String> getCompetencias() {
        return competencias;
    }
}