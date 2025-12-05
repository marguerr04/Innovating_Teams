// src/components/PhaseIntro.jsx

import React, { useState, useEffect, useRef } from 'react';
import { SOUNDS, useAudio } from '../assets/index.js';

const PHASE_IMAGES = {
  teamwork: '/assets/images/instructions/trabajo_equipo.png',
  empathy: '/assets/images/instructions/empatia.png',
  creativity: '/assets/images/instructions/creatividad.png',
  communication: '/assets/images/instructions/comunicacion.png',
  feedback: '/assets/images/instructions/feedback.png'
};

const PHASE_ILLUSTRATIONS = {
  1: { src: PHASE_IMAGES.teamwork, alt: 'Ilustración trabajo en equipo' },
  2: { src: PHASE_IMAGES.empathy, alt: 'Ilustración empatía' },
  3: { src: PHASE_IMAGES.creativity, alt: 'Ilustración creatividad' },
  4: { src: PHASE_IMAGES.communication, alt: 'Ilustración comunicación' },
  5: { src: PHASE_IMAGES.feedback, alt: 'Ilustración evaluación y feedback' },
};

const INTRO_DATA = {
  1: { 
    habilidad: "Trabajo en equipo", 
    lema: "Misión: Sincronización de Equipo", 
    texto: "Agentes, su primera misión es coordinarse. Tienen poco tiempo para tomar decisiones en conjunto. ¿Lograrán ponerse de acuerdo?" 
  },
  2: { 
    habilidad: "Empatía", 
    lema: "Misión: Infiltración y Análisis", 
    texto: "Deben investigar a su usuario objetivo. Descubran qué piensa y qué siente para detectar sus verdaderos problemas." 
  },
  3: { 
    habilidad: "Creatividad", 
    lema: "Misión: Construcción de Prototipo", 
    texto: "No busquen la idea perfecta, busquen la más innovadora. Tienen autorización para experimentar y construir con los materiales disponibles." 
  },
  4: { 
    habilidad: "Comunicación", 
    lema: "Misión: Transmisión del Mensaje", 
    texto: "El mundo debe conocer su solución. Preparen un mensaje claro y contundente para convencer a la audiencia." 
  },
  5: { 
    habilidad: "Evaluación", 
    lema: "Misión: Reporte de Inteligencia", 
    texto: "Analicen el desempeño de los otros equipos. Su retroalimentación es vital para mejorar las soluciones globales." 
  }
};

const TOTAL_DURATION = 30000; // 30 segundos

export default function PhaseIntro({ phase, onDone }) {
  const [isVisible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const data = INTRO_DATA[phase];
  const illustration = PHASE_ILLUSTRATIONS[phase];
  const notifiedRef = useRef(false);
  const playMagic = useAudio(SOUNDS.games.magic);

  useEffect(() => {
    // Sonido mágico una sola vez al mostrar la intro
    playMagic();

    // Secuencia de entrada
    const bgTimer = setTimeout(() => setVisible(true), 10);
    const cardTimer = setTimeout(() => setShowContent(true), 240);
    
    // Barra de progreso
    const start = performance.now();
    const tick = (t) => {
      const r = Math.min(1, (t - start) / TOTAL_DURATION);
      setProgress(r * 100);
      if (r < 1) timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);

    // Cierre automático
    const autoCloseTimer = setTimeout(() => notify("auto"), TOTAL_DURATION);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(cardTimer);
      clearTimeout(autoCloseTimer);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
    // Nota: playMagic es estable para este uso; omitimos dependencia para evitar re-ejecuciones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = (reason) => {
    // Si ya fue notificado, no hacer nada (evita disparos fantasma)
    if (notifiedRef.current) return;
    notifiedRef.current = true;

    setVisible(false); 
    
    setTimeout(() => {
      onDone(phase);
    }, 600); 
  };

  if (!data) return null;

  return (
    // --- CONTENEDOR PRINCIPAL (Fondo oscuro + Centrado) ---
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'bg-slate-900/90 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      
      {/* --- TARJETA GRANDE --- */}
      {/* Cambios clave aquí:
          - w-full max-w-6xl: Mucho más ancha en PC.
          - min-h-[60vh]: Altura mínima considerable.
          - p-8 md:p-16: Mucho espacio interno (padding).
      */}
      <div 
        className={`
          relative w-full max-w-6xl min-h-[50vh] bg-[#0f1f36] border-4 border-slate-700/50 
          rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-center
          transition-all duration-700 transform
          ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}
        `}
      >
        {/* Barra de Progreso Superior */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-mint-400 transition-all ease-linear" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Botón Saltar (móvil) */}
        <button 
          className="absolute top-8 right-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold rounded-xl transition-colors border border-slate-600 lg:hidden"
          onClick={() => notify("skip")}
        >
          Saltar Intro ⏭
        </button>

        {/* Controles top-right en escritorio */}
        <div className="hidden lg:flex absolute top-6 right-6 flex-col items-end gap-4">
          <button 
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold rounded-xl transition-colors border border-slate-600"
            onClick={() => notify("skip")}
          >
            Saltar Intro ⏭
          </button>
          {illustration && (
            <div className="w-40 h-40 xl:w-48 xl:h-48 bg-slate-900/30 border border-slate-700 rounded-[1.75rem] shadow-inner backdrop-blur-sm pointer-events-none flex items-center justify-center">
              <img src={illustration.src} alt={illustration.alt} className="max-w-full max-h-full object-contain" loading="lazy" />
            </div>
          )}
        </div>

        {/* --- CONTENIDO --- */}
        <div className="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:gap-10 justify-center h-full">
          <div className="flex-1">
          
          {/* Badge de Fase (Más grande) */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-mint-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse"></span>
            <span className="text-xl md:text-2xl font-bold text-slate-400 tracking-widest uppercase">
              Misión {phase} de 5
            </span>
          </div>

          {/* Habilidad (Título Principal - GIGANTE) */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            {data.habilidad}
          </h1>

          {/* Lema (Subtítulo - Grande y colorido) */}
          <div className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-mint-300 mb-8 italic">
            "{data.lema}"
          </div>

          {/* Texto descriptivo (Cuerpo - Muy legible) */}
          <p className="text-xl md:text-3xl text-slate-300 leading-relaxed max-w-5xl font-medium">
            {data.texto}
          </p>

          {/* Nota al pie */}
          <div className="mt-12 text-slate-500 text-base md:text-lg font-semibold">
            ℹ️ La transmisión finalizará automáticamente en unos segundos...
          </div>
          </div>

          {illustration && (
            <div className="lg:hidden mt-10 flex justify-center">
              <div className="w-48 h-48 bg-slate-900/40 border border-slate-700 rounded-[1.75rem] shadow-inner flex items-center justify-center">
                <img src={illustration.src} alt={illustration.alt} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}