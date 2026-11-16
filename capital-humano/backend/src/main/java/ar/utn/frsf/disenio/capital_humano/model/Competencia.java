package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "competencias")
@Getter
@Setter
@NoArgsConstructor
public class Competencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private Boolean activa = true;
}