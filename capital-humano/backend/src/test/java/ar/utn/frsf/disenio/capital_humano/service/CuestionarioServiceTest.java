package ar.utn.frsf.disenio.capital_humano.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import ar.utn.frsf.disenio.capital_humano.dto.BloqueCuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CompletarBloqueRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.RespuestaDTO;
import ar.utn.frsf.disenio.capital_humano.exception.SolicitudInvalidaException;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.EstadoCuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Resultado;
import ar.utn.frsf.disenio.capital_humano.repository.CuestionarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

/** CU026 contra los datos de data.sql (cada test se deshace al terminar). */
@SpringBootTest
@Transactional
class CuestionarioServiceTest {

    private static final String CLAVE_ACTIVO = "A1S2D3F4";      // 010 Rodriguez, puesto P001
    private static final String CLAVE_EN_PROCESO = "G5H6J7K8";  // 014 Perez, puesto P001

    @Autowired
    private CuestionarioService cuestionarioService;

    @Autowired
    private CuestionarioRepository cuestionarioRepository;

    @Test
    void flujoCompletoGuardaResultadosYCompletaElCuestionario() {
        Cuestionario cuestionario = porClave(CLAVE_ACTIVO);
        Long id = cuestionario.getId();
        assertThat(cuestionarioService.consultarCuestionario(id).getEstado()).isEqualTo(EstadoCuestionario.ACTIVO);

        // P001: Compromiso Institucional (2 preguntas) y Comunicacion Asertiva (2) -> 4 preguntas
        BloqueCuestionarioDTO bloque = cuestionarioService.iniciarCuestionario(id);
        assertThat(cuestionario.getEstado()).isEqualTo(EstadoCuestionario.EN_PROCESO);
        int preguntas = 0;
        while (true) {
            preguntas += bloque.getPreguntas().size();
            // Siempre la primera opción: NUNCA (0) en Likert, SI (10) en Si/No
            cuestionarioService.completarCuestionario(id, bloque.getBloqueId(), primeraOpcion(bloque));
            if (bloque.getNumero().equals(bloque.getCantidadBloques())) {
                break;
            }
            bloque = cuestionarioService.iniciarCuestionario(id);
        }
        assertThat(preguntas).isEqualTo(4);

        assertThat(cuestionarioService.consultarCuestionario(id).getEstado()).isEqualTo(EstadoCuestionario.COMPLETO);
        Map<String, Resultado> resultados = cuestionario.getResultados().stream()
                .collect(Collectors.toMap(r -> r.getCompetencia().getNombre(), r -> r));
        // Lealtad: (0 + 0) / 2 = 0. Trabajo en Equipo: P-003 Likert (0) + P-004 Si/No (10) -> 10 / 2 = 5
        assertThat(resultados).containsOnlyKeys("Lealtad", "Trabajo en Equipo");
        assertThat(resultados.get("Lealtad").getPuntajeObtenido()).isEqualTo(0.0);
        assertThat(resultados.get("Lealtad").getPuntajeRequerido()).isEqualTo(10.0);
        assertThat(resultados.get("Trabajo en Equipo").getPuntajeObtenido()).isEqualTo(5.0);
        assertThat(resultados.get("Trabajo en Equipo").getPuntajeRequerido()).isEqualTo(8.0);
    }

    @Test
    void alVolverAIngresarSeRetomaElMismoBloque() {
        Long id = porClave(CLAVE_ACTIVO).getId();
        BloqueCuestionarioDTO primero = cuestionarioService.iniciarCuestionario(id);
        BloqueCuestionarioDTO otraVez = cuestionarioService.iniciarCuestionario(id);
        assertThat(otraVez.getBloqueId()).isEqualTo(primero.getBloqueId());
        assertThat(otraVez.getPreguntas()).extracting("preguntaId")
                .containsExactlyElementsOf(primero.getPreguntas().stream().map(p -> p.getPreguntaId()).toList());
    }

    @Test
    void unBloqueConPreguntasSinResponderSeRechaza() {
        Long id = porClave(CLAVE_ACTIVO).getId();
        BloqueCuestionarioDTO bloque = cuestionarioService.iniciarCuestionario(id);
        assertThatThrownBy(() -> cuestionarioService.completarCuestionario(
                id, bloque.getBloqueId(), new CompletarBloqueRequestDTO(List.of())))
                .isInstanceOf(SolicitudInvalidaException.class);
    }

    @Test
    void activoSinIniciarPasadoElPlazoQuedaSinContestar() {
        Cuestionario cuestionario = porClave(CLAVE_ACTIVO);
        cuestionario.setFechaCreacion(LocalDateTime.now().minusHours(73));
        assertThat(cuestionarioService.consultarCuestionario(cuestionario.getId()).getEstado())
                .isEqualTo(EstadoCuestionario.SIN_CONTESTAR);
    }

    @Test
    void enProcesoPasadoElTiempoMaximoQuedaIncompleto() {
        Cuestionario cuestionario = porClave(CLAVE_EN_PROCESO);
        cuestionario.setFechaInicio(LocalDateTime.now().minusMinutes(91));
        assertThat(cuestionarioService.consultarCuestionario(cuestionario.getId()).getEstado())
                .isEqualTo(EstadoCuestionario.INCOMPLETO);
    }

    @Test
    void enProcesoConDemasiadosAccesosQuedaIncompleto() {
        Cuestionario cuestionario = porClave(CLAVE_EN_PROCESO);
        cuestionario.setCantidadAccesos(cuestionario.getCantidadMaximaAccesos() + 1);
        assertThat(cuestionarioService.consultarCuestionario(cuestionario.getId()).getEstado())
                .isEqualTo(EstadoCuestionario.INCOMPLETO);
    }

    private Cuestionario porClave(String clave) {
        return cuestionarioRepository.findAll().stream()
                .filter(c -> c.getClaveIngreso().equals(clave))
                .findFirst()
                .orElseThrow();
    }

    private CompletarBloqueRequestDTO primeraOpcion(BloqueCuestionarioDTO bloque) {
        return new CompletarBloqueRequestDTO(bloque.getPreguntas().stream()
                .map(p -> new RespuestaDTO(p.getPreguntaId(), p.getOpciones().get(0).getId()))
                .toList());
    }
}
