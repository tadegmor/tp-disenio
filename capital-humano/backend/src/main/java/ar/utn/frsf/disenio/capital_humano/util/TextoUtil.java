package ar.utn.frsf.disenio.capital_humano.util;

public final class TextoUtil {

    private TextoUtil() {
    }

    /** null o en blanco se convierte en "" (que en una búsqueda "contiene" coincide con todo). */
    public static String normalizar(String valor) {
        return valor == null ? "" : valor.trim();
    }
}