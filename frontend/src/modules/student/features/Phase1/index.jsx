// src/modules/student/features/Phase1/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Phase1.css'; // Asegúrate de que este archivo exista o elimina la línea si no lo usas
import { load, save } from '../../../../utils/helpers.js';
import ActivityModal from '../../components/ActivityModal.jsx';
import Timer from '../../../../components/Timer';
// ...existing code...

// Importamos los juegos
import AnagramaGame from './components/AnagramaGame';
import RompeHielosGame from './components/RompeHielosGame';
import SopaLetrasGame from './components/SopaLetrasGame';

const PHASE_1_DURATION = 300; // 5 minutos

// --- COMPONENTE PARA RENDERIZAR EL JUEGO GANADOR ---
const ActividadGanadora = ({ winner, onComplete }) => {
  const id = winner?.id || '';
  
  if (id === 'anagrama') return <AnagramaGame onComplete={onComplete} />;
  if (id === 'ice') return <RompeHielosGame onComplete={onComplete} />;
  
  // Por defecto: Sopa de letras
  return <SopaLetrasGame onGameEnd={onComplete} />;
};

// --- COMPONENTE DE SELECCIÓN DE MODO (¿SE CONOCEN?) ---
const KnowledgeSelector = ({ onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">¿Cuál es la situación del equipo?</h2>
        <p className="text-white/80 text-lg">
          Seleccionen la opción que mejor los represente para sugerirles las actividades ideales.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 px-4">
        {/* Opción A: Se conocen */}
        <button 
          onClick={() => onSelect('known')}
          className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/30 border-4 border-transparent hover:border-sky-400"
        >
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-40 w-40 rounded-full bg-sky-100 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-4xl shadow-lg shadow-sky-500/40 group-hover:rotate-12 transition-transform">
              🤝
            </div>
            <h3 className="mb-3 text-2xl font-bold text-slate-800">Ya nos conocemos</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Hemos trabajado juntos antes o somos amigos. Queremos un desafío mental rápido para activarnos.
            </p>
            <div className="mt-6 inline-flex items-center rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
              Actividades: Sopa de Letras / Anagrama
            </div>
          </div>
        </button>

        {/* Opción B: No se conocen */}
        <button 
          onClick={() => onSelect('unknown')}
          className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-mint-500/30 border-4 border-transparent hover:border-mint-400"
        >
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-40 w-40 rounded-full bg-mint-100 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-500 text-4xl shadow-lg shadow-mint-500/40 group-hover:-rotate-12 transition-transform">
              👋
            </div>
            <h3 className="mb-3 text-2xl font-bold text-slate-800">No nos conocemos</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Es nuestra primera vez juntos. Necesitamos una dinámica para romper el hielo y entrar en confianza.
            </p>
            <div className="mt-6 inline-flex items-center rounded-full bg-mint-50 px-4 py-2 text-sm font-bold text-mint-700">
              Actividad: Rompehielos
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DE LA FASE 1 ---
function Phase1({ role, onNext, isProf }) {
  // NOTE: Phase-specific video intro is shown via the global interstitial (StudentApp).
  
  // 1. Estado para controlar el modo ("conocen" vs "no conocen")
  const [knowledgeMode, setKnowledgeMode] = useState(() => load('it_p1_knowledge', null));
  
  // 2. Estado de la votación
  const [poll, setPoll] = useState(() => load('it_poll', { 
    options: [], 
    votes: {}, 
    myVote: null 
  }));

  // Persistencia
  useEffect(() => save('it_poll', poll), [poll]);
  useEffect(() => save('it_p1_knowledge', knowledgeMode), [knowledgeMode]);

  // Helper para obtener opciones
  const getOptionsForMode = (mode) => {
    if (mode === 'known') {
      return [
        { id: 'sopa', label: 'Sopa de letras' },
        { id: 'anagrama', label: 'Armar palabras con letras' }
      ];
    }
    if (mode === 'unknown') {
      return [
        { id: 'ice', label: 'Romper el hielo con el grupo' }
      ];
    }
    return [];
  };

  // Efecto: Inicializar opciones si ya hay modo pero no opciones
  useEffect(() => {
    if (knowledgeMode && poll.options.length === 0) {
      setPoll(prev => ({
        ...prev,
        options: getOptionsForMode(knowledgeMode)
      }));
    }
  }, [knowledgeMode, poll.options.length]);

  // --- HANDLERS ---

  const handleModeSelect = (mode) => {
    setKnowledgeMode(mode);
    // Reseteamos la votación al cambiar de modo para evitar inconsistencias
    setPoll({
      options: getOptionsForMode(mode),
      votes: {},
      myVote: null
    });
  };

  // Handler para el botón del profesor (Resetear todo)
  const handleResetMode = () => {
    if (window.confirm("¿Seguro que quieres cambiar el modo? Se borrarán los votos actuales.")) {
      setKnowledgeMode(null);
      localStorage.removeItem('it_p1_knowledge');
      setPoll({ options: [], votes: {}, myVote: null });
    }
  };

  const castVote = (id) => {
    setPoll(p => {
      const me = role + '-' + (localStorage.getItem('it_user') || 'solo');
      const votes = { ...p.votes, [me]: id };
      return { ...p, myVote: id, votes };
    });
  };

  // Lógica de Ganador
  const tally = Object.values(poll.votes).reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
  
  const winner = poll.options.length > 0 
    ? poll.options.reduce((best, o) => ((tally[o.id] || 0) > (tally[best?.id] || 0) ? o : best), poll.options[0])
    : null;
    
  const selectedOption = (poll.options.find(o => o.id === poll.myVote) || winner);

  // Estados para el Modal de Actividad
  const [activityDone, setActivityDone] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [customIframe, setCustomIframe] = useState(null);

  const handleOnComplete = useCallback(() => {
    setActivityDone(true);
    setShowActivity(false);
    setCustomIframe(null);
  }, []);


  // --- RENDERIZADO ---

  // VISTA 1: Si no se ha elegido el modo, mostrar selector
  if (!knowledgeMode) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Fase 1 · Configuración inicial</h1>
          {/* Timer decorativo o de espera */}
          <div className="card p-4 scale-90 origin-right">
             <Timer initialSeconds={PHASE_1_DURATION} isProf={isProf} autoStart={false} />
          </div>
        </div>
        <KnowledgeSelector onSelect={handleModeSelect} />
      </>
    );
  }

  // VISTA 2: Pantalla de Votación
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Fase 1 · Votación</h1>
            
            {/* BOTÓN DE PROFESOR PARA CAMBIAR MODO */}
            {isProf && (
              <button 
                onClick={handleResetMode}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-full border border-slate-500 transition-all hover:scale-105 shadow-sm flex items-center gap-1"
                title="Volver a elegir si se conocen o no"
              >
                <span>⚙️</span> Cambiar Modo
              </button>
            )}
          </div>
          <p className="text-white/60 text-sm">
            Modo actual: <strong className="text-mint-400">{knowledgeMode === 'known' ? 'Ya se conocen' : 'No se conocen'}</strong>
          </p>
        </div>

        <div className="card p-4">
          <Timer
            initialSeconds={PHASE_1_DURATION}
            isProf={isProf}
            autoStart={true}
            onComplete={onNext}
          />
        </div>
      </div>

      <p className="text-lg text-white/80 mb-6 max-w-3xl">
        ¡Comencemos! La primera habilidad a trabajar es el <strong>Trabajo en Equipo</strong>. 
        {knowledgeMode === 'known' 
          ? " Como ya se conocen, voten por un desafío rápido para activar la mente."
          : " Como es su primera vez, realizaremos una dinámica para romper el hielo."
        }
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        
        {/* Card Izquierda: Lista de Opciones */}
        <div className="card p-6">
          <b className="text-lg text-slate-800">Votación de actividades</b>
          <div className="mt-4 flex flex-col gap-3">
            {poll.options.length > 0 ? (
              poll.options.map(o => (
                <label 
                  key={o.id} 
                  className={`
                    flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                    ${poll.myVote === o.id 
                      ? 'border-mint-500 bg-mint-50 shadow-md' 
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  {/* Radio Button Custom */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${poll.myVote === o.id ? 'border-mint-500' : 'border-slate-300'}`}>
                    {poll.myVote === o.id && <div className="w-3 h-3 rounded-full bg-mint-500" />}
                  </div>
                  
                  {/* Input Real (Oculto) */}
                  <input 
                    type="radio" 
                    name="opt" 
                    className="hidden"
                    checked={poll.myVote === o.id} 
                    onChange={() => castVote(o.id)} 
                  />
                  
                  <span className={`font-bold text-lg ${poll.myVote === o.id ? 'text-mint-700' : 'text-slate-700'}`}>
                    {o.label}
                  </span>
                  
                  {/* Contador de Votos */}
                  <span className="ml-auto text-xs font-bold bg-slate-200 text-slate-600 rounded-full px-3 py-1">
                    {tally[o.id] || 0}
                  </span>
                </label>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 animate-pulse">Cargando opciones...</div>
            )}
          </div>
          
          <div className="mt-6 p-3 bg-slate-100 rounded-xl text-center text-slate-600">
            Ganando: <b className="text-slate-800">{winner?.label || 'Esperando votos...'}</b>
          </div>
          
          <div className="mt-4 text-right">
            <button 
              className={`btn w-full py-3 text-lg shadow-lg ${!activityDone ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-accent-500 text-white hover:bg-accent-600'}`} 
              onClick={onNext} 
              disabled={!activityDone}
            >
              Continuar a Fase 2 →
            </button>
          </div>
        </div>

        {/* Card Derecha: Área de Acción */}
        <div className="card p-6 flex flex-col h-full justify-between">
          <div>
            <b className="text-lg text-slate-800">Tu Actividad:</b>
            <h2 className="text-2xl font-extrabold text-mint-600 mt-1 mb-2">
              {selectedOption?.label || 'Selecciona una opción...'}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Completa la actividad con tu equipo para desbloquear la siguiente fase. 
              ¡Recuerden trabajar juntos!
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button 
              className="btn bg-mint-500 hover:bg-mint-600 text-white w-full py-4 text-lg font-bold shadow-lg shadow-mint-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]" 
              onClick={() => { setCustomIframe(null); setShowActivity(true); }} 
              disabled={activityDone || !selectedOption}
            >
              ¡Comenzar Actividad! 🚀
            </button>
            
            <button 
              className="btn bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 w-full py-3 font-semibold" 
              onClick={() => { 
                const ev = new CustomEvent('open-iframe', { detail: { title: 'Instrucciones del juego', src: '/extras/instrucciones/index.html' } }); 
                window.dispatchEvent(ev); 
                setShowActivity(true); 
              }}
            >
              📖 Ver Instrucciones
            </button>
          </div>

          {activityDone && (
            <div className="mt-6 p-4 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-bold animate-bounce">
              <span>✅</span> Actividad completada con éxito
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE ACTIVIDAD (Juego o Instrucciones) */}
      <ActivityModal 
        show={showActivity} 
        onClose={() => { setShowActivity(false); setCustomIframe(null); }} 
        title={`Fase 1: ${customIframe?.title || selectedOption?.label}`}
      >
        {customIframe ? (
          <div className="w-full h-full relative bg-white">
            <iframe src={customIframe.src} title={customIframe.title || 'Vista'} className="absolute inset-0 w-full h-full border-0" />
          </div>
        ) : (
          selectedOption && <ActividadGanadora winner={selectedOption} onComplete={handleOnComplete} />
        )}
      </ActivityModal>
    </>
  );
}

export default Phase1;