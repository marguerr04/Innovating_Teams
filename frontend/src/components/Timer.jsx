// Archivo: src/components/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { beep } from '../utils/helpers.js'; 

/**
 * Un componente de temporizador reutilizable.
 * @param {number} initialSeconds - El total de segundos para el temporizador.
 * @param {boolean} isProf - Si el usuario es profesor (para mostrar botones).
 * @param {boolean} autoStart - Si el timer debe empezar automáticamente.
 */
export default function Timer({ initialSeconds = 300, isProf = false, autoStart = false }) {
  
  // --- Lógica del Timer ---
  const [seconds, setSeconds] = useState(initialSeconds);
  // CAMBIO: El estado 'running' se inicializa con la prop 'autoStart'
  const [running, setRunning] = useState(autoStart);
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

  // Función de reseteo
  const reset = () => {
    // CAMBIO: Al reiniciar, vuelve al estado 'autoStart'
    setRunning(autoStart); 
    setSeconds(initialSeconds);
    lastBeepRef.current = null;
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    // Si autoStart es true, el useEffect de [running] lo reiniciará
  };
  // --- Fin Lógica del Timer ---

  // Formato del tiempo
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Display del Timer */}
      <div className="text-6xl font-extrabold tracking-widest text-slate-900">
        {mm}:{ss}
      </div>

      {/* 4. Controles del Profesor (Actualizados) */}
      <div className="mt-5 flex gap-2">
        {isProf && (
          <>
            {/* CAMBIO: Muestra Iniciar o Pausar según el estado 'running' */}
            {!running ? (
              <button 
                className="btn bg-mint-500 text-white" 
                onClick={() => setRunning(true)}
              >
                Iniciar
              </button>
            ) : (
              <button 
                className="btn bg-slate-100" 
                onClick={() => setRunning(false)}
              >
                Pausar
              </button>
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