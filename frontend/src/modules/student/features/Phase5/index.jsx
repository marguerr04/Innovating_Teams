// src/modules/student/features/Phase5/index.jsx

import JuicyButton from '../../../../components/JuicyButton';
import React, { useState, useEffect, useRef } from 'react';
import { load, save } from '../../../../utils/helpers.js';
import useImageManager from '../../../../utils/useImageManager';
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
  
  // --- LÓGICA DE FOTOS CON GOOGLE CLOUD STORAGE ---
  // Estado local para la imagen del equipo actual
  const [currentTeamPhoto, setCurrentTeamPhoto] = useState(null);


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
  
  // Usar el mismo hook que funciona en Phase3
  const {
    imageUrl: existingImageUrl,
    hasImage: hasExistingImage,
    loading: loadingExistingImage,
    error: imageError,
    updateImageData,
    refreshImage,
    clearError
  } = useImageManager(currentTeam.id);

  // Estado local para la imagen del equipo actual (ya declarado arriba)

  // Sincronizar con imagen existente cuando se carga y cuando cambia el equipo
  useEffect(() => {
    console.log(`🔍 Debug Equipo ${currentTeam.id}:`, {
      hasExistingImage,
      existingImageUrl,
      loadingExistingImage
    });
    
    if (hasExistingImage && existingImageUrl) {
      setCurrentTeamPhoto(existingImageUrl);
      console.log(`✅ Imagen asignada para ${currentTeam.name}:`, existingImageUrl);
    } else {
      // Para equipos sin imagen en la BD, mostrar imagen de prueba
      if (currentTeam.id === MY_TEAM_ID) {
        setCurrentTeamPhoto(null); // Mi equipo sin imagen
      } else {
        setCurrentTeamPhoto('/lego.gif'); // Otros equipos - imagen de prueba
      }
      console.log(`❌ Sin imagen para ${currentTeam.name}`);
    }
  }, [hasExistingImage, existingImageUrl, currentTeam.id]);

  // --- VISTA DE PRESENTACIÓN ---
  if (view === 'presenting') {
    return (
      <div className="max-w-3xl mx-auto card p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Presentando (Turno {currentTeamIndex + 1}/{TEAMS.length}):</h2>
        <p className="text-5xl font-extrabold text-mint-500 mb-6">{currentTeam.name}</p>
        
        {/* Sección de imagen del prototipo - exactamente como Phase3 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-700 mb-3">Prototipo LEGO</h3>
          
          {/* Mensaje de error si existe */}
          {imageError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              ⚠️ {imageError}
              <button 
                onClick={clearError}
                className="ml-2 underline hover:no-underline"
              >
                Cerrar
              </button>
            </div>
          )}
          
          {/* Indicador de carga */}
          {loadingExistingImage && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 text-sm">
              🔄 Cargando imagen existente del equipo {currentTeam.id}...
            </div>
          )}
          
          {/* Mostrar imagen (igual que Phase3) */}
          {currentTeamPhoto ? (
            <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border-4 border-mint-200 mb-4">
              <img 
                src={currentTeamPhoto} 
                alt={`Prototipo del ${currentTeam.name}`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  console.error('Error al cargar imagen del equipo:', currentTeam.id, currentTeamPhoto);
                  // Si hay error cargando imagen, mostrar placeholder
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{display: 'none'}} className="w-full aspect-video bg-orange-100 border border-orange-300 rounded text-orange-600 text-sm flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">📷</div>
                <div>URL de imagen no válida</div>
                <div className="text-xs mt-1 px-2 text-center break-all">{currentTeamPhoto}</div>
              </div>
              {/* Información adicional si es imagen existente */}
              {hasExistingImage && currentTeamPhoto === existingImageUrl && (
                <div className="bg-white/90 p-2 text-xs text-slate-600">
                  📷 Imagen cargada desde base de datos - Equipo {currentTeam.id}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto aspect-video bg-slate-700 flex items-center justify-center text-white/50 rounded-lg text-lg mb-4">
              {loadingExistingImage ? (
                "🔄 Cargando imagen..."
              ) : (
                <div className="text-center">
                  <div className="text-lg mb-2">{`No hay imagen para ${currentTeam.name}`}</div>
                  <div className="text-xs">
                    hasImage: {String(hasExistingImage)} | 
                    loading: {String(loadingExistingImage)} |
                    error: {imageError ? 'Sí' : 'No'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
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

        {/* CAMBIO: Texto de rol más grande */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            {isMyTeamPresenting ? (
              <p className="text-slate-700 font-bold text-xl md:text-2xl">
                ¡Es su momento! Véndanle su idea al mundo. Tienen 90 segundos.
              </p>
            ) : (
              <p className="text-slate-600 text-lg md:text-2xl">
                <strong>Rol de Juez:</strong> Escuchen atentamente. Busquen innovación y viabilidad. <br/>
                ¿Esta solución realmente ayuda a la persona?
              </p>
            )}
        </div>
        
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
            <JuicyButton color="mint" onClick={handleEvaluationComplete}>
    Guardar y Siguiente →
  </JuicyButton>
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
             {/* CAMBIO: Instrucción de evaluación más grande */}
       {!isMyTeamPresenting && (
          <p className="text-slate-600 my-6 text-center text-lg md:text-2xl font-medium max-w-3xl mx-auto">
            Como evaluadores, su misión es dar feedback honesto. 
            <br/>
            <span className="text-slate-500 text-base md:text-xl">
                ¿El equipo entendió el problema? ¿La solución es creativa? Califiquen del 1 al 10.
            </span>
          </p>
       )}
              
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