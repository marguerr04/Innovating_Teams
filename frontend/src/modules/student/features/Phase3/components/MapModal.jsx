import React from 'react';
import ReadOnlyMap from './ReadOnlyMap';

export default function MapModal({ show, onClose, persona, bubbles }) {
  // Si no se debe mostrar, no renderiza nada
  if (!show) {
    return null; 
  }

  // JSX del Modal 
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50" 
        onMouseDown={(e) => { 
          // Cierra el modal si se hace clic en el fondo
          if (e.target === e.currentTarget) onClose(); 
        }}
      ></div>
      <div 
        className="relative card w-[min(980px,95vw)] p-5" 
        onMouseDown={(e) => e.stopPropagation()} // Evita que el clic en el card cierre el modal
      >
        <div className="flex items-center justify-between">
          <b>Mapa de Empatía</b>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
        <ReadOnlyMap persona={persona} bubbles={bubbles} />
      </div>
    </div>
  );
}