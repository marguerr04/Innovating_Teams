// Archivo: src/modules/student/pages/StudentApp.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

import { useRole } from '../../../utils/helpers.js';

import InstructionsModal from '../../../components/InstructionsModal';

// 1. ELIMINAMOS 'InteractiveBackground' DE AQUÍ
// import InteractiveBackground from '../../../components/InteractiveBackground.jsx'; // <--- ELIMINADO
import PhaseBackground from '../../../components/PhaseBackground.jsx'; // <--- AÑADIDO

import PhaseIntro from '../../../components/PhaseIntro.jsx';
import TokensOverlay from '../../../components/TokensOverlay.jsx';

import Phase0 from "../features/Phase0";
import Phase1 from "../features/Phase1";
import Phase2 from "../features/Phase2";
import Phase3 from '../features/Phase3';
import Phase4 from '../features/Phase4';
import Phase5 from '../features/Phase5';
import Phase6 from '../features/Phase6';
import Phase7 from '../features/Phase7';

import BouncingCircle from '../../../components/BouncingCircle';


export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(0); 
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
    setShowIntro(true); 
  };
  
  const handleIntroDone = () => {
    setShowIntro(false);
  };

  return (
    // 2. ELIMINAMOS la clase 'interactive-background-glow'
    <div className="min-h-screen text-white relative"> 
      
      {/* 3. REEMPLAZAMOS el componente de fondo */}
      {/* <InteractiveBackground /> */ } {/* <--- ELIMINADO */}
      <PhaseBackground phase={phase} /> {/* <--- CORRECTO */}
      
      {/* Botón de Instrucciones */}
      <button 
        id="openModal"
        className="fixed top-4 right-4 z-40 bg-[#005a8d] hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2"
        onClick={() => setShowInstructions(true)}
      >
        📘 Ver instrucciones
      </button>

      {/* Modal de Instrucciones */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* Navbar (con z-index) */}
      <div className="sticky top-0 z-20 backdrop-blur border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* ... (contenido del navbar sin cambios) ... */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3 no-underline">
                  {!imgError ? (
                    <img
                      src="/assets/mission_logo.png"
                      alt="Mision Emprende"
                      className="w-32 max-h-12 object-contain"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="text-left">
                      <div className="font-extrabold text-2xl tracking-wider text-white">Mision</div>
                      <div className="font-extrabold text-2xl tracking-wider text-[#FFD700]">Emprende</div>
                    </div>
                  )}
                </Link>
              </div>
              <div className="progress ml-3">
                {[0,1,2,3,4,5,6,7].map((n) => (
                  <span key={n} className={`step ${phase === n ? "active" : ""}`}>
                    Fase {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="btn bg-sea-500 text-white mr-2" onClick={() => setShowInstructions(true)}>Ver Instrucciones</button>
              <span className="text-sm opacity-80">
                Rol: <b>{isProf ? "Profesor" : "Alumno"}</b>
              </span>
              <button
                className="btn btn-ghost"
                onClick={() => setRole(isProf ? "alumno" : "profesor")}
              >
                {isProf ? "Cambiar a Alumno" : "Cambiar a Profesor"}
              </button>
            </div>
        </div>
      </div>
      
      {/* TokensOverlay (sin cambios) */}
      <TokensOverlay 
        show={showTokens}
        phase={phaseToShowTokensFor}
        onContinue={handleTokenContinue}
      />

      {/* Contenido de la Fase (con z-index) */}
      <div className="max-w-6xl mx-auto p-6 relative z-10">
      
        {/* ... (Lógica de fases sin cambios) ... */}
        {!showTokens && (
          phase === 0 ? (
            <Phase0 onStart={() => go(1)} />
          ) : (
            showIntro && phase <= 5 ? (
              <PhaseIntro
                phase={phase}
                onDone={handleIntroDone}
              />
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