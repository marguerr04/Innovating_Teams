import React, { useState, useEffect } from 'react';
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx';
import RouletteModal from './components/RouletteModal';

const PHASE_4_DURATION = 360; // 6 minutos

export default function Phase4({ role, isProf, onNext, onBack }) {
  // ... (La lógica de estado 'members', 'selected', 'remaining', 'mode', etc. no cambia)
  const [members, setMembers] = useState(() => load('it_members', ['Ana', 'Bruno', 'Carla', 'Diego']));
  const [selected, setSelected] = useState(() => load('it_selected', []));
  
  useEffect(() => {
    save('it_members', members);
    save('it_selected', selected);
  }, [members, selected]);
  
  const remaining = members.filter(m => !selected.includes(m));
  const [mode, setMode] = useState('ruleta');
  const [showRoulette, setShowRoulette] = useState(false);

  // ... (Las funciones 'handleAddMember' y 'handleSelectWinner' no cambian)
  const handleAddMember = (e) => { /* ... */ };
  const handleSelectWinner = (name) => { /* ... */ };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        
        {/* Contenedor de Título y Timer (sin cambios) */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Fase 4 · Pitch del equipo</h1>
            <p className="opacity-80">El profesor elige o sortea quién presenta.</p>
          </div>
          <div className="card p-4">
            <Timer 
              initialSeconds={PHASE_4_DURATION} 
              isProf={isProf} 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Miembros (sin cambios) */}
          <div className="card p-6">
            <b>Miembros del grupo</b>
            {/* ... (JSX de miembros y input de 'isProf') ... */}
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
          
          {/* Card 2: Seleccionar */}
          <div className="card p-6">
            <b>Seleccionar aleatoriamente</b>
            {/* ... (Botones de modo) ... */}
            <div className="mt-3 flex gap-2">
              {['ruleta', 'palito', 'vasos'].map(k => (
                <button 
                  key={k} 
                  className={`btn ${mode === k ? 'bg-mint-500 text-white' : 'bg-slate-100'}`} 
                  onClick={() => setMode(k)}
                >
                  {k === 'ruleta' ? 'Ruleta' : k === 'palito' ? 'Palito más corto' : 'Juego de vasos'}
                </button>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-slate-600">Método visual cambia, pero la selección es justa. No se repiten presentadores.</div>
            
            {/* --- 1. BLOQUE 'isProf' ELIMINADO --- */}
            {/* Ahora el botón se muestra para todos los roles */}
            <button 
              className="mt-4 btn bg-accent-500 text-white" 
              onClick={() => setShowRoulette(true)}
              disabled={remaining.length === 0}
            >
              {remaining.length === 0 ? 'Todos han presentado' : 'Elegir al azar'}
            </button>
            
            {/* (Botones de navegación de fase) */}
            <div className="mt-6 flex gap-2">
              <button className="btn bg-slate-100" onClick={onBack}>← Volver</button>
              <button className="btn bg-accent-500 text-white" onClick={onNext}>Continuar a Fase 5</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de la Ruleta (sin cambios) */}
      <RouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        names={remaining}
        onSpinEnd={handleSelectWinner}
      />
    </>
  );
}