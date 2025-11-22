import React, { useState } from 'react';
import VideoIntroCard from './components/VideoIntroCard.jsx';
import JuicyButton from '../../../../components/JuicyButton';

export default function Phase0({ onStart }) {
  const [stage, setStage] = useState('video');

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center gap-8">
      {stage === 'video' && (
        <>
          <VideoIntroCard />
          <div className="fixed bottom-6 right-6 z-30">
            <JuicyButton 
              color="gray" 
              onClick={() => setStage('start')}
              className="text-sm"
            >
              Saltar introducción
            </JuicyButton>
          </div>
        </>
      )}

      {stage === 'start' && (
        <>
          {/* CAMBIO: Textos mucho más grandes (text-4xl a 6xl en titulo, xl a 3xl en texto) */}
          <div className="w-full text-center max-w-4xl px-6 mb-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
              ¡Bienvenido a tu Misión!
            </h2>
            <p className="text-white/90 text-xl md:text-3xl leading-relaxed drop-shadow-sm font-medium">
              Hoy te convertirás en un innovador. Tu objetivo es encontrar una <span className="text-mint-300">solución real</span> para una persona que la necesita.
              <br className="hidden md:block" /> ¿Estás listo para conocer a tu equipo?
            </p>
          </div>
          
          <div className="fixed bottom-8 right-8 z-30">
            <JuicyButton 
              color="mint" 
              onClick={onStart}
              className="shadow-2xl text-xl px-8 py-4" // Botón también un poco más grande
            >
              Comenzar Misión 🚀
            </JuicyButton>
          </div>
        </>
      )}
    </div>
  );
}