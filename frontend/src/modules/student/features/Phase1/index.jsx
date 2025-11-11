// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css'; 
import { load, save, defaultPoll } from '../../../../utils/helpers.js';

// Importa los componentes
import WordSearch2 from './components/WordSearch2/WordSearch2.jsx';
import MakeWords from './components/MakeWords/MakeWords.jsx';
import BreakIce from './components/BreakIce.jsx';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer'; // Importa el Timer

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

// Duración de 5 minutos (300s)
const PHASE_1_DURATION = 300;

function Phase1({ role, onNext, isProf }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

  // --- Lógica de votación (sin cambios) ---
  const castVote = (id) => {
    setPoll(p => { const me = role + '-' + (localStorage.getItem('it_user') || 'solo'); const votes = { ...p.votes, [me]: id }; return { ...p, myVote: id, votes }; });
  };
  const tally = Object.values(poll.votes).reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const winner = poll.options.reduce((best, o) => (tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best, poll.options[0]);

  // --- Estados del modal (sin cambios) ---
  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false); 

  const handleOnComplete = useCallback(() => {
    setActivityDone(true);
    setShowActivity(false); // Cierra el modal
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* --- 1. NUEVA CABECERA CON FLEX --- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold">
          Fase 1 · Votación de actividades
        </h1>
        {/* --- 2. TARJETA DEL TIMER --- */}
        <div className="card p-4">
          <Timer 
            initialSeconds={PHASE_1_DURATION}
            isProf={isProf}
            autoStart={true}
          />
        </div>
      </div>

      {/* === 1. AÑADIR BLOQUE DE INSTRUCCIÓN === */}
      <p className="text-lg text-white/80 mb-6 max-w-3xl">
        ¡Comencemos! La primera habilidad a trabajar es el <strong>Trabajo en Equipo</strong>. 
        Para romper el hielo, vota por la actividad que prefieras que realice todo el grupo.
      </p>
      {/* === FIN DE LA INSTRUCCIÓN === */}

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
              className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`}
              onClick={onNext}
              disabled={!activityDone}
            >
              Ir a Fase 2
            </button>
          </div>
        </div>

        {/* --- 3. TARJETA DE ACTIVIDAD (Modificada) --- */}
        <div className="card p-6">
          <b>Actividad: {winner.label}</b> 
          <p className="text-sm text-slate-600">Completa la actividad para continuar.</p>
          
          {/* --- 4. TIMER ELIMINADO DE AQUÍ --- */}
          
          <div className="mt-4">
            <button
              className="btn bg-mint-500 text-white w-full"
              onClick={() => setShowActivity(true)}
              disabled={activityDone}
            >
              {activityDone ? "Actividad Completada" : "¡Comenzar Actividad!"}
            </button>
          </div>

          {activityDone && <div className="mt-3 text-emerald-600 text-sm">✔ Actividad completada.</div>}
        </div>

      </div>

      {/* --- MODAL (Sin cambios) --- */}
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