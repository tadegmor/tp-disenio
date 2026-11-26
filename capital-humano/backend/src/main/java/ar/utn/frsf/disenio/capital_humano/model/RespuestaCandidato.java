package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Opción que eligió el candidato para una pregunta de un bloque. */
@Entity
@Table(name = "respuestas_candidato")
@Getter
@Setter
@NoArgsConstructor
public class RespuestaCandidato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bloque_id", nullable = false)
    private BloqueCuestionario bloque;

    /** Pregunta + ítem elegido + su ponderación. */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ponderacion_opcion_id", nullable = false)
    private PonderacionOpcion opcionElegida;

    @Column(name = "fecha_respuesta", nullable = false)
    private LocalDateTime fechaRespuesta;

    public RespuestaCandidato(BloqueCuestionario bloque, PonderacionOpcion opcionElegida, LocalDateTime fechaRespuesta) {
        this.bloque = bloque;
        this.opcionElegida = opcionElegida;
        this.fechaRespuesta = fechaRespuesta;
    }

    public Factor getFactor() {
        return opcionElegida.getPregunta().getFactor();
    }

    public int getPonderacion() {
        return opcionElegida.getPonderacion();
    }
}
