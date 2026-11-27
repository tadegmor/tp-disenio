package ar.utn.frsf.disenio.capital_humano.reporte;

import ar.utn.frsf.disenio.capital_humano.model.Cuestionario;
import ar.utn.frsf.disenio.capital_humano.model.Puesto;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
public class ReporteOrdenMerito implements GeneradorReporte {

    private final LocalDateTime fechaEmision;
    private final String emitidoPor;
    private final Puesto puesto;
    private final List<Cuestionario> cuestionarios;

    public ReporteOrdenMerito(LocalDateTime fechaEmision, String emitidoPor, Puesto puesto,
                              List<Cuestionario> cuestionarios) {
        this.fechaEmision = fechaEmision;
        this.emitidoPor = emitidoPor;
        this.puesto = puesto;
        this.cuestionarios = cuestionarios;
    }

    @Override
    public void generarReporte() {
        log.info("Generando ReporteOrdenMerito para puesto [{} - {}] ({} cuestionarios) por {}",
                puesto.getCodigo(), puesto.getNombre(), cuestionarios.size(), emitidoPor);
    }

    @Override
    public void imprimirReporte() {
        log.info("Enviando listado de Orden de Mérito del puesto [{}] a impresora...", puesto.getCodigo());
    }
}