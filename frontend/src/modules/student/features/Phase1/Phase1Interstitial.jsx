import React from 'react';
export default function Phase1Interstitial({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Interfaz Intermedia Fase 1</h2>
      <button className="btn px-6 py-2" onClick={onNext}>Siguiente</button>
    </div>
  );
}
