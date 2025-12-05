import { useState, useEffect, useRef } from 'react';

/**
 * Countdown timer hook.
 * @param {object} options
 * @param {number} options.initialSeconds - start seconds (default 300)
 * @param {function} options.onComplete - callback when timer hits 0
 * @param {boolean} options.autoStart - start immediately
 */
export const useTimer = ({ initialSeconds = 300, onComplete = null, autoStart = false } = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(!!autoStart);
  const intervalRef = useRef(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = (newInitial) => {
    const init = typeof newInitial === 'number' ? newInitial : initialSeconds;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeconds(init);
    setIsRunning(!!autoStart);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          try {
            if (typeof onComplete === 'function') onComplete();
          } catch (e) {
            console.error(e);
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const formatTime = () => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return {
    time: formatTime(),
    seconds,
    isRunning,
    start,
    reset,
    stop,
  };
};
