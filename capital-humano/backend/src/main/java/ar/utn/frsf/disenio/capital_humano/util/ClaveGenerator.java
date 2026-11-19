package ar.utn.frsf.disenio.capital_humano.util;

import java.security.SecureRandom;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/** Claves de ingreso del CU025: aleatorias, 8 caracteres, con letras y dígitos. */
@Component
public class ClaveGenerator {

    public static final int LONGITUD = 8;

    private static final String LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITOS = "0123456789";
    private static final String TODOS = LETRAS + DIGITOS;
    private static final Pattern FORMATO = Pattern.compile("^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{" + LONGITUD + "}$");

    private final SecureRandom random = new SecureRandom();

    public String generar() {
        char[] clave = new char[LONGITUD];
        clave[0] = LETRAS.charAt(random.nextInt(LETRAS.length()));
        clave[1] = DIGITOS.charAt(random.nextInt(DIGITOS.length()));
        for (int i = 2; i < LONGITUD; i++) {
            clave[i] = TODOS.charAt(random.nextInt(TODOS.length()));
        }
        // se mezclan para que las posiciones de la letra y el dígito obligatorios no sean predecibles
        for (int i = LONGITUD - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char tmp = clave[i];
            clave[i] = clave[j];
            clave[j] = tmp;
        }
        return new String(clave);
    }

    public boolean esValida(String clave) {
        return clave != null && FORMATO.matcher(clave).matches();
    }
}