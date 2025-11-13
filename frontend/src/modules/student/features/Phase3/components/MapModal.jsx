// src/modules/student/features/Phase3/components/MapModal.jsx
import React from 'react';
import ReadOnlyMap from './ReadOnlyMap';
// 1. IMPORTA LA PERSONCARD (con la ruta corregida para subir)
import PersonCard from '../../Phase2/components/PersonCard';

export default function MapModal({ show, onClose, persona, bubbles }) {
  if (!show) {
    return null; 
  }

  return (
    // 2. MODAL CON OVERLAY
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      onMouseDown={(e) => { 
        if (e.target === e.currentTarget) onClose(); 
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* 3. CARD MÁS ANCHA Y CON GRID */}
      <div 
        className="relative card w-[min(1100px,95vw)] p-6" // Más ancha y con más padding
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <b className="text-xl">Mapa de Empatía y Persona</b>
          <button 
            className="text-slate-400 hover:text-slate-600 text-3xl leading-none" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        {/* 4. GRID DE 2 COLUMNAS */}
        <div className="grid lg:grid-cols-[320px,1fr] gap-6">
          
          {/* Columna Izquierda: Persona */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-slate-700">Persona</h3>
            <div className="flex-1">
              <PersonCard persona={persona} />
            </div>
          </div>
          
          {/* Columna Derecha: Bubble Map */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-2 text-slate-700">Bubble Map</h3>
            <div className="flex-1">
              <ReadOnlyMap persona={persona} bubbles={bubbles} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}