
import React, { useState, useEffect } from 'react';

import { load, save, defaultPoll } from '../../../../utils/helpers.js';


import WordSearch from './components/WordSearch';
import MakeWords from './components/MakeWords.jsx';
import BreakIce from './components/BreakIce.jsx';

const ActividadGanadora = ({ winner, onComplete }) => {

  switch (winner.id) {
    case 'sopa':
      return <WordSearch onComplete={onComplete} />;
    case 'armar':
      return <MakeWords onComplete={onComplete} />;
    case 'ice':
      return <BreakIce onComplete={onComplete} />;
    default:
      return <p>Juego no encontrado</p>;
  }
};

function Phase1({ role, onNext }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

  const castVote = (id) => {

    setPoll(p => { const me = role + '-' + (localStorage.getItem('it_user') || 'solo'); const votes = { ...p.votes, [me]: id }; return { ...p, myVote: id, votes }; });


  };

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

        <div className="card p-6">
          <b>Actividad: {winner.label}</b> 
          <p className="text-sm text-slate-600">Encuentra todas las palabras para marcar la actividad como realizada.</p>

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