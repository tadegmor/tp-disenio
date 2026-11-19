package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.EvaluacionGeneradaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.ResultadoEvaluacionDTO;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Evaluacion;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import ar.utn.frsf.disenio.capital_humano.util.NombreArchivoUtil;
import org.springframework.stereotype.Component;

@Component
public class EvaluacionMapper {

    /** Fila de "Candidatos a evaluar" antes de guardar (sin id de cuestionario). */
    public ResultadoEvaluacionDTO mapToDTO(Candidato candidato, String claveIngreso) {
        return ResultadoEvaluacionDTO.builder()
                .candidatoId(candidato.getId())
                .apellidoCandidato(candidato.getApellido())
                .nombreCandidato(candidato.getNombre())
                .numeroCandidato(candidato.getNumeroCandidato())
                .tipoDocumento(candidato.getTipoDocumento())
                .numeroDocumento(candidato.getNumeroDocumento())
                .claveIngreso(claveIngreso)
                .build();
    }

    public ResultadoEvaluacionDTO mapToDTO(Cuestionario cuestionario) {
        ResultadoEvaluacionDTO dto = mapToDTO(cuestionario.getCandidato(), cuestionario.getClaveIngreso());
        dto.setCuestionarioId(cuestionario.getId());
        return dto;
    }

    public EvaluacionGeneradaDTO mapToDTO(Evaluacion evaluacion) {
        Puesto puesto = evaluacion.getPuesto();
        return EvaluacionGeneradaDTO.builder()
                .evaluacionId(evaluacion.getId())
                .puestoId(puesto.getId())
                .nombrePuesto(puesto.getNombre())
                .empresa(puesto.getEmpresa())
                .fechaCreacion(evaluacion.getFechaCreacion())
                .nombreArchivo(NombreArchivoUtil.paraEvaluacion(evaluacion.getFechaCreacion(), puesto.getNombre()))
                .candidatos(evaluacion.getCuestionarios().stream().map(cu -> mapToDTO(cu)).toList())
                .build();
    }
}