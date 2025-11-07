// Archivo: src/modules/student/features/Phase3/components/LegoTimer.jsx

import React from 'react';

// 1. Importa el NUEVO componente Timer
// (Ajusta la ruta '..' para subir a 'src/' y bajar a 'components/')
import Timer from '../../../../../components/Timer'; 

// 2. Define la duración de esta fase (5 minutos)
const PHASE_3_DURATION = 300;

export default function LegoTimer({ isProf, onNext, onBack, onShowMap }) {
  
  // --- 3. BORRA toda la lógica del timer (useState, useEffect, etc.) ---

  return (
    // Card de Tailwind (de index.html)
    <div className="card p-6 flex flex-col items-center">
      <img 
        src="/lego.gif" 
        className="w-[280px] h-[158px] object-cover rounded-xl mb-4" 
        alt="gif lego"
      />
      
      {/* 4. Renderiza el componente Timer aquí */}
      <Timer 
        initialSeconds={PHASE_3_DURATION} 
        isProf={isProf}
        autoStart={true} 
      />
      
      {/* Botón 'Ver bubble map' (de index.html) */}
      <div className="mt-5">
        <button className="btn bg-slate-200" onClick={onShowMap}>Ver bubble map</button>
      </div>

      {/* Botones de navegación de fase (de index.html) */}
      <div className="mt-6 flex gap-2">
        <button className="btn bg-slate-100" onClick={onBack}>← Volver</button>
        <button className="btn bg-accent-500 text-white" onClick={onNext}>Continuar a Fase 4</button>
      </div>
    </div>
  );
}