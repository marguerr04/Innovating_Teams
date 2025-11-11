// Archivo: src/modules/student/pages/StudentApp.jsx

// 1. IMPORTA useState Y el nuevo overlay
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useRole } from '../../../utils/helpers.js'; 
import InstructionsModal from '../../../components/InstructionsModal';
import InteractiveBackground from '../../../components/InteractiveBackground.jsx'; 
import PhaseIntro from '../../../components/PhaseIntro.jsx'; 
import TokensOverlay from '../../../components/TokensOverlay.jsx'; // <-- 1. AÑADE ESTO

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
  const [phase, setPhase] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  // estado para fallback si la imagen no carga o es muy pequeña
  const [imgError, setImgError] = useState(false);
  
  // 2. AÑADE ESTOS NUEVOS ESTADOS
  const [showTokens, setShowTokens] = useState(false);
  const [phaseToShowTokensFor, setPhaseToShowTokensFor] = useState(0);

  // 3. CREA LA FUNCIÓN QUE MUESTRA EL OVERLAY
  const handlePhaseComplete = (phaseJustFinished) => {
    // No mostramos tokens para Fase 6 o 7
    if (phaseJustFinished >= 6) {
      go(phaseJustFinished + 1);
      return;
    }
    
    setPhaseToShowTokensFor(phaseJustFinished);
    setShowTokens(true);
    // La intro se oculta
    setShowIntro(false);
  };
  
  // 4. CREA LA FUNCIÓN QUE EL OVERLAY LLAMA AL CERRARSE
  const handleTokenContinue = () => {
    setShowTokens(false);
    // Llama a 'go' para ir a la *siguiente* fase
    go(phaseToShowTokensFor + 1);
  };

  // 'go' sigue igual: muestra la intro de la fase
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
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* ... (Tu Navbar no cambia) ... */}
      <div className="sticky top-0 z-20 backdrop-blur border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                {/* Logo a la izquierda, cargado desde public/assets/mission_logo.png */}
                <Link to="/" className="flex items-center gap-3 no-underline">
                  {!imgError ? (
                    <img
                      src="/assets/mission_logo.png"
                      alt="Mision Emprende"
                      className="w-32 max-h-12 object-contain"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    // Fallback textual ancho y espaciado horizontal
                    <div className="text-left">
                      <div className="font-extrabold text-2xl tracking-wider text-white">Mision</div>
                      <div className="font-extrabold text-2xl tracking-wider text-[#FFD700]">Emprende</div>
                    </div>
                  )}
                </Link>
              </div>
              <div className="progress ml-3">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
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
      
      {/* 5. AÑADE EL OVERLAY DE TOKENS AQUÍ */}
      {/* (Se renderiza "encima" de todo lo demás) */}
      <TokensOverlay 
        show={showTokens}
        phase={phaseToShowTokensFor}
        onContinue={handleTokenContinue}
      />

      {/* Contenido de la Fase */}
      <div className="max-w-6xl mx-auto p-6 relative z-10">
      
        {/* 6. MODIFICA EL RENDERIZADO CONDICIONAL */}
        {/* Ahora, solo muestra la intro O la fase si el overlay de tokens NO está visible */ }
        {!showTokens && ( 
          showIntro && phase <= 5 ? (
            <PhaseIntro 
              phase={phase} 
              onDone={handleIntroDone}
            />
          ) : (
            <>
              {/* 7. ACTUALIZA TODAS LAS LLAMADAS 'onNext' */}
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