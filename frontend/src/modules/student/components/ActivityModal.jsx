// src/modules/student/components/ActivityModal.jsx
import React from 'react';

// Este componente recibe 4 props:
// - show: (booleano) para mostrar u ocultar el modal
// - onClose: (función) para cerrarlo
// - title: (string) el título de la actividad
// - children: (componente) el juego en sí (ej. <WordSearch2 />)
export default function ActivityModal({ show, onClose, title, children }) {
  if (!show) {
    return null; // Si no se debe mostrar, no renderiza nada
  }

  // Tailwind para un fondo oscuro semitransparente
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      
      {/* El contenedor del juego, con el estilo oscuro de tu referencia */}
      <div className="w-full max-w-6xl h-full bg-slate-950 text-white rounded-3xl border border-white/5 shadow-2xl flex flex-col">
        
        {/* 1. Encabezado del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white"
          >
            &times; {/* Una "X" para cerrar */}
          </button>
        </div>

        {/* 2. Contenido del Modal (Aquí irá tu Sopa de Letras) */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

      </div>
    </div>
  );
}