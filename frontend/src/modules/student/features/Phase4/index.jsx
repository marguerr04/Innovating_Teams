// src/modules/student/features/Phase4/index.jsx
import JuicyButton from '../../../../components/JuicyButton';
// 1. IMPORTA 'useEffect' JUNTO CON 'useState'
import React, { useState, useEffect } from 'react';
// 2. IMPORTA 'load' Y 'save'
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx';
import RouletteModal from './components/RouletteModal';

const PHASE_4_DURATION = 360; // 6 minutos

export default function Phase4({ role, isProf, onNext, onBack }) {
  
  const p2 = load('it_phase2_store', null) || {};

  // 3. ESTADO PARA EL TEXTAREA (con persistencia en localStorage)
  const [pitchText, setPitchText] = useState(() => load('it_pitch_text', ''));
  useEffect(() => {
    save('it_pitch_text', pitchText);
  }, [pitchText]);

  // --- Estados (sin cambios) ---
  const [members, setMembers] = useState(() => load('it_members', ['Ana', 'Bruno', 'Carla', 'Diego']));
  const [selected, setSelected] = useState(() => load('it_selected', []));
  
  useEffect(() => {
    save('it_members', members);
    save('it_selected', selected);
  }, [members, selected]);
  
  const remaining = members.filter(m => !selected.includes(m));
  const [showModal, setShowModal] = useState(false);

  // --- Lógica de Handlers (sin cambios) ---
  const handleAddMember = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const name = e.target.value.trim();
      if (!members.includes(name)) {
        setMembers(prev => [...prev, name]);
      }
      e.target.value = '';
    }
  };
  
  const handleSelectWinner = (name) => {
    if (name && !selected.includes(name)) {
      setSelected(prev => [...prev, name]);
    }
    setShowModal(false); 
  };
  // --- Fin de la lógica ---

  return (
    <>
      <div className="max-w-5xl mx-auto">
        
        {/* Contenedor de Título y Timer (sin cambios) */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Comunicación</h1>
          </div>
          <div className="card p-4">
            <Timer 
              initialSeconds={PHASE_4_DURATION} 
              isProf={isProf} 
              autoStart={true}
            />
          </div>
        </div>
        
        {/* Bloque de Instrucción (sin cambios) */}
        {/* CAMBIO: Estructura clara de lo que se espera en el pitch */}
<div className="mb-8 max-w-4xl space-y-4">
          <p className="text-xl md:text-3xl font-bold text-white/95">
            Tu Misión: Convencer al resto de que su solución es la mejor.
          </p>
          <div className="text-lg md:text-2xl text-white/85 leading-relaxed bg-white/10 p-4 rounded-xl border border-white/20">
            Preparen un pitch de <strong>90 segundos</strong> respondiendo claramente:
            <ol className="list-decimal list-inside mt-2 space-y-1 font-semibold">
              <li>¿Quién es su usuario?</li>
              <li>¿Qué problema tiene?</li>
              <li>¿Cómo su emprendimiento lo soluciona?</li>
            </ol>
          </div>
        </div>
        
        {/* === 4. NUEVO BLOQUE DE TEXTAREA === */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-3 text-slate-800">Borrador del Pitch</h2>
          <p className="text-slate-600 text-sm mb-3">
            Usen este espacio para escribir y ordenar las ideas de su pitch. (Se guarda automáticamente).
          </p>
          <textarea
            className="w-full h-40 rounded-xl border border-slate-200 p-3 bg-white text-slate-900 focus:ring-2 focus:ring-mint-500"
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            placeholder="Estructura sugerida: 1. Problema (Ej: Humberto...), 2. Solución (Nuestro prototipo...), 3. Valor (Ayuda a...), 4. Próximos pasos..."
          />
        </div>
        {/* === FIN DEL BLOQUE TEXTAREA === */}

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Miembros (sin cambios) */}
          <div className="card p-6">
            <b>Miembros del grupo</b>
            <div className="mt-3 flex flex-wrap gap-2">
              {members.map(m => (
                <span 
                  key={m} 
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${selected.includes(m) ? 'bg-slate-200 text-slate-500 line-through' : 'bg-slate-100'}`}
                >
                  {m}
                </span>
              ))}
            </div>
            {isProf && (
              <div className="mt-4 flex gap-2">
                <input 
                  className="rounded-xl border border-slate-300 px-3 py-2 flex-1" 
                  placeholder="Agregar miembro" 
                  onKeyDown={handleAddMember} 
                />
                <button 
                  className="btn bg-slate-100" 
                  onClick={() => setSelected([])}
                >
                  Reset elegidos
                </button>
              </div>
            )}
          </div>
          
          {/* Card 2: Seleccionar (sin cambios) */}
          <div className="card p-6">
            <b>Seleccionar aleatoriamente</b>
            <div className="mt-4 text-sm text-slate-600">
              Usa la ruleta para elegir quién presenta. No se repiten presentadores.
            </div>
            <JuicyButton 
        color="yellow" 
        onClick={() => setShowModal(true)}
        disabled={remaining.length === 0}
        className="w-full"
      >
        {remaining.length === 0 ? 'Todos han presentado' : '🎰 Girar la Ruleta'}
      </JuicyButton>
            <div className="mt-6 flex gap-2">
              <JuicyButton color="gray" onClick={onBack}>← Volver</JuicyButton>
    <JuicyButton color="blue" onClick={onNext}>Continuar a Fase 5 →</JuicyButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Ruleta (sin cambios) */}
      <RouletteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        names={remaining}
        onSpinEnd={handleSelectWinner}
      />
    </>
  );
}