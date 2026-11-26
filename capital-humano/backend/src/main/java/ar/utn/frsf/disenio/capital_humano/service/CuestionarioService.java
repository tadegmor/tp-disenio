package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.config.CuestionarioProperties;
import ar.utn.frsf.disenio.capital_humano.dto.BloqueCuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CompletarBloqueRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.RespuestaDTO;
import ar.utn.frsf.disenio.capital_humano.exception.ConflictoException;
import ar.utn.frsf.disenio.capital_humano.exception.RecursoNoEncontradoException;
import ar.utn.frsf.disenio.capital_humano.exception.TransicionInvalidaException;
import ar.utn.frsf.disenio.capital_humano.mapper.CuestionarioMapper;
import ar.utn.frsf.disenio.capital_humano.model.BloqueCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import ar.utn.frsf.disenio.capital_humano.model.PuestoCompetencia;
import ar.utn.frsf.disenio.capital_humano.model.Resultado;
import ar.utn.frsf.disenio.capital_humano.repository.CuestionarioRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PreguntaRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PuestoCompetenciaRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CU026 - Completar Cuestionario (GestorEvaluaciones del diagrama de secuencia). */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CuestionarioService {

    private final CuestionarioRepository cuestionarioRepository;
    private final PreguntaRepository preguntaRepository;
    private final PuestoCompetenciaRepository puestoCompetenciaRepository;
    private final CuestionarioMapper cuestionarioMapper;
    private final CuestionarioProperties parametros;

    /** Paso 1: si se superaron los plazos o los accesos, el patrón State lo pasa a INCOMPLETO (1.A) o SIN_CONTESTAR (1.B). */
    @Transactional
    public CuestionarioDTO consultarCuestionario(Long cuestionarioId) {
        Cuestionario cuestionario = obtener(cuestionarioId);
        cuestionario.vencer(LocalDateTime.now());
        return cuestionarioMapper.mapToDTO(cuestionario);
    }

    /** Paso 1: las instrucciones se toman del repositorio de configuraciones (CuestionarioProperties). */
    public String obtenerInstrucciones() {
        return parametros.getInstrucciones().formatted(parametros.getTiempoMaximoCompletarMinutos());
    }

    /** Pasos 3-4 (ACTIVO: inicia y genera los bloques), 1.C y 8.A (EN_PROCESO: devuelve el bloque sin responder). */
    @Transactional
    public BloqueCuestionarioDTO iniciarCuestionario(Long cuestionarioId) {
        Cuestionario cuestionario = obtener(cuestionarioId);
        cuestionario.iniciar(LocalDateTime.now());
        if (cuestionario.getBloques().isEmpty()) {
            generarBloques(cuestionario);
        }
        BloqueCuestionario pendiente = cuestionario.bloquePendiente()
                .orElseThrow(() -> new ConflictoException("El cuestionario no tiene bloques sin responder", List.of()));
        return cuestionarioMapper.mapToDTO(pendiente);
    }

    /** Pasos 7-8: guarda el bloque respondido; si era el último calcula los resultados y completa el cuestionario. */
    @Transactional
    public void completarCuestionario(Long cuestionarioId, Long bloqueId, CompletarBloqueRequestDTO request) {
        Cuestionario cuestionario = obtener(cuestionarioId);
        if (cuestionario.getEstado() != EstadoCuestionario.EN_PROCESO) {
            throw new TransicionInvalidaException(cuestionario.getEstado(), "responder");
        }
        // Un bloque ya respondido no se puede volver a modificar
        BloqueCuestionario bloque = cuestionario.bloquePendiente()
                .filter(b -> b.getId().equals(bloqueId))
                .orElseThrow(() -> new ConflictoException("El bloque no es el que está pendiente de respuesta", List.of()));

        LocalDateTime ahora = LocalDateTime.now();
        bloque.responder(itemsPorPregunta(request), ahora);

        if (cuestionario.bloquePendiente().isEmpty()) {
            calcularResultados(cuestionario, ahora);
            cuestionario.completar(ahora);
        }
    }

    // ------------------------------------------------------------------ helpers

    private Cuestionario obtener(Long cuestionarioId) {
        return cuestionarioRepository.findById(cuestionarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el cuestionario con id " + cuestionarioId));
    }

    /**
     * Paso 3 y nota (1): por cada factor con al menos 2 preguntas se eligen 2 al azar; se mezclan todas
     * y se agrupan en bloques de cantidadPreguntasPorBloque.
     */
    private void generarBloques(Cuestionario cuestionario) {
        List<Long> competenciaIds = competenciasDelPuesto(cuestionario).stream()
                .map(pc -> pc.getCompetencia().getId())
                .toList();
        int porFactor = cuestionario.getCantidadPreguntasPorFactor();

        List<Pregunta> elegidas = new ArrayList<>();
        preguntaRepository.buscarPorCompetencias(competenciaIds).stream()
                .collect(Collectors.groupingBy(p -> p.getFactor().getId()))
                .values().stream()
                .filter(delFactor -> delFactor.size() >= porFactor)
                .forEach(delFactor -> {
                    Collections.shuffle(delFactor);
                    elegidas.addAll(delFactor.subList(0, porFactor));
                });
        if (elegidas.isEmpty()) {
            throw new ConflictoException("El puesto no tiene competencias con preguntas suficientes para evaluar", List.of());
        }
        Collections.shuffle(elegidas);

        int porBloque = cuestionario.getCantidadPreguntasPorBloque();
        for (int desde = 0, numero = 1; desde < elegidas.size(); desde += porBloque, numero++) {
            int hasta = Math.min(desde + porBloque, elegidas.size());
            cuestionario.agregarBloque(new BloqueCuestionario(numero, elegidas.subList(desde, hasta)));
        }
        // Guarda los bloques (y les asigna id) para presentarlos idénticos si el candidato vuelve a ingresar
        cuestionarioRepository.flush();
    }

    /**
     * Nota (3): total del factor = suma de las ponderaciones elegidas / 2 (preguntas por factor);
     * total de la competencia = suma de los totales de sus factores / cantidad de factores evaluados.
     */
    private void calcularResultados(Cuestionario cuestionario, LocalDateTime ahora) {
        // competenciaId -> (factorId -> suma de ponderaciones)
        Map<Long, Map<Long, Integer>> sumas = new HashMap<>();
        cuestionario.getBloques().stream()
                .flatMap(bloque -> bloque.getRespuestas().stream())
                .forEach(r -> sumas
                        .computeIfAbsent(r.getFactor().getCompetencia().getId(), id -> new HashMap<>())
                        .merge(r.getFactor().getId(), r.getPonderacion(), Integer::sum));

        double preguntasPorFactor = cuestionario.getCantidadPreguntasPorFactor();
        for (PuestoCompetencia requerida : competenciasDelPuesto(cuestionario)) {
            Map<Long, Integer> factores = sumas.get(requerida.getCompetencia().getId());
            if (factores == null) {
                continue; // competencia sin factores evaluables
            }
            double total = factores.values().stream()
                    .mapToDouble(suma -> suma / preguntasPorFactor)
                    .average()
                    .orElse(0);
            cuestionario.agregarResultado(
                    new Resultado(requerida.getCompetencia(), total, requerida.getPonderacion(), ahora));
        }
    }

    private List<PuestoCompetencia> competenciasDelPuesto(Cuestionario cuestionario) {
        return puestoCompetenciaRepository.buscarPorPuesto(cuestionario.getEvaluacion().getPuesto().getId());
    }

    /** preguntaId -> itemOpcionId; las preguntas que falten las detecta el bloque (6.A). */
    private Map<Long, Long> itemsPorPregunta(CompletarBloqueRequestDTO request) {
        if (request == null || request.getRespuestas() == null) {
            return Map.of();
        }
        return request.getRespuestas().stream()
                .filter(Objects::nonNull)
                .filter(r -> r.getPreguntaId() != null && r.getItemOpcionId() != null)
                .collect(Collectors.toMap(RespuestaDTO::getPreguntaId, RespuestaDTO::getItemOpcionId, (a, b) -> b));
    }
}
