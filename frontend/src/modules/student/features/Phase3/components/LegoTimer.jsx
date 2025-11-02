import React, { useState, useEffect, useRef } from 'react';

import { beep } from '../../../../../utils/helpers.js'; 

export default function LegoTimer({ role, onNext, onBack, onShowMap }) {
  // --- Lógica del Timer ---
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        const next = Math.max(0, s - 1);
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
        if (next === 0) {
          if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
          setRunning(false); 
          lastBeepRef.current = null;
          setTimeout(() => alert('⏱️ ¡Tiempo terminado!'));
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [running]);
  // --- Fin Lógica del Timer ---

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const isProf = role === 'profesor';

  return (
    // JSX de la Card (copiado de index.html)
    <div className="card p-6 flex flex-col items-center">
      {/* 'lego.gif' */}
      <img 
        src="/lego.gif" 
        className="w-[280px] h-[158px] object-cover rounded-xl mb-4" 
        alt="gif lego"
      />
      <div className="text-6xl font-extrabold tracking-widest">{mm}:{ss}</div>
      
      {/* Botones de control */}
      <div className="mt-5 flex gap-2">
        <button className="btn bg-slate-200" onClick={onShowMap}>Ver bubble map</button>
        {isProf && (
          <>
            <button className="btn bg-mint-500 text-white" onClick={() => setRunning(true)}>Iniciar</button>
            <button className="btn bg-slate-100" onClick={() => setRunning(false)}>Pausar</button>
            <button 
              className="btn bg-accent-500 text-white" 
              onClick={() => { setRunning(false); setSeconds(300); lastBeepRef.current = null; }}
            >
              Reiniciar
            </button>
          </>
        )}
      </div>
      
      {!isProf && <div className="text-xs text-slate-500 mt-2">El profesor controla el temporizador.</div>}
      
      {/* Botones de navegación de fase */}
      <div className="mt-6 flex gap-2">
        <button className="btn bg-slate-100" onClick={onBack}>← Volver</button>
        <button className="btn bg-accent-500 text-white" onClick={onNext}>Continuar a Fase 4</button>
      </div>
    </div>
  );
}