package ar.utn.frsf.disenio.capital_humano.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClaveGeneratorTest {

    private final ClaveGenerator generador = new ClaveGenerator();

    @Test
    void lasClavesGeneradasTienen8CaracteresConLetrasYDigitos() {
        for (int i = 0; i < 2000; i++) {
            assertThat(generador.esValida(generador.generar())).isTrue();
        }
    }

    @Test
    void validaElFormato() {
        assertThat(generador.esValida("A1S2D3F4")).isTrue();
        assertThat(generador.esValida("ABCDEFGH")).isFalse();
        assertThat(generador.esValida("12345678")).isFalse();
        assertThat(generador.esValida("a1s2d3f4")).isFalse();
        assertThat(generador.esValida("A1S2D3F")).isFalse();
        assertThat(generador.esValida("A1S2D3F45")).isFalse();
        assertThat(generador.esValida(null)).isFalse();
    }
}