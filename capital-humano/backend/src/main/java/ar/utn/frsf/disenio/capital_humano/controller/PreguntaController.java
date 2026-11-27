package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.PreguntaDTO;
import ar.utn.frsf.disenio.capital_humano.service.PreguntaService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/preguntas")
public class PreguntaController {

    private final PreguntaService preguntaService;

    public PreguntaController(PreguntaService preguntaService) {
        this.preguntaService = preguntaService;
    }

    //GET /api/preguntas?competencia=lealtad&factor=compro&nombre=logro

    @GetMapping
    public List<PreguntaDTO> buscarPreguntasPorFiltros(
            @RequestParam(required = false) String competencia,
            @RequestParam(required = false) String factor,
            @RequestParam(required = false) String nombre) {
        return preguntaService.buscarPreguntasPorFiltros(competencia, factor, nombre);
    }

    @GetMapping("/{id}")
    public PreguntaDTO obtenerPreguntaPorId(@PathVariable Long id) {
        return preguntaService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> darBajaPregunta(@PathVariable Long id) {
        preguntaService.darBaja(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<PreguntaDTO> darAltaPregunta(@RequestBody PreguntaDTO dto) {
    PreguntaDTO creada = preguntaService.darAlta(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(creada);
}
}

