import { useState, useCallback, useRef , useEffect} from 'react';

const GRID_SIZE = 16;
const WORDS = [
  "INNOVACION", "EQUIPO", "IDEA", "CREATIVIDAD", "PITCH",
  "EMPATIA", "LIDERAZGO", "PROYECTO", "STARTUP", "DESAFIO",
  "SOLUCION", "CLIENTE", "IMPACTO", "TECNOLOGIA", "COLABORAR"
];

const WORD_COLORS = [
  "rgba(16,185,129,0.45)", "rgba(59,130,246,0.45)", "rgba(236,72,153,0.45)",
  "rgba(244,63,94,0.45)", "rgba(234,179,8,0.45)", "rgba(14,165,233,0.45)",
  "rgba(147,51,234,0.45)", "rgba(34,197,235,0.45)", "rgba(94,234,212,0.45)",
  "rgba(251,191,36,0.45)", "rgba(250,113,131,0.45)", "rgba(45,212,191,0.45)",
  "rgba(59,130,246,0.45)", "rgba(236,72,153,0.45)", "rgba(16,185,129,0.45)"
];

export const useWordSearch = (onComplete) => {
  console.log("--- RENDERIZANDO useWordSearch ---");
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(null);
  const boardRef = useRef(null);
  const linesSvgRef = useRef(null);
  const liveLineRef = useRef(null);

  const createEmptyGrid = useCallback(() => {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  }, []);

  const canPlaceWord = useCallback((word, row, col, dr, dc, tempGrid) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      const cell = tempGrid[r][c];
      if (cell !== "" && cell !== word[i]) return false;
    }
    return true;
  }, []);

  const placeWord = useCallback((word, tempGrid) => {
    const directions = [
      { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
      { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
      { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
      { dr: -1, dc: 1 }, { dr: -1, dc: -1 },
    ];

    for (let attempt = 0; attempt < 300; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      if (canPlaceWord(word, row, col, dir.dr, dir.dc, tempGrid)) {
        for (let i = 0; i < word.length; i++) {
          tempGrid[row + dir.dr * i][col + dir.dc * i] = word[i];
        }
        return true;
      }
    }
    return false;
  }, [canPlaceWord]);

  const buildGrid = useCallback(() => {
    for (let tries = 0; tries < 80; tries++) {
      const tempGrid = createEmptyGrid();
      let allPlaced = true;

      for (const word of WORDS) {
        if (!placeWord(word, tempGrid)) {
          allPlaced = false;
          break;
        }
      }

      if (allPlaced) {
        const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (tempGrid[r][c] === "") {
              tempGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
            }
          }
        }
        return tempGrid;
      }
    }

    // Fallback: usar solo 14 palabras
    const tempGrid = createEmptyGrid();
    const reducedWords = WORDS.slice(0, 14);
    for (const word of reducedWords) placeWord(word, tempGrid);
    
    const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (tempGrid[r][c] === "") {
          tempGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    return tempGrid;
  }, [createEmptyGrid, placeWord]);

  const initializeGame = useCallback(() => {
    const newGrid = buildGrid();
    setGrid(newGrid);
    setFoundWords(new Set());
    setSelectedCells([]);
    setIsSelecting(false);
    setCurrentDirection(null);
  }, [buildGrid]);

  const getCellCenter = useCallback((cell) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    return {
      x: cellRect.left - boardRect.left + cellRect.width / 2,
      y: cellRect.top - boardRect.top + cellRect.height / 2
    };
  }, []);

  const createLiveLine = useCallback(() => {
    if (!linesSvgRef.current) return;
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "rgba(148,163,184,0.25)");
    line.setAttribute("stroke-width", "12");
    line.setAttribute("stroke-linecap", "round");
    linesSvgRef.current.appendChild(line);
    liveLineRef.current = line;
  }, []);

  const updateLiveLine = useCallback(() => {
    if (!liveLineRef.current || selectedCells.length === 0) return;
    
    const start = getCellCenter(selectedCells[0].el);
    const end = getCellCenter(selectedCells[selectedCells.length - 1].el);
    
    liveLineRef.current.setAttribute("x1", start.x);
    liveLineRef.current.setAttribute("y1", start.y);
    liveLineRef.current.setAttribute("x2", end.x);
    liveLineRef.current.setAttribute("y2", end.y);
  }, [selectedCells, getCellCenter]);

  const createFinalLine = useCallback((cells, color) => {
    if (!linesSvgRef.current) return;
    
    const start = getCellCenter(cells[0].el);
    const end = getCellCenter(cells[cells.length - 1].el);
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "18");
    line.setAttribute("stroke-linecap", "round");
    linesSvgRef.current.appendChild(line);
  }, [getCellCenter]);

    const clearSelection = useCallback(() => {
    document.querySelectorAll(".cell-selected").forEach(cell => {
      cell.classList.remove("cell-selected");
    });
  }, []);

  const checkWord = useCallback(() => {
    if (selectedCells.length <= 1) {
      clearSelection();
      if (liveLineRef.current && linesSvgRef.current?.contains(liveLineRef.current)) {
        linesSvgRef.current.removeChild(liveLineRef.current);
      }
      liveLineRef.current = null;
      return;
    }

    const letters = selectedCells.map(c => grid[c.row][c.col]).join("");
    const reversed = letters.split("").reverse().join("");
    const wordIndex = WORDS.findIndex(w => w === letters || w === reversed);

    if (wordIndex !== -1) {
      const word = WORDS[wordIndex];
      
      if (foundWords.has(word)) {
        clearSelection();
        if (liveLineRef.current && linesSvgRef.current?.contains(liveLineRef.current)) {
          linesSvgRef.current.removeChild(liveLineRef.current);
        }
        liveLineRef.current = null;
        setSelectedCells([]);
        setCurrentDirection(null);
        return;
      }

      // Marcar palabra como encontrada
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(word);
      setFoundWords(newFoundWords);

      // Crear línea permanente
      if (liveLineRef.current && linesSvgRef.current?.contains(liveLineRef.current)) {
        linesSvgRef.current.removeChild(liveLineRef.current);
      }
      createFinalLine(selectedCells, WORD_COLORS[wordIndex % WORD_COLORS.length]);

      // Reproducir sonido (si está disponible)
      // successSound.play().catch(() => {});

      // Verificar si se completó el juego
      if (newFoundWords.size === WORDS.length && onComplete) {
        onComplete();
      }
    } else {
      clearSelection();
      if (liveLineRef.current && linesSvgRef.current?.contains(liveLineRef.current)) {
        linesSvgRef.current.removeChild(liveLineRef.current);
      }
    }

    liveLineRef.current = null;
  setSelectedCells([]);
  setCurrentDirection(null);
}, [selectedCells, grid, foundWords, onComplete, createFinalLine, clearSelection]); // <- Agregar clearSelection aquí



  const addCellToSelection = useCallback((cell, row, col) => {
    const key = `${row}-${col}`;
    
    if (selectedCells.find(c => c.key === key)) return;

    if (selectedCells.length === 0) {
      const newSelectedCells = [{ row, col, key, el: cell }];
      setSelectedCells(newSelectedCells);
      cell.classList.add("cell-selected");
      return;
    }

    if (selectedCells.length === 1) {
      const prev = selectedCells[0];
      const dr = Math.sign(row - prev.row);
      const dc = Math.sign(col - prev.col);
      
      if (dr === 0 && dc === 0) return;
      
      setCurrentDirection({ dr, dc });
      const newSelectedCells = [...selectedCells, { row, col, key, el: cell }];
      setSelectedCells(newSelectedCells);
      cell.classList.add("cell-selected");
      return;
    }

    const last = selectedCells[selectedCells.length - 1];
    const expectedRow = last.row + currentDirection.dr;
    const expectedCol = last.col + currentDirection.dc;
    
    if (row === expectedRow && col === expectedCol) {
      const newSelectedCells = [...selectedCells, { row, col, key, el: cell }];
      setSelectedCells(newSelectedCells);
      cell.classList.add("cell-selected");
    }
  }, [selectedCells, currentDirection]);

  const handleStartSelection = useCallback((cell, row, col) => {
    setIsSelecting(true);
    setSelectedCells([]);
    setCurrentDirection(null);
    addCellToSelection(cell, row, col);
    createLiveLine();
  }, [addCellToSelection, createLiveLine]);

  const handleMoveSelection = useCallback((cell, row, col) => {
    if (!isSelecting) return;
    addCellToSelection(cell, row, col);
    updateLiveLine();
  }, [isSelecting, addCellToSelection, updateLiveLine]);

  const handleEndSelection = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);
    checkWord();
  }, [isSelecting, checkWord]);

  return {
    grid,
    foundWords,
    selectedCells,
    isSelecting,
    WORDS,
    WORD_COLORS,
    GRID_SIZE,
    boardRef,
    linesSvgRef,
    initializeGame,
    handleStartSelection,
    handleMoveSelection,
    handleEndSelection,
    getCellCenter,
    updateLiveLine
  };
};