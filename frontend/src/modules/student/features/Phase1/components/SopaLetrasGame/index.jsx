import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTimer } from '../WordSearch2/hooks/useTimer';
import { SOUNDS, useAudio } from '../../../../../../assets/index.js';

// Palabras del juego original (exactas)
const WORDS = [
  "INNOVACION","EQUIPO","IDEA","CREATIVIDAD","PITCH",
  "EMPATIA","LIDERAZGO","PROYECTO","STARTUP","DESAFIO",
  "SOLUCION","CLIENTE","IMPACTO","TECNOLOGIA","COLABORAR"
];

// Colores exactos del HTML original
const WORD_COLORS = [
  "rgba(16,185,129,0.45)","rgba(59,130,246,0.45)","rgba(236,72,153,0.45)",
  "rgba(244,63,94,0.45)","rgba(234,179,8,0.45)","rgba(14,165,233,0.45)",
  "rgba(147,51,234,0.45)","rgba(34,197,235,0.45)","rgba(94,234,212,0.45)",
  "rgba(251,191,36,0.45)","rgba(250,113,131,0.45)","rgba(45,212,191,0.45)",
  "rgba(59,130,246,0.45)","rgba(236,72,153,0.45)","rgba(16,185,129,0.45)"
];

const GRID_SIZE = 16;

const SopaLetrasGame = ({ onGameEnd }) => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionDir, setSelectionDir] = useState(null);
  const [foundLines, setFoundLines] = useState([]);
  const [teamName, setTeamName] = useState("Equipo 1 - Naranja");
  // --- Nuevo Timer: Cuenta Regresiva ---
  const TOTAL_SECONDS = 5 * 60; // 5 minutos (ajustable)
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const lastTickSoundRef = useRef(null);
  const [liveLine, setLiveLine] = useState(null);
  
  const boardRef = useRef(null);
  const svgRef = useRef(null);
  const successSoundRef = useRef(null);

  // Hooks de audio con protección de errores
  const playSuccess = useAudio(SOUNDS.games.success);
  const playClick = useAudio(SOUNDS.ui.click);
  // Nuevo: hooks para temporizador (los archivos tick.mp3 y alarm.mp3 deben existir)
  const playTick = useAudio(SOUNDS.ui.tick);      // pequeño "tic" cada segundo último minuto
  const playAlarm = useAudio(SOUNDS.ui.alarm);    // alarma final

  // Funciones de audio seguras
  const safePlaySuccess = useCallback(() => {
    try {
      if (typeof playSuccess === 'function') {
        playSuccess();
      }
    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  }, [playSuccess]);

  const safePlayClick = useCallback(() => {
    try {
      if (typeof playClick === 'function') {
        playClick();
      }
    } catch (error) {
      console.warn('Error playing click sound:', error);
    }
  }, [playClick]);

  // Iniciar cuenta regresiva
  const startTimer = useCallback(() => {
    if (running) return;
    setRunning(true);
  }, [running]);

  // Reiniciar timer
  const resetTimer = useCallback(() => {
    setRunning(false);
    setRemaining(TOTAL_SECONDS);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Color dinámico según tiempo restante
  const getTimerColor = useCallback(() => {
    if (remaining <= 30) return 'text-rose-500';
    if (remaining <= 120) return 'text-amber-400'; // menos de 2 min amarillos
    return 'text-emerald-400'; // >2 min verdes
  }, [remaining]);

  // Formatear tiempo
  const formatTime = useCallback(() => {
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [remaining]);

  // Manejo del intervalo para cuenta regresiva
  useEffect(() => {
    if (!running) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemaining(prev => {
          const next = prev - 1;
          // Reproducción de sonido "tic" cada segundo del último minuto
          if (next <= 60 && next > 0) {
            if (lastTickSoundRef.current !== next) {
              // Intento de reproducción (ignorar errores silenciosamente)
              try { playTick(); } catch {}
              lastTickSoundRef.current = next;
            }
          }
          if (next <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setRunning(false);
            // Al acabar el tiempo reproducir sonido final (alarma)
            try { playAlarm(); } catch {}
            setTimeout(() => {
              alert('⏱️ Tiempo agotado');
              onGameEnd?.();
            }, 150);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, onGameEnd]);

  // Crear grid vacío
  const createEmptyGrid = useCallback(() => {
    return Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(""));
  }, []);

  // Verificar si puede colocar palabra - algoritmo exacto del HTML
  const canPlace = useCallback((grid, word, row, col, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      const cell = grid[r][c];
      if (cell !== "" && cell !== word[i]) return false;
    }
    return true;
  }, []);

  // Colocar palabra - algoritmo exacto del HTML
  const placeWord = useCallback((grid, word) => {
    const dirs = [
      {dr:0,dc:1},{dr:0,dc:-1},
      {dr:1,dc:0},{dr:-1,dc:0},
      {dr:1,dc:1},{dr:1,dc:-1},
      {dr:-1,dc:1},{dr:-1,dc:-1},
    ];
    
    // probamos posiciones aleatorias (300 intentos como en HTML)
    for (let attempt = 0; attempt < 300; attempt++) {
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      if (canPlace(grid, word, row, col, d.dr, d.dc)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + d.dr * i][col + d.dc * i] = word[i];
        }
        return true;
      }
    }
    return false;
  }, [canPlace]);

  // Construir el grid completo - algoritmo exacto del HTML
  const buildGrid = useCallback(() => {
    // intentamos varias veces construir TODO el tablero
    for (let tries = 0; tries < 80; tries++) {
      const newGrid = createEmptyGrid();
      let okAll = true;
      
      for (const word of WORDS) {
        if (!placeWord(newGrid, word)) {
          okAll = false;
          break;
        }
      }
      
      if (okAll) {
        // rellenar vacíos
        const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[r][c] === "") {
              newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
            }
          }
        }
        return newGrid;
      }
    }
    
    // si después de muchos intentos no logramos 15, quitamos la última
    console.warn("No cupieron las 15, quitando la última solo en este intento.");
    const newGrid = createEmptyGrid();
    const reducedWords = WORDS.slice(0, 14);
    
    for (const word of reducedWords) {
      placeWord(newGrid, word);
    }
    
    const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === "") {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    return newGrid;
  }, [createEmptyGrid, placeWord]);

  // Obtener posición central de una celda - exacto como HTML
  const getCellCenter = useCallback((cellData) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellEl = cellData.el || boardRef.current.children[cellData.row * GRID_SIZE + cellData.col];
    const cellRect = cellEl.getBoundingClientRect();
    
    return {
      x: cellRect.left - boardRect.left + cellRect.width / 2,
      y: cellRect.top - boardRect.top + cellRect.height / 2
    };
  }, []);

  // Función para agregar celda a la selección - exacto como HTML
  const addCell = useCallback((cellEl) => {
    const row = parseInt(cellEl.dataset.row);
    const col = parseInt(cellEl.dataset.col);
    const key = row + "-" + col;
    
    if (selectedCells.find(c => c.key === key)) return;

    if (selectedCells.length === 0) {
      const newCell = {row, col, key, el: cellEl};
      setSelectedCells([newCell]);
      cellEl.classList.add("cell-selected");
      return;
    }
    
    if (selectedCells.length === 1) {
      const prev = selectedCells[0];
      const dr = Math.sign(row - prev.row);
      const dc = Math.sign(col - prev.col);
      if (dr === 0 && dc === 0) return;
      
      const newDir = {dr, dc};
      setSelectionDir(newDir);
      const newCell = {row, col, key, el: cellEl};
      setSelectedCells(prev => [...prev, newCell]);
      cellEl.classList.add("cell-selected");
      return;
    }
    
    if (selectionDir) {
      const last = selectedCells[selectedCells.length - 1];
      const expectedRow = last.row + selectionDir.dr;
      const expectedCol = last.col + selectionDir.dc;
      
      if (row === expectedRow && col === expectedCol) {
        const newCell = {row, col, key, el: cellEl};
        setSelectedCells(prev => [...prev, newCell]);
        cellEl.classList.add("cell-selected");
      }
    }
  }, [selectedCells, selectionDir]);

  // Crear línea de selección en vivo
  const createLiveLine = useCallback(() => {
    if (!svgRef.current || selectedCells.length === 0) return;
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "rgba(148,163,184,0.25)");
    line.setAttribute("stroke-width", "12");
    line.setAttribute("stroke-linecap", "round");
    svgRef.current.appendChild(line);
    setLiveLine(line);
  }, [selectedCells]);

  // Actualizar línea en vivo
  const updateLiveLine = useCallback(() => {
    if (!liveLine || selectedCells.length === 0) return;
    
    const start = getCellCenter(selectedCells[0]);
    const end = getCellCenter(selectedCells[selectedCells.length - 1]);
    
    liveLine.setAttribute("x1", start.x);
    liveLine.setAttribute("y1", start.y);
    liveLine.setAttribute("x2", end.x);
    liveLine.setAttribute("y2", end.y);
  }, [liveLine, selectedCells, getCellCenter]);

  // Crear línea final para palabra encontrada
  const createFinalLine = useCallback((cells, color) => {
    if (!svgRef.current) return;
    
    const start = getCellCenter(cells[0]);
    const end = getCellCenter(cells[cells.length - 1]);
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "18");
    line.setAttribute("stroke-linecap", "round");
    svgRef.current.appendChild(line);
  }, [getCellCenter]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    if (boardRef.current) {
      boardRef.current.querySelectorAll(".cell-selected").forEach(c => 
        c.classList.remove("cell-selected")
      );
    }
  }, []);

  // Verificar palabra - exacto como HTML
  const checkWord = useCallback(() => {
    if (selectedCells.length <= 1) {
      clearSelection();
      if (liveLine && svgRef.current) {
        svgRef.current.removeChild(liveLine);
        setLiveLine(null);
      }
      return;
    }
    
    const letters = selectedCells.map(c => grid[c.row][c.col]).join("");
    const reversed = letters.split("").reverse().join("");
    const idx = WORDS.findIndex(w => w === letters || w === reversed);
    
    if (idx !== -1) {
      const word = WORDS[idx];
      
      if (foundWords.has(word)) {
        clearSelection();
        if (liveLine && svgRef.current) {
          svgRef.current.removeChild(liveLine);
          setLiveLine(null);
        }
        setSelectedCells([]);
        setSelectionDir(null);
        return;
      }
      
      selectedCells.forEach(c => {
        c.el.classList.remove("cell-selected");
        c.el.classList.add("cell-found");
      });
      
      setFoundWords(prev => new Set([...prev, word]));
      
      if (liveLine && svgRef.current) {
        svgRef.current.removeChild(liveLine);
        setLiveLine(null);
      }
      
      createFinalLine(selectedCells, WORD_COLORS[idx % WORD_COLORS.length]);
      
      // Reproducir sonido de éxito
      safePlaySuccess();
      
      if (foundWords.size + 1 === WORDS.length) {
        // Detener cuenta regresiva al completar todas las palabras
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRunning(false);
        setTimeout(() => {
          onGameEnd?.();
        }, 1500);
      }
    } else {
      clearSelection();
      if (liveLine && svgRef.current) {
        svgRef.current.removeChild(liveLine);
        setLiveLine(null);
      }
    }
    
    setSelectedCells([]);
    setSelectionDir(null);
  }, [selectedCells, grid, foundWords, liveLine, clearSelection, createFinalLine, onGameEnd]);

  // Eventos de selección
  const startSelection = useCallback((e) => {
    e.preventDefault();
    setIsSelecting(true);
    startTimer();
    safePlayClick(); // Sonido al hacer clic
    clearSelection();
    setSelectedCells([]);
    setSelectionDir(null);
    addCell(e.target);
    createLiveLine();
  }, [startTimer, clearSelection, addCell, createLiveLine, playClick]);

  const moveSelection = useCallback((e) => {
    if (!isSelecting) return;
    addCell(e.target);
    updateLiveLine();
  }, [isSelecting, addCell, updateLiveLine]);

  const endSelection = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);
    checkWord();
  }, [isSelecting, checkWord]);

  // Event listeners globales
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        checkWord();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, checkWord]);

  // Construir tablero
  const buildBoard = useCallback(() => {
    const newGrid = buildGrid();
    setGrid(newGrid);
    setFoundWords(new Set());
    setFoundLines([]);
    if (svgRef.current) {
      svgRef.current.innerHTML = "";
    }
  }, [buildGrid]);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    resetTimer();
    buildBoard();
  }, [resetTimer, buildBoard]);

  // Inicializar
  useEffect(() => {
    buildBoard();
  }, []);

  // Actualizar SVG cuando el board cambia
  useEffect(() => {
    if (boardRef.current && svgRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      svgRef.current.setAttribute("width", rect.width);
      svgRef.current.setAttribute("height", rect.height);
      svgRef.current.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    }
  }, [grid]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (boardRef.current && svgRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        svgRef.current.setAttribute("width", rect.width);
        svgRef.current.setAttribute("height", rect.height);
        svgRef.current.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">

      {/* Header exacto como HTML */}
      <header className="w-full bg-slate-950/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Fase 1 – Sopa de letras</h1>
            <p className="text-sm text-slate-200/70">16×16 · sin scroll · bloqueo duplicados · TODAS las palabras</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase text-slate-200/40">tiempo</p>
            <p className={`text-3xl font-mono transition ${getTimerColor()} ${remaining <= 30 ? 'animate-pulse' : ''}`}>{formatTime()}</p>
          </div>
        </div>
      </header>

      {/* Main exacto como HTML */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          {/* Board Container */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 md:p-6 relative">
            <div className="w-full max-w-[820px] relative">
              <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div 
                ref={boardRef}
                className="grid gap-[0.35rem] w-full select-none"
                style={{ 
                  gridTemplateColumns: 'repeat(16, minmax(2rem, 1fr))'
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="board-cell aspect-square flex items-center justify-center bg-slate-900/40 hover:bg-emerald-400/15 rounded-xl font-semibold text-white cursor-pointer"
                      data-row={rowIndex}
                      data-col={colIndex}
                      onMouseDown={startSelection}
                      onMouseEnter={moveSelection}
                      onMouseUp={endSelection}
                    >
                      {letter}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Mensaje de victoria */}
            {foundWords.size === WORDS.length && (
              <div className="mt-6 bg-emerald-400/10 border border-emerald-400/40 text-emerald-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold">¡Listo! Equipo completó la sopa</p>
                  <p className="text-sm text-emerald-50/80">Comparte el tiempo con el facilitador.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar exacto como HTML */}
          <div className="space-y-4">
            {/* Team name */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4">
              <p className="text-[0.6rem] uppercase text-slate-200/40 mb-1">equipo</p>
              <input 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-slate-950/20 border border-white/10 rounded-2xl px-3 py-2 text-sm"
              />
            </div>
            
            {/* Words list */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 max-h-[430px] overflow-y-auto">
              <h2 className="text-xs uppercase text-slate-200/60 mb-3">Palabras (15)</h2>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {WORDS.map((word, index) => (
                  <li
                    key={word}
                    data-word={word}
                    className={`px-3 py-1 bg-slate-950/40 rounded-2xl border border-white/5 flex items-center gap-2 ${
                      foundWords.has(word) ? 'word-found' : ''
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        background: WORD_COLORS[index % WORD_COLORS.length].replace('0.45', '1')
                      }}
                    />
                    {word}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Controls */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 flex gap-3">
              <button 
                onClick={() => { safePlayClick(); resetGame(); }}
                className="flex-1 bg-slate-950/40 rounded-2xl py-2"
              >
                Reiniciar tiempo
              </button>
              <button 
                onClick={() => { safePlayClick(); resetGame(); startTimer(); }}
                className="flex-1 bg-emerald-400/80 text-slate-950 rounded-2xl py-2 font-semibold"
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .cell-selected { 
          background: rgba(0, 204, 153, 0.25) !important; 
        }
        .cell-found { 
          background: rgba(16,185,129,1) !important; 
          color: white !important; 
          font-weight: 700 !important; 
        }
        .word-found { 
          text-decoration: line-through !important; 
          color: #10b981 !important; 
          font-weight: 600 !important; 
        }
      `}</style>
    </div>
  );
};

export default SopaLetrasGame;