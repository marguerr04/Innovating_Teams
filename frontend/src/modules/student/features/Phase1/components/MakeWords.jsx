import React from 'react';

function MakeWords({ onComplete }) {
  return (
    <div className="text-center p-8 bg-slate-100 rounded-lg">
      <h3 className="text-xl font-bold text-slate-800">Armar Palabras</h3>
      <p className="text-slate-600 mt-2">
        Este juego está en construcción.
      </p>
      {/* Simular que se completa después de 3 segundos */}
      <button 
        onClick={onComplete} 
        className="btn bg-accent-500 text-white mt-4"
      >
        Completar (Test)
      </button>
    </div>
  );
}

export default MakeWords;