// src/modules/student/features/Phase2/index.jsx

import React, { useState, useEffect } from "react";
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx'; // Importa el Timer

// Importa los componentes de la Fase 2
import AreaSelector from "./components/AreaSelector";
import PersonaCard from "./components/PersonCard";
import EmpathyEditor from "./components/EmpathyEditor";
import DraggableMap from "./components/DraggableMap";
import "./Phase2.css"; 

const STORAGE_KEY = 'it_phase2_store';

// Duración de 8 minutos (480s)
const PHASE_2_DURATION = 480;

export default function Phase2({ onNext, isProf }) {
  
  // Constantes de la Fase 2
  const AREAS = [
    { id: "salud", name: "Salud" },
    { id: "sustentabilidad", name: "Sustentabilidad" },
    { id: "educacion", name: "Educación" },
  ];

  // (Tu const CHALL actualizada va aquí)
  const CHALL = {
    salud: [
      { id: "tto", title: "Autogestión de tratamientos", persona: { name: "Humberto", age: 50, story: "Fue dado de alta con indicaciones médicas complejas, pero no entendió qué debía seguir tomando ni a quién acudir si se sentía mal.", }},
      { id: "obesidad", title: "Obesidad", persona: { name: "Simona", age: 27, story: "Sabe que la alimentación es clave, pero no ha podido organizar ni aprender a darle una nutrición buena a su hija.", }},
      { id: "envejecimiento", title: "Envejecimiento activo", persona: { name: "Juana", age: 72, story: "Vive sola. Le gustaría mantenerse activa, pero no conoce programas accesibles que la motiven a hacer ejercicio y socializar.", }},
    ],
    sustentabilidad: [
      { id: "fast-fashion", title: "Contaminación por fast fashion", persona: { name: "Gabriela", age: 18, story: "Vive cerca de vertederos y basurales; debe pasar a diario por lugares con desagradables olores.", }},
      { id: "agua", title: "Acceso al agua en la agricultura", persona: { name: "Camila", age: 50, story: "Agricultora de paltas, está complicada de perder su negocio por la cantidad de agua que debe utilizar.", }},
      { id: "residuos", title: "Gestión de residuos electrónicos", persona: { name: "Francisco", age: 29, story: "Cambió su celular y computador, pero no sabe dónde llevar los antiguos. Terminó guardándolos en un cajón.", }},
    ],
    educacion: [
      { id: "financiera", title: "Educación financiera accesible", persona: { name: "Martina", age: 22, story: "Emprendedora que vende por redes sociales. No sabe cómo organizar su dinero, lo que la mantiene en constante inestabilidad.", }},
      { id: "laboral", title: "Inicio de vida laboral", persona: { name: "Andrés", age: 23, story: "Recién egresado de odontología, ninguna clínica lo ha llamado porque no tiene experiencia previa.", }},
      { id: "adultos-tec", title: "Tecnología adultos mayores", persona: { name: "Osvaldo", age: 70, story: "Adulto mayor que debe pedir ayuda a sus hijos o nietos cada vez que debe hacer tramites digitales.", }},
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
  const [showMap, setShowMap] = useState(false);
  const handleAdd = (bubble) => {
    const id = Math.random().toString(36).slice(2);
    setState((s) => ({
      ...s,
      bubbles: [
        ...s.bubbles,
        { id, ...bubble, x: 80 + Math.random() * 200, y: 100 + Math.random() * 200 },
      ],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* --- 1. NUEVA CABECERA CON FLEX --- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold">
          Fase 2 · Selección y Mapa de Empatía
        </h1>
        {/* --- 2. TARJETA DEL TIMER --- */}
        <div className="card p-4">
          <Timer 
            initialSeconds={PHASE_2_DURATION} 
            isProf={isProf} 
            autoStart={true}
          />
        </div>
      </div>

      {/* === 1. AÑADIR BLOQUE DE INSTRUCCIÓN === */}
      <p className="text-lg text-white/80 mb-6 max-w-3xl">
        Ahora, vamos a empatizar. Selecciona un área y un desafío para conocer a la persona que ayudarás.
        Luego, <strong>agrega atributos</strong> (necesidades, dolores, etc.) para construir su mapa de empatía.
      </p>
      {/* === FIN DE LA INSTRUCCIÓN === */}

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
        
          {/* --- 3. TIMER ELIMINADO DE AQUÍ --- */}

          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Ficha de la Persona</h2>
            {state.persona && (
              <button
                className="btn bg-slate-100"
                onClick={() => setShowMap(true)}
              >
                Ver / Editar bubble map
              </button>
            )}
          </div>

          {/* (Tu JSX para PersonaCard y EmpathyEditor no cambia) */}
          <div className="grid lg:grid-cols-[260px,1fr] gap-6">
            <PersonaCard persona={state.persona} />
            {state.persona && (
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
                onViewMap={() => setShowMap(true)}
                onConfirm={onNext}
              />
            )}
          </div>
        </div>
      </div>

      {/* --- Modal del mapa (Sin cambios) --- */}
      {showMap && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onMouseDown={(e) => { 
            if (e.target === e.currentTarget) {
              setShowMap(false);
            }
          }}
        >
          <div className="card bg-white p-6 w-[90%] max-w-4xl relative">
            <button
              className="absolute top-4 right-5 text-2xl text-slate-400 hover:text-slate-600"
              onClick={() => setShowMap(false)}
            >
              &times;
            </button>
            <DraggableMap
              persona={state.persona}
              bubbles={state.bubbles}
              applyBubbles={(updater) =>
                setState((s) => {
                  const newBubbles = typeof updater === 'function' 
                    ? updater(s.bubbles)
                    : updater;
                  return { ...s, bubbles: newBubbles };
                })
              }
              canDrag
            />
          </div>
        </div>
      )}
    </div>
  );
}