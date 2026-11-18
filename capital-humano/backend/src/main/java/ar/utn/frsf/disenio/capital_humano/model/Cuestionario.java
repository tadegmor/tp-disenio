package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cuestionarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cuestionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidato_id")
    private Candidato candidato;

    @ManyToOne
    @JoinColumn(name = "puesto_id")
    private Puesto puesto;

    private String claveIngreso;
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    private EstadoCuestionario estado;
}