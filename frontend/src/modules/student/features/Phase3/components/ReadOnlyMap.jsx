import React from 'react';

import { arr } from '../../../../../utils/helpers.js'; 

export default function ReadOnlyMap({ persona, bubbles }) {
  // Lógica de ReadOnlyMap 
  const list = arr(bubbles).map(b => ({ ...b }));
  if (!list.find(b => b.center)) {
    list.unshift({ id: 'center', text: `${persona?.name || 'Persona'} · ${persona?.age || ''}`, x: 120, y: 80, center: true });
  }

  return (
    // JSX de ReadOnlyMap 
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