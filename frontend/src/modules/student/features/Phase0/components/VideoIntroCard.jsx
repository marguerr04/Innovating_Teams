// VideoIntroCard.jsx
// Componente responsive para alojar el video introductorio con controles
import React, { useEffect, useState, useRef } from 'react';

// General VideoIntroCard: acepta `videoId` (por defecto 15) y `size` ('large'|'medium')
export default function VideoIntroCard({ videoId = 15, size = 'large' }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Iniciar con sonido
  const [showUnmuteButton, setShowUnmuteButton] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const id = videoId;
    const url = `/api/videos/${id}/`;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setVideoUrl(data.url || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Error al cargar video');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId, retry]);

  // Función para intentar autoplay con sonido
  const attemptAutoplay = async () => {
    if (videoRef.current) {
      try {
        // Primero intenta con sonido
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
        setShowUnmuteButton(false);
      } catch (error) {
        // Si falla, intenta sin sonido y muestra botón
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsMuted(true);
          setShowUnmuteButton(true);
        } catch (mutedError) {
          console.log('Autoplay falló completamente:', mutedError);
        }
      }
    }
  };

  // Función para activar/desactivar el sonido
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      setShowUnmuteButton(false); // Ocultar el botón después del primer clic
    }
  };

  // Función para intentar unmute automático después de que el usuario interactúe
  const handleVideoClick = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowUnmuteButton(false);
    }
  };

  // Ajustes de tamaño
  const maxWidthClass = size === 'medium' ? 'max-w-4xl' : 'max-w-5xl';

  return (
    <div className={`w-full mx-auto ${maxWidthClass}`}>
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4 sm:p-6">
        {/* Área de video con relación 16:9 usando aspect-video */}
        <div className="aspect-video w-full grid place-items-center bg-gradient-to-br from-[#1E5AA8] to-[#3AB6B5] text-white/80">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              <p className="text-xl sm:text-2xl font-bold">Cargando intro...</p>
            </div>
          ) : error ? (
            <div className="text-center space-y-2">
              <p className="text-xl sm:text-2xl font-bold">Intro del Juego</p>
              <p className="text-sm sm:text-base opacity-80">{error}</p>
              <button className="btn mt-2 px-3 py-1 text-xs" onClick={() => setRetry(r => r + 1)}>Reintentar</button>
            </div>
          ) : videoUrl ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                muted={isMuted}
                controls
                playsInline
                preload="auto"
                onClick={handleVideoClick}
                onLoadedData={() => {
                  setLoading(false);
                  attemptAutoplay(); // Intentar autoplay con sonido cuando el video se carga
                }}
                onError={() => setError('Error al cargar video')}
              />
              {/* Botón de activar sonido superpuesto */}
              {showUnmuteButton && isMuted && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={toggleMute}
                    className="bg-white/90 hover:bg-white text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.35 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.35l4.033-3.824a1 1 0 011 0zM8 5.432L5.616 7.316A1 1 0 005 8H3v4h2a1 1 0 01.616.316L8 14.568V5.432z" />
                      <path d="M12.2 8.2a1 1 0 011.6 1.2 2 2 0 000 1.2 1 1 0 11-1.6 1.2 4 4 0 000-3.6z" />
                      <path d="M14.2 6.2a1 1 0 011.6 1.2 6 6 0 010 5.2 1 1 0 11-1.6 1.2 4 4 0 000-7.6z" />
                    </svg>
                    <span>Activar Audio</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-xl sm:text-2xl font-bold">Intro del Juego</p>
              <p className="text-sm sm:text-base opacity-80">(Video no disponible)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
