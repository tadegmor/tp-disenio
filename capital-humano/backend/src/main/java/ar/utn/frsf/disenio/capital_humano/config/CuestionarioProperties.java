package ar.utn.frsf.disenio.capital_humano.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Parámetros de los cuestionarios (CU026: "se toman de un repositorio de configuraciones del sistema").
 * Se leen de application.properties con el prefijo capitalhumano.cuestionario.
 */
@Component
@ConfigurationProperties(prefix = "capitalhumano.cuestionario")
@Getter
@Setter
public class CuestionarioProperties {

    private int cantidadPreguntasPorFactor = 2;
    private int cantidadPreguntasPorBloque = 5;
    private int tiempoMaximoActivoHoras = 72;
    private int tiempoMaximoCompletarMinutos = 90;
    private int cantidadMaximaAccesos = 3;
}