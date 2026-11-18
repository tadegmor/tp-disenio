package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.EvaluarCandidatoRequestDTO;
import ar.utn.frsf.disenio.capital_humano.model.Candidato;
import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.service.EvaluacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluaciones")
@CrossOrigin(origins = "http://localhost:3000")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    public EvaluacionController(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    @PostMapping("/verificar-activos")
    public ResponseEntity<List<Candidato>> verificarActivos(@RequestBody List<Long> candidatoIds) {
        return ResponseEntity.ok(evaluacionService.verificarCuestionariosActivos(candidatoIds));
    }

    @PostMapping("/generar")
    public ResponseEntity<List<Cuestionario>> generarEvaluaciones(@RequestBody EvaluarCandidatoRequestDTO request) {
        // Jackson ya deserializó los IDs directamente como List<Long> y Long
        List<Cuestionario> cuestionarios = evaluacionService.generarEvaluaciones(
            request.getCandidatoIds(), 
            request.getPuestoId()
        );
        return ResponseEntity.ok(cuestionarios);
    }

    @GetMapping("/exportar")
    public ResponseEntity<Map<String, String>> exportar(@RequestParam Long puestoId) {
        String nombreArchivo = evaluacionService.exportarResultadosExcel(puestoId);
        return ResponseEntity.ok(Map.of("nombreArchivo", nombreArchivo));
    }
}