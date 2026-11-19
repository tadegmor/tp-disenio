package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.CandidatoDTO;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CandidatoMapper {

    public CandidatoDTO mapToDTO(Candidato candidato) {
        return CandidatoDTO.builder()
                .id(candidato.getId())
                .apellido(candidato.getApellido())
                .nombre(candidato.getNombre())
                .tipoDocumento(candidato.getTipoDocumento())
                .numeroDocumento(candidato.getNumeroDocumento())
                .numeroCandidato(candidato.getNumeroCandidato())
                .build();
    }

    public List<CandidatoDTO> mapToDTO(List<Candidato> candidatos) {
        return candidatos.stream().map(c -> mapToDTO(c)).toList();
    }

    /** Agrega el estado del cuestionario que impide evaluar de nuevo al candidato (null si no hay ninguno). */
    public CandidatoDTO mapToDTO(Candidato candidato, List<Cuestionario> cuestionarios) {
        CandidatoDTO dto = mapToDTO(candidato);
        dto.setEstadoCuestionario(cuestionarios.stream()
                .filter(cuestionario -> !cuestionario.permiteNuevaEvaluacion())
                .map(cuestionario -> cuestionario.getEstado().name())
                .findFirst()
                .orElse(null));
        return dto;
    }
}