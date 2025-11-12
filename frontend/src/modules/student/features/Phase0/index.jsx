// Phase0 index.jsx
// Maneja dos pantallas: video introductorio y pantalla para comenzar juego
import React, { useState } from 'react';
import VideoIntroCard from './components/VideoIntroCard.jsx';

export default function Phase0({ onStart }) {
  const [stage, setStage] = useState('video'); // 'video' | 'start'

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center gap-8">
      {stage === 'video' && (
        <>
          <VideoIntroCard />
          {/* Botón Saltar introducción */}
          <button
            onClick={() => setStage('start')}
            className="fixed bottom-6 right-6 z-30 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl backdrop-blur border border-white/25 shadow-lg transition"
          >
            Saltar introducción
          </button>
        </>
      )}

      {stage === 'start' && (
        <>
          {/* Pantalla vacía de espera */}
          <div className="w-full text-center text-white/60 text-sm">
            {/* Puedes agregar contenido aquí más adelante */}
          </div>
          <button
            onClick={onStart}
            className="fixed bottom-6 right-6 z-30 bg-[#3AB6B5]/70 hover:bg-[#3AB6B5]/85 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition backdrop-blur-sm"
          >
            Comenzar juego
          </button>
        </>
      )}
    </div>
  );
}
