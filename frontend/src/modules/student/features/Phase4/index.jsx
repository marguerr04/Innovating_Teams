import React, { useState, useEffect } from 'react';

// Ajusta la ruta para que coincida con tu archivo helpers.js
import { load, save } from '../../../../utils/helpers.js';

// Importa el modal de la ruleta
import RouletteModal from './components/RouletteModal';

export default function Phase4({ role, onNext, onBack }) {
  // Lógica de estado de index.html
  const [members, setMembers] = useState(() => load('it_members', ['Ana', 'Bruno', 'Carla', 'Diego']));
  const [selected, setSelected] = useState(() => load('it_selected', []));
  
  // Guardar en localStorage cuando cambien
  useEffect(() => {
    save('it_members', members);
    save('it_selected', selected);
  }, [members, selected]);
  
  const remaining = members.filter(m => !selected.includes(m));
  const [mode, setMode] = useState('ruleta');
  const [showRoulette, setShowRoulette] = useState(false);
  const isProf = role === 'profesor';

  // Función para añadir miembro (de index.html)
  const handleAddMember = (e) => {
    if (e.key === 'Enter') {
      const v = e.currentTarget.value.trim();
      if (v && !members.includes(v)) {
        setMembers([...members, v]);
        e.currentTarget.value = '';
      }
    }
  };

  // Función que se llama cuando la ruleta termina
  const handleSelectWinner = (name) => {
    // Si la ruleta se cierra sin ganador, o el nombre no está en la lista
    if (!name || !remaining.includes(name)) {
      setShowRoulette(false);
      return;
    }
    // Añade al ganador a la lista de 'seleccionados'
    setSelected(s => [...s, name]);
    setShowRoulette(false);
    alert('🎤 Pitch por: ' + name);
  };

  return (
    <>
      {/* Contenedor principal (de index.html) */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-1">Fase 4 · Pitch del equipo</h1>
        <p className="opacity-80 mb-4">El profesor elige o sortea quién presenta.</p>
        
        {/* Grid de 2 columnas (de index.html) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Miembros (de index.html) */}
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
          
          {/* Card 2: Seleccionar (de index.html) */}
          <div className="card p-6">
            <b>Seleccionar aleatoriamente</b>
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
            
            {isProf ? (
              <button 
                className="mt-4 btn bg-accent-500 text-white" 
                onClick={() => setShowRoulette(true)} // <-- CAMBIO: Abre el modal
                disabled={remaining.length === 0}
              >
                {remaining.length === 0 ? 'Todos han presentado' : 'Elegir al azar'}
              </button>
            ) : (
              <div className="mt-4 text-xs text-slate-500">Solo el profesor puede sortear.</div>
            )}
            
            <div className="mt-6 flex gap-2">
              <button className="btn bg-slate-100" onClick={onBack}>← Volver</button>
              <button className="btn bg-accent-500 text-white" onClick={onNext}>Continuar a Fase 5</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* El Modal de la Ruleta (se renderiza aquí) */}
      <RouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        names={remaining} // Pasa solo los miembros restantes
        onSpinEnd={handleSelectWinner}
      />
    </>
  );
}