// src/modules/student/features/Phase3/index.jsx

import React, { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture.jsx';
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx'; // Usamos el Timer global
// Importamos PersonaCard y ReadOnlyMap directamente
import PersonaCard from '../Phase2/components/PersonCard';
import ReadOnlyMap from './components/ReadOnlyMap';

// Ya no necesitamos MapModal en este archivo si el contenido va directo a la pantalla
// import MapModal from './components/MapModal'; 

const PHASE_3_DURATION = 600; // 10 minutos para esta fase

export default function Phase3({ role, isProf, onNext, onBack }) {
  
  const p2 = load('it_phase2_store', null) || {};
  // const [showMap, setShowMap] = useState(false); // Ya no necesitamos este estado
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
    <div className="max-w-6xl mx-auto"> 
      
      {/* --- CABECERA CON TÍTULO, INSTRUCCIONES Y TIMER --- */}
      <div className="flex justify-between items-start mb-6">
        {/* Columna Izquierda: Título e Instrucciones */}
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Fase 3 · Creatividad (Construcción)</h1>
          <p className="text-lg opacity-80 max-w-3xl">
            ¡Tiempo de crear! Usando la <strong>caja de Legos en tu mesa</strong>, 
            construye un prototipo de tu solución para <strong>{p2?.persona?.name || 'la persona'}</strong>. 
            Al terminar, toma una foto de tu creación.
          </p>
        </div>
        
        {/* Columna Derecha: Timer (pequeño) */}
        <div className="card p-4 flex-shrink-0 ml-6">
          <Timer 
            initialSeconds={PHASE_3_DURATION} 
            isProf={isProf}
            autoStart={true} 
            size="small" // Usamos el tamaño pequeño
          />
        </div>
      </div>
      
      {/* --- NUEVO LAYOUT: CONTEXTO (Persona + Mapa) en pantalla completa --- */}
      <div className="card p-6 mb-8"> {/* Añadimos un margin-bottom para separarlo del botón de la cámara */}
        
        {/* Título (como en image_67c476.png) */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mapa de Empatía y Persona</h2>

        {/* --- Layout de dos columnas para Persona y Bubble Map --- */}
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          
          {/* Columna Izquierda: Persona */}
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Persona</h3>
            <PersonaCard persona={p2?.persona} />
          </div>

          {/* Columna Derecha: Bubble Map */}
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Bubble Map</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <ReadOnlyMap persona={p2?.persona} bubbles={p2?.bubbles || []} />
            </div>
          </div>
        </div>
      </div>
      
      {/* --- SECCIÓN DE CAPTURA DE PROTOTIPO (debajo de Persona + Mapa) --- */}
      <div className="card p-6 text-center mb-8"> {/* mb-8 para separar de los botones de navegación */}
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Captura tu Prototipo</h2>
        
        {/* Botón para abrir el modal de la cámara */}
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
          <p className="text-sm text-slate-600 mt-3">¡Prototipo guardado! Puedes tomar otra foto si lo necesitas.</p>
        )}
      </div>

      {/* --- BOTONES DE NAVEGACIÓN --- */}
      <div className="flex gap-3 justify-end mb-10"> {/* Añadimos mb-10 para espacio inferior */}
        <button className="btn bg-slate-100" onClick={onBack}>← Volver</button>
        <button className="btn bg-accent-500 text-white" onClick={onNext}>Continuar a Fase 4</button>
      </div>
      
      {/* Ya no usamos MapModal en este archivo, su contenido ahora está directamente en la página. */}
      {/* Puedes eliminar el archivo MapModal.jsx si ya no lo usas en ninguna otra parte. */}

      {/* Modal de Cámara (sin cambios, se abre con el botón "Tomar Foto") */}
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
