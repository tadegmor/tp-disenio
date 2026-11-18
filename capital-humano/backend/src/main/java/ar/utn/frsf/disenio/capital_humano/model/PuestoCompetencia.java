package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "puesto_competencias")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PuestoCompetencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "puesto_id", nullable = false)
    private Puesto puesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competencia_id", nullable = false)
    private Competencia competencia;

    @Column(nullable = false)
    private Integer ponderacion; // Ponderación requerida por el puesto (ej. 10, 8)
}