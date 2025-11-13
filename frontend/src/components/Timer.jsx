// Archivo: src/components/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
// 1. Importa la función 'beep' desde tu archivo de helpers
// (Ajusta la ruta '..' según dónde guardes este Timer.jsx)
import { beep } from '../utils/helpers.js'; 

/**
 * Un componente de temporizador reutilizable.
 * @param {number} initialSeconds - El total de segundos para el temporizador.
 * @param {boolean} isProf - Si el usuario es profesor (para mostrar botones).
 * @param {boolean} autoStart - Si el timer debe empezar automáticamente.
 * @param {function} onComplete - (NUEVO) Callback que se ejecuta cuando el timer llega a 0.
 */
export default function Timer({ initialSeconds = 300, isProf = false, autoStart = false, onComplete }) {
  
  // --- Lógica del Timer (Cuenta Regresiva Corregida) ---
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

  // Efecto para manejar el intervalo
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
        const next = s - 1; // Cuenta regresiva
        
        // Beep para los últimos 5 segundos
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
        
        // Cuando llega a 0
        if (next <= 0) {
          clearInterval(tickRef.current);
          setRunning(false);
          lastBeepRef.current = null;
          
          // --- CAMBIO ---
          // Llama al callback onComplete si existe, en lugar de la alerta
          if (onComplete) onComplete();
          // setTimeout(() => alert('⏱️ ¡Tiempo terminado!')); // Eliminado
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [running, onComplete]); // Añadido onComplete a las dependencias

  // Función de reseteo
  const reset = () => {
    setRunning(autoStart);
    setSeconds(initialSeconds);
    lastBeepRef.current = null;
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  };
  // --- Fin Lógica del Timer ---

  // Formato del tiempo
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Display del Timer con color dinámico */}
      <div className={`text-6xl font-extrabold tracking-widest ${getTimerColor()}`}>
        {mm}:{ss}
      </div>

      {/* Controles del Profesor (Actualizados) */}
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
      
      {/* Texto de ayuda eliminado */}
    </div>
  );
}