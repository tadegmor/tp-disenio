package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.CandidatoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.EvaluacionGeneradaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.EvaluarCandidatoRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.FinalizarEvaluacionRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.ResultadoEvaluacionDTO;
import ar.utn.frsf.disenio.capital_humano.service.EvaluacionService;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/evaluaciones")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    /** Pasos 2-3: búsqueda de candidatos (200). */
    @GetMapping("/candidatos")
    public ResponseEntity<List<CandidatoDTO>> buscarCandidatos(@RequestParam(required = false) String apellido,
                                                               @RequestParam(required = false) String nombre,
                                                               @RequestParam(required = false) String numeroCandidato) {
        return ResponseEntity.ok(evaluacionService.buscarCandidatos(apellido, nombre, numeroCandidato));
    }

    /** Paso 6: devuelve los candidatos con cuestionario activo o en proceso (lista vacía = todos disponibles). */
    @PostMapping("/verificar-activos")
    public ResponseEntity<List<CandidatoDTO>> verificarActivos(@RequestBody List<Long> candidatoIds) {
        return ResponseEntity.ok(evaluacionService.verificarCuestionariosActivos(candidatoIds));
    }

    /** Paso 11: genera las claves sin guardar. 400 / 404 / 409 (candidatos no disponibles) / 422 (puesto no evaluable). */
    @PostMapping("/preparar")
    public ResponseEntity<List<ResultadoEvaluacionDTO>> preparar(@RequestBody EvaluarCandidatoRequestDTO request) {
        return ResponseEntity.ok(evaluacionService.prepararEvaluacion(request.getPuestoId(), request.getCandidatoIds()));
    }

    /** Paso 12 (Finalizar): guarda la evaluación y sus cuestionarios ACTIVOS (201). */
    @PostMapping
    public ResponseEntity<EvaluacionGeneradaDTO> finalizar(@RequestBody FinalizarEvaluacionRequestDTO request) {
        EvaluacionGeneradaDTO generada = evaluacionService.evaluarCandidato(request);
        return ResponseEntity.created(URI.create("/api/evaluaciones/" + generada.getEvaluacionId())).body(generada);
    }
}