import React from 'react';

// Ajusta la ruta para que coincida con tu archivo helpers.js
import { arr } from '../../../../../utils/helpers.js'; 

export default function ReadOnlyMap({ persona, bubbles }) {
  // Lógica de ReadOnlyMap (copiada de index.html)
  const list = arr(bubbles).map(b => ({ ...b }));
  if (!list.find(b => b.center)) {
    list.unshift({ id: 'center', text: `${persona?.name || 'Persona'} · ${persona?.age || ''}`, x: 120, y: 80, center: true });
  }

  return (
    // JSX de ReadOnlyMap (copiado de index.html)
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