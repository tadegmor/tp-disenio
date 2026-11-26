package ar.utn.frsf.disenio.capital_humano.controller;

import ar.utn.frsf.disenio.capital_humano.dto.CompetenciaDTO;
import ar.utn.frsf.disenio.capital_humano.dto.FactorDTO;
import ar.utn.frsf.disenio.capital_humano.service.CompetenciaService;
import ar.utn.frsf.disenio.capital_humano.service.FactorService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/competencias")
public class CompetenciaController {

    private final CompetenciaService competenciaService;
    private final FactorService factorService;

    public CompetenciaController(
            CompetenciaService competenciaService,
            FactorService factorService) {
        this.competenciaService = competenciaService;
        this.factorService = factorService;
    }

    @GetMapping
    public List<CompetenciaDTO> listarTodas() {
        return competenciaService.listarTodas();
    }

    @GetMapping("/{competenciaId}/factores")
    public List<FactorDTO> buscarFactoresPorCompetencia(@PathVariable Long competenciaId) {
        return factorService.buscarPorCompetencia(competenciaId);
    }
}