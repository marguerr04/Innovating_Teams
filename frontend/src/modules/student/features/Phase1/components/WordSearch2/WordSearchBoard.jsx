import React, { useEffect } from 'react';

const WordSearchBoard = ({ 
  grid, 
  foundWords,
  boardRef, 
  linesSvgRef,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd
}) => {
  useEffect(() => {
    const handleResize = () => {
      if (boardRef.current && linesSvgRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        linesSvgRef.current.setAttribute("width", rect.width);
        linesSvgRef.current.setAttribute("height", rect.height);
        linesSvgRef.current.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [boardRef, linesSvgRef]);

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 md:p-6 relative">
      <div id="board-wrapper" className="w-full max-w-4xl mx-auto">
        <svg 
          ref={linesSvgRef}
          id="linesSvg"
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <div 
          ref={boardRef}
          id="board"
          className="noselect grid grid-cols-16 gap-1 sm:gap-2 w-full aspect-square"
          style={{ 
            gridTemplateColumns: 'repeat(16, minmax(0, 1fr))'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  board-cell flex items-center justify-center bg-slate-900/40 hover:bg-emerald-400/15 
                  rounded-lg sm:rounded-xl font-semibold text-white cursor-pointer text-xs sm:text-sm md:text-base
                  transition-colors duration-200 select-none
                  ${foundWords.has(letter) ? 'cell-found bg-emerald-500 text-white' : ''}
                `}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={(e) => onCellMouseDown(e.currentTarget, rowIndex, colIndex)}
                onMouseEnter={(e) => onCellMouseEnter(e.currentTarget, rowIndex, colIndex)}
                onMouseUp={onCellMouseUp}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onCellTouchStart(e.currentTarget, rowIndex, colIndex);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (element?.classList?.contains('board-cell')) {
                    onCellTouchMove(element, parseInt(element.dataset.row), parseInt(element.dataset.col));
                  }
                }}
                onTouchEnd={onCellTouchEnd}
              >
                {letter}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WordSearchBoard;