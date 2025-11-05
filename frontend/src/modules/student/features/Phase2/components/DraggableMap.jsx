import React, { useRef, useEffect } from 'react';

// Ajusta la ruta para que coincida con tu archivo helpers.js
import { arr } from '../../../../../utils/helpers.js';

// --- Lógica de DraggableMap (de index.html) ---
export default function DraggableMap({ persona, bubbles, applyBubbles, canDrag }) {
  const boxRef = useRef(null);

  // Efecto para centrar la burbuja 'Persona'
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    
    // Estima el centro (basado en el código de index.html)
    const rect = box.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const list = arr(bubbles);
    const center = list.find(b => b.center);
    const centerText = `${persona?.name || 'Persona'} · ${persona?.age || ''}`;

    if (!center) {
      // Si la burbuja 'center' no existe, la crea
      const newCenter = { id: 'center', text: centerText, x: cx - 60, y: cy - 18, center: true };
      applyBubbles([...list, newCenter]);
    } else if (center.text !== centerText) {
      // Si la persona cambia, actualiza el texto
      applyBubbles(list.map(b => b.center ? { ...b, text: centerText } : b));
    }
  }, [persona?.name, persona?.age, bubbles, applyBubbles]); // Dependencias

  // Lógica de arrastre (de index.html)
  const onDown = (e, id) => {
    if (!canDrag) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = boxRef.current.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const list = arr(bubbles);
    const i = list.findIndex(x => x.id === id);
    if (i < 0 || list[i].center) return;
    
    let sx = list[i].x || 0, sy = list[i].y || 0;

    const move = (ev) => {
      const nx = Math.max(10, Math.min(rect.width - 10, sx + (ev.clientX - startX)));
      const ny = Math.max(10, Math.min(rect.height - 10, sy + (ev.clientY - startY)));
      
      applyBubbles(prevList => {
        const base = arr(prevList);
        const clone = base.map(x => ({ ...x }));
        const ix = clone.findIndex(x => x.id === id);
        if (ix >= 0 && !clone[ix].center) {
          clone[ix].x = nx;
          clone[ix].y = ny;
        }
        return clone;
      });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up, { passive: false });
  };

  // JSX de DraggableMap (de index.html)
  return (
    <div 
      ref={boxRef} 
      className="bubble-map" 
      onPointerDown={(e) => e.stopPropagation()}
    >
      {arr(bubbles).map(b => (
        <div 
          key={b.id} 
          className={`bubble ${b.center ? 'center' : ''} ${!canDrag || b.center ? 'lock' : ''}`}
          style={{ left: b.x, top: b.y }} 
          onPointerDown={(b.center || !canDrag) ? undefined : (e) => onDown(e, b.id)}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}