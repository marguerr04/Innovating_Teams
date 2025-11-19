// src/modules/student/features/Phase2/index.jsx

import React, { useState, useEffect } from "react";
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx';

// Importa los componentes
import AreaSelector from "./components/AreaSelector";
import PersonaCard from "./components/PersonCard";
import EmpathyEditor from "./components/EmpathyEditor";
import DraggableMap from "./components/DraggableMap";
import "./Phase2.css";
import VideoIntroCard from '../Phase0/components/VideoIntroCard';

const STORAGE_KEY = 'it_phase2_store';
const PHASE_2_DURATION = 480;

export default function Phase2({ onNext, isProf }) {
  
  // --- Constantes (asumimos que están aquí) ---
  const AREAS = [
    { id: "salud", name: "Salud" },
    { id: "sustentabilidad", name: "Sustentabilidad" },
    { id: "educacion", name: "Educación" },
  ];
  const CHALL = {
    salud: [
      { id: "tto", title: "Autogestión de tratamientos", persona: { name: "Humberto", age: 50, story: "Fue dado de alta con indicaciones médicas complejas...", }},
      { id: "obesidad", title: "Obesidad", persona: { name: "Simona", age: 27, story: "Sabe que la alimentación es clave...", }},
      { id: "envejecimiento", title: "Envejecimiento activo", persona: { name: "Juana", age: 72, story: "Vive sola. Le gustaría mantenerse activa...", }},
    ],
    sustentabilidad: [
      { id: "fast-fashion", title: "Contaminación por fast fashion", persona: { name: "Gabriela", age: 18, story: "Vive cerca de vertederos...", }},
      { id: "agua", title: "Acceso al agua en la agricultura", persona: { name: "Camila", age: 50, story: "Agricultora de paltas, está complicada...", }},
      { id: "residuos", title: "Gestión de residuos electrónicos", persona: { name: "Francisco", age: 29, story: "Cambió su celular y computador...", }},
    ],
    educacion: [
      { id: "financiera", title: "Educación financiera accesible", persona: { name: "Martina", age: 22, story: "Emprendedora que vende por redes sociales...", }},
      { id: "laboral", title: "Inicio de vida laboral", persona: { name: "Andrés", age: 23, story: "Recién egresado de odontología...", }},
      { id: "adultos-tec", title: "Tecnología adultos mayores", persona: { name: "Osvaldo", age: 70, story: "Adulto mayor que debe pedir ayuda...", }},
    ],
  };
  const CATS = [
    { id: "necesidades", name: "Necesidades", cls: "bg-emerald-100 text-emerald-900 border-emerald-200" },
    { id: "dolores", name: "Dolores", cls: "bg-rose-100 text-rose-900 border-rose-200" },
    { id: "objetivos", name: "Objetivos", cls: "bg-indigo-100 text-indigo-900 border-indigo-200" },
  ];
  // --- Fin Constantes ---

  // --- Lógica de estado (sin cambios) ---
  const [state, setState] = useState(() => load(STORAGE_KEY, {
    area: null,
    challengeId: null,
    persona: null,
    bubbles: [],
  }));
  useEffect(() => {
    save(STORAGE_KEY, state);
  }, [state]); 
  
  const [view, setView] = useState('selection'); 
  const [showMap, setShowMap] = useState(false);
  
  const handleAdd = (bubble) => {
    const id = Math.random().toString(36).slice(2);
    setState((s) => ({
      ...s,
      bubbles: [ ...s.bubbles, { id, ...bubble } ],
    }));
  };
  // --- Fin Lógica de estado ---

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        
        {/* --- Cabecera y Timer (Compartido) --- */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold">
            Empatía · {view === 'selection' ? 'Selección de Desafío' : 'Mapa de Empatía'}
          </h1>
          <div className="card p-4">
            <Timer 
              initialSeconds={PHASE_2_DURATION} 
              isProf={isProf} 
              autoStart={true}
            />
          </div>
        </div>

        {/* --- Párrafo de Instrucción (Dinámico) --- */}
        {/* Video intro para la fase 2 (id 16) antes de selección */}
        {view === 'selection' && (
          <div className="mb-6">
            <VideoIntroCard videoId={16} size="medium" />
          </div>
        )}
        {view === 'selection' ? (
          <p className="text-lg text-white/80 mb-6 max-w-3xl">
            Vamos a empatizar. Selecciona un área y un desafío para conocer a la persona que ayudarás.
            Haz clic en "Continuar a Empatía" cuando estés listo.
          </p>
        ) : (
          <p className="text-lg text-white/80 mb-6 max-w-3xl">
            Ahora, construye el mapa de empatía para <strong>{state.persona?.name}</strong>. 
            Usa el editor de la derecha para añadir atributos y observa cómo se arma el mapa.
          </p>
        )}

        {/* ============================================= */}
        {/* ---          VISTA 1: SELECCIÓN           --- */}
        {/* ============================================= */}
        {view === 'selection' && (
          <div className="grid md:grid-cols-3 gap-6">
            <AreaSelector
              area={state.area}
              challengeId={state.challengeId}
              areas={AREAS}
              challenges={CHALL}
              onSelectArea={(id) =>
                setState((s) => ({ ...s, area: id, challengeId: null, persona: null }))
              }
              onSelectChallenge={(id) => {
                const persona = CHALL[state.area].find((c) => c.id === id)?.persona;
                setState((s) => ({ ...s, challengeId: id, persona }));
              }}
            />
            <div className="md:col-span-2 card p-6">
              <h2 className="font-bold mb-3">Ficha de la Persona</h2>
              <div className="grid lg:grid-cols-[260px,1fr] gap-6">
                <PersonaCard persona={state.persona} />
                {!state.persona ? (
                  <div className="flex items-center justify-center text-center text-slate-500 bg-slate-50 rounded-lg p-4">
                    Selecciona un desafío de la izquierda para ver la ficha de la persona.
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center bg-slate-50 rounded-lg p-4">
                    <p className="text-lg font-semibold text-slate-800">Persona seleccionada:</p>
                    <p className="text-3xl font-bold text-mint-600 my-2">{state.persona.name}</p>
                    <p className="text-slate-600 mb-4">¿Todo listo? ¡Vamos a empatizar!</p>
                    <button
                      onClick={() => setView('empathy')}
                      className="btn bg-mint-500 text-white w-full max-w-xs"
                    >
                      Continuar a Empatía →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* ---        VISTA 2: MAPA DE EMPATÍA       --- */}
        {/* ============================================= */}
        {view === 'empathy' && (
          
          // 1. NUEVO GRID: Lienzo (1fr) + Sidebar (400px) en PC
          //    En tablet (no-lg), se apila (1 columna)
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            
            {/* --- Columna 1: Lienzo (El Mapa) --- */}
            {/* 'order-last lg:order-first' -> En tablet, el mapa va al final. En PC, va primero. */}
            {/* ----- ¡ACTUALIZACIÓN! Vamos a poner el mapa primero en AMBOS casos. ----- */}
            <div className="card p-4">
              <h2 className="font-bold text-xl text-slate-800 px-3 pt-2">
                Mapa de Empatía
              </h2>
              <DraggableMap
                persona={state.persona}
                bubbles={state.bubbles}
              />
            </div>

            {/* --- Columna 2: Sidebar (Herramientas) --- */}
            <div className="space-y-6">
              
              {/* Card de Persona */}
              <div className="card p-6">
                 <h2 className="font-bold mb-3">Ficha de la Persona</h2>
                 <PersonaCard persona={state.persona} />
                 <button 
                    onClick={() => setView('selection')}
                    className="btn bg-slate-100 mt-4"
                 >
                   ← Volver a Selección
                 </button>
              </div>
              
              {/* Card de Editor */}
              <div className="card p-6">
                <h2 className="font-bold mb-3">Editor de Atributos</h2>
                <EmpathyEditor
                  persona={state.persona}
                  bubbles={state.bubbles}
                  categories={CATS}
                  onAdd={handleAdd}
                  onRemove={(id) =>
                    setState((s) => ({
                      ...s,
                      bubbles: s.bubbles.filter((b) => b.id !== id),
                    }))
                  }
                  onViewMap={() => setShowMap(true)} // Aún podemos usar el modal
                  onConfirm={onNext} // Botón final para pasar de fase
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* --- Modal (sin cambios) --- */}
      {showMap && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => { 
            if (e.target === e.currentTarget) setShowMap(false);
          }}
        >
          <div className="card bg-white p-6 w-[90%] max-w-4xl relative">
            <button
              className="absolute top-4 right-5 text-2xl text-slate-400 hover:text-slate-600 z-20"
              onClick={() => setShowMap(false)}
            >
              &times;
            </button>
            <DraggableMap
              persona={state.persona}
              bubbles={state.bubbles}
            />
          </div>
        </div>
      )}
    </>
  );
}