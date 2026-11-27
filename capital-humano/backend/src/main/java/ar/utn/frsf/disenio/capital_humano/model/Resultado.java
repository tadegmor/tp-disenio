package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "resultados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    @Column(name = "puntaje_obtenido", nullable = false)
    private Double puntajeObtenido;

    @Column(name = "puntaje_requerido", nullable = false)
    private Double puntajeRequerido;

    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;
}