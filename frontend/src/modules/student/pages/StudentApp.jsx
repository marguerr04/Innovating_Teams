// Archivo: src/modules/student/pages/StudentApp.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useRole } from '../../../utils/helpers.js';
import InstructionsModal from '../../../components/InstructionsModal';
import PhaseBackground from '../../../components/PhaseBackground.jsx';
import PhaseIntro from '../../../components/PhaseIntro.jsx';
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

export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(-2); 
  const [showInstructions, setShowInstructions] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [phaseToShowTokensFor, setPhaseToShowTokensFor] = useState(0);

  const handlePhaseComplete = (phaseJustFinished) => {
    if (phaseJustFinished >= 6) {
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
    if (n < 0) {
      setShowIntro(false);
    } else {
      setShowIntro(true); 
    }
  };
  
  const handleIntroDone = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen text-white relative"> 
      
      <PhaseBackground phase={phase} /> 
      
      {/* Botón flotante de instrucciones (solo visible si el navbar no está, o como backup) */}
      {phase < 0 && (
        <button 
          id="openModal"
          className="fixed top-4 right-4 z-40 bg-[#005a8d] hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2"
          onClick={() => setShowInstructions(true)}
        >
          📘 Ver instrucciones
        </button>
      )}

      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* Navbar REESTRUCTURADO */}
      {phase >= 0 && (
        <div className="sticky top-0 z-20 backdrop-blur border-b border-white/20 bg-slate-900/30">
          
          {/* CAMBIO CLAVE: 
              1. 'max-w-7xl' -> Limita el ancho total en pantallas gigantes.
              2. 'mx-auto' -> Centra todo el navbar si la pantalla es más ancha que 7xl.
              3. 'px-4 lg:px-8' -> Padding responsivo. En PC (lg) añade más margen a los lados para "empujar" el logo y botones hacia el centro.
          */}
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-3 flex items-center justify-between gap-4">
              
              {/* 1. LOGO (Izquierda) */}
              <div className="flex-shrink-0 w-32 lg:w-40 flex items-center"> {/* Ancho fijo para equilibrar */}
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
              
              {/* 2. BARRA DE PROGRESO (Centro) */}
              <div className="flex-1 flex justify-center min-w-0"> 
                  <PhaseProgressBar currentPhase={phase} />
              </div>

              {/* 3. BOTONES (Derecha) */}
              {/* Mismo ancho fijo que el logo para mantener el centro perfecto */}
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
                {phase === 1 && <Phase1 role={role} isProf={isProf} onNext={() => handlePhaseComplete(1)} />}
                {phase === 2 && <Phase2 role={role} isProf={isProf} onNext={() => handlePhaseComplete(2)} />}
                {phase === 3 && <Phase3 role={role} isProf={isProf} onBack={() => go(2)} onNext={() => handlePhaseComplete(3)} />}
                {phase === 4 && <Phase4 role={role} isProf={isProf} onBack={() => go(3)} onNext={() => handlePhaseComplete(4)} />}
                {phase === 5 && <Phase5 role={role} isProf={isProf} onBack={() => go(4)} onNext={() => handlePhaseComplete(5)} />}
                {phase === 6 && <Phase6 role={role} isProf={isProf} onBack={() => go(5)} onNext={() => handlePhaseComplete(6)} />}
                {phase === 7 && <Phase7 role={role} isProf={isProf} onBack={() => go(6)} />}
              </>
            )
          )
        )}
      </div>
    </div>
  );
}