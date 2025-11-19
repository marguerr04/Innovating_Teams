// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css';
import { load, save } from '../../../../utils/helpers.js';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer';

// Importamos los juegos
import AnagramaGame from './components/AnagramaGame';
import RompeHielosGame from './components/RompeHielosGame';
import SopaLetrasGame from './components/SopaLetrasGame';

const PHASE_1_DURATION = 300;

// Componente para renderizar el juego ganador
const ActividadGanadora = ({ winner, onComplete }) => {
  const id = winner?.id || '';
  if (id === 'anagrama') return <AnagramaGame onComplete={onComplete} />;
  if (id === 'ice') return <RompeHielosGame onComplete={onComplete} />;
  return <SopaLetrasGame onGameEnd={onComplete} />;
};

// Componente de Selección de Modo
const KnowledgeSelector = ({ onSelect }) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Opción: Se conocen */}
        <button onClick={() => onSelect('known')} className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-2xl transition-all hover:scale-[1.02] hover:shadow-sky-500/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-sky-100 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-3xl text-white shadow-lg shadow-sky-500/30">🤝</div>
            <h3 className="mb-2 text-2xl font-bold text-slate-800">Ya nos conocemos</h3>
            <p className="text-slate-600">Hemos trabajado juntos antes o somos amigos. Queremos un desafío mental rápido.</p>
            <div className="mt-6 flex items-center text-sm font-bold text-sky-600">Actividades: Sopa de Letras / Anagrama <span className="ml-2">→</span></div>
          </div>
        </button>

        {/* Opción: No se conocen */}
        <button onClick={() => onSelect('unknown')} className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-2xl transition-all hover:scale-[1.02] hover:shadow-mint-500/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-mint-100 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-500 text-3xl text-white shadow-lg shadow-mint-500/30">👋</div>
            <h3 className="mb-2 text-2xl font-bold text-slate-800">No nos conocemos</h3>
            <p className="text-slate-600">Es nuestra primera vez juntos. Necesitamos romper el hielo para entrar en confianza.</p>
            <div className="mt-6 flex items-center text-sm font-bold text-mint-600">Actividad: Rompehielos <span className="ml-2">→</span></div>
          </div>
        </button>
      </div>
    </div>
  );
};

function Phase1({ role, onNext, isProf }) {
  const [knowledgeMode, setKnowledgeMode] = useState(() => load('it_p1_knowledge', null));
  const [poll, setPoll] = useState(() => load('it_poll', { options: [], votes: {}, myVote: null }));

  useEffect(() => save('it_poll', poll), [poll]);
  useEffect(() => save('it_p1_knowledge', knowledgeMode), [knowledgeMode]);

  const getOptionsForMode = (mode) => {
    if (mode === 'known') return [{ id: 'sopa', label: 'Sopa de letras' }, { id: 'anagrama', label: 'Armar palabras con letras' }];
    if (mode === 'unknown') return [{ id: 'ice', label: 'Romper el hielo con el grupo' }];
    return [];
  };

  useEffect(() => {
    if (knowledgeMode && poll.options.length === 0) {
      setPoll(prev => ({ ...prev, options: getOptionsForMode(knowledgeMode) }));
    }
  }, [knowledgeMode, poll.options.length]);

  const handleModeSelect = (mode) => {
    setKnowledgeMode(mode);
    setPoll(prev => ({ ...prev, options: getOptionsForMode(mode), votes: {}, myVote: null }));
  };

  // 1. NUEVO: Función para resetear el modo y volver atrás
  const handleResetMode = () => {
    setKnowledgeMode(null);
    localStorage.removeItem('it_p1_knowledge');
    setPoll({ options: [], votes: {}, myVote: null }); // Limpiamos la votación también
  };

  const castVote = (id) => {
    setPoll(p => {
      const me = role + '-' + (localStorage.getItem('it_user') || 'solo');
      const votes = { ...p.votes, [me]: id };
      return { ...p, myVote: id, votes };
    });
  };

  const tally = Object.values(poll.votes).reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
  const winner = poll.options.length > 0 ? poll.options.reduce((best, o) => ((tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best), poll.options[0]) : null;
  const selectedOption = (poll.options.find(o => o.id === poll.myVote) || winner);

  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [customIframe, setCustomIframe] = useState(null);

  const handleOnComplete = useCallback(() => {
    setActivityDone(true);
    setShowActivity(false);
    setCustomIframe(null);
  }, []);

  // VISTA 1: Selección de Modo
  if (!knowledgeMode) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Trabajo en Equipo</h1>
          <div className="card p-4">
            <Timer initialSeconds={PHASE_1_DURATION} isProf={isProf} autoStart={false} />
          </div>
        </div>
        <KnowledgeSelector onSelect={handleModeSelect} />
      </>
    );
  }

  // VISTA 2: Votación / Actividad
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold">Trabajo en Equipo</h1>
           
           {/* 2. NUEVO: Botón visible solo para el profesor */}
           {isProf && (
              <button 
                onClick={handleResetMode}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-full border border-slate-500 transition-colors flex items-center gap-2 shadow-sm"
                title="Volver a elegir modo (Solo Profesor)"
              >
                ⚙️ Cambiar Modo
              </button>
           )}
        </div>

        <div className="card p-4">
          <Timer initialSeconds={PHASE_1_DURATION} isProf={isProf} autoStart={true} onComplete={onNext} />
        </div>
      </div>

      <p className="text-lg text-white/80 mb-6 max-w-3xl">
        ¡Comencemos! La primera habilidad a trabajar es el <strong>Trabajo en Equipo</strong>. 
        {knowledgeMode === 'known' ? " Como ya se conocen, elijan un desafío rápido para activar la mente." : " Como es su primera vez, vamos a romper el hielo para conocernos mejor."}
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        
        {/* Card Izquierda: Votación */}
        <div className="card p-6">
          <b>Votación de actividades</b>
          <div className="mt-4 flex flex-col gap-3">
            {poll.options.length > 0 ? (
              poll.options.map(o => (
                <label key={o.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors cursor-pointer ${poll.myVote === o.id ? 'border-mint-500 bg-mint-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${poll.myVote === o.id ? 'border-mint-500' : 'border-slate-300'}`}>
                    {poll.myVote === o.id && <div className="w-2.5 h-2.5 rounded-full bg-mint-500" />}
                  </div>
                  <input type="radio" name="opt" className="hidden" checked={poll.myVote === o.id} onChange={() => castVote(o.id)} />
                  <span className={`font-semibold ${poll.myVote === o.id ? 'text-mint-700' : 'text-slate-700'}`}>{o.label}</span>
                  <span className="ml-auto text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-1">{tally[o.id] || 0} voto(s)</span>
                </label>
              ))
            ) : (<p>Cargando opciones...</p>)}
          </div>
          <div className="mt-4 text-sm">Ganando: <b>{winner?.label || 'Esperando votos...'}</b></div>
          <div className="mt-3 text-right">
            <button className={`btn ${!activityDone ? 'bg-slate-400 cursor-not-allowed' : 'bg-accent-500 text-white'}`} onClick={onNext} disabled={!activityDone}>Ir a Fase 2</button>
          </div>
        </div>

        {/* Card Derecha: Actividad */}
        <div className="card p-6">
          <b>Actividad: {selectedOption?.label || '...'}</b>
          <p className="text-sm text-slate-600 mt-2">Completa la actividad para continuar.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn bg-mint-500 text-white w-full" onClick={() => { setCustomIframe(null); setShowActivity(true); }} disabled={activityDone || !selectedOption}>¡Comenzar Actividad!</button>
            <button className="btn bg-sea-500 text-white w-full" onClick={() => { const ev = new CustomEvent('open-iframe', { detail: { title: 'Instrucciones', src: '/extras/instrucciones/index.html' } }); window.dispatchEvent(ev); setShowActivity(true); }}>Ver Instrucciones</button>
          </div>
          {activityDone && <div className="mt-3 text-emerald-600 text-sm font-bold">✔ Actividad completada.</div>}
        </div>
      </div>

      <ActivityModal show={showActivity} onClose={() => { setShowActivity(false); setCustomIframe(null); }} title={`Fase 1: ${customIframe?.title || selectedOption?.label}`}>
        {customIframe ? (<div className="w-full h-full relative"><iframe src={customIframe.src} title={customIframe.title || 'Vista'} className="absolute inset-0 w-full h-full border-0" /></div>) : (selectedOption && <ActividadGanadora winner={selectedOption} onComplete={handleOnComplete} />)}
      </ActivityModal>
    </>
  );
}

export default Phase1;