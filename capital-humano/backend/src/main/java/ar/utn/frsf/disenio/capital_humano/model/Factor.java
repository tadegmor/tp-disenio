package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "factores")
@Getter
@Setter
@NoArgsConstructor
public class Factor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competencia_id", nullable = false)
    private Competencia competencia;
}