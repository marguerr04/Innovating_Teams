// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css'; 
import { load, save, defaultPoll } from '../../../../utils/helpers.js';

// 1. Importa tus componentes de juego Y el nuevo Modal
import WordSearch2 from './components/WordSearch2/WordSearch2.jsx';
import MakeWords from './components/MakeWords.jsx';
import BreakIce from './components/BreakIce.jsx';
import ActivityModal from '../../components/ActivityModal.jsx'; // <-- IMPORTA EL MODAL

const ActividadGanadora = ({ winner, onComplete }) => {
  // ... (Esta función no cambia)
  switch (winner.id) {
    case 'sopa':
      return <WordSearch2 onComplete={onComplete} />;
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

  // ... (Toda tu lógica de 'castVote', 'tally' y 'winner' no cambia)
  const castVote = (id) => {
    setPoll(p => { const me = role + '-' + (localStorage.getItem('it_user') || 'solo'); const votes = { ...p.votes, [me]: id }; return { ...p, myVote: id, votes }; });
  };
  const tally = Object.values(poll.votes).reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const winner = poll.options.reduce((best, o) => (tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best, poll.options[0]);

  // 2. ESTADOS PARA CONTROLAR EL JUEGO
  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false); // <-- NUEVO ESTADO PARA EL MODAL

  // 3. NUEVA FUNCIÓN 'onComplete'
  // Ahora, cuando el juego termina, actualiza el estado Y cierra el modal.
  const handleOnComplete = useCallback(() => {
    setActivityDone(true);
    setShowActivity(false); // Cierra el modal
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">Fase 1 · Votación de actividades</h1>
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* --- TARJETA DE VOTACIÓN (No cambia) --- */}
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
              className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`}
              onClick={onNext}
              disabled={!activityDone}
            >
              Ir a Fase 2
            </button>
          </div>
        </div>

        {/* --- TARJETA DE ACTIVIDAD (Ahora es más simple) --- */}
        <div className="card p-6">
          <b>Actividad: {winner.label}</b> 
          <p className="text-sm text-slate-600">Completa la actividad para continuar.</p>
          
          <div className="mt-4">
            {/* 4. REEMPLAZAMOS EL JUEGO POR UN BOTÓN */}
            <button
              className="btn bg-mint-500 text-white w-full"
              onClick={() => setShowActivity(true)} // <-- Abre el modal
              disabled={activityDone} // Se deshabilita si ya la completó
            >
              {activityDone ? "Actividad Completada" : "¡Comenzar Actividad!"}
            </button>
          </div>

          {activityDone && <div className="mt-3 text-emerald-600 text-sm">✔ Actividad completada.</div>}
        </div>

      </div>

      {/* 5. EL MODAL (Fuera del grid, listo para superponerse) */}
      <ActivityModal 
        show={showActivity} 
        onClose={() => setShowActivity(false)}
        title={`Fase 1: ${winner.label}`}
      >
        <ActividadGanadora 
          winner={winner} 
          onComplete={handleOnComplete} 
        />
      </ActivityModal>

    </div>
  );
}

export default Phase1;