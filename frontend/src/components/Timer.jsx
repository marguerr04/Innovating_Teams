// Archivo: src/components/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
// 1. Importa la función 'beep' desde tu archivo de helpers
// (Ajusta la ruta '..' según dónde guardes este Timer.jsx)
import { beep } from '../utils/helpers.js'; 

/**
 * Un componente de temporizador reutilizable.
 * @param {number} initialSeconds - El total de segundos para el temporizador.
 * @param {boolean} isProf - Si el usuario es profesor (para mostrar botones).
 */
export default function Timer({ initialSeconds = 300, isProf = false }) {
  
  // --- 2. Lógica del Timer (copiada de Phase3 en index.html) ---
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        const next = Math.max(0, s - 1);
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
        if (next === 0) {
          if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
          setRunning(false); 
          lastBeepRef.current = null;
          setTimeout(() => alert('⏱️ ¡Tiempo terminado!'));
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [running]); // Se ejecuta solo cuando 'running' cambia

  // Función de reseteo (de index.html)
  const reset = () => {
    setRunning(false);
    setSeconds(initialSeconds);
    lastBeepRef.current = null;
  };
  // --- Fin Lógica del Timer ---

  // Formato del tiempo
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* 3. Display del Timer (de index.html) */}
      <div className="text-6xl font-extrabold tracking-widest text-slate-900">
        {mm}:{ss}
      </div>

      {/* 4. Controles del Profesor (de index.html) */}
      <div className="mt-5 flex gap-2">
        {isProf && (
          <>
            <button 
              className="btn bg-mint-500 text-white" 
              onClick={() => setRunning(true)}
            >
              Iniciar
            </button>
            <button 
              className="btn bg-slate-100" 
              onClick={() => setRunning(false)}
            >
              Pausar
            </button>
            <button 
              className="btn bg-accent-500 text-white" 
              onClick={reset}
            >
              Reiniciar
            </button>
          </>
        )}
      </div>
      
      {!isProf && (
        <div className="text-xs text-slate-500 mt-2">
          El profesor controla el temporizador.
        </div>
      )}
    </div>
  );
}