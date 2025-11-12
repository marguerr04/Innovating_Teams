// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
<<<<<<< HEAD
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
=======
import './Phase1.css';
import { load, save, defaultPoll } from '../../../../utils/helpers.js';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer';
import AnagramaGame from './components/AnagramaGame';
import RompeHielosGame from './components/RompeHielosGame';
import SopaLetrasGame from './components/SopaLetrasGame';

const ActividadGanadora = ({ winner, onComplete }) => {
  const norm = (s = '') =>
    (s + '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const id = norm(winner?.id || '');
  const lbl = norm(winner?.label || '');

  console.log('Debug mapping:', { id, lbl, winner });

  let key = 'sopa';
  
  console.log('Testing patterns:');
  console.log('- armar+palabras test:', /\barmar\b.*\bpalabras\b/i.test(lbl));
  console.log('- romper+hielo test:', /\bromper\b.*\bhielo\b/i.test(lbl));
  console.log('- sopa+letras test:', /\bsopa\b.*\bletras\b/i.test(lbl));
  
  // Detección más específica y ordenada
  // PRIMERO: Detectar anagrama/armar palabras (más específico)
  if (
    id === 'armar' ||
    /\barmar\b.*\bpalabras\b/i.test(lbl) ||
    /\banagrama\b/i.test(lbl) ||
    id.includes('anagram') ||
    id.includes('anagrama')
  ) {
    key = 'anagrama';
  } 
  // SEGUNDO: Detectar rompehielos (más específico)
  else if (
    id === 'ice' ||
    /\bromper\b.*\bhielo\b/i.test(lbl) ||
    /\brompehielos?\b/i.test(lbl) ||
    id.includes('ice') ||
    id.includes('rompe')
  ) {
    key = 'ice';
  } 
  // TERCERO: Detectar sopa de letras
  else if (
    id === 'sopa' ||
    /\bsopa\b.*\bletras\b/i.test(lbl) ||
    /\bsopa\b/i.test(lbl) ||
    id.includes('sopa')
  ) {
    key = 'sopa';
  }

  console.log('Selected key:', key);

  // SIEMPRE usar componentes React - No más iframes HTML
  if (key === 'anagrama') {
    console.log('Rendering AnagramaGame component');
    return <AnagramaGame onComplete={onComplete} />;
  }

  if (key === 'ice') {
    console.log('Rendering RompeHielosGame component');
    return <RompeHielosGame onComplete={onComplete} />;
  }

  // Default a sopa de letras si no coincide nada
  console.log('Rendering SopaLetrasGame component (default)');
  return <SopaLetrasGame onGameEnd={onComplete} />;
};

>>>>>>> avanceAlejandro/rama_post_certamen_1
const PHASE_1_DURATION = 300;

function Phase1({ role, onNext, isProf }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

<<<<<<< HEAD
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
=======
  const castVote = (id) => {
    setPoll(p => {
      const me = role + '-' + (localStorage.getItem('studentId') || 'me');
      const votes = { ...p.votes, [me]: id };
      return { ...p, myVote: id, votes };
    });
  };

  const tally = Object.values(poll.votes).reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
  const winner = poll.options.reduce((best, o) => ((tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best), poll.options[0]);
  // La actividad activa será la opción seleccionada por el alumno; si no hay selección, usamos la ganadora
  const selectedOption = poll.options.find(o => o.id === poll.myVote) || winner;

  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  React.useEffect(() => {
    if (!showActivity) return;
    // Lazy-load Chatbase widget only when opening a game
    if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
      window.chatbase = (...args) => { window.chatbase.q = window.chatbase.q || []; window.chatbase.q.push(args); };
      window.chatbase = new Proxy(window.chatbase, { get(target, prop){ if (prop==='q') return target.q; return (...args) => target(prop, ...args); } });
      const onLoad = function(){ const s=document.createElement('script'); s.src='https://www.chatbase.co/embed.min.js'; s.id='NDIGyY6LjlULvnmM9GEOX'; s.domain='www.chatbase.co'; document.body.appendChild(s); };
      if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad);
    }
  }, [showActivity]);
  const [customIframe, setCustomIframe] = useState(null);

  useEffect(() => {
    const onOpen = (e) => setCustomIframe(e.detail || null);
    window.addEventListener('open-iframe', onOpen);
    return () => window.removeEventListener('open-iframe', onOpen);
  }, []);

  const handleOnComplete = useCallback(() => {
    setActivityDone(true);
    setShowActivity(false);
    setCustomIframe(null);
>>>>>>> avanceAlejandro/rama_post_certamen_1
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
<<<<<<< HEAD
      
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
=======
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fase 1 · Votación de actividades</h1>
        <div className="card p-4">
          <Timer 
            initialSeconds={PHASE_1_DURATION} 
            isProf={isProf} 
            autoStart={true}
            onComplete={onNext}
>>>>>>> avanceAlejandro/rama_post_certamen_1
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
<<<<<<< HEAD

        {/* --- TARJETA DE VOTACIÓN (Sin cambios) --- */}
=======
>>>>>>> avanceAlejandro/rama_post_certamen_1
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
<<<<<<< HEAD
            <button 
              className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`}
              onClick={onNext}
              disabled={!activityDone}
            >
=======
            <button className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`} onClick={onNext} disabled={!activityDone}>
>>>>>>> avanceAlejandro/rama_post_certamen_1
              Ir a Fase 2
            </button>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        <div className="card p-6">
          <b>Actividad: {selectedOption.label}</b>
          <p className="text-sm text-slate-600 mt-2">Completa la actividad para continuar.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn bg-mint-500 text-white w-full" onClick={() => { setCustomIframe(null); setShowActivity(true); }} disabled={activityDone}>
              ¡Comenzar Actividad!
            </button>
            <button className="btn bg-sea-500 text-white w-full" onClick={() => { const ev = new CustomEvent('open-iframe', { detail: { title: 'Instrucciones del juego', src: '/extras/instrucciones/index.html' } }); window.dispatchEvent(ev); setShowActivity(true); }}>
              Ver Instrucciones
>>>>>>> avanceAlejandro/rama_post_certamen_1
            </button>
          </div>

          {activityDone && <div className="mt-3 text-emerald-600 text-sm">✔ Actividad completada.</div>}
        </div>
<<<<<<< HEAD

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

=======
      </div>

      <ActivityModal show={showActivity} onClose={() => { setShowActivity(false); setCustomIframe(null); }} title={`Fase 1: ${customIframe?.title || selectedOption.label}`}>
        {customIframe ? (
          <div className="w-full h-full relative">
            <iframe src={customIframe.src} title={customIframe.title || 'Vista'} className="absolute inset-0 w-full h-full border-0" />
          </div>
        ) : (
          <ActividadGanadora winner={selectedOption} onComplete={handleOnComplete} />
        )}
      </ActivityModal>
>>>>>>> avanceAlejandro/rama_post_certamen_1
    </div>
  );
}

<<<<<<< HEAD
export default Phase1;
=======
export default Phase1;
>>>>>>> avanceAlejandro/rama_post_certamen_1
