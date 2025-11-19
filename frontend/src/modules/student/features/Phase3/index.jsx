// src/modules/student/features/Phase3/index.jsx

import React, { useState, useEffect } from 'react';
import PrototypeUpload from '../../components/PrototypeUpload';
import useImageManager from '../../../../utils/useImageManager';
import { load, save } from '../../../../utils/helpers.js'; 
import LegoTimer from './components/LegoTimer';
import MapModal from './components/MapModal';

export default function Phase3({ role, isProf, onNext, onBack }) {
  
  const p2 = load('it_phase2_store', null) || {};
  const [showMap, setShowMap] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const teamId = 1; // Por ahora hardcodeado, después se puede hacer dinámico

  // Usar el hook para gestionar imágenes
  const {
    imageUrl: existingImageUrl,
    hasImage: hasExistingImage,
    loading: loadingExistingImage,
    error: imageError,
    updateImageData,
    refreshImage,
    clearError
  } = useImageManager(teamId);

  // Estado local para la foto (mantenemos compatibilidad con funcionalidad existente)
  const [legoPhoto, setLegoPhoto] = useState(() => load('it_lego_photo_url', null));

  // Sincronizar con imagen existente cuando se carga
  useEffect(() => {
    if (hasExistingImage && existingImageUrl && !legoPhoto) {
      setLegoPhoto(existingImageUrl);
      save('it_lego_photo_url', existingImageUrl);
    }
  }, [hasExistingImage, existingImageUrl, legoPhoto]);

  useEffect(() => {
    save('it_lego_photo_url', legoPhoto);
  }, [legoPhoto]);

  // Handlers para subida de imagen
  const handleImageUploaded = (result) => {
    setLegoPhoto(result.imageUrl);
    setShowUploadModal(false);
    save('it_lego_photo_url', result.imageUrl);
    
    // Actualizar el hook con la nueva imagen
    updateImageData(result.imageUrl, result.solucionId);
    
    console.log('Imagen subida exitosamente:', result);
  };

  const handleOpenUpload = () => {
    setShowUploadModal(true);
  };

  const handleRefreshImage = () => {
    refreshImage();
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
        
        {/* Mensaje de error si existe */}
        {imageError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {imageError}
            <button 
              onClick={clearError}
              className="ml-2 underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}
        
        {/* Indicador de carga */}
        {loadingExistingImage && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 text-sm">
            🔄 Cargando imagen existente del equipo {teamId}...
          </div>
        )}
        
        {/* Mostrar imagen (ya sea existente o nueva) */}
        {legoPhoto ? (
          <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border-4 border-white mb-4">
            <img 
              src={legoPhoto} 
              alt="Prototipo Lego" 
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.error('Error al cargar imagen:', e);
                // Si hay error cargando imagen, limpiar estado
                setLegoPhoto(null);
                save('it_lego_photo_url', null);
              }}
            />
            {/* Información adicional si es imagen existente */}
            {hasExistingImage && legoPhoto === existingImageUrl && (
              <div className="bg-white/90 p-2 text-xs text-slate-600">
                📷 Imagen cargada desde base de datos - Equipo {teamId}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto aspect-video bg-slate-700 flex items-center justify-center text-white/50 rounded-lg text-lg mb-4">
            {loadingExistingImage ? (
              "🔄 Cargando imagen..."
            ) : (
              "No hay foto capturada."
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button 
            onClick={handleOpenUpload} 
            className="btn bg-mint-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-mint-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {legoPhoto ? 'Subir Nueva Foto' : 'Tomar Foto del Prototipo'}
          </button>
          
          {/* Botón de recargar imagen existente */}
          {hasExistingImage && (
            <button 
              onClick={handleRefreshImage} 
              className="btn bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              🔄 Recargar Imagen
            </button>
          )}
        </div>
        
        {legoPhoto && (
          <p className="text-sm text-white/70 mt-3">
            ¡Prototipo guardado! Puedes subir una nueva foto si lo necesitas.
          </p>
        )}
        
        {/* Información del equipo */}
        <p className="text-xs text-white/50 mt-2">
          Equipo {teamId} • {hasExistingImage ? 'Con imagen guardada' : 'Sin imagen guardada'}
        </p>
      </div>
      
      {/* Modal para ver el mapa de bubbles */}
      <MapModal 
        show={showMap} 
        onClose={() => setShowMap(false)} 
        persona={p2?.persona} 
        bubbles={p2?.bubbles || []} 
      />

      {/* Modal de subida de imágenes */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowUploadModal(false)} 
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-3xl leading-none z-10"
            >
              &times;
            </button>
            <PrototypeUpload
              equipoId={1}
              onImageUploaded={handleImageUploaded}
            />
          </div>
        </div>
      )}
      
    </div>
  );
}