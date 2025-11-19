// src/modules/student/features/Phase2/components/DraggableMap.jsx
import React, { useMemo } from 'react'; 
import { arr, CATS } from '../../../../../utils/helpers.js';

// Lógica de clases
const categoryClasses = CATS.reduce((acc, cat) => {
  acc[cat.id] = cat.cls;
  return acc;
}, {});
const defaultClasses = "bg-slate-100 text-slate-900 border-slate-200";

// --- LÓGICA DE POSICIONAMIENTO (CON RADIOS AJUSTADOS) ---
const calculatePositions = (bubbleCount) => {
  const positions = [];
  const isMobile = window.innerWidth < 1024;

  // --- 1. Usamos los radios más pequeños para que quepan ---
  const RADIUS_X = isMobile ? 160 : 220; // Antes era 300
  const RADIUS_Y = isMobile ? 120 : 160; // Antes era 180

  const START_ANGLE = -Math.PI / 2; 

  for (let i = 0; i < bubbleCount; i++) {
    const angle = START_ANGLE + (i / bubbleCount) * (2 * Math.PI);
    const x = Math.cos(angle) * RADIUS_X;
    const y = Math.sin(angle) * RADIUS_Y;
    const transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    positions.push({ transform });
  }
  return positions;
};
// --- FIN DE LA LÓGICA DE POSICIONAMIENTO ---

export default function DraggableMap({ persona, bubbles }) {
  
  const allBubbles = arr(bubbles);
  const centerBubble = { 
    id: 'center', 
    text: `${persona?.name || 'Persona'} · ${persona?.age || ''}`, 
    center: true 
  };
  const otherBubbles = allBubbles.filter(b => !b.center);

  const bubblePositions = useMemo(
    () => calculatePositions(otherBubbles.length),
    [otherBubbles.length]
  );

  return (
    <div 
      className="relative w-full h-full min-h-[420px] p-4 bg-gray-50 rounded-lg overflow-hidden"
    >
      {/* 2. Capa SVG eliminada */}
      
      {/* Burbuja Central */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                   w-32 h-32 rounded-full font-bold text-white shadow-lg bg-red-500 
                   flex items-center justify-center text-center p-2"
      >
        {centerBubble.text}
      </div>

      {/* Ancla para burbujas satélite */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-0">
        
        {otherBubbles.map((b, index) => {
          const colorClasses = categoryClasses[b.cat] || defaultClasses;
          const position = bubblePositions[index];

          return (
            <div 
              key={b.id} 
              // 3. No se necesita 'ref' para las líneas
              className={`absolute z-10 w-28 h-28 rounded-full font-semibold border shadow-sm 
                         ${colorClasses} transition-transform duration-300 ease-in-out 
                         flex items-center justify-center text-center text-sm p-2`}
              style={{ 
                transform: position.transform
              }}
            >
              {b.text}
            </div>
          );
        })}
      </div>

      {/* Mensaje de "vacío" */}
      {otherBubbles.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <p className="mt-28 text-center text-sm text-gray-400">
            Usa el editor para añadir atributos (dolores, necesidades...)
          </p>
        </div>
      )}

    </div>
  );
}