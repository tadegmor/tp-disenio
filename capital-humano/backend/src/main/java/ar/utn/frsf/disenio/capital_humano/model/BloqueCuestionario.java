package ar.utn.frsf.disenio.capital_humano.model;

import ar.utn.frsf.disenio.capital_humano.exception.SolicitudInvalidaException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Paso del wizard del CU026: un grupo de preguntas que se responde una sola vez. */
@Entity
@Table(name = "bloques_cuestionario")
@Getter
@Setter
@NoArgsConstructor
public class BloqueCuestionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cuestionario_id", nullable = false)
    private Cuestionario cuestionario;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private boolean completado = false;

    /** Se guarda el orden para presentar el bloque idéntico si el candidato vuelve a ingresar (paso 3). */
    @ManyToMany
    @JoinTable(name = "bloque_preguntas",
            joinColumns = @JoinColumn(name = "bloque_id"),
            inverseJoinColumns = @JoinColumn(name = "pregunta_id"))
    @OrderColumn(name = "orden")
    @Setter(AccessLevel.NONE)
    private List<Pregunta> preguntas = new ArrayList<>();

    @OneToMany(mappedBy = "bloque", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter(AccessLevel.NONE)
    private List<RespuestaCandidato> respuestas = new ArrayList<>();

    public BloqueCuestionario(int numero, List<Pregunta> preguntas) {
        this.numero = numero;
        this.preguntas.addAll(preguntas);
    }

    /** Paso 7: registra una respuesta por pregunta (itemOpcionId elegido por preguntaId) y cierra el bloque. */
    public void responder(Map<Long, Long> itemPorPregunta, LocalDateTime ahora) {
        for (Pregunta pregunta : preguntas) {
            Long itemOpcionId = itemPorPregunta.get(pregunta.getId());
            if (itemOpcionId == null) {
                throw new SolicitudInvalidaException("Debe responder todas las preguntas del bloque");
            }
            PonderacionOpcion elegida = pregunta.ponderacionDe(itemOpcionId)
                    .orElseThrow(() -> new SolicitudInvalidaException("La opción elegida no corresponde a la pregunta"));
            respuestas.add(new RespuestaCandidato(this, elegida, ahora));
        }
        completado = true;
    }
}
