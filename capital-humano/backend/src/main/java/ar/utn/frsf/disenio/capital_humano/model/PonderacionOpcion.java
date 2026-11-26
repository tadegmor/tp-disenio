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

/** Ponderación de un ítem de opción para una pregunta (relación pregunta–opción, corrección del CU021). */
@Entity
@Table(name = "ponderaciones_opcion")
@Getter
@Setter
@NoArgsConstructor
public class PonderacionOpcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private Pregunta pregunta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_opcion_id", nullable = false)
    private ItemOpcion itemOpcion;

    @Column(nullable = false)
    private Integer ponderacion;
}
