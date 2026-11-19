package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.CandidatoClaveDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CandidatoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.EvaluacionGeneradaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.FinalizarEvaluacionRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoCompetenciasDTO;
import ar.utn.frsf.disenio.capital_humano.dto.ResultadoEvaluacionDTO;
import ar.utn.frsf.disenio.capital_humano.exception.ConflictoException;
import ar.utn.frsf.disenio.capital_humano.exception.PuestoNoEvaluableException;
import ar.utn.frsf.disenio.capital_humano.exception.RecursoNoEncontradoException;
import ar.utn.frsf.disenio.capital_humano.exception.SolicitudInvalidaException;
import ar.utn.frsf.disenio.capital_humano.factory.CuestionarioFactory;
import ar.utn.frsf.disenio.capital_humano.mapper.CandidatoMapper;
import ar.utn.frsf.disenio.capital_humano.mapper.EvaluacionMapper;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Evaluacion;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import ar.utn.frsf.disenio.capital_humano.repository.CandidatoRepository;
import ar.utn.frsf.disenio.capital_humano.repository.CuestionarioRepository;
import ar.utn.frsf.disenio.capital_humano.repository.EvaluacionRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PuestoRepository;
import ar.utn.frsf.disenio.capital_humano.util.ClaveGenerator;
import ar.utn.frsf.disenio.capital_humano.util.TextoUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CU025 - Evaluar a Candidato (GestorEvaluaciones del diagrama de secuencia). */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluacionService {

    private static final int MAX_INTENTOS_CLAVE = 50;

    private final CandidatoRepository candidatoRepository;
    private final CuestionarioRepository cuestionarioRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final PuestoRepository puestoRepository;
    private final PuestoService puestoService;
    private final CandidatoMapper candidatoMapper;
    private final EvaluacionMapper evaluacionMapper;
    private final CuestionarioFactory cuestionarioFactory;
    private final ClaveGenerator claveGenerator;

    /** Pasos 2-3: los tres filtros son opcionales y la búsqueda es "contiene". */
    public List<CandidatoDTO> buscarCandidatos(String apellido, String nombre, String numeroCandidato) {
        return candidatoMapper.mapToDTO(candidatoRepository.buscarPorFiltros(
                TextoUtil.normalizar(apellido),
                TextoUtil.normalizar(nombre),
                TextoUtil.normalizar(numeroCandidato)));
    }

    /** Paso 6 / 6.A: devuelve los candidatos que NO pueden ser evaluados (cuestionario activo o en proceso). */
    public List<CandidatoDTO> verificarCuestionariosActivos(List<Long> candidatoIds) {
        List<Long> ids = validarIds(candidatoIds);
        List<Candidato> candidatos = obtenerCandidatos(ids);
        Map<Long, List<Cuestionario>> cuestionarios = cuestionariosPorCandidato(ids);

        return candidatos.stream()
                .filter(c -> bloqueaNuevaEvaluacion(cuestionarios.getOrDefault(c.getId(), List.of())))
                .map(c -> candidatoMapper.mapToDTO(c, cuestionarios.getOrDefault(c.getId(), List.of())))
                .toList();
    }

    /**
     * Pasos 9 a 11: valida el puesto y los candidatos y genera las claves de ingreso, SIN guardar nada.
     * Si el actor cancela (12.A) no queda ningún dato en el sistema.
     */
    public List<ResultadoEvaluacionDTO> prepararEvaluacion(Long puestoId, List<Long> candidatoIds) {
        List<Long> ids = validarIds(candidatoIds);
        validarPuestoEvaluable(puestoId);
        List<Candidato> candidatos = obtenerCandidatosDisponibles(ids);

        Set<String> usadas = new HashSet<>();
        return candidatos.stream()
                .map(c -> evaluacionMapper.mapToDTO(c, claveNueva(usadas)))
                .toList();
    }

    /** Pasos 12-13: guarda la evaluación con un cuestionario ACTIVO por candidato y las claves ya mostradas. */
    @Transactional
    public EvaluacionGeneradaDTO evaluarCandidato(FinalizarEvaluacionRequestDTO request) {
        if (request == null || request.getCandidatos() == null || request.getCandidatos().isEmpty()) {
            throw new SolicitudInvalidaException("Debe indicar los candidatos a evaluar");
        }

        Map<Long, String> claves = new LinkedHashMap<>();
        for (CandidatoClaveDTO item : request.getCandidatos()) {
            if (item == null || item.getCandidatoId() == null) {
                throw new SolicitudInvalidaException("Cada candidato debe indicar su id");
            }
            if (!claveGenerator.esValida(item.getClaveIngreso())) {
                throw new SolicitudInvalidaException("La clave de ingreso debe tener 8 caracteres entre letras y dígitos");
            }
            if (claves.put(item.getCandidatoId(), item.getClaveIngreso()) != null) {
                throw new SolicitudInvalidaException("Hay candidatos repetidos en la evaluación");
            }
        }
        if (new HashSet<>(claves.values()).size() != claves.size()) {
            throw new SolicitudInvalidaException("Hay claves de ingreso repetidas");
        }

        validarPuestoEvaluable(request.getPuestoId());
        List<Candidato> candidatos = obtenerCandidatosDisponibles(new ArrayList<>(claves.keySet()));

        List<String> enUso = claves.values().stream()
                .filter(cuestionarioRepository::existsByClaveIngreso)
                .toList();
        if (!enUso.isEmpty()) {
            throw new ConflictoException("Alguna de las claves de ingreso ya está en uso. Vuelva a generar las claves", enUso);
        }

        Puesto puesto = puestoRepository.findByIdAndEliminadoFalse(request.getPuestoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el puesto con id " + request.getPuestoId()));

        LocalDateTime ahora = LocalDateTime.now();
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setPuesto(puesto);
        evaluacion.setFechaCreacion(ahora);
        candidatos.forEach(c -> cuestionarioFactory.crearActivo(evaluacion, c, claves.get(c.getId()), ahora));

        return evaluacionMapper.mapToDTO(evaluacionRepository.save(evaluacion));
    }

    // ------------------------------------------------------------------ helpers

    private List<Long> validarIds(List<Long> candidatoIds) {
        List<Long> ids = candidatoIds == null ? List.of()
                : candidatoIds.stream().filter(Objects::nonNull).distinct().toList();
        if (ids.isEmpty()) {
            throw new SolicitudInvalidaException("Debe seleccionar uno o más candidatos");
        }
        return ids;
    }

    private PuestoCompetenciasDTO validarPuestoEvaluable(Long puestoId) {
        if (puestoId == null) {
            throw new SolicitudInvalidaException("Debe seleccionar un puesto");
        }
        PuestoCompetenciasDTO puesto = puestoService.obtenerCompetenciasConFactores(puestoId);
        if (puesto.getCompetencias().isEmpty()) {
            throw new SolicitudInvalidaException("El puesto seleccionado no tiene competencias asociadas");
        }
        if (!puesto.isEvaluable()) {
            throw new PuestoNoEvaluableException(puesto.getCompetenciasNoEvaluables());
        }
        return puesto;
    }

    /** Candidatos existentes y no eliminados, en el mismo orden en que llegaron los ids. */
    private List<Candidato> obtenerCandidatos(List<Long> ids) {
        Map<Long, Candidato> porId = candidatoRepository.findAllByIdInAndEliminadoFalse(ids).stream()
                .collect(Collectors.toMap(Candidato::getId, Function.identity()));
        if (porId.size() != ids.size()) {
            throw new RecursoNoEncontradoException("Alguno de los candidatos seleccionados no existe");
        }
        return ids.stream().map(porId::get).toList();
    }

    private List<Candidato> obtenerCandidatosDisponibles(List<Long> ids) {
        List<Candidato> candidatos = obtenerCandidatos(ids);
        Map<Long, List<Cuestionario>> cuestionarios = cuestionariosPorCandidato(ids);

        List<String> bloqueados = candidatos.stream()
                .filter(c -> bloqueaNuevaEvaluacion(cuestionarios.getOrDefault(c.getId(), List.of())))
                .map(c -> c.getApellido() + " " + c.getNombre())
                .toList();
        if (!bloqueados.isEmpty()) {
            throw new ConflictoException(
                    "Hay candidatos con cuestionarios activos o en proceso que no pueden ser evaluados nuevamente",
                    bloqueados);
        }
        return candidatos;
    }

    private Map<Long, List<Cuestionario>> cuestionariosPorCandidato(List<Long> ids) {
        return cuestionarioRepository.buscarPorCandidatos(ids).stream()
                .collect(Collectors.groupingBy(cu -> cu.getCandidato().getId()));
    }

    /** Usa el patrón State: no se compara el enum a mano. */
    private boolean bloqueaNuevaEvaluacion(List<Cuestionario> cuestionarios) {
        return cuestionarios.stream().anyMatch(cu -> !cu.permiteNuevaEvaluacion());
    }

    private String claveNueva(Set<String> usadas) {
        for (int intento = 0; intento < MAX_INTENTOS_CLAVE; intento++) {
            String clave = claveGenerator.generar();
            if (!usadas.contains(clave) && !cuestionarioRepository.existsByClaveIngreso(clave)) {
                usadas.add(clave);
                return clave;
            }
        }
        throw new IllegalStateException("No se pudo generar una clave de ingreso única");
    }
}