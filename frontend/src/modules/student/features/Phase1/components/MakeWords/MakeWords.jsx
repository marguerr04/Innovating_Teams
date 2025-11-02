// src/modules/student/features/Phase1/components/MakeWords.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTimer } from '../WordSearch2/hooks/useTimer'; // Reutilizamos el hook del timer

// --- DATOS DEL JUEGO (Mantenidos dentro del componente) --- t
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

// --- Lógica de Sonidos (Hook simple) ---
const useAudio = (src) => {
  const audioRef = useRef(new Audio(src));
  const play = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);
  return play;
};

// --- Componente Principal ---
export default function MakeWords({ onComplete }) {
  const { time, start: startTimer, stop: stopTimer } = useTimer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [answerEntries, setAnswerEntries] = useState([]); // [{ letter, sourceIndex }]
  const [usedIndices, setUsedIndices] = useState(Array(WORDS[0].length).fill(false));
  const [feedback, setFeedback] = useState({ msg: '', type: '' });
  
  // Sonidos
  const playTap = useAudio("computer-mouse-click-352734.mp3");
  const playCorrect = useAudio("button_09-190435.mp3");
  const playWrong = useAudio("training-program-incorrect1-88736.mp3");

  const currentWord = useMemo(() => WORDS[currentIndex], [currentIndex]);
  const currentDescription = useMemo(() => DESCRIPTIONS[currentWord] || "Descripción no disponible.", [currentWord]);
  
  const shuffledLetters = useMemo(() => {
    let shuffled;
    do {
      shuffled = currentWord.split('').sort(() => 0.5 - Math.random());
    } while (shuffled.join('') === currentWord && currentWord.length > 1);
    return shuffled;
  }, [currentWord]);

  // Resetea el estado para una nueva palabra
  const loadWord = useCallback((index) => {
    setCurrentIndex(index);
    setAnswerEntries([]);
    setUsedIndices(Array(WORDS[index].length).fill(false));
    setFeedback({ msg: '', type: '' });
  }, []);

  // Handler para clic en una letra disponible
  const handleLetterClick = (letter, index) => {
    startTimer();
    playTap();
    setUsedIndices(prev => prev.map((used, i) => i === index ? true : used));
    setAnswerEntries(prev => [...prev, { letter, sourceIndex: index }]);
  };

  // Handler para clic en una letra de la respuesta (para devolverla)
  const handleAnswerClick = (position) => {
    playTap();
    const entry = answerEntries[position];
    setUsedIndices(prev => prev.map((used, i) => i === entry.sourceIndex ? false : used));
    setAnswerEntries(prev => prev.filter((_, i) => i !== position));
    setFeedback({ msg: '', type: '' });
  };

  // Handler para limpiar la respuesta actual
  const handleClear = () => {
    playTap();
    setAnswerEntries([]);
    setUsedIndices(Array(currentWord.length).fill(false));
    setFeedback({ msg: '', type: '' });
  };

  // Handler para ir a la siguiente palabra
  const handleNextWord = () => {
    playTap();
    if (currentIndex < WORDS.length - 1) {
      loadWord(currentIndex + 1);
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
          loadWord(currentIndex + 1);
        }
      }, 700);
      
    } else if (currentAnswer.length === currentWord.length) {
      playWrong();
      setFeedback({ msg: '❌ No es esa, revisa la descripción', type: 'error' });
    }
  }, [answerEntries, currentWord, currentIndex, loadWord, playCorrect, playWrong]);

  // Efecto que comprueba si el juego se ha completado
  useEffect(() => {
    if (solvedWords.size === WORDS.length) {
      stopTimer();
      onComplete(); // Llama a la función onComplete del padre
    }
  }, [solvedWords, onComplete, stopTimer]);

  const getFeedbackClass = () => {
    if (feedback.type === 'ok') return 'bg-emerald-400/10 text-emerald-100 border border-emerald-400/40';
    if (feedback.type === 'error') return 'bg-rose-400/5 text-rose-100 border border-rose-400/40';
    return 'hidden';
  };
  
  return (
    // Usamos la estructura y clases de Tailwind del HTML
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header (se puede mover al modal si se prefiere) */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Anagrama actual</h2>
        <span className="text-sm text-slate-200/50">{currentIndex + 1} / {WORDS.length}</span>
        <div className="text-right">
          <p className="text-[0.6rem] uppercase text-slate-200/40">tiempo</p>
          <p className="text-3xl font-mono text-emerald-300">{time}</p>
        </div>
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
              className={`letter-chip w-14 h-14 md:w-16 md:h-16 bg-slate-800/80 hover:bg-slate-700 text-lg ${usedIndices[i] ? 'letter-used' : ''}`}
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
              className="answer-chip px-3 py-1 bg-slate-800/80 rounded-xl"
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
        <button onClick={handleClear} className="flex-1 bg-slate-950/40 rounded-2xl py-2">Borrar</button>
        <button 
          onClick={handleNextWord} 
          className="flex-1 bg-emerald-400/90 text-slate-950 rounded-2xl py-2 font-semibold"
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
  );
}