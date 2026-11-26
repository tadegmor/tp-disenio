package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

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
    @Column(name = "tipo", nullable = false, length =20)
    private TipoPregunta tipo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_factor", nullable = false)
    private Factor factor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_opcion_respuesta", nullable = false)
    private OpcionRespuesta opcionRespuesta;

    @Column(name = "eliminado", nullable = false)
    private boolean eliminado = false;

    /**
     * Ponderación de cada ítem de la opción de respuesta para esta pregunta (suman 10).
     * Sin cascada de borrado: la baja de la pregunta es lógica (CU023) y las ponderaciones se conservan.
     */
    @OneToMany(mappedBy = "pregunta", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<PonderacionOpcion> ponderaciones = new ArrayList<>();

    protected Pregunta(){

    }

    /** CU026: la opción elegida por el candidato tiene que ser un ítem de esta pregunta. */
    public Optional<PonderacionOpcion> ponderacionDe(Long itemOpcionId) {
        return ponderaciones.stream()
                .filter(p -> p.getItemOpcion().getId().equals(itemOpcionId))
                .findFirst();
    }
}

