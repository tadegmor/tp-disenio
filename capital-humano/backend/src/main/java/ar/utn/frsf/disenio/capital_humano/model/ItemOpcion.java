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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Cada valor de una OpcionRespuesta reutilizable (ej. "Siempre" dentro de una escala). */
@Entity
@Table(name = "items_opcion")
@Getter
@Setter
@NoArgsConstructor
public class ItemOpcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opcion_respuesta_id", nullable = false)
    private OpcionRespuesta opcionRespuesta;

    @Column(nullable = false)
    private Integer orden;

    @Column(nullable = false)
    private String descripcion;
}
