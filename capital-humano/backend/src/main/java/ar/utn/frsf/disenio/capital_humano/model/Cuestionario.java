package ar.utn.frsf.disenio.capital_humano.model;

import ar.utn.frsf.disenio.capital_humano.model.estado.EstadoCuestionarioFactory;
import ar.utn.frsf.disenio.capital_humano.model.estado.EstadoCuestionarioState;
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
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cuestionarios")
@Getter
@Setter
@NoArgsConstructor
public class Cuestionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluacion_id", nullable = false)
    private Evaluacion evaluacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    @Column(name = "clave_ingreso", nullable = false, length = 8)
    private String claveIngreso;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "ultimo_ingreso")
    private LocalDateTime ultimoIngreso;

    @Column(name = "fecha_cambio_estado", nullable = false)
    private LocalDateTime fechaCambioEstado;

    /** Solo se modifica mediante activar() y transicionarA(), que usan los objetos State. */
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    @Setter(AccessLevel.NONE)
    private EstadoCuestionario estado;

    @Column(name = "cantidad_accesos", nullable = false)
    private int cantidadAccesos = 0;

    @Column(name = "cantidad_maxima_accesos", nullable = false)
    private Integer cantidadMaximaAccesos;

    @Column(name = "cantidad_preguntas_por_factor", nullable = false)
    private Integer cantidadPreguntasPorFactor;

    @Column(name = "cantidad_preguntas_por_bloque", nullable = false)
    private Integer cantidadPreguntasPorBloque;

    /** Horas que el cuestionario puede permanecer ACTIVO sin que el candidato lo inicie. */
    @Column(name = "tiempo_maximo_activo", nullable = false)
    private Integer tiempoMaximoActivo;

    /** Minutos que tiene el candidato para completar el cuestionario desde que lo inicia. */
    @Column(name = "tiempo_maximo_completar", nullable = false)
    private Integer tiempoMaximoCompletar;

    // ---------------- Ciclo de vida (delegado en el patrón State) ----------------

    /** Estado inicial al generarse la evaluación (CU025: los cuestionarios se crean "activos"). */
    public void activar(LocalDateTime ahora) {
        this.fechaCreacion = ahora;
        transicionarA(EstadoCuestionario.ACTIVO, ahora);
    }

    public void transicionarA(EstadoCuestionario nuevoEstado, LocalDateTime ahora) {
        this.estado = nuevoEstado;
        this.fechaCambioEstado = ahora;
    }

    public EstadoCuestionarioState estadoActual() {
        return EstadoCuestionarioFactory.de(estado);
    }

    public boolean permiteNuevaEvaluacion() {
        return estadoActual().permiteNuevaEvaluacion();
    }

    public void iniciar(LocalDateTime ahora) {
        estadoActual().iniciar(this, ahora);
    }

    public void completar(LocalDateTime ahora) {
        estadoActual().completar(this, ahora);
    }

    public void vencer(LocalDateTime ahora) {
        estadoActual().vencer(this, ahora);
    }

    // ---------------- Reglas de plazo (CU026 nota 2 y CU032) ----------------

    public boolean superoTiempoMaximoActivo(LocalDateTime ahora) {
        return ahora.isAfter(fechaCreacion.plusHours(tiempoMaximoActivo));
    }

    public boolean superoTiempoMaximoCompletar(LocalDateTime ahora) {
        return fechaInicio != null && ahora.isAfter(fechaInicio.plusMinutes(tiempoMaximoCompletar));
    }

    public boolean superoCantidadMaximaAccesos() {
        return cantidadAccesos > cantidadMaximaAccesos;
    }
}