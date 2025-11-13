// src/modules/student/features/Phase3/index.jsx

import React, { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture.jsx'; 
import { load, save } from '../../../../utils/helpers.js'; 
import LegoTimer from './components/LegoTimer';
import MapModal from './components/MapModal';

export default function Phase3({ role, isProf, onNext, onBack }) {
  
  const p2 = load('it_phase2_store', null) || {};
  const [showMap, setShowMap] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [legoPhoto, setLegoPhoto] = useState(() => load('it_lego_photo', null));
  useEffect(() => {
    save('it_lego_photo', legoPhoto);
  }, [legoPhoto]);

  const handlePhotoCapture = (imageDataUrl) => {
    setLegoPhoto(imageDataUrl);
    setShowCameraModal(false); 
  };

  return (
    <div className="max-w-4xl mx-auto text-center"> 
      
      <h1 className="text-3xl font-extrabold mb-1">Fase 3 · Creatividad (Construcción)</h1>
      
      <p className="text-lg opacity-80 mb-4 max-w-2xl mx-auto">
        ¡Tiempo de crear! Usando la <strong>caja de Legos en tu mesa</strong>, 
        construye un prototipo de tu solución para <strong>{p2?.persona?.name || 'la persona'}</strong>. 
        Al terminar, toma una foto de tu creación con el botón de la cámara.
      </p>
      
      <LegoTimer 
        isProf={isProf} 
        onNext={onNext} 
        onBack={onBack} 
        onShowMap={() => setShowMap(true)}
      />

      <div className="mt-8 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Captura tu Prototipo</h2>
        
        {legoPhoto ? (
          <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border-4 border-white mb-4">
            <img src={legoPhoto} alt="Prototipo Lego" className="w-full h-auto object-cover" />
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto aspect-video bg-slate-700 flex items-center justify-center text-white/50 rounded-lg text-lg mb-4">
            No hay foto capturada.
          </div>
        )}
        
        <button 
          onClick={() => setShowCameraModal(true)} 
          className="btn bg-mint-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-mint-600 transition-colors flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {legoPhoto ? 'Tomar Otra Foto' : 'Tomar Foto del Prototipo'}
        </button>
        {legoPhoto && (
          <p className="text-sm text-white/70 mt-3">¡Prototipo guardado! Puedes tomar otra foto si lo necesitas.</p>
        )}
      </div>
      
      {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
      {/* (Volvemos a pasar 'persona' y 'bubbles' por separado) */}
      <MapModal 
        show={showMap} 
        onClose={() => setShowMap(false)} 
        persona={p2?.persona} 
        bubbles={p2?.bubbles || []} 
      />
      {/* --- FIN DE LA CORRECCIÓN --- */}

      {/* Modal de la Cámara (sin cambios) */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <button 
              onClick={() => setShowCameraModal(false)} 
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-3xl leading-none"
            >
              &times;
            </button>
            <CameraCapture
              initialImage={legoPhoto} 
              onCapture={handlePhotoCapture}
              buttonText="Capturar Prototipo Lego"
            />
          </div>
        </div>
      )}
      
    </div>
  );
}