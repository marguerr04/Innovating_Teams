// src/components/CameraCapture.jsx

import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function CameraCapture({ initialImage, onCapture, buttonText = "Tomar Foto" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(initialImage);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); 
  
  // --- 1. NUEVO ESTADO: Si la cámara falla, mostramos el botón de subir ---
  const [showFallback, setShowFallback] = useState(false);

  // --- 2. MODIFICACIÓN: Separamos la lógica de la cámara ---
  const startCamera = useCallback(async () => {
    // Si ya hay foto o stream, no hacemos nada
    if (photo || stream) return;

    try {
      setError('');
      setShowFallback(false); // Reiniciamos el fallback
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      setStream(newStream);
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setError("No se pudo acceder a la cámara. Sube un archivo en su lugar.");
      // --- 3. ¡PLAN B! Si la cámara falla, activamos el fallback ---
      setShowFallback(true); 
    }
  }, [photo, facingMode, stream]);

  // --- 4. MODIFICACIÓN: El useEffect ahora solo llama a startCamera ---
  useEffect(() => {
    startCamera(); // Intenta iniciar la cámara al cargar

    return () => {
      // Limpieza al desmontar el componente
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera, stream]); // Dependemos de startCamera

  const toggleCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); 
    }
    setStream(null); 
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    setPhoto(null); 
    onCapture(null);
  };

  const takePhoto = () => {
    // ... (Tu función takePhoto está perfecta, no necesita cambios) ...
    if (stream && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); 
      setPhoto(dataUrl);
      onCapture(dataUrl); 
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null); 
    onCapture(null);
    // El useEffect se encargará de reiniciar la cámara
  };

  // --- 5. NUEVA FUNCIÓN: Para manejar la subida de archivo (el fallback) ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setPhoto(base64String);
      onCapture(base64String); // ¡Funciona igual que takePhoto!
    };
    reader.onerror = (err) => {
      console.error("Error al subir archivo:", err);
      setError("No se pudo cargar la imagen.");
    };
  };

  // --- 6. RENDERIZADO MODIFICADO ---

  // Si hay foto, siempre mostrar la foto.
  if (photo) {
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg text-slate-900">
        <div className="w-full max-w-lg rounded-lg overflow-hidden mb-4">
          <img src={photo} alt="Lego Prototipo" className="w-full h-auto object-cover" />
        </div>
        <div className="flex gap-4 mt-2">
          <button 
            onClick={retakePhoto} 
            className="btn bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            ❌ Tomar Otra
          </button>
        </div>
      </div>
    );
  }

  // Si no hay foto, decidimos qué mostrar: Cámara, Fallback o Cargando.
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg text-slate-900">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {showFallback ? (
        // --- 7. VISTA DE FALLBACK (para tu PC) ---
        <div className="w-full max-w-lg aspect-video bg-slate-200 flex flex-col items-center justify-center text-slate-500 rounded-lg mb-4 p-4">
          <p className="mb-4 text-center">La cámara no está disponible.</p>
          <label 
            htmlFor="fileInput" 
            className="btn bg-sky-500 text-white cursor-pointer"
          >
            ⬆️ Subir archivo de imagen
          </label>
          <input 
            type="file" 
            accept="image/*" 
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : stream ? (
        // --- VISTA DE CÁMARA (para la tablet) ---
        <div className="relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          <button 
            onClick={toggleCamera} 
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full text-sm hover:bg-black/70 transition-colors"
            title="Cambiar Cámara"
          >
            🔄
          </button>
        </div>
      ) : (
        // --- VISTA DE CARGA ---
        <div className="w-full max-w-lg aspect-video bg-slate-200 flex items-center justify-center text-slate-500 rounded-lg mb-4">
          Cargando cámara...
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="flex gap-4 mt-2">
        {!photo && stream && !showFallback && (
          <button 
            onClick={takePhoto} 
            className="btn bg-mint-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-mint-600 transition-colors"
          >
            📸 {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}