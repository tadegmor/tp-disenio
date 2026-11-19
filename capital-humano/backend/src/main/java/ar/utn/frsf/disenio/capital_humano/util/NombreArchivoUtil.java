package ar.utn.frsf.disenio.capital_humano.util;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class NombreArchivoUtil {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm");

    private NombreArchivoUtil() {
    }

    /** CU025: aaaa-mm-dd-hh-mm-NombreFunción.xls (ej: 2026-05-01-19-08-JEFE-DE-COCINA.xls). */
    public static String paraEvaluacion(LocalDateTime fecha, String nombrePuesto) {
        String sinAcentos = Normalizer.normalize(nombrePuesto, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String funcion = sinAcentos.toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]+", "-")
                .replaceAll("^-|-$", "");
        return fecha.format(FORMATO_FECHA) + "-" + funcion + ".xls";
    }
}