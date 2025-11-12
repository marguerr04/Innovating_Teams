// Archivo: src/components/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { beep } from '../utils/helpers.js'; 

/**
<<<<<<< HEAD
 * Un componente de temporizador reutilizable.
 * @param {number} initialSeconds - El total de segundos para el temporizador.
 * @param {boolean} isProf - Si el usuario es profesor (para mostrar botones).
 * @param {boolean} autoStart - Si el timer debe empezar automáticamente.
 */
export default function Timer({ initialSeconds = 300, isProf = false, autoStart = false }) {
  
  // --- Lógica del Timer ---
  const [seconds, setSeconds] = useState(initialSeconds);
  // CAMBIO: El estado 'running' se inicializa con la prop 'autoStart'
=======
 * Un componente de temporizador reutilizable en cuenta regresiva.
 */
export default function Timer({ 
  initialSeconds = 300, 
  isProf = false, 
  autoStart = false,
  onComplete = () => {},
  colorMode = 'default' // Puede ser 'default' o 'red'
}) {
  
  // --- Lógica del Timer (Cuenta Regresiva Corregida) ---
  const [seconds, setSeconds] = useState(initialSeconds);
>>>>>>> avanceAlejandro/rama_post_certamen_1
  const [running, setRunning] = useState(autoStart);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

<<<<<<< HEAD
  useEffect(() => {
    if (!running) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        const next = Math.max(0, s - 1);
=======
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
>>>>>>> avanceAlejandro/rama_post_certamen_1
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
<<<<<<< HEAD
        if (next === 0) {
          if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
          setRunning(false); 
          lastBeepRef.current = null;
          setTimeout(() => alert('⏱️ ¡Tiempo terminado!'));
=======
        
        // Cuando llega a 0
        if (next <= 0) {
          clearInterval(tickRef.current);
          setRunning(false);
          lastBeepRef.current = null;
          setTimeout(() => {
            alert('⏱️ ¡Tiempo terminado!');
            onComplete();
          }, 100);
          return 0;
>>>>>>> avanceAlejandro/rama_post_certamen_1
        }
        return next;
      });
    }, 1000);
<<<<<<< HEAD
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
=======

    return () => { 
      if (tickRef.current) { 
        clearInterval(tickRef.current); 
        tickRef.current = null; 
      } 
    };
  }, [running, onComplete]);

  // Efecto para auto-start
  useEffect(() => {
    if (autoStart && !running && seconds === initialSeconds) {
      setRunning(true);
    }
  }, [autoStart, running, seconds, initialSeconds]);

  // Función de reseteo
  const reset = () => {
    setRunning(false);
    setSeconds(initialSeconds);
    lastBeepRef.current = null;
    if (tickRef.current) { 
      clearInterval(tickRef.current); 
      tickRef.current = null; 
    }
    
    // Si autoStart es true, iniciar después del reset
    if (autoStart) {
      setTimeout(() => setRunning(true), 100);
    }
  };

  // --- Estilos dinámicos según tiempo restante ---
  const getTimerColor = () => {
    // Si colorMode es 'red', siempre mostramos en rojo
    if (colorMode === 'red') return 'text-rose-600 dark:text-rose-400';
    
    // Si colorMode es 'green', siempre mostramos en verde emerald
    if (colorMode === 'green') return 'text-emerald-400';

    // Colores normales para otros casos
    if (seconds <= 60) return 'text-rose-600 dark:text-rose-400';
    if (seconds <= 120) return 'text-amber-500 dark:text-amber-400';
    return 'text-slate-900 dark:text-emerald-400';
  };
>>>>>>> avanceAlejandro/rama_post_certamen_1

  // Formato del tiempo
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
<<<<<<< HEAD
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
=======
      {/* Display del Timer con color dinámico */}
      <div className={`text-6xl font-extrabold tracking-widest ${getTimerColor()}`}>
        {mm}:{ss}
      </div>

      {/* Indicador visual para últimos segundos */}
      {seconds <= 60 && seconds > 0 && (
        <div className="text-xs text-rose-500 dark:text-rose-400 font-semibold mt-1">
          ¡Último minuto!
        </div>
      )}

      {seconds === 0 && (
        <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
          ¡Tiempo completado!
        </div>
      )}

      {/* Controles del Profesor */}
      <div className="mt-5 flex gap-2">
        {isProf && (
          <>
            {!running && seconds > 0 ? (
>>>>>>> avanceAlejandro/rama_post_certamen_1
              <button 
                className="btn bg-mint-500 text-white" 
                onClick={() => setRunning(true)}
              >
                Iniciar
              </button>
            ) : (
<<<<<<< HEAD
              <button 
                className="btn bg-slate-100" 
                onClick={() => setRunning(false)}
              >
                Pausar
              </button>
=======
              running && (
                <button 
                  className="btn bg-slate-100" 
                  onClick={() => setRunning(false)}
                >
                  Pausar
                </button>
              )
>>>>>>> avanceAlejandro/rama_post_certamen_1
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
<<<<<<< HEAD
      
      
=======
>>>>>>> avanceAlejandro/rama_post_certamen_1
    </div>
  );
}