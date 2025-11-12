import { useState, useEffect, useRef } from 'react';

<<<<<<< HEAD
export const useTimer = () => {
  console.log("--- RENDERIZANDO useTimer ---");
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
=======
/**
 * useTimer hook refactorizado para countdown
 * @param {object} options
 * @param {number} options.initialSeconds - segundos iniciales (default 300)
 * @param {function} options.onComplete - callback cuando llega a 0
 * @param {boolean} options.autoStart - si debe arrancar automáticamente
 */
export const useTimer = ({ initialSeconds = 300, onComplete = null, autoStart = false } = {}) => {
  console.log("--- RENDERIZANDO useTimer (countdown) ---");
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(!!autoStart);
>>>>>>> avanceAlejandro/rama_post_certamen_1
  const intervalRef = useRef(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
<<<<<<< HEAD
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setSeconds(0);
    setIsRunning(false);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
=======
    }
  };

  const stop = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setIsRunning(false);
  };

  const reset = (newInitial) => {
    // si se pasa newInitial, lo usamos como nuevo valor inicial
    const init = typeof newInitial === 'number' ? newInitial : initialSeconds;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setSeconds(init);
    setIsRunning(!!autoStart);
  };

  useEffect(() => {
    if (!isRunning) return;

    // Si ya hay un intervalo, no crear otro
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          // detener
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
          setIsRunning(false);
          try { if (typeof onComplete === 'function') onComplete(); } catch (e) { console.error(e); }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [isRunning, onComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
>>>>>>> avanceAlejandro/rama_post_certamen_1
  }, []);

  const formatTime = () => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return {
    time: formatTime(),
    seconds,
    isRunning,
    start,
    reset,
    stop
  };
};