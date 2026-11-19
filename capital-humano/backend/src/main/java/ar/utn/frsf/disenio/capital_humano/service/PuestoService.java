package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.config.CuestionarioProperties;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoCompetenciasDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.exception.RecursoNoEncontradoException;
import ar.utn.frsf.disenio.capital_humano.mapper.PuestoMapper;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import ar.utn.frsf.disenio.capital_humano.model.PuestoCompetencia;
import ar.utn.frsf.disenio.capital_humano.repository.PreguntaRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PuestoCompetenciaRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PuestoRepository;
import ar.utn.frsf.disenio.capital_humano.util.TextoUtil;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PuestoService {

    private final PuestoRepository puestoRepository;
    private final PuestoCompetenciaRepository puestoCompetenciaRepository;
    private final PreguntaRepository preguntaRepository;
    private final CuestionarioProperties parametros;
    private final PuestoMapper puestoMapper;

    /** Con los tres filtros vacíos devuelve todos los puestos (carga automática de los desplegables). */
    public List<PuestoDTO> buscar(String codigo, String nombre, String empresa) {
        List<Puesto> puestos = puestoRepository.buscarPorFiltros(
                TextoUtil.normalizar(codigo), TextoUtil.normalizar(nombre), TextoUtil.normalizar(empresa));
        return puestoMapper.mapToDTO(puestos);
    }

    /**
     * CU025 pasos 9 y 9.A: competencias requeridas por el puesto con su ponderación, indicando cuáles
     * son evaluables (al menos un factor con las preguntas necesarias para armar un cuestionario).
     */
    public PuestoCompetenciasDTO obtenerCompetenciasConFactores(Long puestoId) {
        Puesto puesto = puestoRepository.findByIdAndEliminadoFalse(puestoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el puesto con id " + puestoId));

        List<PuestoCompetencia> requeridas = puestoCompetenciaRepository.buscarPorPuesto(puestoId);
        Set<Long> evaluables = new HashSet<>();
        if (!requeridas.isEmpty()) {
            List<Long> competenciaIds = requeridas.stream().map(pc -> pc.getCompetencia().getId()).toList();
            evaluables.addAll(preguntaRepository.competenciasConFactoresEvaluables(
                    competenciaIds, parametros.getCantidadPreguntasPorFactor()));
        }
        return puestoMapper.mapToDTO(puesto, requeridas, evaluables);
    }
}