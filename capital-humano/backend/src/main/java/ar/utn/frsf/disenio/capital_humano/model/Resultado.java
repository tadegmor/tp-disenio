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

/** Puntaje que obtuvo el candidato en una competencia (CU026 paso 8, nota 3). */
@Entity
@Table(name = "resultados")
@Getter
@Setter
@NoArgsConstructor
public class Resultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cuestionario_id", nullable = false)
    private Cuestionario cuestionario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competencia_id", nullable = false)
    private Competencia competencia;

    @Column(name = "puntaje_obtenido", nullable = false)
    private Double puntajeObtenido;

    /** Ponderación que el puesto exige para la competencia. */
    @Column(name = "puntaje_requerido", nullable = false)
    private Double puntajeRequerido;

    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;

    public Resultado(Competencia competencia, double puntajeObtenido, double puntajeRequerido, LocalDateTime fechaCalculo) {
        this.competencia = competencia;
        this.puntajeObtenido = puntajeObtenido;
        this.puntajeRequerido = puntajeRequerido;
        this.fechaCalculo = fechaCalculo;
    }
}
