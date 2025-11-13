// src/components/CameraCapture.jsx

import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ initialImage, onCapture, buttonText = "Tomar Foto" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(initialImage);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); 

  useEffect(() => {
    // Si ya tenemos una foto, no iniciamos la cámara automáticamente.
    // También si el stream ya está corriendo.
    if (photo || stream) return;

    const startCamera = async () => {
      try {
        setError('');
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode } 
        });
        if (videoRef.current) { // Asegurarse de que videoRef.current no sea null
          videoRef.current.srcObject = newStream;
          await videoRef.current.play();
        }
        setStream(newStream);
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara. Asegúrate de haber dado permiso.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [photo, facingMode, stream]);

  const toggleCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); 
    }
    setStream(null); 
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    setPhoto(null); 
    onCapture(null); // Notificar al padre que la foto actual se ha borrado
  };

  const takePhoto = () => {
    if (stream && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); 
      setPhoto(dataUrl);
      onCapture(dataUrl); // Llamar al callback con la foto
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null); 
    onCapture(null); // Informar que la foto ha sido borrada
    // El useEffect se encargará de reiniciar la cámara
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg text-slate-900">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!photo && stream ? (
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
      ) : photo ? (
        // Cuando hay foto, no mostramos el video
        <div className="w-full max-w-lg rounded-lg overflow-hidden mb-4">
          <img src={photo} alt="Lego Prototipo" className="w-full h-auto object-cover" />
        </div>
      ) : (
        <div className="w-full max-w-lg aspect-video bg-slate-200 flex items-center justify-center text-slate-500 rounded-lg mb-4">
          Cargando cámara...
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="flex gap-4 mt-2">
        {!photo && stream && (
          <button 
            onClick={takePhoto} 
            className="btn bg-mint-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-mint-600 transition-colors"
          >
            📸 {buttonText}
          </button>
        )}
        {photo && (
          <button 
            onClick={retakePhoto} 
            className="btn bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            ❌ Tomar Otra
          </button>
        )}
      </div>
    </div>
  );
}