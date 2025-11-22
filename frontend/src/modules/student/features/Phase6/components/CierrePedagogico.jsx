import React from 'react';
import JuicyButton from '../../../../../components/JuicyButton';

export default function CierrePedagogico({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      
      {/* 1. Mensaje de Agradecimiento y Cierre */}
      <div className="card p-12 text-center bg-white/95 backdrop-blur-sm shadow-2xl border-white/50 w-full">
        <div className="text-6xl mb-6">🚀</div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-8">
          ¡Gracias por jugar!
        </h2>
        <p className="text-xl md:text-3xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto mb-10">
          Gracias por ser parte de esta experiencia. <br />
          Esperamos que este desafío los motive a integrarse al mundo del 
          <span className="text-mint-600 font-bold"> emprendimiento e innovación</span>.
        </p>

        {/* 2. Botón para ir al Podio */}
        <div className="flex justify-center">
          <JuicyButton 
            color="mint" 
            onClick={onNext} 
            className="text-xl px-12 py-5 shadow-xl hover:scale-105 transition-transform font-bold tracking-wide"
          >
            Ver Resultados y Podio 🏆
          </JuicyButton>
        </div>
      </div>

    </div>
  );
}