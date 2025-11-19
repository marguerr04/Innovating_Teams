import React, { useEffect, useState } from 'react';

export default function VideoTest() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/videos/')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        // mostrar solo videos globales (partida === null)
        const global = data.filter((v) => v.partida === null);
        setVideos(global);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="p-4">Cargando videos...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Prueba de Videos (Globales)</h2>
      {videos.length === 0 && <div>No hay videos globales.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((v) => (
          <div key={v.id} className="border rounded-lg p-3 shadow-sm">
            <div className="mb-2 font-semibold">{v.nombrevideo}</div>
            <div className="bg-black flex items-center justify-center">
              <video
                controls
                width="100%"
                style={{ maxHeight: 360, objectFit: 'contain' }}
              >
                <source src={v.url} type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>
            <div className="mt-2 text-sm text-gray-600 truncate">{v.url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
