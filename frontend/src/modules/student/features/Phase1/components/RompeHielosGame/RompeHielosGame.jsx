// src/modules/student/features/Phase1/components/RompeHielosGame/RompeHielosGame.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SOUNDS, useAudio } from '../../../../../../assets/index.js';

// --- DATOS DEL JUEGO ---
const PEOPLE = ["Camila", "Martín", "Valentina", "Diego", "Sofía", "Javier"];

const QUESTIONS = [
  "¿Qué te motivó a entrar a este proyecto / carrera?",
  "¿Qué te gustaría que tu equipo sepa sobre ti desde hoy?",
  "¿Qué cosas haces muy bien cuando trabajas en grupo?",
  "¿Cuál ha sido tu mejor experiencia trabajando con otras personas?",
  "¿Qué tipo de tareas disfrutas más dentro de un proyecto?",
  "¿Qué te ayuda a confiar en tu equipo?",
  "¿Cuál sería tu rol ideal en esta actividad?",
  "Cuenta una habilidad tuya que el grupo todavía no conoce.",
  "¿Qué esperas aprender de tus compañeros en esta actividad?",
  "¿Qué te gusta hacer para desconectarte después de estudiar/trabajar?",
  "Si tuvieras que agradecer algo al equipo ahora, ¿qué sería?",
  "¿Qué objetivo personal tienes para este semestre/año?",
  "¿Cuál fue tu primer emprendimiento o idea loca que tuviste?"
];

// --- Hook para sonidos ---
// Se usa el hook importado de assets

// --- Función para obtener elemento aleatorio diferente al anterior ---
function getRandomDifferent(list, last) {
  if (!last) return list[Math.floor(Math.random() * list.length)];
  let candidate = list[Math.floor(Math.random() * list.length)];
  if (candidate === last && list.length > 1) {
    candidate = list[(list.indexOf(candidate) + 1) % list.length];
  }
  return candidate;
}

export default function RompeHielosGame({ onComplete }) {
  const [round, setRound] = useState(1);
  const [currentPerson, setCurrentPerson] = useState("—");
  const [currentQuestion, setCurrentQuestion] = useState("Pulsa \"Nueva ronda\" para empezar.");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [lastPerson, setLastPerson] = useState(null);
  const [lastQuestion, setLastQuestion] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [questionFlash, setQuestionFlash] = useState(false);

  // Sonido para los pasos de la animación
  const playStep = useAudio(SOUNDS.ui.button_click);

  // Función de animación (no es hook)
  const createAnimation = (list, lastValue, onStep, onEnd, duration = 1400, interval = 120) => {
    return new Promise((resolve) => {
      setIsAnimating(true);
      let elapsed = 0;
      const start = performance.now();
      
      const timer = setInterval(() => {
        const now = performance.now();
        elapsed = now - start;
        const candidate = list[Math.floor(Math.random() * list.length)];
        onStep(candidate);
        
        // Reproducir sonido de manera segura
        try {
          playStep();
        } catch (e) {
          console.warn('Audio playback failed:', e);
        }
        
        if (elapsed >= duration) {
          clearInterval(timer);
          let final = getRandomDifferent(list, lastValue);
          onEnd(final);
          setIsAnimating(false);
          resolve(final);
        }
      }, interval * 1.6); // Factor de velocidad similar al HTML original
    });
  };

  // Animación de selección de persona
  const animatePersonSequence = useCallback(async () => {
    if (isAnimating) return;
    
    const final = await createAnimation(
      PEOPLE,
      lastPerson,
      (temp) => {
        setSelectedPerson(temp);
        setCurrentPerson(temp);
      },
      (final) => {
        setSelectedPerson(final);
        setCurrentPerson(final);
      },
      1400,
      110
    );
    
    setLastPerson(final);
    return final;
  }, [isAnimating, lastPerson, createAnimation]);

  // Animación de selección de pregunta
  const animateQuestionSequence = useCallback(async () => {
    if (isAnimating) return;
    
    const final = await createAnimation(
      QUESTIONS,
      lastQuestion,
      (temp) => {
        setCurrentQuestion(temp);
      },
      (final) => {
        setCurrentQuestion(final);
        setQuestionFlash(true);
        setTimeout(() => setQuestionFlash(false), 500);
      },
      1500,
      120
    );
    
    setLastQuestion(final);
    return final;
  }, [isAnimating, lastQuestion, createAnimation]);

  // Handlers para los botones
  const handleNewPerson = () => {
    if (isAnimating) return;
    animatePersonSequence();
  };

  const handleNewQuestion = () => {
    if (isAnimating) return;
    animateQuestionSequence();
  };

  const handleNewRound = async () => {
    if (isAnimating) return;
    setRound(prev => prev + 1);
    await animatePersonSequence();
    await animateQuestionSequence();
  };

  // Renderizar las cartas de personas
  const renderPersonCard = (name) => {
    const isSelected = name === selectedPerson;
    return (
      <div
        key={name}
        className={`person-card rounded-2xl px-4 py-3 flex items-center justify-between gap-2 transition-all duration-150 ease-in-out ${
          isSelected 
            ? 'person-active bg-teal-300/[0.18] border border-teal-300/80 transform scale-101 shadow-lg shadow-teal-300/25' 
            : 'bg-slate-950/20 border border-white/5'
        }`}
      >
        <span className="font-medium">{name}</span>
        {isSelected && <span className="text-emerald-300 text-sm">▶</span>}
      </div>
    );
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/5 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Fase 1 – Rompehielos</h1>
            <p className="text-sm text-slate-200/70">Sorteo animado de persona y pregunta.</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase text-slate-200/40">modo</p>
            <p className="text-sm font-medium text-emerald-300">Grupos · tablets</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Sección de personas */}
        <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Personas del grupo</h2>
            <p className="text-xs text-slate-200/50">Ronda {round}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PEOPLE.map(name => renderPersonCard(name))}
          </div>
        </section>

        {/* Sección de pregunta */}
        <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-9 h-9 rounded-2xl bg-emerald-400/10 border border-emerald-400/60 items-center justify-center text-emerald-300 text-lg">
              ?
            </span>
            <div>
              <p className="text-xs uppercase text-slate-200/40">persona elegida</p>
              <p className="text-xl font-semibold">{currentPerson}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-200/40 mb-2">pregunta rompehielos</p>
            <p 
              className={`text-xl md:text-2xl leading-relaxed text-slate-50/90 ${
                questionFlash ? 'animate-pulse' : ''
              }`}
            >
              {currentQuestion}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleNewQuestion}
              disabled={isAnimating}
              className="px-4 py-2 rounded-2xl bg-slate-950/50 border border-white/10 hover:bg-slate-900/80 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Otra pregunta 🔁
            </button>
            <button 
              onClick={handleNewPerson}
              disabled={isAnimating}
              className="px-4 py-2 rounded-2xl bg-slate-950/50 border border-white/10 hover:bg-slate-900/80 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Otra persona 🙋
            </button>
            <button 
              onClick={handleNewRound}
              disabled={isAnimating}
              className="px-4 py-2 rounded-2xl bg-emerald-400 text-slate-950 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-300 transition-colors"
            >
              Nueva ronda ➜
            </button>
          </div>

          <p className="text-xs text-slate-200/40">
            Tip: el sonido se dispara en cada "salto" de persona/pregunta. Si te molesta mucho en tablets, baja el volumen del sistema.
          </p>
        </section>

        {/* Botón para completar actividad */}
        <div className="text-center pt-6">
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg"
          >
            Terminar actividad
          </button>
        </div>
      </main>
    </div>
  );
}