package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import java.time.LocalDateTime;

/** Patrón State: cada estado del cuestionario decide qué puede hacerse y a qué estado pasa. */
public interface EstadoCuestionarioState {

    EstadoCuestionario getEstado();

    /** CU025 (6.A): solo los cuestionarios activos o en proceso impiden evaluar de nuevo al candidato. */
    boolean permiteNuevaEvaluacion();

    /** CU026 paso 3: el candidato acepta las instrucciones y comienza (ACTIVO a EN_PROCESO); en proceso, retoma (1.C). */
    void iniciar(Cuestionario cuestionario, LocalDateTime ahora);

    /** CU026 paso 8: se respondió el último bloque (EN_PROCESO a COMPLETO). */
    void completar(Cuestionario cuestionario, LocalDateTime ahora);

    /** CU032 / CU026 1.A y 1.B: pasa al estado correspondiente si se superó el plazo; si no, no hace nada. */
    void vencer(Cuestionario cuestionario, LocalDateTime ahora);
}