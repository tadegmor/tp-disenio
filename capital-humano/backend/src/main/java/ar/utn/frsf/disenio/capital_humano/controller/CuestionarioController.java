package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.BloqueCuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CompletarBloqueRequestDTO;
import ar.utn.frsf.disenio.capital_humano.dto.CuestionarioDTO;
import ar.utn.frsf.disenio.capital_humano.service.CuestionarioService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cuestionario")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CuestionarioController {

    private final CuestionarioService cuestionarioService;

    /** Listado "Cuestionarios pendientes" del candidato que ingresó con su número de candidato (inicio del CU026). */
    @GetMapping(params = "numeroCandidato")
    public ResponseEntity<List<CuestionarioDTO>> listarPorNumeroCandidato(@RequestParam String numeroCandidato) {
        return ResponseEntity.ok(cuestionarioService.listarPorNumeroCandidato(numeroCandidato));
    }

    /** Paso 1: estado del cuestionario ya verificado (1.A / 1.B). 404 si no existe. */
    @GetMapping("/{id}")
    public ResponseEntity<CuestionarioDTO> consultar(@PathVariable Long id) {
        return ResponseEntity.ok(cuestionarioService.consultarCuestionario(id));
    }

    /** Paso 1: texto de la pantalla "Cuestionario - Instrucciones". */
    @GetMapping(value = "/instrucciones", produces = "text/plain;charset=UTF-8")
    public ResponseEntity<String> obtenerInstrucciones() {
        return ResponseEntity.ok(cuestionarioService.obtenerInstrucciones());
    }

    /** Pasos 3-4, 1.C y 8.A: bloque sin responder. 409 si el estado no permite iniciarlo. */
    @PostMapping("/{id}/iniciar")
    public ResponseEntity<BloqueCuestionarioDTO> iniciar(@PathVariable Long id) {
        return ResponseEntity.ok(cuestionarioService.iniciarCuestionario(id));
    }

    /** Pasos 7-8: guarda el bloque (204). 400 si faltan respuestas, 409 si el bloque ya fue respondido. */
    @PostMapping("/{id}/bloques/{bloqueId}")
    public ResponseEntity<Void> completar(@PathVariable Long id,
                                          @PathVariable Long bloqueId,
                                          @RequestBody CompletarBloqueRequestDTO request) {
        cuestionarioService.completarCuestionario(id, bloqueId, request);
        return ResponseEntity.noContent().build();
    }
}
