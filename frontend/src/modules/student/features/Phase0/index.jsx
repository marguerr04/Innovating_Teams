import React, { useState } from 'react';
import VideoIntroCard from './components/VideoIntroCard.jsx';
import JuicyButton from '../../../../components/JuicyButton'; // <--- Importar

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
          <div className="w-full text-center text-white/60 text-sm"></div>
          <div className="fixed bottom-6 right-6 z-30">
            <JuicyButton 
              color="mint" 
              onClick={onStart}
              className="shadow-xl"
            >
              Comenzar juego 🚀
            </JuicyButton>
          </div>
        </>
      )}
    </div>
  );
}