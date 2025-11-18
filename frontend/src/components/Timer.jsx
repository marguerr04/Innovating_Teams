// Archivo: src/components/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { beep } from '../utils/helpers.js';

/**
 * ... (descripción) ...
 * @param {string} size - (NUEVO) 'large' (default) o 'small'.
 */
export default function Timer({ 
  initialSeconds = 300, 
  isProf = false, 
  autoStart = false, 
  onComplete, 
  size = 'large' // 1. Añadimos la prop 'size'
}) {
  
  // --- Lógica del Timer (sin cambios) ---
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) { 
        clearInterval(tickRef.current); 
        tickRef.current = null; 
      }
      return;
    }

    tickRef.current = setInterval(() => {
      setSeconds(s => {
        const next = s - 1;
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
        if (next <= 0) {
          clearInterval(tickRef.current);
          setRunning(false);
          lastBeepRef.current = null;
          if (onComplete) onComplete();
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [running, onComplete]);

  const reset = () => {
    setRunning(autoStart);
    setSeconds(initialSeconds);
    lastBeepRef.current = null;
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  };
  // --- Fin Lógica del Timer ---

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const getTimerColor = (remainingSeconds, totalSeconds) => {
    if (remainingSeconds <= totalSeconds * 0.1) return 'text-red-600';
    if (remainingSeconds <= totalSeconds * 0.25) return 'text-yellow-500';
    return 'text-slate-900';
  };
  
  // 2. Definimos el tamaño de la fuente basado en 'size'
  const textSizeClass = size === 'large' ? 'text-6xl' : 'text-4xl';

  return (
    <div className="flex flex-col items-center">
      {/* 3. Aplicamos la clase de tamaño */}
      <div className={`font-extrabold tracking-widest ${getTimerColor(seconds, initialSeconds)} ${textSizeClass}`}>
        {mm}:{ss}
      </div>

      {/* Controles del Profesor (sin cambios) */}
      <div className="mt-5 flex gap-2">
        {isProf && (
          <>
            {!running ? (
              <button 
                className="btn bg-mint-500 text-white" 
                onClick={() => setRunning(true)}
              >
                Iniciar
              </button>
            ) : (
              running && (
                <button 
                  className="btn bg-slate-100" 
                  onClick={() => setRunning(false)}
                >
                  Pausar
                </button>
              )
            )}
            <button 
              className="btn bg-accent-500 text-white" 
              onClick={reset}
            >
              Reiniciar
            </button>
          </>
        )}
      </div>
    </div>
  );
}