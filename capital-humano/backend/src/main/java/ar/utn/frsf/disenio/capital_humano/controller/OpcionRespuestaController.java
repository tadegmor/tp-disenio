package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.OpcionRespuestaDTO;
import ar.utn.frsf.disenio.capital_humano.service.OpcionRespuestaService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/opciones-respuesta")
public class OpcionRespuestaController {

    private final OpcionRespuestaService opcionRespuestaService;

    public OpcionRespuestaController(OpcionRespuestaService opcionRespuestaService) {
        this.opcionRespuestaService = opcionRespuestaService;
    }

    @GetMapping("/activas")
    public List<OpcionRespuestaDTO> listarActivas() {
        return opcionRespuestaService.listarActivas();
    }
}