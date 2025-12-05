// Archivo: src/components/Timer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { beep } from '../utils/helpers.js';

const WARNING_TIME = 60; // Start ticking loop on last minute

// Rutas de los GIFs (recuerda el ajuste que hicimos si estaban invertidos)
const HOURGLASS_GIF = '/assets/gifs/bomb.gif'; // Ajustado según tu feedback anterior
const BOMB_GIF = '/assets/gifs/hourglass.gif'; // Ajustado según tu feedback anterior
const TICK_SOUND = '/assets/sounds/tictacClock.mp3'; 

export default function Timer({ 
  initialSeconds = 300, 
  isProf = false, 
  autoStart = false, 
  onComplete, 
  size = 'large' 
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const audioRef = useRef(null); 

  // Lógica del conteo regresivo
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        const next = prev - 1;
        if (next > 0 && next <= 5) { beep(); }
        if (next <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          if (onComplete) onComplete();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  // Lógica de Efectos
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isRunning && seconds <= WARNING_TIME && seconds > 0) {
      if (audio.paused) {
        audio.play().catch(e => console.warn("Audio play blocked:", e));
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [seconds, isRunning]);

  const reset = () => {
    setIsRunning(autoStart);
    setSeconds(initialSeconds);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  
  // Lógica Visual
  const isCritical = seconds <= WARNING_TIME && seconds > 0;
  const currentGif = isCritical ? BOMB_GIF : HOURGLASS_GIF;
  const textColorClass = isCritical ? 'text-red-600 scale-110 transition-transform' : 'text-slate-800';
  
  // Ajustamos ligeramente el tamaño del texto para que quepa bien al lado
  const textSizeClass = size === 'large' ? 'text-5xl' : 'text-3xl';

  return (
    // 1. CAMBIO PRINCIPAL: 'flex-row' (por defecto en flex) en lugar de 'flex-col'
    // 'gap-6' separa el GIF del texto
    <div className="flex items-center gap-6 relative p-2">
      <audio ref={audioRef} src={TICK_SOUND} loop />

      {/* 2. COLUMNA IZQUIERDA: GIF */}
      {/* Quitamos el w-full y mb-4, usamos flex-shrink-0 para que no se aplaste */}
      <div className="h-32 w-32 flex-shrink-0 flex items-center justify-center">
         <img 
           src={currentGif} 
           alt="Timer status" 
           className={`object-contain transition-all duration-300 ${isCritical ? 'h-32 w-32 animate-bounce' : 'h-28 w-28'}`}
         />
      </div>

      {/* 3. COLUMNA DERECHA: Texto y Botones */}
      <div className="flex flex-col items-start"> {/* items-start para alinear a la izquierda */}
        
        {/* Números */}
        <div className={`font-extrabold tracking-widest leading-none ${textColorClass} ${textSizeClass}`}>
          {mm}:{ss}
        </div>

        {/* Estado */}
        <p className={`text-xs font-bold mt-1 uppercase tracking-wider ${isCritical ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
          {isCritical ? "¡Tiempo agotándose!" : "Tiempo restante"}
        </p>

        {/* Controles */}
        {isProf && (
          <div className="mt-3 flex gap-2">
            <button 
              className={`btn btn-xs px-3 py-1 rounded text-white font-bold ${isRunning ? 'bg-orange-400' : 'bg-mint-500'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button 
              className="btn btn-xs px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300" 
              onClick={reset}
            >
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}