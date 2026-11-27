package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.CandidatoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.OrdenMeritoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.exception.RecursoNoEncontradoException;
import ar.utn.frsf.disenio.capital_humano.exception.SolicitudInvalidaException;
import ar.utn.frsf.disenio.capital_humano.mapper.OrdenMeritoMapper;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Evaluacion;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import ar.utn.frsf.disenio.capital_humano.model.PuestoCompetencia;
import ar.utn.frsf.disenio.capital_humano.model.Resultado;
import ar.utn.frsf.disenio.capital_humano.reporte.GeneradorReporte;
import ar.utn.frsf.disenio.capital_humano.reporte.ReporteOrdenMerito;
import ar.utn.frsf.disenio.capital_humano.repository.CuestionarioRepository;
import ar.utn.frsf.disenio.capital_humano.repository.EvaluacionRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PuestoRepository;
import ar.utn.frsf.disenio.capital_humano.repository.ResultadoRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class InformeService {

    private static final List< EstadoCuestionario > ORDEN_ESTADOS_NO_COMPLETOS = List.of(
            EstadoCuestionario.EN_PROCESO,
            EstadoCuestionario.ACTIVO,
            EstadoCuestionario.INCOMPLETO,
            EstadoCuestionario.SIN_CONTESTAR
    );

    private final PuestoRepository puestoRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final CuestionarioRepository cuestionarioRepository;
    private final ResultadoRepository resultadoRepository;
    private final OrdenMeritoMapper ordenMeritoMapper;

    public InformeService(PuestoRepository puestoRepository,
                          EvaluacionRepository evaluacionRepository,
                          CuestionarioRepository cuestionarioRepository,
                          ResultadoRepository resultadoRepository,
                          OrdenMeritoMapper ordenMeritoMapper) {
        this.puestoRepository = puestoRepository;
        this.evaluacionRepository = evaluacionRepository;
        this.cuestionarioRepository = cuestionarioRepository;
        this.resultadoRepository = resultadoRepository;
        this.ordenMeritoMapper = ordenMeritoMapper;
    }

    public List< PuestoDTO > buscarPuestos(String codigo, String nombre, String empresa) {
        String cod = codigo != null ? codigo.trim() : "";
        String nom = nombre != null ? nombre.trim() : "";
        String emp = empresa != null ? empresa.trim() : "";

        if (cod.isEmpty() && nom.isEmpty() && emp.isEmpty()) {
            throw new SolicitudInvalidaException("Debe ingresar al menos un criterio de búsqueda");
        }

        List< Puesto > puestos = puestoRepository.buscarPorFiltros(cod, nom, emp);
        List< PuestoDTO > resultado = new ArrayList<>();

        for (Puesto p : puestos) {
            List< Evaluacion > evaluaciones = evaluacionRepository.buscarPorPuesto(p.getId());

            List< Cuestionario > cuestionariosActivos = evaluaciones.stream()
                    .flatMap(e -> e.getCuestionarios().stream())
                    .filter(c -> c.getCandidato() != null && !c.getCandidato().isEliminado())
                    .toList();

            int cantidadCandidatos = cuestionariosActivos.size();
            int evaluacionesCompletas = (int) cuestionariosActivos.stream()
                    .filter(c -> c.getEstado() == EstadoCuestionario.COMPLETO)
                    .count();

            resultado.add(ordenMeritoMapper.toPuestoDTO(p, cantidadCandidatos, evaluacionesCompletas));
        }

        return resultado;
    }

    public List< Map< String, Object > > listarEvaluacionesPorPuesto(Long puestoId) {
        puestoRepository.findByIdAndEliminadoFalse(puestoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el puesto con id " + puestoId));

        return evaluacionRepository.buscarPorPuesto(puestoId).stream()
                .map(ev -> {
                    int cantCand = (int) ev.getCuestionarios().stream()
                            .filter(c -> c.getCandidato() != null && !c.getCandidato().isEliminado())
                            .count();
                    Map< String, Object > item = new LinkedHashMap<>();
                    item.put("id", ev.getId());
                    item.put("fechaCreacion", ev.getFechaCreacion());
                    item.put("cantidadCuestionarios", cantCand);
                    return item;
                })
                .toList();
    }

    public List< OrdenMeritoDTO > emitirOrdenMerito(Long puestoId, List< Long > evaluacionIds) {
        if (puestoId == null) {
            throw new SolicitudInvalidaException("Debe seleccionar un puesto.");
        }

        Puesto puesto = puestoRepository.buscarConCompetenciasPorId(puestoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el puesto con id " + puestoId));

        List< Evaluacion > evaluacionesPuesto = evaluacionRepository.buscarPorPuesto(puestoId);
        if (evaluacionesPuesto.isEmpty()) {
            throw new SolicitudInvalidaException("El puesto no posee evaluaciones");
        }

        List< Long > idsAProcesar = (evaluacionIds == null || evaluacionIds.isEmpty())
                ? evaluacionesPuesto.stream().map(Evaluacion::getId).toList()
                : evaluacionIds;

        List< Cuestionario > cuestionarios = cuestionarioRepository.buscarPorEvaluaciones(idsAProcesar);

        List< Resultado > resultados = new ArrayList<>();
        for (Long evalId : idsAProcesar) {
            resultados.addAll(resultadoRepository.buscarPorEvaluacion(evalId));
        }

        return procesarOrdenMerito(puesto, cuestionarios, resultados);
    }

    public void imprimirOrdenMerito(Long puestoId, List< Long > evaluacionIds) {
        Puesto puesto = puestoRepository.findByIdAndEliminadoFalse(puestoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró el puesto con id " + puestoId));

        List< Evaluacion > evaluacionesPuesto = evaluacionRepository.buscarPorPuesto(puestoId);
        List< Long > ids = (evaluacionIds == null || evaluacionIds.isEmpty())
                ? evaluacionesPuesto.stream().map(Evaluacion::getId).toList()
                : evaluacionIds;

        List< Cuestionario > cuestionarios = cuestionarioRepository.buscarPorEvaluaciones(ids);

        GeneradorReporte reporte = new ReporteOrdenMerito(
                LocalDateTime.now(),
                "Consultor",
                puesto,
                cuestionarios
        );
        reporte.generarReporte();
        reporte.imprimirReporte();
    }

    private List< OrdenMeritoDTO > procesarOrdenMerito(Puesto puesto,
                                                       List< Cuestionario > cuestionarios,
                                                       List< Resultado > resultados) {
        Map< Long, List< Resultado > > resultadosPorCuestionario = resultados.stream()
                .collect(Collectors.groupingBy(r -> r.getCuestionario().getId()));

        List< PuestoCompetencia > requeridas = puesto.getCompetenciasPuesto() != null
                ? puesto.getCompetenciasPuesto()
                : List.of();

        List< OrdenMeritoDTO > conformanOrden = new ArrayList<>();
        List< OrdenMeritoDTO > noAlcanzanMinimo = new ArrayList<>();
        List< OrdenMeritoDTO > otrosEstados = new ArrayList<>();

        for (Cuestionario c : cuestionarios) {
            CandidatoDTO candDto = ordenMeritoMapper.toCandidatoDTO(c.getCandidato(), c.getEstado());
            CuestionarioDTO cuestDto = ordenMeritoMapper.toCuestionarioDTO(c);

            if (c.getEstado() == EstadoCuestionario.COMPLETO) {
                List< Resultado > resCuest = resultadosPorCuestionario.getOrDefault(c.getId(), List.of());
                double puntajeTotal = resCuest.stream()
                        .mapToDouble(r -> r.getPuntajeObtenido() != null ? r.getPuntajeObtenido() : 0.0)
                        .sum();
                puntajeTotal = Math.round(puntajeTotal * 100.0) / 100.0;

                boolean cumpleMinimos = evaluarPonderacionesMinimas(requeridas, resCuest);

                OrdenMeritoDTO item = OrdenMeritoDTO.builder()
                        .candidato(candDto)
                        .cuestionario(cuestDto)
                        .puntajeObtenido(puntajeTotal)
                        .cumplePonderacionesMinimas(cumpleMinimos)
                        .build();

                if (cumpleMinimos) {
                    conformanOrden.add(item);
                } else {
                    noAlcanzanMinimo.add(item);
                }
            } else {
                otrosEstados.add(OrdenMeritoDTO.builder()
                        .candidato(candDto)
                        .cuestionario(cuestDto)
                        .puntajeObtenido(null)
                        .cumplePonderacionesMinimas(false)
                        .build());
            }
        }

        Comparator< OrdenMeritoDTO > porPuntajeDesc = Comparator.comparing(
                OrdenMeritoDTO::getPuntajeObtenido,
                Comparator.nullsLast(Comparator.reverseOrder())
        );
        conformanOrden.sort(porPuntajeDesc);
        noAlcanzanMinimo.sort(porPuntajeDesc);

        otrosEstados.sort(Comparator.comparingInt(item -> {
            EstadoCuestionario estado = item != null && item.getCuestionario() != null
                    ? item.getCuestionario().getEstado()
                    : null;
            int idx = estado != null ? ORDEN_ESTADOS_NO_COMPLETOS.indexOf(estado) : -1;
            return idx >= 0 ? idx : Integer.MAX_VALUE;
        }));

        List< OrdenMeritoDTO > salida = new ArrayList<>();
        salida.addAll(conformanOrden);
        salida.addAll(noAlcanzanMinimo);
        salida.addAll(otrosEstados);
        return salida;
    }

    private boolean evaluarPonderacionesMinimas(List< PuestoCompetencia > requeridas,
                                                List< Resultado > resCuest) {
        if (resCuest.isEmpty()) {
            return false;
        }
        if (requeridas.isEmpty()) {
            return resCuest.stream().allMatch(r ->
                    r.getPuntajeObtenido() != null &&
                    r.getPuntajeRequerido() != null &&
                    r.getPuntajeObtenido() >= r.getPuntajeRequerido()
            );
        }

        Map< Long, Double > obtenidoPorCompetencia = resCuest.stream()
                .collect(Collectors.toMap(
                        r -> r.getCompetencia().getId(),
                        r -> r.getPuntajeObtenido() != null ? r.getPuntajeObtenido() : 0.0,
                        Double::max
                ));

        for (PuestoCompetencia pc : requeridas) {
            Double obtenido = obtenidoPorCompetencia.get(pc.getCompetencia().getId());
            if (obtenido == null || obtenido < pc.getPonderacion()) {
                return false;
            }
        }
        return true;
    }
}