// src/modules/student/features/Phase6/components/PodioFinal.jsx
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti'; // Importa la librería

// Constantes del podio (de index.html)
const targetHeights = [230, 190, 160, 125];
const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#F472B6'];
const order = [1, 0, 2, 3]; // Define el orden visual (2do, 1ro, 3ro, 4to)

export default function PodioFinal({ baseTeams, onNext, onBack }) {
  const [animateBars, setAnimateBars] = useState(false);
  const audioRef = useRef(null);

  // Efecto para disparar la animación y el confeti (de index.html)
  useEffect(() => {
    // Activa la animación CSS de las barras
    const animTimer = setTimeout(() => setAnimateBars(true), 80);
    
    // Dispara sonido y confeti
    const sfxTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      // Lanza el confeti (usando la librería npm)
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 500);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(sfxTimer);
    };
  }, []); // Se ejecuta solo una vez, cuando el componente se monta

  const winner = baseTeams[0];

  return (
    <div className="max-w-6xl mx-auto">
      {/* (Asegúrate de que 'crowd-cheer.mp3' esté en /public/assets/sounds) */}
      <audio ref={audioRef} src="/assets/sounds/crowd-cheer.mp3" preload="auto" className="hidden"></audio>
      
      <h1 className="text-3xl font-extrabold mb-2">Ranking por Tokens</h1>
      <div className="card p-6 relative overflow-hidden">
        <p className="text-slate-500 mb-6">Clasificación final de equipos según tokens obtenidos.</p>
        
        {/* Podio animado (de index.html) */}
        <div className="flex flex-wrap items-end justify-center gap-6 min-h-[250px]">
          {baseTeams.map((team, idx) => (
            <div key={team.name} className="flex flex-col items-center gap-2" style={{ order: order[idx] }}>
              <div className="text-sm font-semibold text-slate-700 min-h-[2rem] text-center">{team.name}</div>
              <div
                className={`rounded-2xl w-[140px] flex items-end justify-center pb-6 shadow-xl transition-all duration-1000 ${
                  animateBars && idx === 0 ? 'podio-glow' : '' // Aplica 'podio-glow' solo al ganador
                }`}
                style={{
                  background: colors[idx],
                  height: animateBars ? `${targetHeights[idx]}px` : '0px'
                }}
              >
                <span className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">{idx + 1}</span>
              </div>
              <div className="bg-slate-800 text-white text-xs px-4 py-1 rounded-full shadow">{team.tokens} tokens</div>
            </div>
          ))}
        </div>
        
        {/* Banner de Ganador (de index.html) */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-amber-900">
          <span>🏆</span>
          <span className="font-semibold">Ganador:</span>
          <span className="font-bold">{winner.name}</span>
          <span>· {winner.tokens} tokens</span>
        </div>
        
        {/* Tabla de Ranking (de index.html) */}
        <div className="mt-6 bg-slate-50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2 w-12">#</th>
                <th className="text-left px-4 py-2">Equipo</th>
                <th className="text-right px-4 py-2">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {baseTeams.map((t, i) => (
                <tr key={t.name} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-semibold">{i + 1}.</td>
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2 text-right">
                    <span className="inline-block bg-slate-900 text-white text-xs px-3 py-1 rounded-full">{t.tokens} tokens</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Navegación (de index.html) */}
        <div className="mt-6 flex gap-3">
          <button onClick={() => { setAnimateBars(false); onBack(); }} className="btn bg-slate-100 text-slate-700">
            ← Volver al mensaje
          </button>
          <button onClick={onNext} className="btn bg-sea-500 text-white hover:bg-sea-600">
            Continuar a Fase 7 →
          </button>
        </div>
      </div>
    </div>
  );
}