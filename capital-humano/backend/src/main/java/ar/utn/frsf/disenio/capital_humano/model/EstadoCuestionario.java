package ar.utn.frsf.disenio.capital_humano.model;

/** Valor que se persiste. El comportamiento de cada estado vive en el paquete model.estado (patrón State). */
public enum EstadoCuestionario {
    ACTIVO,
    SIN_CONTESTAR,
    EN_PROCESO,
    INCOMPLETO,
    COMPLETO
}