// Interfaz eliminada: ya no se muestra video en la fase 5
export default function Phase5Interstitial({ onNext }) {
  // Salto directo a la siguiente fase
  if (typeof onNext === 'function') onNext();
  return null;
}
