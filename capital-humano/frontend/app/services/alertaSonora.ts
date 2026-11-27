/** "Suave alerta auditiva" de los flujos alternativos (CU026 1.A.3, 1.B.3 y 6.A.2): un tono corto y bajo. */
export function emitirAlertaSonora(): void {
  try {
    const contexto = new AudioContext();
    const oscilador = contexto.createOscillator();
    const volumen = contexto.createGain();

    oscilador.type = "sine";
    oscilador.frequency.value = 660;
    volumen.gain.setValueAtTime(0.08, contexto.currentTime);
    volumen.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.35);

    oscilador.connect(volumen);
    volumen.connect(contexto.destination);
    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.35);
    oscilador.onended = () => void contexto.close();
  } catch {
    // el navegador no soporta audio o lo bloqueó: el aviso visual alcanza
  }
}
