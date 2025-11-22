import React from 'react';

const phaseNames = [
  "Inicio", 
  "Equipo", 
  "Empatía", 
  "Creatividad", 
  "Comunicación", 
  "Evaluación", 
  "Resultados", 
  "Feedback" 
];

export default function PhaseProgressBar({ currentPhase }) {
  
  const firstRow = phaseNames.slice(0, 4);
  const secondRow = phaseNames.slice(4, 8);

  const renderRow = (phases, baseIndex) => (
    <div className="flex w-full filter drop-shadow-sm">
      {phases.map((name, index) => {
        const globalIndex = baseIndex + index;
        const isActive = globalIndex === currentPhase;
        const isCompleted = globalIndex < currentPhase;

        // --- LÓGICA DE COLORES ---
        // Grupo 1: Estructurales (Inicio, Resultados, Feedback) -> Verdes
        const isStructural = [0, 6, 7].includes(globalIndex);
        
        let bgClass = 'bg-slate-700'; 
        let textBaseColor = 'text-slate-400';

        if (isCompleted || isActive) {
          textBaseColor = 'text-white';
          
          if (isStructural) {
            // VERDE: Para fases de estructura
            // CAMBIO: Usamos 'emerald-600' para activo (mejor contraste) y '700' para completado
            bgClass = isActive ? 'bg-emerald-600' : 'bg-emerald-700';
          } else {
            // NARANJA: Para fases de habilidades (Juego)
            // CAMBIO: Usamos 'orange-500' en vez de amarillo. Se ve activo pero la letra blanca resalta bien.
            bgClass = isActive ? 'bg-orange-500' : 'bg-amber-600';
          }
        }

        const textStyle = isActive
          ? 'text-[9px] sm:text-[10px] md:text-xs font-extrabold scale-105' 
          : 'text-[8px] sm:text-[9px] md:text-[10px] font-medium opacity-90'; 

        const zIndex = 50 - index;

        return (
          <div 
            key={globalIndex}
            className="relative flex-1 h-6 md:h-8 flex items-center justify-center transition-all duration-300"
            style={{ 
              zIndex: zIndex,
              marginLeft: index === 0 ? '0' : '-10px', 
              clipPath: index === 0 
                ? 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)' 
                : 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 8% 50%)' 
            }}
          >
            <div className={`absolute inset-0 ${bgClass} transition-colors duration-500`}></div>
            
            <span className={`relative z-10 uppercase tracking-wider pl-2 truncate px-1 ${textBaseColor} ${textStyle}`}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto flex flex-col gap-0.5">
      {renderRow(firstRow, 0)}
      {renderRow(secondRow, 4)}
    </div>
  );
}