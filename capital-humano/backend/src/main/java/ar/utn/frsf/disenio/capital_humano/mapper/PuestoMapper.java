package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.CompetenciaRequeridaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoCompetenciasDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import ar.utn.frsf.disenio.capital_humano.model.PuestoCompetencia;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class PuestoMapper {

    public PuestoDTO mapToDTO(Puesto puesto) {
        return PuestoDTO.builder()
                .id(puesto.getId())
                .codigo(puesto.getCodigo())
                .nombre(puesto.getNombre())
                .empresa(puesto.getEmpresa())
                .build();
    }

    public List<PuestoDTO> mapToDTO(List<Puesto> puestos) {
        return puestos.stream().map(p -> mapToDTO(p)).toList();
    }

    public PuestoCompetenciasDTO mapToDTO(Puesto puesto, List<PuestoCompetencia> requeridas, Set<Long> competenciasEvaluables) {
        List<CompetenciaRequeridaDTO> competencias = requeridas.stream()
                .map(pc -> CompetenciaRequeridaDTO.builder()
                        .competenciaId(pc.getCompetencia().getId())
                        .nombre(pc.getCompetencia().getNombre())
                        .ponderacion(pc.getPonderacion())
                        .evaluable(competenciasEvaluables.contains(pc.getCompetencia().getId()))
                        .build())
                .toList();

        List<String> noEvaluables = competencias.stream()
                .filter(c -> !c.isEvaluable())
                .map(CompetenciaRequeridaDTO::getNombre)
                .toList();

        return PuestoCompetenciasDTO.builder()
                .puestoId(puesto.getId())
                .codigo(puesto.getCodigo())
                .nombre(puesto.getNombre())
                .empresa(puesto.getEmpresa())
                .competencias(competencias)
                .competenciasNoEvaluables(noEvaluables)
                .evaluable(!competencias.isEmpty() && noEvaluables.isEmpty())
                .build();
    }
}