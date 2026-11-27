package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opciones_respuesta")
@Getter
@Setter
@NoArgsConstructor
public class OpcionRespuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private Boolean activa = true;

    @OneToMany(
        mappedBy = "opcionRespuesta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("orden ASC")
    private List<ItemOpcion> items = new ArrayList<>();

    public void agregarItem(ItemOpcion item) {
        items.add(item);
        item.setOpcionRespuesta(this);
    }

    public void quitarItem(ItemOpcion item) {
        items.remove(item);
        item.setOpcionRespuesta(null);
    }
}