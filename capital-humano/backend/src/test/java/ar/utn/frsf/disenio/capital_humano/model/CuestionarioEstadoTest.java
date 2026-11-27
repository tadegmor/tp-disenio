package ar.utn.frsf.disenio.capital_humano;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import ar.utn.frsf.disenio.capital_humano.exception.TransicionInvalidaException;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;

class CuestionarioEstadoTest {

    private static final LocalDateTime T0 = LocalDateTime.of(2026, 5, 1, 10, 0);

    private Cuestionario cuestionario;

    @BeforeEach
    void crearCuestionarioActivo() {
        cuestionario = new Cuestionario();
        cuestionario.setTiempoMaximoActivo(72);
        cuestionario.setTiempoMaximoCompletar(90);
        cuestionario.setCantidadMaximaAccesos(3);
        cuestionario.activar(T0);
    }

    @Test
    void activoYEnProcesoImpidenNuevaEvaluacion() {
        assertThat(cuestionario.permiteNuevaEvaluacion()).isFalse();
        cuestionario.iniciar(T0.plusHours(1));
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.EN_PROCESO);
        assertThat(cuestionario.permiteNuevaEvaluacion()).isFalse();
    }

    @Test
    void iniciarRegistraFechaDeInicio() {
        LocalDateTime inicio = T0.plusHours(2);
        cuestionario.iniciar(inicio);
        assertThat(cuestionario.getFechaInicio()).isEqualTo(inicio);
        assertThat(cuestionario.getFechaCambioEstado()).isEqualTo(inicio);
    }

    @Test
    void activoVencidoPasaASinContestar() {
        cuestionario.vencer(T0.plusHours(73));
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.SIN_CONTESTAR);
        assertThat(cuestionario.permiteNuevaEvaluacion()).isTrue();
    }

    @Test
    void activoDentroDelPlazoNoCambia() {
        cuestionario.vencer(T0.plusHours(72));
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.ACTIVO);
    }

    @Test
    void enProcesoVencidoPasaAIncompleto() {
        cuestionario.iniciar(T0.plusHours(1));
        cuestionario.vencer(T0.plusHours(1).plusMinutes(91));
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.INCOMPLETO);
    }

    @Test
    void completarDesdeEnProcesoPasaACompleto() {
        cuestionario.iniciar(T0.plusHours(1));
        LocalDateTime fin = T0.plusHours(1).plusMinutes(30);
        cuestionario.completar(fin);
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.COMPLETO);
        assertThat(cuestionario.getFechaFin()).isEqualTo(fin);
        assertThat(cuestionario.permiteNuevaEvaluacion()).isTrue();
    }

    @Test
    void completarUnCuestionarioActivoEsInvalido() {
        assertThatThrownBy(() -> cuestionario.completar(T0.plusHours(1)))
                .isInstanceOf(TransicionInvalidaException.class);
    }

    @Test
    void unEstadoFinalNoPermiteIniciar() {
        cuestionario.vencer(T0.plusHours(100));
        assertThatThrownBy(() -> cuestionario.iniciar(T0.plusHours(101)))
                .isInstanceOf(TransicionInvalidaException.class);
    }
}