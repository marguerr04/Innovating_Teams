// Archivo: src/components/InstructionsModal.jsx

import React, { useState, useRef, useEffect } from 'react';

const instructionImages = {
  teamwork: '/assets/images/instructions/trabajo_equipo.png',
  empathy: '/assets/images/instructions/empatia.png',
  creativity: '/assets/images/instructions/creatividad.png',
  communication: '/assets/images/instructions/comunicacion.png',
  feedback: '/assets/images/instructions/feedback.png'
};

// 1. Pega el array 'stages' de tu index.html
const stages = [
  {
    short: "1",
    title: "Etapa 1: Habilidad de Equipo (5 minutos)",
    duration: "5 minutos",
    skill: "Comunicación efectiva",
    rule: "Tokens por orden de finalización: 1° 4, 2° 3, 3° 2, 4° 1.",
    illustration: { src: instructionImages.teamwork, alt: 'Ilustración trabajo en equipo' },
    body: `
      <p><strong>Objetivo:</strong> Poner a prueba la capacidad de colaboración y comunicación del equipo.</p>
      <p><strong>Dinámica:</strong> El equipo elige cómo iniciará la dinámica:</p>
      <ul class="list-disc list-inside space-y-1 mt-1">
        <li><strong>Opción A: Nos conocemos.</strong> Realizarán un juego corto donde los grupos votan y la opción más votada es la que se juega.</li>
        <li><strong>Opción B: No nos conocemos.</strong> Harán una breve presentación personal y luego votarán para jugar.</li>
      </ul>
      <p class="mt-2"><strong>Cronómetro:</strong> visible de 5 minutos.</p>
      <p><strong>Habilidad clave:</strong> Comunicación efectiva. <span class="text-slate-500 text-xs">Importancia: asegura que los integrantes coordinen acciones y escuchen bajo presión de tiempo.</span></p>
      <p class="mt-2"><strong>Tokens (por orden de finalización):</strong></p>
      <ul class="list-disc list-inside space-y-1 mt-1">
        <li>1° equipo en terminar: 4 tokens (máximo)</li>
        <li>2° equipo en terminar: 3 tokens</li>
        <li>3° equipo en terminar: 2 tokens</li>
        <li>4° equipo en terminar: 1 token</li>
      </ul>
    `
  },
  {
    short: "2",
    title: "Etapa 2: Desafío y Empatía (8 minutos)",
    duration: "8 minutos",
    skill: "Empatía",
    rule: "1 token si se completa dentro del tiempo.",
    illustration: { src: instructionImages.empathy, alt: 'Ilustración empatía' },
    body: `
      <p><strong>Objetivo:</strong> Seleccionar un problema y caracterizar a la persona que lo vive.</p>
      <p><strong>Dinámica:</strong></p>
      <ul class="list-disc list-inside space-y-1 mt-1">
        <li>Elegir una temática: <strong>Salud</strong>, <strong>Sustentabilidad</strong> o <strong>Educación</strong>.</li>
        <li>Seleccionar un desafío asociado que ya trae una breve explicación del problema.</li>
        <li>Ese desafío incluye una <strong>persona afectada</strong> (con nombre y edad) para que el equipo se centre en ella.</li>
        <li>Completar el <strong>Bubble Map</strong> caracterizando a esa persona: perfil, entorno, emociones, necesidades, limitaciones, motivaciones.</li>
      </ul>
      <p class="mt-2"><strong>Cronómetro:</strong> visible de 8 minutos.</p>
      <p><strong>Habilidad clave:</strong> Empatía. <span class="text-slate-500 text-xs">Importancia: permite diseñar soluciones centradas en las personas y no solo en la idea.</span></p>
      <p class="mt-2"><strong>Tokens:</strong> el equipo gana <strong>1 token</strong> por completar la etapa dentro del tiempo.</p>
    `
  },
  {
    short: "3",
        title: "Etapa 3: Creatividad (10 minutos)",
        duration: "10 minutos",
        skill: "Pensamiento creativo y prototipado",
        rule: "1 token si se completa dentro del tiempo.",
        illustration: { src: instructionImages.creativity, alt: 'Ilustración creatividad' },
        body: `
          <p><strong>Objetivo:</strong> Conceptualizar una solución mediante el prototipado.</p>
          <p><strong>Dinámica:</strong> Construir una solución usando <strong>LEGO físico</strong> a partir del problema elegido en la etapa anterior.</p>
          <p><strong>Evidencia (opcional):</strong> el equipo puede subir o registrar una foto de su prototipo para dejar evidencia.</p>
          <p><strong>Cronómetro:</strong> visible de 10 minutos.</p>
          <p><strong>Habilidad clave:</strong> Pensamiento creativo y prototipado. <span class="text-slate-500 text-xs">Importancia: fomenta que los estudiantes creen, iteren y materialicen ideas en poco tiempo.</span></p>
          <p class="mt-2"><strong>Tokens:</strong> el equipo gana <strong>1 token</strong> por completar la etapa dentro del tiempo establecido.</p>
        `
  },
  {
    short: "4",
        title: "Etapa 4: Comunicación (6 minutos)",
        duration: "6 minutos + pitch 90s",
        skill: "Habilidad de comunicación",
        rule: "1 token si se completa dentro del tiempo.",
        illustration: { src: instructionImages.communication, alt: 'Ilustración comunicación' },
        body: `
          <p><strong>Objetivo:</strong> Entrenar la habilidad de presentar la idea de forma clara y concisa (pitch).</p>
          <p><strong>Dinámica:</strong> Preparar un pitch de <strong>90 segundos</strong>. El sistema muestra una guía con la estructura del pitch:</p>
          <ul class="list-disc list-inside space-y-1 mt-1">
            <li>Equipo: Cuéntanos cómo se llama tu emprendimiento</li>
            <li>Desafío y empatía: Expongan cuál es el desafío que están abordando y den a conocer a la
persona que enfrenta el desafío, destacando sus características</li>
            <li>Creatividad: Muéstranos la solución para el desafío utilizando la creación con los legos</li>
            <li>Comunicación: Hagan el pitch de una manera atractiva, cierra invitando a apoyar tu
emprendimiento</li>
          </ul>
          <p class="mt-2"><strong>Cronómetro de preparación:</strong> máximo 6 minutos.</p>
          <p><strong>Habilidad clave:</strong> Habilidad de comunicación. <span class="text-slate-500 text-xs">Importancia: permite contar el valor de la idea para que otros la entiendan y la evalúen.</span></p>
          <p class="mt-2"><strong>Tokens:</strong> el equipo gana <strong>1 token</strong> por completar la etapa dentro del tiempo.</p>
        `
  },
  {
    short: "5",
        title: "Etapa 5: Evaluación entre equipos (variable)",
        duration: "Variable",
        skill: "Pensamiento crítico y feedback",
        rule: "1 token por participar + ranking (5, 4, 3, 2).",
        illustration: { src: instructionImages.feedback, alt: 'Ilustración feedback' },
        body: `
          <p><strong>Objetivo:</strong> Desarrollar el pensamiento crítico mediante la retroalimentación entre pares.</p>
          <p><strong>Dinámica:</strong> Los equipos <strong>evalúan al resto</strong> (no se autoevalúan) usando una <strong>rúbrica simple</strong> con 4 criterios:</p>
          <ul class="list-disc list-inside space-y-1 mt-1">
            <li>Equipo</li>
            <li>Empatía</li>
            <li>Creatividad</li>
            <li>Comunicación</li>
          </ul>
          <p class="mt-2"><strong>Tokens de participación:</strong> cada equipo que completa la evaluación recibe <strong>1 token fijo</strong>.</p>
          <p><strong>Tokens por puntuación recibida:</strong> se asignan según el promedio de la puntuación que el equipo recibe de los demás grupos:</p>
          <ul class="list-disc list-inside space-y-1 mt-1">
            <li>1° equipo mejor evaluado: 5 tokens</li>
            <li>2° equipo mejor evaluado: 4 tokens</li>
            <li>3° equipo mejor evaluado: 3 tokens</li>
            <li>4° equipo mejor evaluado: 2 tokens</li>
          </ul>
          <p class="text-slate-500 text-xs mt-2">Esta etapa fomenta la observación, la argumentación y el respeto entre equipos.</p>
        `
  },
  {
    short: "6",
    title: "Etapa 6: Cierre y Apoyo (5 minutos)",
    duration: "5 minutos",
    skill: "Reflexión y proyección",
    rule: "No aplica tokens nuevos (muestra ranking).",
    illustration: null,
    body: `
          <p><strong>Objetivo:</strong> Reflexión y cierre del juego.</p>
          <p><strong>Mensaje pedagógico:</strong> se explica la importancia de las habilidades emprendedoras trabajadas: equipo, empatía, creatividad, comunicación y feedback.</p>
          <p><strong>Autoevaluación con QR:</strong> los estudiantes acceden a un <strong>QR de autoevaluación</strong> donde califican sus propias habilidades emprendedoras.</p>
          <p><strong>Resultados finales:</strong> se presenta el ranking de equipos con el total de tokens obtenidos.</p>
          <p><strong>Apoyo UDD y QR:</strong> se muestran múltiples códigos QR para:</p>
          <ul class="list-disc list-inside space-y-1 mt-1">
            <li>Encuesta de satisfacción y recomendaciones.</li>
            <li>Invitación a los programas de Emprendimiento UDD (sitio web e Instagram).</li>
          </ul>
          <p class="mt-2 text-slate-500 text-xs">El juego finaliza aquí. Los alumnos pueden volver al menú principal.</p>
        ` 
  }
];

export default function InstructionsModal({ isOpen, onClose, initialPhase = 1 }) {
  const [currentStage, setCurrentStage] = useState(0);
  const audioRef = useRef(null);
  const touchStartXRef = useRef(0);
  const contentRef = useRef(null);
  const stg = stages[currentStage];
  const illustration = stg?.illustration ?? null;

  useEffect(() => {
    if (isOpen) {
      // Sincroniza la página interna con la fase actual del juego
      // Restamos 1 porque las fases son (1, 2, 3) y los arrays son (0, 1, 2)
      const newPageIndex = Math.max(0, initialPhase - 1);
      
      setCurrentStage(newPageIndex);
      
      // Resetea el scroll al abrir
      if (contentRef.current) contentRef.current.scrollTop = 0; 
    }
  }, [isOpen, initialPhase]); // Se ejecuta cuando 'isOpen' o 'initialPhase' cambian

  // 2. Traduce las funciones de JS a React
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSetStage = (index) => {
    setCurrentStage(index);
    playSound();
    if (contentRef.current) contentRef.current.scrollTop = 0; 
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      handleSetStage(currentStage + 1);
    }
  };

  const handlePrev = () => {
    if (currentStage > 0) {
      handleSetStage(currentStage - 1);
    }
  };

  // 3. Traduce los listeners de swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartXRef.current;
    const threshold = 50; // Píxeles de swipe para cambiar
    if (diff < -threshold) handleNext();
    else if (diff > threshold) handlePrev();
  };

  // 4. Copia el JSX del modal de index.html
  return (
    <>
      {/* Overlay */}
      <div 
        id="overlay" 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div id="modal" className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'pointer-events-none'}`}>
        <div
          id="modalContent"
          // Usamos las clases de Tailwind de tu index.html
          className={`w-[92vw] max-w-[900px] md:max-w-[920px] h-[88vh] md:h-[86vh] bg-[#f7f6f2] rounded-3xl shadow-2xl border border-slate-100 flex flex-col gap-4 transition-all duration-200 ${isOpen ? 'show-modal' : 'hidden-modal'}`}
        >
          {/* Header */}
          <header className="bg-white rounded-t-3xl px-5 py-4 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#005a8d] flex items-center justify-center">
              <span className="text-white font-bold text-lg">ME</span>
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Instrucciones del juego</p>
              <h1 className="text-base font-semibold text-slate-900">Misión Emprende</h1>
            </div>
            <button id="closeModal" className="text-slate-400 hover:text-slate-600 text-xl leading-none" onClick={onClose}>&times;</button>
          </header>

          {/* Step Pills (Renderizados con React) */}
          <div className="px-4 sm:px-6 flex gap-2 overflow-x-auto items-center" id="topSteps">
            {stages.map((stg, idx) => (
              <button
                key={stg.short}
                type="button"
                className={`step-pill flex items-center gap-3 px-3 py-2 ${idx === currentStage ? "step-pill-active" : "bg-transparent"}`}
                onClick={() => handleSetStage(idx)}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${idx === currentStage ? "bg-[#005a8d] text-white" : "bg-white/70 text-slate-500"} font-semibold text-sm`}>
                  {stg.short}
                </div>
                <span className={`${idx === currentStage ? "inline text-sm font-medium text-[#005a8d] whitespace-nowrap" : "hidden md:inline-block text-slate-500/0"}`}>
                  {idx === currentStage ? stg.title : ""}
                </span>
              </button>
            ))}
          </div>

          {/* Contenido (Renderizado con React) */}
          <div ref={contentRef} className="px-4 sm:px-6 pb-4 flex-1 overflow-y-auto">
            <section 
              id="content"
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex gap-3 mb-5 flex-wrap">
                <span className="bg-[#e6f0f7] text-[#005a8d] text-xs px-3 py-1 rounded-full inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005a8d]"></span>
                  Duración: {stg.duration}
                </span>
                <span className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Habilidad clave: {stg.skill}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Regla tokens: {stg.rule}
                </span>
              </div>
              {/* Usamos dangerouslySetInnerHTML porque el 'body' es HTML */}
              <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                <div className="space-y-2 text-sm leading-relaxed text-slate-800 lg:col-span-2"
                  dangerouslySetInnerHTML={{ __html: stg.body }}
                ></div>
                {illustration && (
                  <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-[220px] aspect-square bg-slate-50 border border-slate-100 rounded-2xl shadow-inner flex items-center justify-center p-3">
                      <img
                        src={illustration.src}
                        alt={illustration.alt}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
                Puedes deslizar hacia la izquierda o derecha (en tablet/celular) para cambiar de etapa.
              </p>
            </section>
          </div>

          {/* Footer (Conectado a React) */}
          <footer className="px-4 sm:px-6 py-4 flex gap-3 justify-between md:justify-end bg-white rounded-b-3xl border-t border-slate-100">
            <button id="prevBtn" className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-600 disabled:opacity-50" onClick={handlePrev} disabled={currentStage === 0}>
              ← Anterior
            </button>
            <button id="nextBtn" className="px-4 py-2 rounded-lg bg-[#005a8d] text-white text-sm font-semibold disabled:opacity-50" onClick={handleNext} disabled={currentStage === stages.length - 1}>
              Siguiente →
            </button>
          </footer>
        </div>
      </div>

      {/* Elemento de Audio (ubicado en /public/assets/sounds/) */}
      <audio ref={audioRef} src="/assets/sounds/turnPage.mp3" preload="auto"></audio>
    </>
  );
}