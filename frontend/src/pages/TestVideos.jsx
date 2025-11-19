import React, { useEffect, useState } from 'react';

export default function TestVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos/')
      .then((res) => res.json())
      .then((data) => {
        // mostrar sólo videos globales (partida === null)
        const global = data.filter((v) => v.partida === null);
        setVideos(global);
      })
      .catch((err) => {
        console.error('Error fetching videos', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 12 }}>Prueba de Videos (Globales)</h2>
      {loading && <p>Cargando videos...</p>}
      {!loading && videos.length === 0 && <p>No hay videos globales.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {videos.map((v) => (
          <div key={v.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' }}>
            <h4 style={{ margin: '6px 0' }}>{v.nombrevideo}</h4>
            <video controls width="100%" style={{ maxHeight: 360, objectFit: 'cover' }}>
              <source src={v.url} type="video/mp4" />
              Tu navegador no soporta video.
            </video>
            <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>{v.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
