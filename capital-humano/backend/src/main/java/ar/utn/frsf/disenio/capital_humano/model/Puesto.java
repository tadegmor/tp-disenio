package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "puestos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Puesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String empresa;

    @Builder.Default
    private boolean eliminado = false;

    // Relación con las competencias del puesto a través de la tabla intermedia
    @OneToMany(mappedBy = "puesto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PuestoCompetencia> competenciasPuesto;
}