// src/components/PhaseIntro.jsx

import React, { useState, useEffect, useRef } from 'react';

// 1. Datos de las intros (de los 'data-' attributes de los <body>)
const INTRO_DATA = {
  1: { habilidad: "Trabajo en equipo", lema: "Jugar bien es jugar juntos.", texto: "Coordinación, confianza y decisiones colaborativas para cumplir objetivos en tiempo limitado." },
  2: { habilidad: "Empatía", lema: "Diseñar es ponerse en los zapatos del otro.", texto: "Observamos, escuchamos y comprendemos a la persona usuaria para detectar necesidades reales." },
  3: { habilidad: "Creatividad", lema: "Probar vale más que esperar ideas perfectas.", texto: "Generamos alternativas, combinamos y prototipamos rápido para encontrar opciones con potencial." },
  4: { habilidad: "Comunicación (Pitch)", lema: "Una buena idea solo impacta si se entiende.", texto: "Mensaje claro y persuasivo: problema, solución, valor y próximos pasos." },
  5: { habilidad: "Feedback", lema: "Mejorar es iterar con miradas distintas.", texto: "Recibimos y damos retro concreta y respetuosa para iterar: qué funciona y qué ajustar." }
};
const TOTAL_DURATION = 30000; // 30 segundos

export default function PhaseIntro({ phase, onDone }) {
  const [isVisible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const data = INTRO_DATA[phase];

  // Lógica de animación (de intro.js)
  useEffect(() => {
    // 1. Anima la entrada
    const bgTimer = setTimeout(() => setVisible(true), 10);
    const cardTimer = setTimeout(() => setShowContent(true), 240);
    
    // 2. Lógica de la barra de progreso (de intro.js)
    const start = performance.now();
    const tick = (t) => {
      const r = Math.min(1, (t - start) / TOTAL_DURATION);
      setProgress(r * 100);
      if (r < 1) timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);

    // 3. Cierre automático
    const autoCloseTimer = setTimeout(() => notify("auto"), TOTAL_DURATION);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(cardTimer);
      clearTimeout(autoCloseTimer);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []); // Se ejecuta solo una vez

  // Función de cierre (de intro.js)
  const notify = (reason) => {
    setVisible(false); // Inicia la animación de salida
    // Espera a que termine la animación de salida antes de llamar a onDone
    setTimeout(() => {
      onDone(phase);
    }, 600); // 600ms (igual que la animación de entrada)
  };

  if (!data) return null; // No hay intro para esta fase

  return (
    // JSX del Intro (de phaseX.html y style.css)
    <>
      <div className={`bg ${isVisible ? 'bg-in' : ''}`}></div>
      <div className="wrap">
        <div className={`card ${showContent ? 'card-in' : ''}`}>
          <div id="bar" style={{ width: `${progress}%` }}></div>
          <button id="skipBtn" className="skip" onClick={() => notify("skip")}>
            Saltar
          </button>
          <div className="top badge">
            <span className="dot"></span>
            <span>Fase {phase} de 5</span>
          </div>
          <h1 className={`title ${showContent ? 'title-in' : ''}`}>
            En esta fase trabajaremos la habilidad: {data.habilidad}
          </h1>
          <div className={`lead ${showContent ? 'text-in' : ''}`}>
            {data.lema}
          </div>
          <p className={`text ${showContent ? 'text-in' : ''}`}>
            {data.texto}
          </p>
          <div className="note">Intro finaliza automáticamente o al presionar “Saltar”.</div>
        </div>
      </div>
    </>
  );
}