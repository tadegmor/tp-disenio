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

    /** Texto de la pantalla "Cuestionario - Instrucciones" (CU026 paso 1). %d = tiempo máximo para completar. */
    private String instrucciones = """
            Lea atentamente cada pregunta y seleccione la opción que mejor lo represente.
            Las preguntas se presentan en bloques: debe responder todas las del bloque para avanzar \
            y, una vez enviado, no podrá volver a modificarlo.
            Dispone de %d minutos desde que inicia el cuestionario para completarlo. \
            Si se retira, podrá continuar más tarde desde el bloque en que quedó.""";
}