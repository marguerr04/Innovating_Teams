// src/modules/student/features/Phase5/index.jsx

import React, { useState, useEffect, useRef } from 'react';

// 1. IMPORTA tus helpers (load, save)
// (Ruta: Phase5 -> features -> student -> modules -> src -> utils)
import { load, save } from '../../../../utils/helpers.js';

// 2. IMPORTA el Timer global
// (Ruta: Phase5 -> features -> student -> modules -> src -> components)
import Timer from '../../../../components/Timer.jsx';

// 3. IMPORTA el SkillRater local
import SkillRater from './components/SkillRater.jsx';

// 4. DEFINE LA DURACIÓN DE LA FASE (5 minutos)
const PHASE_5_DURATION = 300; 

// --- Constantes de Phase 5 (de index.html) ---
const skills = [
  { key: "equipo", label: "Equipo", desc: "Evalúa si trabajaron coordinados, con participación y colaboración." },
  { key: "empatia", label: "Empatía", desc: "Evalúa si entendieron bien a la persona del desafío y su contexto." },
  { key: "creatividad", label: "Creatividad", desc: "Evalúa originalidad y diversidad de ideas." },
  { key: "solucion", label: "Solución", desc: "Evalúa si la propuesta responde claramente al problema." },
];
const emptyEval = { equipo: null, empatia: null, creatividad: null, solucion: null, comment: "" };
// --- Fin Constantes ---

export default function Phase5({ role, isProf, onNext, onBack }) {
  
  // --- Lógica de estado (de index.html) ---
  const [currentTeam, setCurrentTeam] = useState(1);
  const [allScores, setAllScores] = useState(() => {
    const saved = load("it_scores_v2_multi", null); //
    return saved || { 1: { ...emptyEval }, 2: { ...emptyEval }, 3: { ...emptyEval }, 4: { ...emptyEval } };
  });
  
  useEffect(() => save("it_scores_v2_multi", allScores), [allScores]);
  
  const soundRef = useRef(null);
  const active = allScores[currentTeam]; // El objeto de score para el equipo actual

  // Función setVal (de index.html)
  function setVal(field, value) {
    setAllScores((prev) => {
      const copy = { ...prev };
      copy[currentTeam] = { ...copy[currentTeam], [field]: value };
      return copy;
    });
    // Toca el sonido (de index.html)
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  }

  return (
    // Contenedor principal (de index.html)
    <div className="w-full flex flex-col items-center">
      
      {/* --- Selector de Equipo (de index.html) --- */}
      <div className="flex gap-3 mb-5 mt-1">
        <span className="text-white/80 text-sm self-center">Evaluando equipo:</span>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setCurrentTeam(n)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              n === currentTeam ? "bg-emerald-400 text-white shadow" : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            Equipo {n}
          </button>
        ))}
      </div>

      {/* --- Card Principal (de index.html) --- */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Fase 5 · Evaluación a otros grupos</h2>

        {/* --- Componente Timer --- */}
        <div className="mb-6 border-b border-slate-200 pb-6">
          <Timer 
            initialSeconds={PHASE_5_DURATION} 
            isProf={isProf}
            autoStart={true} 
          />
        </div>
        
        <div className="space-y-5">
          {/* --- Mapeo de Componentes SkillRater --- */}
          {skills.map((skill) => (
            <SkillRater
              key={skill.key}
              skill={skill}
              value={active[skill.key]} // Pasa el score actual
              onRate={setVal} // Pasa la función para actualizar
            />
          ))}

          {/* --- Comentarios (de index.html) --- */}
          <div>
            <div className="font-bold mb-2 text-slate-900">Comentarios para equipo {currentTeam}</div>
            <textarea
              className="w-full rounded-xl border border-slate-200 p-3 min-h-[90px] bg-white text-slate-900"
              value={active.comment}
              onChange={(e) => setVal("comment", e.target.value)}
              placeholder="Comentarios constructivos..."
            ></textarea>
          </div>
        </div>

        {/* --- Navegación (de index.html) --- */}
        <div className="flex justify-between mt-8">
          <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-medium hover:bg-slate-200" onClick={onBack}>
            ← Volver
          </button>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600" onClick={onNext}>
            Continuar a Fase 6 →
          </button>
        </div>
      </div>
      
      {/* --- Elemento de Audio --- */}
      {/* (Asegúrate de poner 'MA_BBRealSound_Push_Button_1_MP3.mp3' en tu carpeta /public) */}
      <audio ref={soundRef} src="/MA_BBRealSound_Push_Button_1_MP3.mp3" preload="auto" className="hidden"></audio>
    </div>
  );
}