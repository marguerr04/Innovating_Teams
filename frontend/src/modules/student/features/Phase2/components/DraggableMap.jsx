// src/modules/student/features/Phase2/components/DraggableMap.jsx
import React, { useMemo } from 'react'; 
import { arr, CATS } from '../../../../../utils/helpers.js';

// --- 1. MAPA DE AVATARES (Para mostrar la foto en el centro) ---
const AVATAR_MAP = {
  Osvaldo: "/avatars/osvaldo.png",
  Humberto: "/avatars/humberto.png",
  Simona: "/avatars/simona.png",
  Juana: "/avatars/juana.png",
  Martina: "/avatars/martina.png",
  Andrés: "/avatars/andres.png",
  Gabriela: "/avatars/gabriela.png",
  Camila: "/avatars/camila.png",
  Francisco: "/avatars/francisco.png",
  Luis: "/avatars/luis.png",
};
const DEFAULT_AVATAR = "/avatars/default.png";

// Lógica de clases
const categoryClasses = CATS.reduce((acc, cat) => {
  acc[cat.id] = cat.cls;
  return acc;
}, {});
const defaultClasses = "bg-slate-100 text-slate-900 border-slate-200";

// --- LÓGICA DE POSICIONAMIENTO ---
const calculatePositions = (bubbleCount) => {
  const positions = [];
  const isMobile = window.innerWidth < 1024;

  const RADIUS_X = isMobile ? 160 : 220; 
  const RADIUS_Y = isMobile ? 120 : 160; 

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

export default function DraggableMap({ persona, bubbles }) {
  
  const allBubbles = arr(bubbles);
  // El texto central ahora es secundario, priorizamos la imagen visualmente
  const centerBubble = { 
    id: 'center', 
    text: persona?.name || 'Persona', 
    center: true 
  };
  const otherBubbles = allBubbles.filter(b => !b.center);

  const bubblePositions = useMemo(
    () => calculatePositions(otherBubbles.length),
    [otherBubbles.length]
  );

  const avatarSrc = AVATAR_MAP[persona?.name] || DEFAULT_AVATAR;

  return (
    <div 
      className="relative w-full h-full min-h-[420px] p-4 bg-gray-50 rounded-lg overflow-hidden"
    >
      {/* --- BURBUJA CENTRAL (FOTO) --- */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 
                   w-32 h-32 rounded-full shadow-2xl border-4 border-red-500 bg-white 
                   overflow-hidden flex items-center justify-center"
      >
        {/* CAMBIO: Mostrar imagen en vez de texto */}
        <img 
          src={avatarSrc} 
          alt={centerBubble.text} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ancla para burbujas satélite */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-0">
        {otherBubbles.map((b, index) => {
          const colorClasses = categoryClasses[b.cat] || defaultClasses;
          const position = bubblePositions[index];

          return (
            <div 
              key={b.id} 
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

      {/* Mensaje de "vacío" (ajustado posición) */}
      {otherBubbles.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 mt-24 w-64 text-center">
          <p className="text-sm text-gray-400 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
            Añade atributos para verlos aquí
          </p>
        </div>
      )}
    </div>
  );
}