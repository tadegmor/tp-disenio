package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pregunta")
@SQLDelete(sql = "UPDATE pregunta SET eliminado = true WHERE id_pregunta = ?")
@SQLRestriction("eliminado = false")
@Getter
@Setter
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pregunta")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "enunciado", nullable = false, length = 500)
    private String enunciado;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoPregunta tipo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_factor", nullable = false)
    private Factor factor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_opcion_respuesta", nullable = false)
    private OpcionRespuesta opcionRespuesta;

    @OneToMany(
        mappedBy = "pregunta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<PonderacionOpcion> ponderaciones = new ArrayList<>();

    @Column(name = "eliminado", nullable = false)
    private boolean eliminado = false;

    public Pregunta() {
    }

    public void agregarPonderacion(ItemOpcion item, Double ponderacion) {
        PonderacionOpcion po = new PonderacionOpcion();
        po.setPregunta(this);
        po.setItemOpcion(item);
        po.setPonderacion(ponderacion);
        this.ponderaciones.add(po);
    }
}