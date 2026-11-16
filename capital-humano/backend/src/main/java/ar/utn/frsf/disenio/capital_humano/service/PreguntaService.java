package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.PreguntaDTO;
import ar.utn.frsf.disenio.capital_humano.exception.CriterioBusquedaInvalidoException;
import ar.utn.frsf.disenio.capital_humano.exception.PreguntaNoEncontradaException;
import ar.utn.frsf.disenio.capital_humano.mapper.PreguntaMapper;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import ar.utn.frsf.disenio.capital_humano.repository.PreguntaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PreguntaService {

    private final PreguntaRepository preguntaRepository;
    private final PreguntaMapper preguntaMapper;

    public PreguntaService(PreguntaRepository preguntaRepository, PreguntaMapper preguntaMapper) {
        this.preguntaRepository = preguntaRepository;
        this.preguntaMapper = preguntaMapper;
    }

    //CU 20 paso 3: exige al menos un criterio; la búsqueda es "contiene"
    public List<PreguntaDTO> buscarPreguntasPorFiltros(String competencia, String factor, String nombre) {
        String c = normalizar(competencia);
        String f = normalizar(factor);
        String n = normalizar(nombre);

        if(c.isEmpty() && f.isEmpty() && n.isEmpty()) {
            throw new CriterioBusquedaInvalidoException(
                "Debe ingresar al menos un criterio de búsqueda (competencia, factor o nombre)");
        }
        return preguntaMapper.mapToDTO(preguntaRepository.buscarPreguntasPorFiltros(c, f, n));
    }

    public PreguntaDTO obtenerPorId(Long id){
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id));
        return preguntaMapper.mapToDTO(pregunta);
    }

    //Baja lógica (CU023): El DELETE se convierte en UPDATE elimado = true por @SQLDelete 
    @Transactional
    public void darBaja(Long id){
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id));
        preguntaRepository.delete(pregunta);
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim();
    }

}
