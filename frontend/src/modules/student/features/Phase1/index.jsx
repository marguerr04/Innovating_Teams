// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css';
import { load, save, defaultPoll } from '../../../../utils/helpers.js';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer';

const ActividadGanadora = ({ winner, onComplete }) => {
  const srcMap = {
    sopa: '/games/sopa/index.html',
    anagrama: '/games/anagrama/index.html',
    ice: '/games/rompehielos/index.html',
  };

  const norm = (s = '') =>
    (s + '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const id = norm(winner?.id || '');
  const lbl = norm(winner?.label || '');

  let key = 'sopa';
  if (
    id.includes('anagram') ||
    id.includes('anagrama') ||
    /anagrama|armar.*palabras/.test(lbl)
  ) {
    key = 'anagrama';
  } else if (
    id.includes('ice') ||
    id.includes('rompe') ||
    /romper.*hielo|rompehielo|rompehielos/.test(lbl)
  ) {
    key = 'ice';
  } else if (id.includes('sopa') || /sopa/.test(lbl)) {
    key = 'sopa';
  }

  const src = srcMap[key] || srcMap.sopa;

  return (
    <div className="w-full h-full relative">
      <iframe
        src={src}
        title={winner?.label || 'Actividad'}
        className="absolute inset-0 w-full h-full border-0"
      />
      <div className="pointer-events-auto absolute bottom-4 right-4">
        <button
          onClick={onComplete}
          className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-600"
        >
          Terminar actividad
        </button>
      </div>
    </div>
  );
};

const PHASE_1_DURATION = 300;

function Phase1({ role, onNext, isProf }) {
  const [poll, setPoll] = useState(() => load('it_poll', defaultPoll));
  useEffect(() => save('it_poll', poll), [poll]);

  const castVote = (id) => {
    setPoll(p => {
      const me = role + '-' + (localStorage.getItem('studentId') || 'me');
      const votes = { ...p.votes, [me]: id };
      return { ...p, myVote: id, votes };
    });
  };

  const tally = Object.values(poll.votes).reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
  const winner = poll.options.reduce((best, o) => ((tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best), poll.options[0]);

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
  }, []);

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
          <b>Actividad: {winner.label}</b>
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

      <ActivityModal show={showActivity} onClose={() => { setShowActivity(false); setCustomIframe(null); }} title={`Fase 1: ${customIframe?.title || winner.label}`}>
        {customIframe ? (
          <div className="w-full h-full relative">
            <iframe src={customIframe.src} title={customIframe.title || 'Vista'} className="absolute inset-0 w-full h-full border-0" />
          </div>
        ) : (
          <ActividadGanadora winner={winner} onComplete={handleOnComplete} />
        )}
      </ActivityModal>
    </div>
  );
}

export default Phase1;
