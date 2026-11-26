package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.dto.ItemOpcionDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PreguntaDTO;
import ar.utn.frsf.disenio.capital_humano.exception.ConflictoException;
import ar.utn.frsf.disenio.capital_humano.exception.CriterioBusquedaInvalidoException;
import ar.utn.frsf.disenio.capital_humano.exception.PreguntaNoEncontradaException;
import ar.utn.frsf.disenio.capital_humano.exception.RecursoNoEncontradoException;
import ar.utn.frsf.disenio.capital_humano.exception.SolicitudInvalidaException;
import ar.utn.frsf.disenio.capital_humano.mapper.PreguntaMapper;
import ar.utn.frsf.disenio.capital_humano.model.Factor;
import ar.utn.frsf.disenio.capital_humano.model.ItemOpcion;
import ar.utn.frsf.disenio.capital_humano.model.OpcionRespuesta;
import ar.utn.frsf.disenio.capital_humano.model.Pregunta;
import ar.utn.frsf.disenio.capital_humano.model.TipoPregunta;
import ar.utn.frsf.disenio.capital_humano.repository.FactorRepository;
import ar.utn.frsf.disenio.capital_humano.repository.OpcionRespuestaRepository;
import ar.utn.frsf.disenio.capital_humano.repository.PreguntaRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PreguntaService {

    private static final int MAX_NOMBRE = 100;
    private static final int MAX_ENUNCIADO = 500;
    private static final int MAX_DESCRIPCION = 500;
    private static final double SUMA_PONDERACIONES_ESPERADA = 10.0;
    private static final double TOLERANCIA_PONDERACION = 1e-6;

    private final PreguntaRepository preguntaRepository;
    private final FactorRepository factorRepository;
    private final OpcionRespuestaRepository opcionRespuestaRepository;
    private final PreguntaMapper preguntaMapper;

    public PreguntaService(
            PreguntaRepository preguntaRepository,
            FactorRepository factorRepository,
            OpcionRespuestaRepository opcionRespuestaRepository,
            PreguntaMapper preguntaMapper) {
        this.preguntaRepository = preguntaRepository;
        this.factorRepository = factorRepository;
        this.opcionRespuestaRepository = opcionRespuestaRepository;
        this.preguntaMapper = preguntaMapper;
    }

    // CU 20 paso 3: exige al menos un criterio; la búsqueda es "contiene"
    public List<PreguntaDTO> buscarPreguntasPorFiltros(String competencia, String factor, String nombre) {
        String c = normalizar(competencia);
        String f = normalizar(factor);
        String n = normalizar(nombre);

        if (c.isEmpty() && f.isEmpty() && n.isEmpty()) {
            throw new CriterioBusquedaInvalidoException(
                    "Debe ingresar al menos un criterio de búsqueda (competencia, factor o nombre)");
        }
        return preguntaMapper.mapToDTO(preguntaRepository.buscarPreguntasPorFiltros(c, f, n));
    }

    public PreguntaDTO obtenerPorId(Long id) {
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id));
        return preguntaMapper.mapToDTO(pregunta);
    }

    // CU021: Dar de alta Pregunta
    @Transactional
    public PreguntaDTO darAlta(PreguntaDTO dto) {
        if (dto == null) {
            throw new SolicitudInvalidaException("Los datos de la pregunta son obligatorios.");
        }

        // 5.A: Validar campos obligatorios (detallando todas las omisiones)
        List<String> faltantes = new ArrayList<>();
        if (dto.factorId() == null) {
            faltantes.add("Factor (y su Competencia asociada)");
        }
        String nombre = normalizarMayusculas(dto.nombre());
        if (nombre.isEmpty()) {
            faltantes.add("Nombre de Pregunta");
        }
        String enunciado = normalizarMayusculas(dto.enunciado());
        if (enunciado.isEmpty()) {
            faltantes.add("Pregunta");
        }
        if (dto.opcionRespuesta() == null || dto.opcionRespuesta().id() == null) {
            faltantes.add("Opción de Respuesta");
        } else {
            List<ItemOpcionDTO> itemsDto = dto.opcionRespuesta().items();
            if (itemsDto == null || itemsDto.isEmpty()
                    || itemsDto.stream().anyMatch(it -> it == null || it.ponderacion() == null)) {
                faltantes.add("Ponderación de todas las opciones de respuesta");
            }
        }

        if (!faltantes.isEmpty()) {
            throw new SolicitudInvalidaException(
                    "Debe completar todos los campos obligatorios:",
                    faltantes);
        }

        String descripcion = normalizarMayusculas(dto.descripcion());

        // 5.B: Validar longitudes máximas (detallando todos los campos excedidos)
        List<String> excedidos = new ArrayList<>();
        if (nombre.length() > MAX_NOMBRE) {
            excedidos.add("Nombre de Pregunta (máximo " + MAX_NOMBRE + " caracteres)");
        }
        if (enunciado.length() > MAX_ENUNCIADO) {
            excedidos.add("Pregunta (máximo " + MAX_ENUNCIADO + " caracteres)");
        }
        if (descripcion.length() > MAX_DESCRIPCION) {
            excedidos.add("Descripción (máximo " + MAX_DESCRIPCION + " caracteres)");
        }

        if (!excedidos.isEmpty()) {
            throw new SolicitudInvalidaException(
                    "Uno o más campos exceden su longitud máxima permitida:",
                    excedidos);
        }

        // Validar ponderaciones (>= 0 y suma == 10)
        List<ItemOpcionDTO> itemsDto = dto.opcionRespuesta().items();
        double suma = 0.0;
        Map<Long, Double> ponderacionesPorItemId = new HashMap<>();
        for (ItemOpcionDTO itemDto : itemsDto) {
            Double valor = itemDto.ponderacion();
            if (valor == null || valor.isNaN() || valor.isInfinite() || valor < 0.0) {
                throw new SolicitudInvalidaException(
                        "Las ponderaciones deben sumar 10 puntos y ser mayores o iguales a 0.");
            }
            suma += valor;
            if (itemDto.id() != null) {
                ponderacionesPorItemId.put(itemDto.id(), valor);
            }
        }

        if (Math.abs(suma - SUMA_PONDERACIONES_ESPERADA) > TOLERANCIA_PONDERACION) {
            throw new SolicitudInvalidaException(
                    "Las ponderaciones deben sumar 10 puntos y ser mayores o iguales a 0.");
        }

        // Recuperar entidades asociadas
        Factor factor = factorRepository.findById(dto.factorId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró el factor seleccionado."));

        OpcionRespuesta opcionRespuesta = opcionRespuestaRepository.findById(dto.opcionRespuesta().id())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró la opción de respuesta seleccionada."));

        if (opcionRespuesta.getItems().size() != ponderacionesPorItemId.size()) {
            throw new SolicitudInvalidaException(
                    "Debe informar la ponderación para cada ítem de la opción de respuesta seleccionada.");
        }

        // 5.C.1 y 5.C.2: Validar existencia previa en el mismo factor
        if (preguntaRepository.existePorNombre(factor.getId(), nombre)) {
            throw new ConflictoException(
                    "Ya existe una pregunta con ese nombre para la competencia y factor seleccionados.",
                    List.of());
        }

        if (preguntaRepository.existePorEnunciado(factor.getId(), enunciado)) {
            throw new ConflictoException(
                    "Ya existe una pregunta con ese enunciado para la competencia y factor seleccionados.",
                    List.of());
        }

        // Crear y persistir la entidad Pregunta junto con sus PonderacionOpcion
        Pregunta pregunta = new Pregunta();
        pregunta.setFactor(factor);
        pregunta.setNombre(nombre);
        pregunta.setEnunciado(enunciado);
        pregunta.setDescripcion(descripcion.isEmpty() ? null : descripcion);
        pregunta.setOpcionRespuesta(opcionRespuesta);
        pregunta.setTipo(resolverTipoPregunta(dto.tipo(), opcionRespuesta));
        pregunta.setEliminado(false);

        for (ItemOpcion item : opcionRespuesta.getItems()) {
            Double ponderacion = ponderacionesPorItemId.get(item.getId());
            if (ponderacion == null) {
                throw new SolicitudInvalidaException(
                        "Falta la ponderación para la opción: " + item.getDescripcion());
            }
            pregunta.agregarPonderacion(item, ponderacion);
        }

        Pregunta guardada = preguntaRepository.save(pregunta);
        return preguntaMapper.mapToDTO(guardada);
    }

    // Baja lógica (CU023): El DELETE se convierte en UPDATE eliminado = true por @SQLDelete
    @Transactional
    public void darBaja(Long id) {
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id));
        preguntaRepository.delete(pregunta);
    }

    private TipoPregunta resolverTipoPregunta(TipoPregunta tipoDto, OpcionRespuesta opcion) {
        if (tipoDto != null) {
            return tipoDto;
        }
        return opcion.getItems().size() == 2
                ? TipoPregunta.VERDADERO_FALSO
                : TipoPregunta.ESCALA;
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private String normalizarMayusculas(String valor) {
        return valor == null ? "" : valor.trim().toUpperCase(Locale.ROOT);
    }
}