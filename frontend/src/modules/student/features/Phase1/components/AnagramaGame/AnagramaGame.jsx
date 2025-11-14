// src/modules/student/features/Phase1/components/AnagramaGame/AnagramaGame.jsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SOUNDS, useAudio } from '../../../../../../assets/index.js';

// --- DATOS DEL JUEGO ---
const WORDS = [
  "INNOVACION", "EQUIPO", "IDEA", "CREATIVIDAD", "PITCH", "EMPATIA",
  "LIDERAZGO", "PROYECTO", "STARTUP", "DESAFIO", "SOLUCION", "CLIENTE",
  "IMPACTO", "TECNOLOGIA", "COLABORAR"
];

const DESCRIPTIONS = {
  "INNOVACION": "Proceso de generar una propuesta distinta a lo habitual que resuelve el reto mejor que las soluciones existentes.",
  "EQUIPO": "Grupo de participantes que cooperan en esta fase y comparten responsabilidad sobre el puntaje.",
  "IDEA": "Formulación corta de la solución: qué harás, para quién y por qué serviría.",
  "CREATIVIDAD": "Habilidad del grupo para producir varias opciones diferentes antes de elegir la mejor.",
  "PITCH": "Explicación de 30 a 90 segundos que busca convencer a un jurado o facilitador.",
  "EMPATIA": "Paso en el que el equipo se pone en el lugar del usuario para entender su problema real.",
  "LIDERAZGO": "Rol de quien ordena el trabajo, reparte tareas y toma la decisión final cuando hay dudas.",
  "PROYECTO": "Trabajo estructurado con objetivo, tareas y responsable que nace de la idea que eligieron.",
  "STARTUP": "Emprendimiento joven, de base innovadora, que quiere crecer rápido y probar el mercado.",
  "DESAFIO": "Problema o reto que les plantea la fase y que deben resolver antes de avanzar.",
  "SOLUCION": "Propuesta concreta del equipo para resolver el desafío, ya pensada para el usuario.",
  "CLIENTE": "Persona u organización para la que se diseña la solución y que se quiere satisfacer.",
  "IMPACTO": "Cambio medible o beneficio claro que la solución generará en el usuario o contexto.",
  "TECNOLOGIA": "Recurso o herramienta digital que ayuda a implementar la solución (app, web, IA, etc.).",
  "COLABORAR": "Trabajar en conjunto, escuchando y aportando, para llegar más rápido o a una mejor respuesta."
};

// --- Hook personalizado para timer simple ---
const useSimpleTimer = (autoStart) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  useEffect(() => {
    if (autoStart && !isRunning) {
      setIsRunning(true);
    }
  }, [autoStart, isRunning]);
  
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  
  return `${mm}:${ss}`;
};

// --- Función para mezclar array ---
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function AnagramaGame({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [answerEntries, setAnswerEntries] = useState([]);
  const [usedIndices, setUsedIndices] = useState([]);
  const [feedback, setFeedback] = useState({ msg: '', type: '' });
  const [gameStarted, setGameStarted] = useState(false);

  // Timer simple que cuenta hacia arriba como en el HTML original
  const timeDisplay = useSimpleTimer(gameStarted);

  // Sonidos organizados
  const playTap = useAudio(SOUNDS.ui.click);
  const playCorrect = useAudio(SOUNDS.games.success);
  const playWrong = useAudio(SOUNDS.games.incorrect);

  // En caso de que el hook haya cambiado y devuelva objeto {play}, asegurar compatibilidad
  const safePlay = (fn) => {
    try {
      if (!fn) return;
      // Si es objeto con método play
      if (typeof fn === 'object' && typeof fn.play === 'function') {
        fn.play();
        return;
      }
      // Si es función directamente
      if (typeof fn === 'function') {
        fn();
        return;
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  const currentWord = useMemo(() => WORDS[currentIndex], [currentIndex]);
  const currentDescription = useMemo(() => DESCRIPTIONS[currentWord] || "Descripción no disponible.", [currentWord]);
  
  const shuffledLetters = useMemo(() => {
    let shuffled;
    do {
      shuffled = shuffleArray(currentWord.split(''));
    } while (shuffled.join('') === currentWord && currentWord.length > 1);
    return shuffled;
  }, [currentWord]);

  // Inicializar índices usados cuando cambia la palabra
  useEffect(() => {
    setUsedIndices(Array(shuffledLetters.length).fill(false));
    setAnswerEntries([]);
    setFeedback({ msg: '', type: '' });
  }, [shuffledLetters.length]);

  // Handler para clic en una letra disponible
  const handleLetterClick = (letter, index) => {
    if (!gameStarted) setGameStarted(true);
    if (usedIndices[index]) return;

  safePlay(playTap);
    setUsedIndices(prev => prev.map((used, i) => i === index ? true : used));
    setAnswerEntries(prev => [...prev, { letter, sourceIndex: index }]);
  };

  // Handler para clic en una letra de la respuesta (para devolverla)
  const handleAnswerClick = (position) => {
  safePlay(playTap);
    const entry = answerEntries[position];
    setUsedIndices(prev => prev.map((used, i) => i === entry.sourceIndex ? false : used));
    setAnswerEntries(prev => prev.filter((_, i) => i !== position));
    setFeedback({ msg: '', type: '' });
  };

  // Handler para limpiar la respuesta actual
  const handleClear = () => {
  safePlay(playTap);
    setAnswerEntries([]);
    setUsedIndices(Array(shuffledLetters.length).fill(false));
    setFeedback({ msg: '', type: '' });
  };

  // Handler para ir a la siguiente palabra
  const handleNextWord = () => {
  safePlay(playTap);
    if (currentIndex < WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Efecto que comprueba la respuesta cada vez que cambia
  useEffect(() => {
    const currentAnswer = answerEntries.map(e => e.letter).join("");
    if (currentAnswer.length === 0) return;

    if (currentAnswer === currentWord) {
      playCorrect();
      setFeedback({ msg: `✅ Correcto: ${currentWord}`, type: 'ok' });
      setSolvedWords(prev => new Set(prev).add(currentWord));
      
      setTimeout(() => {
        if (currentIndex < WORDS.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 700);
      
    } else if (currentAnswer.length === currentWord.length) {
      playWrong();
      setFeedback({ msg: '❌ No es esa, revisa la descripción', type: 'error' });
    }
  }, [answerEntries, currentWord, currentIndex, playCorrect, playWrong]);

  // Efecto que comprueba si el juego se ha completado
  useEffect(() => {
    if (solvedWords.size === WORDS.length) {
      onComplete();
    }
  }, [solvedWords, onComplete]);

  const getFeedbackClass = () => {
    if (feedback.type === 'ok') return 'bg-emerald-400/10 text-emerald-100 border border-emerald-400/40';
    if (feedback.type === 'error') return 'bg-rose-400/5 text-rose-100 border border-rose-400/40';
    return 'hidden';
  };
  
  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-slate-950/50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Fase 1 – Anagrama</h1>
            <p className="text-sm text-slate-200/70">Lee la descripción y ordena las letras.</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase text-slate-200/40">tiempo</p>
            <p className="text-3xl font-mono text-emerald-300">{timeDisplay}</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Anagrama actual</h2>
            <span className="text-sm text-slate-200/50">{currentIndex + 1} / {WORDS.length}</span>
          </div>

          <div>
            <p className="text-xs text-slate-200/40 uppercase mb-1">Descripción de la palabra:</p>
            <p className="text-base md:text-lg text-slate-50/90 leading-relaxed bg-slate-950/20 rounded-2xl px-4 py-3">
              {currentDescription}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-200/50 mb-2">Letras disponibles</p>
            <div className="flex flex-wrap gap-3">
              {shuffledLetters.map((letter, i) => (
                <button
                  key={i}
                  className={`letter-chip w-14 h-14 md:w-16 md:h-16 bg-slate-800/80 hover:bg-slate-700 text-lg flex items-center justify-center rounded-2xl font-semibold cursor-pointer select-none ${usedIndices[i] ? 'opacity-25 pointer-events-none' : ''}`}
                  onClick={() => handleLetterClick(letter, i)}
                  disabled={usedIndices[i]}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-200/50 mb-2">Respuesta del equipo (toca una letra para devolverla)</p>
            <div className="flex flex-wrap gap-2 min-h-12 bg-slate-950/30 rounded-2xl px-4 py-3 text-lg font-mono tracking-wide">
              {answerEntries.map((entry, pos) => (
                <span
                  key={pos}
                  className="answer-chip px-3 py-1 bg-slate-800/80 rounded-xl cursor-pointer"
                  onClick={() => handleAnswerClick(pos)}
                >
                  {entry.letter}
                </span>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${getFeedbackClass()}`}>
            {feedback.msg || <span>&nbsp;</span>}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleClear} 
              className="flex-1 bg-slate-950/40 rounded-2xl py-2 hover:bg-slate-900/60 transition-colors"
            >
              Borrar
            </button>
            <button 
              onClick={handleNextWord} 
              className="flex-1 bg-emerald-400/90 text-slate-950 rounded-2xl py-2 font-semibold hover:bg-emerald-400 transition-colors"
              disabled={currentIndex >= WORDS.length - 1}
            >
              Siguiente palabra
            </button>
          </div>

          {solvedWords.size === WORDS.length && (
            <div className="bg-emerald-400/10 border border-emerald-400/40 rounded-2xl px-4 py-3">
              <p className="font-semibold">✅ Equipo completó todos los anagramas</p>
              <p className="text-sm text-emerald-50/70">Registra el tiempo y pasa a la siguiente actividad.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}