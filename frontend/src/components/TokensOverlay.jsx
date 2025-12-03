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

const TOKEN_VIDEO_MAP = {
  1: '/assets/videos/coins/1_coin.webm',
  2: '/assets/videos/coins/2_coin.webm',
  3: '/assets/videos/coins/3_coin.webm',
  4: '/assets/videos/coins/4_coin.webm',
};

export default function TokensOverlay({ show, phase, onContinue }) {
  const [reward, setReward] = useState({ amount: 0, reason: "" });
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const videoSrc = show ? (TOKEN_VIDEO_MAP[reward.amount] || null) : null;

  useEffect(() => {
    if (!show || !videoSrc) return;

    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;

    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    let rafId;

    const ensureCanvasSize = () => {
      if (!videoEl.videoWidth || !videoEl.videoHeight) return;
      if (canvasEl.width !== videoEl.videoWidth || canvasEl.height !== videoEl.videoHeight) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }
    };

      const tryPlay = () => {
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {});
        }
      };

      tryPlay();

    const renderFrame = () => {
      if (videoEl.readyState >= 2) {
        ensureCanvasSize();
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
          ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        try {
          const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
          const data = frame.data;
          const threshold = 28; // remove near-black pixels
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] < threshold && data[i + 1] < threshold && data[i + 2] < threshold) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (err) {
          // getImageData might fail on cross-origin media; fallback by keeping frame as-is
        }
      }
      rafId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    };
  }, [show, videoSrc]);

  const handleVideoMetadata = () => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;
    if (videoEl.videoWidth && videoEl.videoHeight) {
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
    }
  };

  if (!show) return null;

  return (
    // --- FONDO: MORADO VIBRANTE (bg-violet-600) ---
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-violet-600 animate-in fade-in zoom-in duration-300 origin-center">
      
      {/* TÍTULO */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.15)] mb-8 uppercase tracking-tight animate-bounce">
        ¡Misión Cumplida!
      </h1>

      {/* Contenedor centrado del robot + tarjeta de tokens */}
      <div className="flex items-center justify-center gap-8 flex-wrap mb-8">
        {videoSrc && (
          <div
            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center drop-shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
            />
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate nofullscreen"
              className="absolute inset-0 opacity-0 pointer-events-none select-none"
              onLoadedMetadata={handleVideoMetadata}
            />
          </div>
        )}

        {/* TARJETA DE TOKENS */}
        {reward.amount > 0 && (
          <div className="bg-white rounded-[2.75rem] p-10 md:p-14 border-b-[10px] border-violet-200 shadow-2xl transform transition hover:scale-105 hover:-rotate-2">
            <div className="text-9xl font-black text-violet-600 mb-4 leading-none">
              +{reward.amount}
            </div>
            <div className="text-2xl font-bold text-slate-400 uppercase tracking-[0.4em]">
              Tokens
            </div>
          </div>
        )}

        {/* ROBOT */}
        <MissyCompanion phase={6} showTokens={true} positioning="relative" />
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