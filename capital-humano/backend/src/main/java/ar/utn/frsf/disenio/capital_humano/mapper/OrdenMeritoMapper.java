package ar.utn.frsf.disenio.capital_humano.mapper;

import ar.utn.frsf.disenio.capital_humano.dto.CandidatoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import org.springframework.stereotype.Component;

@Component
public class OrdenMeritoMapper {

    public PuestoDTO toPuestoDTO(Puesto puesto, int cantidadCandidatos, int evaluacionesCompletas) {
        return PuestoDTO.builder()
                .id(puesto.getId())
                .codigo(puesto.getCodigo())
                .nombre(puesto.getNombre())
                .empresa(puesto.getEmpresa())
                .cantidadCandidatos(cantidadCandidatos)
                .evaluacionesCompletas(evaluacionesCompletas)
                .build();
    }

    public CandidatoDTO toCandidatoDTO(Candidato candidato, EstadoCuestionario estado) {
        return CandidatoDTO.builder()
                .id(candidato.getId())
                .apellido(candidato.getApellido())
                .nombre(candidato.getNombre())
                .tipoDocumento(candidato.getTipoDocumento())
                .numeroDocumento(candidato.getNumeroDocumento())
                .numeroCandidato(candidato.getNumeroCandidato())
                .estadoCuestionario(estado != null ? estado.name() : null)
                .build();
    }

    public CuestionarioDTO toCuestionarioDTO(Cuestionario cuestionario) {
        return CuestionarioDTO.builder()
                .estado(cuestionario.getEstado().name())
                .fechaInicio(cuestionario.getFechaInicio())
                .fechaFin(cuestionario.getFechaFin())
                .ultimoIngreso(cuestionario.getUltimoIngreso())
                .cantidadAccesos(cuestionario.getCantidadAccesos())
                .build();
    }
}