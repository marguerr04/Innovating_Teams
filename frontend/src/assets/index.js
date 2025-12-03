// src/assets/index.js
// Centralización de rutas de assets para mejor escalabilidad

import { useRef, useCallback } from 'react';

// === SONIDOS ===
export const SOUNDS = {
  // Sonidos de juegos
  games: {
    success: '/assets/sounds/games/success.mp3',
    incorrect: '/assets/sounds/games/incorrect.mp3', 
    button_success: '/assets/sounds/games/button_success.mp3'
  },
  
  // Sonidos de UI
  ui: {
    click: '/assets/sounds/ui/click.mp3',
    click_old: '/assets/sounds/ui/click_old.mp3',
    button_click: '/assets/sounds/ui/button_click.mp3',
    // Nuevo: sonidos de temporizador (agregar archivos en public/assets/sounds/ui/)
    tick: '/assets/sounds/ui/tick.mp3', // reproducido cada segundo en el último minuto
    alarm: '/assets/sounds/ui/alarm.mp3' // reproducido al finalizar el tiempo
  },

  // Sonidos de recompensas (tokens, logros, etc.)
  rewards: {
    tokens: '/assets/sounds/rewards/token-sound.mp3'
  }
};

// === IMÁGENES ===
export const IMAGES = {
  // Logos
  logos: {
    // placeholder para futuros logos
  },
  
  // Imágenes de juegos
  games: {
    // placeholder para futuras imágenes de juegos
  }
};

// === VIDEOS ===
export const VIDEOS = {
  // placeholder para futuros videos
};

// === HOOKS PARA AUDIO ===

// Hook reutilizable para audio
export const useAudio = (src) => {
  const audioRef = useRef(null);

  // Crear instancia de audio lazy
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    return audioRef.current;
  }, [src]);

  const play = useCallback(() => {
    const audio = getAudio();
    try {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => console.warn(`No se pudo reproducir el audio: ${src}`));
      }
    } catch (e) {
      console.warn(`No se pudo reproducir el audio: ${src}`);
    }
  }, [getAudio, src]);

  const pause = () => {
    const audio = getAudio();
    audio.pause();
  };

  const stop = () => {
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
  };

  // Compatibilidad: devolver una función invocable (play)
  // y también exponer métodos auxiliares por si alguien los usa.
  const fn = () => play();
  fn.pause = pause;
  fn.stop = stop;
  return fn;
};