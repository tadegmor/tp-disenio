package ar.utn.frsf.disenio.capital_humano.service;

import ar.utn.frsf.disenio.capital_humano.model.*;
import ar.utn.frsf.disenio.capital_humano.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluacionService {

    private final CandidatoRepository candidatoRepository;
    private final CuestionarioRepository cuestionarioRepository;
    private final PuestoRepository puestoRepository;

    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public EvaluacionService(CandidatoRepository candidatoRepository,
                             CuestionarioRepository cuestionarioRepository,
                             PuestoRepository puestoRepository) {
        this.candidatoRepository = candidatoRepository;
        this.cuestionarioRepository = cuestionarioRepository;
        this.puestoRepository = puestoRepository;
    }

    public List<Candidato> buscarCandidatos(String apellido, String nombre, String numeroCandidato) {
        return candidatoRepository.buscarPorFiltros(apellido, nombre, numeroCandidato);
    }

    public List<Candidato> verificarCuestionariosActivos(List<Long> candidatoIds) {
        List<Cuestionario> cuestionarios = cuestionarioRepository.buscarActivosPorCandidatos(candidatoIds);
        return cuestionarios.stream().map(cuestionario -> cuestionario.getCandidato()).filter(c -> c != null).distinct().collect(Collectors.toList());
    }

    @Transactional
    public List<Cuestionario> generarEvaluaciones(List<Long> candidatoIds, Long puestoId) {
        Puesto puesto = puestoRepository.findById(puestoId)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        List<Candidato> candidatos = candidatoRepository.findAllById(candidatoIds);
        List<Cuestionario> cuestionariosGenerados = new ArrayList<>();

        for (Candidato candidato : candidatos) {
            String clave = generarClaveAlfanumérica(8);
            Cuestionario cuestionario = Cuestionario.builder()
                    .candidato(candidato)
                    .puesto(puesto)
                    .claveIngreso(clave)
                    .fechaCreacion(LocalDateTime.now())
                    .estado(EstadoCuestionario.ACTIVO)
                    .build();
            cuestionariosGenerados.add(cuestionarioRepository.save(cuestionario));
        }

        return cuestionariosGenerados;
    }

    public String generarClaveAlfanumérica(int longitud) {
        StringBuilder sb = new StringBuilder(longitud);
        for (int i = 0; i < longitud; i++) {
            sb.append(CARACTERES.charAt(RANDOM.nextInt(CARACTERES.length())));
        }
        return sb.toString();
    }

    public String exportarResultadosExcel(Long puestoId) {
        Puesto puesto = puestoRepository.findById(puestoId).orElseThrow();
        String nombreFuncion = puesto.getNombre().toUpperCase().replace(" ", "-");
        String fechaHora = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm"));
        return fechaHora + "-" + nombreFuncion + ".xls";
    }
}