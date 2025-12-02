// src/modules/student/pages/StudentApp.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useRole } from '../../../utils/helpers.js';
import InstructionsModal from '../../../components/InstructionsModal';
import PhaseBackground from '../../../components/PhaseBackground.jsx';
import PhaseIntro from '../../../components/PhaseIntro.jsx';
import PhaseVideoInterstitial from '../../../components/PhaseVideoInterstitial.jsx';
import TokensOverlay from '../../../components/TokensOverlay.jsx';
import PhaseProgressBar from '../../../components/PhaseProgressBar.jsx'; 
import PhaseSalaCodigo from "../features/Phase-2";
import PhaseSalaEspera from "../features/Phase-1";
import Phase0 from "../features/Phase0";
import Phase1 from "../features/Phase1";
import Phase2 from "../features/Phase2";
import Phase3 from '../features/Phase3';
import Phase4 from '../features/Phase4';
import Phase5 from '../features/Phase5';

import Phase6 from '../features/Phase6';
import Phase7 from '../features/Phase7';
import MissyCompanion from '../../../components/MissyCompanion.jsx';

export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(-2); 
  const [showInstructions, setShowInstructions] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPhaseVideo, setShowPhaseVideo] = useState(false);
  const [phaseVideoShown, setPhaseVideoShown] = useState({});

  const [imgError, setImgError] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [phaseToShowTokensFor, setPhaseToShowTokensFor] = useState(0);

  // --- 1. EFECTO PARA CARGAR EL CHATBOT (CORREGIDO) ---
  useEffect(() => {
    (function(){
      if(!window.chatbase || window.chatbase("getState") !== "initialized"){
        window.chatbase = (...args) => {
          if (!window.chatbase.q) { window.chatbase.q = [] }
          window.chatbase.q.push(args)
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") { return target.q }
            return (...args) => target(prop, ...args)
          }
        })
      }
      const onLoad = function() {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "NDIGyY6LjlULvnmM9GEOX";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      };
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();
  }, []);

  const handlePhaseComplete = (phaseJustFinished) => {
    // Si termina la fase 6, saltar a la fase 7 y mostrar el video de cierre
    if (phaseJustFinished === 6) {
    setPhase(7);

    // disparar video manualmente
    setPhaseVideoShown(prev => ({ ...prev, '7': false }));
    setShowPhaseVideo(true);

    return;
    }
    if (phaseJustFinished > 7) {
      go(phaseJustFinished + 1);
      return;
    }
    setPhaseToShowTokensFor(phaseJustFinished);
    setShowTokens(true);
    setShowIntro(false);
  };
  
  const handleTokenContinue = () => {
    setShowTokens(false);
    go(phaseToShowTokensFor + 1);
  };

  const go = (n) => {
    setPhase(n);
    setShowIntro(n >= 0);
    setPhaseVideoShown(prev => {
      const updated = { ...prev };
      delete updated[n];
      return updated;
    });
  };
  
  // Mapeo explícito de videoId por fase, saltando id 16
  const VIDEO_BY_PHASE = {
    0: 15, // Intro general
    1: 14, // Fase 1
    2: 17, // Fase 2 (Empatía) - saltamos 16
    3: 18, // Fase 3
    4: 19, // Fase 4
    7: 20  // Video de cierre antes de QR (fase 7)
  };

  const handleIntroDone = () => {
    // Show video interstitial if mapped, then continue directly to phase
    const vid = VIDEO_BY_PHASE[phase];
    if (vid && !phaseVideoShown[phase]) {
      setPhaseVideoShown(prev => ({ ...prev, [phase]: true }));
      setShowPhaseVideo(true);
      setShowIntro(false);
      return;
    }
    // No more phase interstitials - go directly to the phase content
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen text-white relative"> 
      
      <PhaseBackground phase={phase} /> 
      
      {/* Botones flotantes (Fases iniciales) */}
      {phase < 0 && (
        <>
          <button
            className="fixed top-4 left-4 z-40 bg-slate-800/50 hover:bg-slate-700/80 text-white px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm border border-white/10 transition-all"
            onClick={() => setRole(isProf ? "alumno" : "profesor")}
          >
            <span>Rol: <b>{isProf ? "Profesor" : "Alumno"}</b></span>
            <span className="opacity-60 text-[10px] hidden sm:inline">(Cambiar)</span>
          </button>

          <button 
            id="openModal"
            className="fixed top-4 right-4 z-40 bg-[#005a8d] hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2"
            onClick={() => setShowInstructions(true)}
          >
            📘 Ver instrucciones
          </button>
        </>
      )}

      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* Navbar (Fases >= 0) */}
      {phase >= 0 && (
        <div className="sticky top-0 z-20 backdrop-blur border-b border-white/20 bg-slate-900/30">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-3 flex items-center justify-between gap-4">
              
              <div className="flex-shrink-0 w-32 lg:w-40 flex items-center"> 
                <Link to="/" className="flex items-center gap-3 no-underline">
                  {!imgError ? (
                    <img
                      src="/assets/mission_logo.png"
                      alt="Mision Emprende"
                      className="w-28 md:w-32 object-contain"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="text-left">
                      <div className="font-extrabold text-xl tracking-wider text-white">Mision</div>
                      <div className="font-extrabold text-xl tracking-wider text-[#FFD700]">Emprende</div>
                    </div>
                  )}
                </Link>
              </div>
              
              <div className="flex-1 flex justify-center min-w-0"> 
                  <PhaseProgressBar currentPhase={phase} />
              </div>

              <div className="flex-shrink-0 w-32 lg:w-40 flex justify-end items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                   <button className="btn bg-sea-500 text-white text-sm px-3 py-2 whitespace-nowrap" onClick={() => setShowInstructions(true)}>Instrucciones</button>
                  <div className="flex flex-col items-end text-xs opacity-80">
                     <span className="font-bold">{isProf ? "Profesor" : "Alumno"}</span>
                     <button
                      className="text-[10px] hover:underline text-sky-300"
                      onClick={() => setRole(isProf ? "alumno" : "profesor")}
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>

            </div>
        </div>
      )}
      
      <TokensOverlay 
        show={showTokens}
        phase={phaseToShowTokensFor}
        onContinue={handleTokenContinue}
      />

      {/* Renderizado de Fases */}
      <div className="max-w-7xl mx-auto p-6 relative z-10"> 
        {!showTokens && (
          phase === -2 ? ( <PhaseSalaCodigo onJoin={() => go(-1)} /> ) :
          phase === -1 ? ( <PhaseSalaEspera onStart={() => go(0)} isProf={isProf} /> ) :
          phase === 0 ? ( <Phase0 onStart={() => go(1)} /> ) : (
            showIntro && phase <= 5 ? (
              <PhaseIntro phase={phase} onDone={handleIntroDone} />
            ) : (
              <>
                {/* Phase-specific video interstitial (overlays the UI). */}
                {showPhaseVideo && (
                  <PhaseVideoInterstitial
                    videoId={VIDEO_BY_PHASE[phase] || 15}
                    size={phase === 0 ? 'large' : 'medium'}
                    onClose={() => {
                      setShowPhaseVideo(false);
                      setShowIntro(false);
                    }}
                  />
                )}


                {/* Renderizado de fases principales */}
                {phase === 1 && !showPhaseVideo && (
                  <Phase1 role={role} isProf={isProf} onNext={() => handlePhaseComplete(1)} />
                )}
                {phase === 2 && !showPhaseVideo && (
                  <Phase2 role={role} isProf={isProf} onNext={() => handlePhaseComplete(2)} />
                )}
                {phase === 3 && !showPhaseVideo && (
                  <Phase3 role={role} isProf={isProf} onBack={() => go(2)} onNext={() => handlePhaseComplete(3)} />
                )}
                {phase === 4 && !showPhaseVideo && (
                  <Phase4 role={role} isProf={isProf} onBack={() => go(3)} onNext={() => handlePhaseComplete(4)} />
                )}
                {phase === 5 && !showPhaseVideo && (
                  <Phase5 role={role} isProf={isProf} onBack={() => go(4)} onNext={() => handlePhaseComplete(5)} />
                )}
                {phase === 6 && !showPhaseVideo && (
                  <Phase6 role={role} isProf={isProf} onBack={() => go(5)} onNext={() => handlePhaseComplete(6)} />
                )}
                
                {/* Fase 7 - Solo se muestra cuando no hay intro, video o interstitial activos */}
                {phase === 7 && !showPhaseVideo && (
                  <Phase7 role={role} isProf={isProf} onBack={() => go(6)} />
                )}
              </>
            )
          )
        )}
      </div>
      {/* Le pasamos la fase actual y si se están mostrando tokens para que reaccione */}
      {/* Solo mostrar el robot normal cuando NO se están mostrando tokens */}
      {!showTokens && (
        <MissyCompanion 
          phase={phase} 
          showTokens={showTokens} 
        />
      )}
    </div>
  );
}