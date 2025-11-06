// Archivo: src/modules/student/pages/StudentApp.jsx

// 1. IMPORTA 'PhaseIntro'
import React, { useState } from 'react';
import { useRole } from '../../../utils/helpers.js'; 
import InstructionsModal from '../../../components/InstructionsModal';
import InteractiveBackground from '../../../components/InteractiveBackground.jsx'; 
import PhaseIntro from '../../../components/PhaseIntro.jsx'; // <-- 1. AÑADE ESTA LÍNEA

import Phase1 from "../features/Phase1";
import Phase2 from "../features/Phase2";
import Phase3 from '../features/Phase3';
import Phase4 from '../features/Phase4';
import Phase5 from '../features/Phase5';
import Phase6 from '../features/Phase6';
const Phase7 = () => <div>Fase 7 (en construcción)</div>;

export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // 2. AÑADE ESTE ESTADO para controlar la visibilidad de la intro
  const [showIntro, setShowIntro] = useState(true);

  // 3. MODIFICA LA FUNCIÓN 'go'
  const go = (n) => {
    setPhase(n);
    // Al cambiar de fase, marca que se debe mostrar la intro
    setShowIntro(true); 
  };
  
  // 4. AÑADE ESTA FUNCIÓN para que la intro nos avise cuándo terminó
  const handleIntroDone = () => {
    setShowIntro(false);
  };

  return (
    // ¡CAMBIO CLAVE! 'interactive-background-glow' aplica el fondo animado
    <div className="interactive-background-glow min-h-screen text-white"> 
      
      <InteractiveBackground />

      {/* Botón de Instrucciones (z-40) */}
      <button 
        id="openModal"
        className="fixed top-4 right-4 z-40 bg-[#005a8d] hover:bg-sky-700 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2"
        onClick={() => setShowInstructions(true)}
      >
        📘 Ver instrucciones
      </button>

      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        initialPhase={phase} 
      />
      
      {/* Navbar (sin fondo propio, usa 'backdrop-blur') */}
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

      {/* Contenido de la Fase (z-10, se renderiza sobre el fondo) */}
      <div className="max-w-6xl mx-auto p-6 relative z-10">
      
        {/* 5. AÑADE LA LÓGICA DE RENDERIZADO CONDICIONAL */}
        {showIntro && phase <= 5 ? (
          // Si 'showIntro' es true (y es una fase con intro), muestra la intro
          <PhaseIntro 
            phase={phase} 
            onDone={handleIntroDone} // Pasa el handler
          />
        ) : (
          // Si no, muestra el contenido de la fase
          <>
            {phase === 1 && <Phase1 role={role} isProf={isProf} onNext={() => go(2)} />}
            {phase === 2 && <Phase2 role={role} isProf={isProf} onNext={() => go(3)} />}
            {phase === 3 && <Phase3 role={role} isProf={isProf} onBack={() => go(2)} onNext={() => go(4)} />}
            {phase === 4 && <Phase4 role={role} isProf={isProf} onBack={() => go(3)} onNext={() => go(5)} />}
            {phase === 5 && <Phase5 role={role} isProf={isProf} onBack={() => go(4)} onNext={() => go(6)} />}
            {phase === 6 && <Phase6 role={role} isProf={isProf} onBack={() => go(5)} onNext={() => go(7)} />}
            {phase === 7 && <Phase7 role={role} isProf={isProf} onBack={() => go(6)} />}
          </>
        )}
        
      </div>
    </div>
  );
}