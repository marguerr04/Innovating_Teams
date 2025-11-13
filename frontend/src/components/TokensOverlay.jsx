// src/components/TokensOverlay.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Lógica de texto (de tokens-overlay.js) ---
function textForPhase(n) {
  if (n === 1) return "Felicidades, fueron el primer equipo en terminar. Han ganado 4 tokens.";
  if (n >= 2 && n <= 4) return "Han ganado 1 token por completar la fase.";
  if (n === 5) return "¡Fase 5 completa! Los tokens de feedback se sumarán en el podio."; // Texto adaptado
  return "¡Fase completada!";
}

// --- Lógica de Confeti (de tokens-overlay.js) ---
const COLORS = ["#ffffff", "#f7d778", "#f79ac0", "#96d6ff", "#8df0d2", "#b39cff"];
const SHAPES = [
  { w: 8, h: 12, r: "2px" }, { w: 10, h: 10, r: "50%" }, { w: 12, h: 5, r: "2px" }
];
function gradientBg() {
  const a = COLORS[(Math.random() * COLORS.length) | 0];
  const b = COLORS[(Math.random() * COLORS.length) | 0];
  return `linear-gradient(${(Math.random() * 360) | 0}deg, ${a}, ${b})`;
}
function makeConfetti(side) {
  const el = document.createElement("div");
  el.className = "tk-confetti"; // Usamos la clase CSS
  const s = SHAPES[(Math.random() * SHAPES.length) | 0];
  el.style.setProperty("--w", s.w + "px");
  el.style.setProperty("--h", s.h + "px");
  el.style.setProperty("--radius", s.r);
  el.style.setProperty("--bg", gradientBg());
  const yStart = (10 + Math.random() * 70) + "vh";
  el.style.setProperty("--yStart", yStart);
  if (side === "left") {
    el.style.setProperty("--fromX", "-14vw");
    const x = (5 + Math.random() * 25) + "vw";
    el.style.setProperty("--x", x);
    el.style.setProperty("--driftX", (15 + Math.random() * 10) + "vw");
  } else {
    el.style.setProperty("--fromX", "14vw");
    const x = (-5 - Math.random() * 25) + "vw";
    el.style.setProperty("--x", x);
    el.style.setProperty("--driftX", (-15 - Math.random() * 10) + "vw");
  }
  el.style.setProperty("--lift", (-6 - Math.random() * 10) + "vh");
  el.style.setProperty("--inDur", (0.35 + Math.random() * 0.35).toFixed(2) + "s");
  el.style.setProperty("--downDur", (2.4 + Math.random() * 2.2).toFixed(2) + "s");
  el.style.setProperty("--spinDur", (1 + Math.random() * 1.4).toFixed(2) + "s");
  el.style.animationDelay = (Math.random() * 0.3).toFixed(2) + "s";
  return el;
}
// --- Fin Lógica de Confeti ---


export default function TokensOverlay({ show, phase, onContinue }) {
  const [subtitle, setSubtitle] = useState("");
  const audioRef = useRef(null);
  const laneLeftRef = useRef(null);
  const laneRightRef = useRef(null);

  // --- Función para lanzar confeti ---
  const launchConfettiLateral = useCallback(() => {
    const left = laneLeftRef.current;
    const right = laneRightRef.current;
    if (!left || !right) return;

    left.innerHTML = "";
    right.innerHTML = "";
    const count = 120;
    for (let i = 0; i < count; i++) {
      left.appendChild(makeConfetti("left"));
      right.appendChild(makeConfetti("right"));
    }
    setTimeout(() => {
      left.innerHTML = "";
      right.innerHTML = "";
    }, 5000);
  }, []); // Vacío, ya que 'makeConfetti' no depende de props o estado

  // --- Función para tocar sonido ---
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {}
  }, []);

  // --- Efecto principal: Se dispara cuando 'show' es true ---
  useEffect(() => {
    if (show) {
      setSubtitle(textForPhase(phase));
      playSound();
      launchConfettiLateral();
    }
  }, [show, phase, playSound, launchConfettiLateral]);

  // --- Renderizado del JSX (de index.html) ---
  return (
    <div 
      className={`tk-overlay ${show ? 'tk-show' : ''}`} 
      aria-hidden={!show}
    >
      <div className="tk-card">
        <h1 className="tk-title">¡Felicitaciones, equipo!</h1>
        <p className="tk-subtitle">{subtitle}</p>
        <img 
          src="/assets/tokens-me.png" 
          alt="Tokens" 
          className="tk-token-img" 
        />
        <button 
          className="tk-btn" 
          onClick={onContinue}
        >
          Continuar
        </button>

        <audio 
          ref={audioRef} 
          src="/token-sound.mp3" 
          preload="auto" 
          playsInline 
        />

        <div ref={laneLeftRef} className="tk-lane tk-left"></div>
        <div ref={laneRightRef} className="tk-lane tk-right"></div>
      </div>
    </div>
  );
}