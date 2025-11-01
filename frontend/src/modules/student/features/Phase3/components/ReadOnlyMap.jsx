import React from 'react';
import { arr } from '../../../../../utils/helpers'; // Ajusta la ruta a tus utils

// Componente 'ReadOnlyMap' (de index.html)
export default function ReadOnlyMap({ persona, bubbles }) {
  const list = arr(bubbles).map(b => ({ ...b }));
  
  // Añade la burbuja central si no existe
  if (!list.find(b => b.center)) {
    const centerText = `${persona?.name || 'Persona'} · ${persona?.age || ''}`;
    list.unshift({ id: 'center', text: centerText, x: 120, y: 80, center: true });
  }

  return (
    // Estas clases (.bubble-map, .bubble) deben estar en tu CSS global
    <div className="bubble-map">
      {list.map(b => (
        <div 
          key={b.id} 
          className={`bubble ${b.center ? 'center' : 'lock'}`} 
          style={{ left: b.x, top: b.y }}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}