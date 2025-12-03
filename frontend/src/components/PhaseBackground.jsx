// src/components/PhaseBackground.jsx
import React from 'react';

// Mapeo de Fases a las nuevas imágenes
const phaseImages = {
  '-2': '/assets/backgrounds/fase7.png',
  '-1': '/assets/backgrounds/fase0.png',
  0: null, 
  1: '/assets/backgrounds/fase1.png', // Amarillo (Creatividad/Ideas)
  2: '/assets/backgrounds/fase2.png', // Verde (Empatía/Colaboración)
  3: '/assets/backgrounds/fase3.png', // Azul (Construcción/Engranajes)
  4: '/assets/backgrounds/fase4.png', // Azul Oscuro (Pitch/Ideación)
  5: '/assets/backgrounds/fase5.png', // Naranja (Comunicación)
  6: '/assets/backgrounds/fase6.png', // Morado (Podio/Trofeos)
  7: '/assets/backgrounds/fase7.png', // Rosa (Feedback/Social)
};

const defaultBgColor = '#11182A';

export default function PhaseBackground({ phase }) {
  
  const activeImageUrl = phaseImages[phase] || null;

  return (
    <div 
      // 1. --- ¡AQUÍ ESTÁ EL CAMBIO! ---
      // Cambiamos de -z-10 a z-0
      className="fixed inset-0 z-0" 
      style={{ backgroundColor: defaultBgColor }}
    >
      {/* El resto del componente (las imágenes) no cambia */}
      {Object.entries(phaseImages).map(([phaseKey, src]) => {
        if (!src) return null; 
        
        const isActive = Number(phaseKey) === phase;
        
        return (
          <div
            key={phaseKey}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isActive ? 0.3 : 0, 
            }}
          />
        );
      })}
    </div>
  );
}