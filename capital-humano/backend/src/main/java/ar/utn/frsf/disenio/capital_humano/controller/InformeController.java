package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.OrdenMeritoDTO;
import ar.utn.frsf.disenio.capital_humano.dto.PuestoDTO;
import ar.utn.frsf.disenio.capital_humano.service.InformeService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/informes")
public class InformeController {

    private final InformeService informeService;

    public InformeController(InformeService informeService) {
        this.informeService = informeService;
    }

    @GetMapping("/puestos")
    public List< PuestoDTO > buscarPuestos(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String empresa) {
        return informeService.buscarPuestos(codigo, nombre, empresa);
    }

    @GetMapping("/puestos/{puestoId}/evaluaciones")
    public List< Map< String, Object > > listarEvaluacionesPorPuesto(@PathVariable Long puestoId) {
        return informeService.listarEvaluacionesPorPuesto(puestoId);
    }

    @PostMapping("/orden-merito")
    public List< OrdenMeritoDTO > emitirOrdenMerito(
            @RequestParam Long puestoId,
            @RequestParam(required = false) List< Long > evaluacionIds) {
        return informeService.emitirOrdenMerito(puestoId, evaluacionIds);
    }

    @PostMapping("/orden-merito/imprimir")
    public ResponseEntity< Map< String, String > > imprimirOrdenMerito(
            @RequestParam Long puestoId,
            @RequestParam(required = false) List< Long > evaluacionIds) {
        informeService.imprimirOrdenMerito(puestoId, evaluacionIds);
        return ResponseEntity.ok(Map.of("mensaje", "Reporte impreso correctamente"));
    }
}