package ar.utn.frsf.disenio.capital_humano.model.estado;

import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;

/** Resuelve el objeto State a partir del valor persistido. Los estados no tienen datos, por eso se comparten. */
public final class EstadoCuestionarioFactory {

    private static final Map<EstadoCuestionario, EstadoCuestionarioState> ESTADOS =
            new EnumMap<>(EstadoCuestionario.class);

    static {
        ESTADOS.put(EstadoCuestionario.ACTIVO, new ActivoState());
        ESTADOS.put(EstadoCuestionario.EN_PROCESO, new EnProcesoState());
        ESTADOS.put(EstadoCuestionario.SIN_CONTESTAR, new SinContestarState());
        ESTADOS.put(EstadoCuestionario.INCOMPLETO, new IncompletoState());
        ESTADOS.put(EstadoCuestionario.COMPLETO, new CompletoState());
    }

    private EstadoCuestionarioFactory() {
    }

    public static EstadoCuestionarioState de(EstadoCuestionario estado) {
        return ESTADOS.get(Objects.requireNonNull(estado, "El cuestionario no tiene estado"));
    }
}