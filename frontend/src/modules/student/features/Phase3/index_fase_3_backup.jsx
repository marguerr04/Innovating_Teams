// Backup de index.jsx antes de merge manual
// Copia completa del archivo en conflicto para recuperación rápida
export const BACKUP = `
// src/modules/student/features/Phase3/index.jsx
import JuicyButton from '../../../../components/JuicyButton';
import React, { useState, useEffect } from 'react';
// Funcionalidad Google Cloud Storage (tu implementación)
import PrototypeUpload from '../../components/PrototypeUpload';
import useImageManager from '../../../../utils/useImageManager';
// Mejoras visuales del compañero  
import CameraCapture from './components/CameraCapture.jsx';
import Timer from '../../../../components/Timer.jsx';
import PersonaCard from '../Phase2/components/PersonCard';
import ReadOnlyMap from './components/ReadOnlyMap';
import { load, save } from '../../../../utils/helpers.js';

const PHASE_3_DURATION = 600; // 10 minutos

export default function Phase3({ role, isProf, onNext, onBack }) {
  
  const p2 = load('it_phase2_store', null) || {};
  
  // Estados para modales
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const teamId = 1; // Por ahora hardcodeado, después se puede hacer dinámico

  // Hook para gestionar imágenes con Google Cloud Storage
  const {
    imageUrl: existingImageUrl,
    hasImage: hasExistingImage,
    loading: loadingExistingImage,
    error: imageError,
    updateImageData,
    refreshImage,
    clearError
  } = useImageManager(teamId);

  // Estado local para la foto
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

  // Handlers para Google Cloud Storage
  const handleImageUploaded = (result) => {
    setLegoPhoto(result.imageUrl);
    setShowUploadModal(false);
    save('it_lego_photo_url', result.imageUrl);
    updateImageData(result.imageUrl, result.solucionId);
    console.log('Imagen subida exitosamente:', result);
  };

  const handleOpenUpload = () => {
    setShowUploadModal(true);
  };

  const handleRefreshImage = () => {
    refreshImage();
  };

  // Handler para cámara local del compañero
  const handleCameraCapture = (capturedImageUrl) => {
    setLegoPhoto(capturedImageUrl);
    setShowCameraModal(false);
    save('it_lego_photo_url', capturedImageUrl);
  };

  return (
    <div className="max-w-6xl mx-auto"> 
      
      {/* Cabecera con Timer mejorado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Creatividad </h1>
          <p className="text-lg opacity-80 max-w-3xl">
            ¡Tiempo de crear! Usando la <strong>caja de Legos en tu mesa</strong>, 
            construye un prototipo de tu solución para <strong>{p2?.persona?.name || 'la persona'}</strong>. 
            Al terminar, toma una foto de tu creación.
          </p>
        </div>
        
        <div className="card p-4 flex-shrink-0 ml-6">
          <Timer 
            initialSeconds={PHASE_3_DURATION} 
            isProf={isProf}
            autoStart={true} 
            size="small"
          />
        </div>
      </div>
      
      {/* Layout mejorado: Persona + Mapa */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mapa de Empatía y Persona</h2>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Persona</h3>
            <PersonaCard persona={p2?.persona} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Bubble Map</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <ReadOnlyMap persona={p2?.persona} bubbles={p2?.bubbles || []} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de captura con funcionalidad combinada */}
      <div className="card p-6 text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Captura tu Prototipo</h2>
        
        {/* Mensaje de error */}
        {imageError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {imageError}
            <button onClick={clearError} className="ml-2 underline hover:no-underline">
              Cerrar
            </button>
          </div>
        )}

        {/* Botón para abrir el modal de la cámara (estético de compañero) */}
        <JuicyButton 
          color="mint" 
          onClick={() => setShowCameraModal(true)} 
          className="flex items-center gap-2 mx-auto mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {legoPhoto ? '📸 Tomar Otra Foto' : '📸 Tomar Foto'}
        </JuicyButton>

        {/* Indicador de carga */}
        {loadingExistingImage && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 text-sm">
            🔄 Cargando imagen existente del equipo {teamId}...
          </div>
        )}
        
        {/* Mostrar imagen */}
        {legoPhoto ? (
          <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border-4 border-mint-200 mb-4">
            <img 
              src={legoPhoto} 
              alt="Prototipo Lego" 
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.error('Error al cargar imagen:', e);
                setLegoPhoto(null);
                save('it_lego_photo_url', null);
              }}
            />
            {hasExistingImage && legoPhoto === existingImageUrl && (
              <div className="bg-white/90 p-2 text-xs text-slate-600">
                📷 Imagen cargada desde base de datos - Equipo {teamId}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto aspect-video bg-slate-700 flex items-center justify-center text-white/50 rounded-lg text-lg mb-4">
            {loadingExistingImage ? "🔄 Cargando imagen..." : "No hay foto capturada."}
          </div>
        )}
        
        {/* Botones combinados */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Google Cloud Storage */}
          <button 
            onClick={handleOpenUpload} 
            className="btn bg-mint-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-mint-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {legoPhoto ? 'Subir Nueva Foto' : 'Subir Foto (Google Cloud)'}
          </button>

          {/* Cámara local (ya tenemos JuicyButton arriba, repetir como opción) */}
          <JuicyButton color="blue" onClick={() => setShowCameraModal(true)} className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Usar Cámara Local
          </JuicyButton>
          
          {/* Recargar imagen */}
          {hasExistingImage && (
            <button 
              onClick={handleRefreshImage} 
              className="btn bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              🔄 Recargar Imagen
            </button>
          )}
        </div>
        
        {legoPhoto && (
          <p className="text-sm text-slate-600 mt-3">
            ¡Prototipo guardado! Puedes subir una nueva foto si lo necesitas.
          </p>
        )}
        
        <p className="text-xs text-slate-500 mt-2">
          Equipo {teamId} • {hasExistingImage ? 'Con imagen guardada' : 'Sin imagen guardada'}
        </p>
      </div>

      {/* Botones de navegación (estéticos del compañero con JuicyButton) */}
      <div className="flex gap-3 justify-end mb-10">
        <JuicyButton color="gray" onClick={onBack}>← Volver</JuicyButton>
        <JuicyButton color="blue" onClick={onNext}>Continuar a Fase 4 →</JuicyButton>
      </div>

      {/* Modal Google Cloud Storage */}
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
              equipoId={teamId}
              onImageUploaded={handleImageUploaded}
            />
          </div>
        </div>
      )}

      {/* Modal cámara local */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCameraModal(false)} 
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-3xl leading-none z-10"
            >
              &times;
            </button>
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setShowCameraModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
`;
