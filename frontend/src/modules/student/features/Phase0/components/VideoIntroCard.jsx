// VideoIntroCard.jsx
// Componente responsive para alojar el video introductorio (placeholder por ahora)
import React, { useEffect, useState, useRef } from 'react';

// General VideoIntroCard: acepta `videoId` (por defecto 15) y `size` ('large'|'medium')
export default function VideoIntroCard({ videoId = 15, size = 'large' }) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
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
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              controls
              playsInline
              preload="auto"
              onLoadedData={() => setLoading(false)}
              onError={() => setError('Error al cargar video')}
            />
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
