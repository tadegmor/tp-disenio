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

@Entity
@Table(name = "ponderacion_opcion")
@Getter
@Setter
@NoArgsConstructor
public class PonderacionOpcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ponderacion_opcion")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_pregunta", nullable = false)
    private Pregunta pregunta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_item_opcion", nullable = false)
    private ItemOpcion itemOpcion;

    @Column(name = "ponderacion", nullable = false)
    private Double ponderacion;
}