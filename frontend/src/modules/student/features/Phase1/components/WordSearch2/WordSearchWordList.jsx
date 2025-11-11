import React from 'react';

const WordSearchWordList = ({ words, wordColors, foundWords }) => {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 max-h-[430px] overflow-y-auto">
      <h2 className="text-xs uppercase text-slate-200/60 mb-3">Palabras ({words.length})</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {words.map((word, index) => (
          <li
            key={word}
            data-word={word}
            className={`
              px-3 py-2 bg-slate-950/40 rounded-2xl border border-white/5 
              flex items-center gap-2 transition-all duration-200
              ${foundWords.has(word) 
                ? 'word-found text-emerald-400 line-through font-semibold' 
                : 'text-white'
              }
            `}
          >
            <span 
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ 
                backgroundColor: wordColors[index % wordColors.length].replace('0.45', '1')
              }}
            />
            <span className="truncate">{word}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordSearchWordList;