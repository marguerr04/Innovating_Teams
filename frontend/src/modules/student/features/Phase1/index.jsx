// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect } from 'react';
// Sube 4 niveles
import { load, save, defaultPoll } from '../../../../utils/helpers.js';

// 1. --- Importar TODOS los juegos ---
import WordSearch from './components/WordSearch';
import ArmarPalabras from './components/ArmarPalabras';
import RomperHielo from './components/RomperHielo';

// 2. --- Un componente "helper" para elegir el juego ---
const ActividadGanadora = ({ winner, onComplete }) => {
  // Usamos el ID del ganador para decidir qué componente mostrar
  switch (winner.id) {
    case 'sopa':
      return <WordSearch onComplete={onComplete} />;
    case 'armar':
      return <ArmarPalabras onComplete={onComplete} />;
    case 'ice':
      return <RomperHielo onComplete={onComplete} />;
    default:
      return <p>Juego no encontrado</p>;
  }
};

function Phase1({ role, onNext }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

  const castVote = (id) => {
    // Lógica de votación (funciona con tu API cuando la conectes)
    // Por ahora, usa localStorage
    setPoll(p => { const me = role + '-' + (localStorage.getItem('it_user') || 'solo'); const votes = { ...p.votes, [me]: id }; return { ...p, myVote: id, votes }; });

    // --- AQUÍ IRÍA LA LLAMADA A TU API (PASO 2) ---
    // fetch('http://127.0.0.1:8000/api/v1/fase1/votar/', {
    //   method: 'POST',
    //   body: JSON.stringify({ voto: id, alumno_id: 'tu_id_de_alumno' })
    // });
  };

  // Lógica de conteo (esto vendrá de la API después)
  const tally = Object.values(poll.votes).reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const winner = poll.options.reduce((best, o) => (tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best, poll.options[0]);

  const [wsDone, setWsDone] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">Fase 1 · Votación de actividades</h1>
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* --- TARJETA DE VOTACIÓN (Sin cambios) --- */}
        <div className="card p-6">
          <b>Votación de actividades</b>
          <div className="mt-4 flex flex-col gap-3">
            {poll.options.map(o => (
              <label key={o.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200">
                <input type="radio" name="opt" checked={poll.myVote === o.id} onChange={() => castVote(o.id)} />
                <span className="font-semibold">{o.label}</span>
                <span className="ml-auto text-xs bg-slate-100 rounded-full px-2 py-1">{tally[o.id] || 0} voto(s)</span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-sm">Ganando: <b>{winner.label}</b></div>
          <div className="mt-3 text-right">
            <button 
              className="btn bg-accent-500 text-white" 
              onClick={onNext}
              disabled={!wsDone} // 3. Deshabilitar el botón si la actividad no está hecha
            >
              Ir a Fase 2
            </button>
          </div>
        </div>

        {/* --- TARJETA DE ACTIVIDAD (AHORA ES DINÁMICA) --- */}
        <div className="card p-6">
          <b>Actividad: {winner.label}</b> {/* Título dinámico */}
          <p className="text-sm text-slate-600">Encuentra todas las palabras para marcar la actividad como realizada.</p>

          {/* 4. --- Renderizado dinámico del juego --- */}
          <div className="mt-4">
            <ActividadGanadora 
              winner={winner} 
              onComplete={() => setWsDone(true)} 
            />
          </div>

          {wsDone && <div className="mt-3 text-emerald-600 text-sm">✔ Actividad completada.</div>}
        </div>

      </div>
    </div>
  );
}

export default Phase1;