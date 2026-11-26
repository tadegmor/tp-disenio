package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "items_opcion")
@Getter
@Setter
@NoArgsConstructor
public class ItemOpcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer orden;

    @Column(nullable = false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opcion_respuesta_id", nullable = false)
    private OpcionRespuesta opcionRespuesta;
}