import React, { useEffect } from 'react';
import { useWordSearch } from './hooks/useWordSearch';
import { useTimer } from './hooks/useTimer';
import WordSearchBoard from './WordSearchBoard';
import WordSearchWordList from './WordSearchWordList';
import WordSearchControls from './WordSearchControls';

const WordSearch2 = ({ onComplete }) => {
  const {
    grid,
    foundWords,
    boardRef,
    linesSvgRef,
    initializeGame,
    handleStartSelection,
    handleMoveSelection,
    handleEndSelection,
    WORDS,
    WORD_COLORS,
    GRID_SIZE
  } = useWordSearch(onComplete);

  // Timer: cuenta regresiva de 5 minutos (300s). Cuando se acaba, llamamos al onComplete recibido desde el padre.
  const { time, start, reset } = useTimer({ initialSeconds: 300, onComplete });

  const [teamName, setTeamName] = React.useState("Equipo 1 - Naranja");
  const [allWordsFound, setAllWordsFound] = React.useState(false);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (foundWords.size === WORDS.length) {
      setAllWordsFound(true);
    }
  }, [foundWords, WORDS.length]);

  const handleReset = () => {
    reset();
    initializeGame();
    setAllWordsFound(false);
  };

  const handleNewGame = () => {
    reset();
    initializeGame();
    setAllWordsFound(false);
  };

  const handleCellMouseDown = (cell, row, col) => {
    start();
    handleStartSelection(cell, row, col);
  };

  const handleCellMouseEnter = (cell, row, col) => {
    handleMoveSelection(cell, row, col);
  };

  const handleCellTouchStart = (cell, row, col) => {
    start();
    handleStartSelection(cell, row, col);
  };

  const handleCellTouchMove = (cell, row, col) => {
    handleMoveSelection(cell, row, col);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          {/* Tablero */}
          <div className="space-y-6">
            <WordSearchBoard
              grid={grid}
              foundWords={foundWords}
              boardRef={boardRef}
              linesSvgRef={linesSvgRef}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleEndSelection}
              onCellTouchStart={handleCellTouchStart}
              onCellTouchMove={handleCellTouchMove}
              onCellTouchEnd={handleEndSelection}
            />

            {/* Mensaje de completado */}
            {allWordsFound && (
              <div className="bg-emerald-400/10 border border-emerald-400/40 text-emerald-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold">¡Listo! Equipo completó la sopa</p>
                  <p className="text-sm text-emerald-50/80">Comparte el tiempo con el facilitador.</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">
            <WordSearchControls
              timer={time}
              onReset={handleReset}
              onNewGame={handleNewGame}
              teamName={teamName}
              onTeamNameChange={setTeamName}
            />

            <WordSearchWordList
              words={WORDS}
              wordColors={WORD_COLORS}
              foundWords={foundWords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearch2;