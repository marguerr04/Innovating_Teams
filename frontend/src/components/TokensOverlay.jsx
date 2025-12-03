// src/components/TokensOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import MissyCompanion from './MissyCompanion.jsx';

function getRewardForPhase(n) {
  if (n === 1) return { amount: 4, reason: "¡Primeros en terminar!" };
  if (n >= 2 && n <= 4) return { amount: 1, reason: "¡Excelente trabajo!" };
  if (n === 5) return { amount: 0, reason: "¡Evaluación completada!" };
  return { amount: 0, reason: "¡Fase superada!" };
}

export default function TokensOverlay({ show, phase, onContinue }) {
  const [reward, setReward] = useState({ amount: 0, reason: "" });
  const audioRef = useRef(null);

  useEffect(() => {
    if (show) {
      setReward(getRewardForPhase(phase));
      
      // 1. Sonido
      if(audioRef.current) {
         audioRef.current.currentTime = 0;
         audioRef.current.volume = 0.6;
         audioRef.current.play().catch(()=>{});
      }

      // 2. Confeti (Colores actualizados para combinar con morado)
      const duration = 2500;
      const end = Date.now() + duration;
      const colors = ['#ffffff', '#e9d5ff', '#fcd34d']; // Blanco, Lila, Amarillo

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [show, phase]);

  if (!show) return null;

  return (
    // --- FONDO: MORADO VIBRANTE (bg-violet-600) ---
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-violet-600 animate-in fade-in zoom-in duration-300 origin-center">
      
      {/* TÍTULO */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.15)] mb-8 uppercase tracking-tight animate-bounce">
        ¡Misión Cumplida!
      </h1>

      {/* Contenedor centrado del robot + tarjeta de tokens */}
      <div className="flex items-center justify-center gap-4 mb-8">
        
        {/* ROBOT */}
        <MissyCompanion phase={6} showTokens={true} positioning="relative" />
        
        {/* TARJETA DE TOKENS */}
        {reward.amount > 0 && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border-b-[8px] border-violet-200 shadow-2xl transform transition hover:scale-105 hover:-rotate-2">
            {/* Texto de puntos en morado para combinar */}
            <div className="text-8xl font-black text-violet-600 mb-2 leading-none">
              +{reward.amount}
            </div>
            <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              Tokens
            </div>
          </div>
        )}

      </div>

      {/* MENSAJE (Texto claro sobre fondo oscuro) */}
      <p className="text-2xl md:text-3xl text-violet-100 font-bold mb-12 max-w-2xl leading-tight text-center">
        {reward.reason}
      </p>

      {/* BOTÓN "JUICY" (Color Menta para contrastar con el morado) */}
      <button 
        onClick={onContinue}
        className="
          bg-teal-400 text-teal-900 text-2xl font-extrabold py-5 px-16 rounded-2xl
          border-b-[8px] border-teal-600 
          shadow-[0_10px_20px_rgba(0,0,0,0.25)]
          active:border-b-0 active:translate-y-[8px] active:shadow-none
          transition-all duration-150 hover:bg-teal-300
          uppercase tracking-wide
        "
      >
        Continuar
      </button>

      <audio ref={audioRef} src="/assets/sounds/games/success.mp3" /> 
    </div>
  );
}