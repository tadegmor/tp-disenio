package ar.utn.frsf.disenio.capital_humano.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class NombreArchivoUtilTest {

    private static final LocalDateTime FECHA = LocalDateTime.of(2026, 5, 1, 19, 8);

    @Test
    void armaElNombreSegunElWireframe() {
        assertThat(NombreArchivoUtil.paraEvaluacion(FECHA, "Jefe de Cocina"))
                .isEqualTo("2026-05-01-19-08-JEFE-DE-COCINA.xls");
    }

    @Test
    void quitaAcentosYCaracteresInvalidos() {
        assertThat(NombreArchivoUtil.paraEvaluacion(FECHA, "Gestión de Proyectos / Sr."))
                .isEqualTo("2026-05-01-19-08-GESTION-DE-PROYECTOS-SR.xls");
    }
}