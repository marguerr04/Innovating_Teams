// VideoIntroCard.jsx
// Componente responsive para alojar el video introductorio (placeholder por ahora)
import React from 'react';

export default function VideoIntroCard() {
  return (
    <div className="w-full mx-auto max-w-5xl">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4 sm:p-6">
        {/* Área de video con relación 16:9 usando aspect-video */}
        <div className="aspect-video w-full grid place-items-center bg-gradient-to-br from-[#1E5AA8] to-[#3AB6B5] text-white/80">
          <div className="text-center space-y-2">
            <p className="text-xl sm:text-2xl font-bold">Intro del Juego</p>
            <p className="text-sm sm:text-base opacity-80">(Video pendiente de integrar)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
