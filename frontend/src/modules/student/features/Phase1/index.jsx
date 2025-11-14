// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css';
import { load, save, defaultPoll } from '../../../../utils/helpers.js';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer';

// Import game components (keep all available to be safe)
import AnagramaGame from './components/AnagramaGame';
import RompeHielosGame from './components/RompeHielosGame';
import SopaLetrasGame from './components/SopaLetrasGame';
import WordSearch2 from './components/WordSearch2/WordSearch2.jsx';
import MakeWords from './components/MakeWords/MakeWords.jsx';
import BreakIce from './components/BreakIce.jsx';

const PHASE_1_DURATION = 300;

const ActividadGanadora = ({ winner, onComplete }) => {
  const norm = (s = '') =>
    (s + '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const id = norm(winner?.id || '');
  const lbl = norm(winner?.label || '');

  // Map to available components with sensible defaults
  if (
    id === 'armar' ||
    /\barmar\b.*\bpalabras\b/i.test(lbl) ||
    /\banagrama\b/i.test(lbl) ||
    id.includes('anagram') ||
    id.includes('anagrama')
  ) {
    return <AnagramaGame onComplete={onComplete} />;
  }

  if (
    id === 'ice' ||
    /\bromper\b.*\bhielo\b/i.test(lbl) ||
    /\brompehielos?\b/i.test(lbl) ||
    id.includes('ice') ||
    id.includes('rompe')
  ) {
    return <RompeHielosGame onComplete={onComplete} />;
  }

  // Default to sopa de letras / wordsearch
  if (id === 'sopa' || /\bsopa\b/i.test(lbl) || id.includes('sopa')) {
    return <SopaLetrasGame onGameEnd={onComplete} />;
  }

  // Fallbacks to older components if present
  if (id === 'sopa2' || lbl.includes('sopa')) return <WordSearch2 onComplete={onComplete} />;
  if (id === 'armar' || lbl.includes('armar')) return <MakeWords onComplete={onComplete} />;
  if (id === 'ice' || lbl.includes('rompe')) return <BreakIce onComplete={onComplete} />;

  return <p>Juego no encontrado</p>;
};

function Phase1({ role, onNext, isProf }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

  const castVote = (id) => {
    setPoll(p => {
      const me = role + '-' + (localStorage.getItem('it_user') || 'solo');
      const votes = { ...p.votes, [me]: id };
      return { ...p, myVote: id, votes };
    });
  };

  const tally = Object.values(poll.votes).reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
  const winner = poll.options.reduce((best, o) => ((tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best), poll.options[0]);
  const selectedOption = poll.options.find(o => o.id === poll.myVote) || winner;

  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
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
  }, []);

  // Lazy-load optional widget only when opening activity
  useEffect(() => {
    if (!showActivity) return;
    // Example: load chat widget lazily (guarded)
    if (!window.chatbase) {
      window.chatbase = (...args) => { window.chatbase.q = window.chatbase.q || []; window.chatbase.q.push(args); };
      const onLoad = function(){ const s=document.createElement('script'); s.src='https://www.chatbase.co/embed.min.js'; s.id='NDIGyY6LjlULvnmM9GEOX'; document.body.appendChild(s); };
      if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad);
    }
  }, [showActivity]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fase 1 · Votación de actividades</h1>
        <div className="card p-4">
          <Timer
            initialSeconds={PHASE_1_DURATION}
            isProf={isProf}
            autoStart={true}
            onComplete={onNext}
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
            <button className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`} onClick={onNext} disabled={!activityDone}>
              Ir a Fase 2
            </button>
          </div>
        </div>

        <div className="card p-6">
          <b>Actividad: {selectedOption.label}</b>
          <p className="text-sm text-slate-600 mt-2">Completa la actividad para continuar.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn bg-mint-500 text-white w-full" onClick={() => { setCustomIframe(null); setShowActivity(true); }} disabled={activityDone}>
              ¡Comenzar Actividad!
            </button>
            <button className="btn bg-sea-500 text-white w-full" onClick={() => { const ev = new CustomEvent('open-iframe', { detail: { title: 'Instrucciones del juego', src: '/extras/instrucciones/index.html' } }); window.dispatchEvent(ev); setShowActivity(true); }}>
              Ver Instrucciones
            </button>
          </div>

          {activityDone && <div className="mt-3 text-emerald-600 text-sm">✔ Actividad completada.</div>}
        </div>
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
    </div>
  );
}

export default Phase1;
