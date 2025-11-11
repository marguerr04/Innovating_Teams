// Archivo: src/modules/student/pages/StudentApp.jsx

import React, { useState } from 'react';
import { useRole } from '../../../utils/helpers.js'; 

// 1. RE-IMPORTA EL MODAL DE INSTRUCCIONES
import InstructionsModal from '../../../components/InstructionsModal'; 
import InteractiveBackground from '../../../components/InteractiveBackground.jsx'; 
import PhaseIntro from '../../../components/PhaseIntro.jsx';
import TokensOverlay from '../../../components/TokensOverlay.jsx'; 

import Phase1 from "../features/Phase1";
import Phase2 from "../features/Phase2";
import Phase3 from '../features/Phase3';
import Phase4 from '../features/Phase4';
import Phase5 from '../features/Phase5';
import Phase6 from '../features/Phase6';
import Phase7 from '../features/Phase7';

export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(1);
  
  // 2. RE-AGREGA EL ESTADO PARA EL MODAL
  const [showInstructions, setShowInstructions] = useState(false);
  
  const [showIntro, setShowIntro] = useState(true);
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
    <div className="interactive-background-glow min-h-screen text-white"> 
      
      <InteractiveBackground />

      {/* 3. RE-AGREGA EL BOTÓN DE INSTRUCCIONES */}
      <button 
        id="openModal"
        className="fixed top-4 right-4 z-40 bg-[#005a8d] hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2"
        onClick={() => setShowInstructions(true)}
      >
        📘 Ver instrucciones
      </button>

      {/* 4. RE-AGREGA EL COMPONENTE MODAL */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* ... (Navbar sin cambios) ... */}
      <div className="sticky top-0 z-20 backdrop-blur border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-extrabold">Innovating Teams</div>
              <div className="progress ml-3">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                  <span key={n} className={`step ${phase === n ? "active" : ""}`}>
                    Fase {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
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
      
      <TokensOverlay 
        show={showTokens}
        phase={phaseToShowTokensFor}
        onContinue={handleTokenContinue}
      />

      {/* Contenido de la Fase (sin cambios) */}
      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {!showTokens && ( 
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
        )}
      </div>
    </div>
  );
}