// src/pages/Phase1.jsx
import React, { useState, useEffect } from 'react';
import WordSearch from '../components/WordSearch'; // <-- Importa el componente

// (Aquí irían las funciones 'load', 'save', 'defaultPoll')
// O mejor, muévelas a un archivo 'utils.js' e impórtalas

export default function Phase1({ role, onNext }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  // ... (todo el resto de la lógica de Phase1)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">Fase 1 · Votación...</h1>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="card p-6">
          {/* ... (JSX de la votación) */}
        </div>
        <div className="card p-6">
          <b>Actividad: Sopa de letras</b>
          <p>...</p>
          <div className="mt-4">
            <WordSearch onComplete={() => setWsDone(true)} /> {/* <-- Usa el componente */}
          </div>
          {/* ... */}
        </div>
      </div>
    </div>
  );
}