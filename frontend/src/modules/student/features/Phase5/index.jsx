// src/modules/student/features/Phase5/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx';
import SkillRater from './components/SkillRater.jsx';

// --- Constantes de la Fase 5 ---
const PITCH_DURATION = 90; // 90 segundos para presentar
const EVAL_DURATION = 120; // 2 minutos para evaluar

const TEAMS = [
  { id: 1, name: "Equipo 1" },
  { id: 2, name: "Equipo 2" },
  { id: 3, name: "Equipo 3" },
  { id: 4, name: "Equipo 4" },
];
const MY_TEAM_ID = 1;

const skills = [
  { key: "equipo", label: "Equipo", desc: "Evalúa si trabajaron coordinados, con participación y colaboración." },
  { key: "empatia", label: "Empatía", desc: "Evalúa si entendieron bien a la persona del desafío y su contexto." },
  { key: "creatividad", label: "Creatividad", desc: "Evalúa originalidad y diversidad de ideas." },
  { key: "solucion", label: "Solución", desc: "Evalúa si la propuesta responde claramente al problema." },
];
const emptyEval = { equipo: null, empatia: null, creatividad: null, solucion: null, comment: "" };
// --- Fin Constantes ---


export default function Phase5({ role, isProf, onNext, onBack }) {
  
  // --- Estados de la Máquina de Flujo ---
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [view, setView] = useState('presenting'); 
  
  const [allScores, setAllScores] = useState(() => {
    return load("it_scores_v2_multi", null) || { 1: { ...emptyEval }, 2: { ...emptyEval }, 3: { ...emptyEval }, 4: { ...emptyEval } };
  });
  useEffect(() => save("it_scores_v2_multi", allScores), [allScores]);
  
  const soundRef = useRef(null);
  
  // --- 1. AÑADIR LÓGICA DE FOTOS (MODIFICADA PARA TESTING) ---
  // ... (código existente) ...
  const [myLegoPhoto] = useState(() => load('it_lego_photo', null)); // <--- ¡ESTA LÍNEA FALTA!
  const [currentTeamPhoto, setCurrentTeamPhoto] = useState(null);

  useEffect(() => {
    // Esta función se actualiza cada vez que cambia el equipo
    const teamId = TEAMS[currentTeamIndex].id;
    
    if (teamId === MY_TEAM_ID) {
      // Para TU equipo (Equipo 1), carga la foto real que tomaste en Fase 3.
      setCurrentTeamPhoto(myLegoPhoto);
    } else {
      // PARA TESTEAR: Carga una foto de prueba para los otros equipos.
      //
      setCurrentTeamPhoto('/lego.gif'); 
    }
  }, [currentTeamIndex, myLegoPhoto]); // Se ejecuta cuando cambia el equipo
  // --- FIN LÓGICA DE FOTOS ---


  const handlePitchComplete = () => {
    setView('evaluating'); 
  };

  const handleEvaluationComplete = () => {
    if (currentTeamIndex < TEAMS.length - 1) {
      setCurrentTeamIndex(prevIndex => prevIndex + 1); 
      setView('presenting'); 
    } else {
      onNext(); 
    }
  };

  function setVal(field, value, teamId) {
    // ... (Tu función setVal existente)
    setAllScores((prev) => {
      const copy = { ...prev };
      copy[teamId] = { ...copy[teamId], [field]: value };
      return copy;
    });
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  }

  const currentTeam = TEAMS[currentTeamIndex];
  const isMyTeamPresenting = currentTeam.id === MY_TEAM_ID;

  // --- VISTA DE PRESENTACIÓN ---
  if (view === 'presenting') {
    return (
      <div className="max-w-3xl mx-auto card p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Presentando (Turno {currentTeamIndex + 1}/{TEAMS.length}):</h2>
        <p className="text-5xl font-extrabold text-mint-500 mb-6">{currentTeam.name}</p>
        
        <Timer
          key={`pitch-${currentTeam.id}`} 
          initialSeconds={PITCH_DURATION}
          isProf={isProf}
          autoStart={true}
          onComplete={handlePitchComplete} 
        />
        
        {isProf && (
          <button 
            className="btn bg-orange-500 text-white mt-4 text-sm"
            onClick={handlePitchComplete}
          >
            (Test) Saltar Presentación
          </button>
        )}
        
        {/* --- 2. MOSTRAR FOTO GRANDE --- */}
        <div className="mt-6">
          {currentTeamPhoto ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Prototipo del {currentTeam.name}:</h3>
              {/* Se muestra grande (max-w-lg) */}
              <img src={currentTeamPhoto} alt={`Prototipo ${currentTeam.name}`} className="w-full max-w-lg mx-auto rounded-lg shadow-md mt-2 border" />
            </div>
          ) : (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg text-slate-500 text-sm">
              {isMyTeamPresenting ? 
                "Tu equipo no subió una foto en la Fase 3." :
                `(No se puede mostrar la foto del ${currentTeam.name} - (lógica de backend pendiente))`
              }
            </div>
          )}
        </div>
        
        {isMyTeamPresenting ? (
          <p className="text-slate-600 mt-4 font-semibold">¡Es su turno de presentar! Tienen 90 segundos.</p>
        ) : (
          <p className="text-slate-600 mt-4">Escuchen atentamente. Después de los 90 segundos, podrán evaluar a este equipo.</p>
        )}
        
        {currentTeamIndex === 0 && (
          <button className="btn bg-slate-100 mt-6" onClick={onBack}>
            ← Volver a Fase 4 (Preparación)
          </button>
        )}
      </div>
    );
  }

  // --- VISTA DE EVALUACIÓN ---
  if (view === 'evaluating') {
    const activeScores = allScores[currentTeam.id] || emptyEval;

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Evaluando a: {currentTeam.name}
          </h2>
          
          <Timer
            key={`eval-${currentTeam.id}`}
            initialSeconds={EVAL_DURATION}
            isProf={isProf}
            autoStart={true}
            onComplete={handleEvaluationComplete} 
          />

          {isProf && (
            <button 
              className="btn bg-orange-500 text-white mt-4 text-sm"
              onClick={handleEvaluationComplete}
            >
              (Test) Saltar Evaluación
            </button>
          )}

          {isMyTeamPresenting ? (
            // Vista si es mi equipo el que está siendo evaluado
            <div className="text-center p-8 bg-slate-100 rounded-lg mt-6">
              <p className="font-semibold text-slate-700">¡Buen trabajo en su pitch!</p>
              <p className="text-slate-600">Su equipo está siendo evaluado por los demás. Esperen a la siguiente ronda.</p>
            </div>
          ) : (
            // Vista para evaluar a OTRO equipo
            <>
              <p className="text-slate-600 my-6 text-center">
                Tienen 2 minutos para otorgar un puntaje de 1 a 10 para cada habilidad, observando su prototipo.
              </p>
              
              {/* --- 3. LAYOUT RESPONSIVO (FOTO + RÚBRICA) --- */}
              <div className="grid grid-cols-1 gap-6 lg:gap-8 items-start">
                
                {/* Columna 1: Foto (Ahora arriba) */}
                {/* CAMBIO: Centramos la foto y quitamos el 'sticky' */}
                <div className="w-full max-w-lg mx-auto"> 
                  {currentTeamPhoto ? (
                    <div> 
                      <h3 className="font-bold text-slate-800 mb-2">Prototipo del {currentTeam.name}</h3>
                      <img src={currentTeamPhoto} alt={`Prototipo ${currentTeam.name}`} className="w-full rounded-lg shadow-md border" />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 text-sm">
                      (No se pudo cargar la foto del prototipo del Equipo {currentTeam.name}.)
                    </div>
                  )}
                </div>
                
                {/* Columna 2: Rúbrica */}
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <SkillRater
                      key={skill.key}
                      skill={skill}
                      value={activeScores[skill.key]}
                      onRate={(key, val) => setVal(key, val, currentTeam.id)}
                    />
                  ))}
                  
                  <div>
                    <div className="font-bold mb-2 text-slate-900">Comentarios para {currentTeam.name}</div>
                    <textarea
                      className="w-full rounded-xl border border-slate-200 p-3 min-h-[90px] bg-white text-slate-900"
                      value={activeScores.comment}
                      onChange={(e) => setVal("comment", e.target.value, currentTeam.id)}
                      placeholder="Comentarios constructivos..."
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* --- FIN LAYOUT RESPONSIVO --- */}

              <div className="flex justify-end mt-8">
                <button 
                  className="btn bg-mint-500 text-white px-6 py-2 rounded-xl font-semibold" 
                  onClick={handleEvaluationComplete}
                >
                  Guardar y Siguiente Equipo
                </button>
              </div>
            </>
          )}
        </div>
        
        <audio ref={soundRef} src="/MA_BBRealSound_Push_Button_1_MP3.mp3" preload="auto" className="hidden"></audio>
      </div>
    );
  }
}