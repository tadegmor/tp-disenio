package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.PuestoCompetenciasDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.service.PuestoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/puestos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PuestoController {

    private final PuestoService puestoService;

    /** Sin filtros devuelve todos los puestos (carga automática de los desplegables Puesto - Empresa). */
    @GetMapping
    public ResponseEntity<List<PuestoDTO>> listarPuestos(@RequestParam(required = false) String codigo,
                                                         @RequestParam(required = false) String nombre,
                                                         @RequestParam(required = false) String empresa) {
        return ResponseEntity.ok(puestoService.buscar(codigo, nombre, empresa));
    }

    @GetMapping("/{id}/competencias")
    public ResponseEntity<PuestoCompetenciasDTO> obtenerCompetencias(@PathVariable Long id) {
        return ResponseEntity.ok(puestoService.obtenerCompetenciasConFactores(id));
    }
}