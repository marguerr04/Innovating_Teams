import React from 'react';

const WordSearchControls = ({ 
  timer, 
  onReset, 
  onNewGame, 
  teamName = "Equipo 1 - Naranja",
  onTeamNameChange 
}) => {
  return (
    <div className="space-y-4">
      {/* Timer y Equipo */}
      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[0.6rem] uppercase text-slate-200/40 mb-1">tiempo</p>
            <p className="text-2xl sm:text-3xl font-mono text-emerald-300">{timer}</p>
          </div>
          <div className="text-right">
            <h1 className="text-lg sm:text-xl font-semibold">Sopa de Letras</h1>
            <p className="text-xs text-slate-200/70">16×16 · Responsive</p>
          </div>
        </div>
        
        <div>
          <p className="text-[0.6rem] uppercase text-slate-200/40 mb-1">equipo</p>
          <input 
            value={teamName}
            onChange={(e) => onTeamNameChange?.(e.target.value)}
            className="w-full bg-slate-950/20 border border-white/10 rounded-2xl px-3 py-2 text-sm"
            placeholder="Nombre del equipo"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-4 flex gap-3">
        <button 
          onClick={onReset}
          className="flex-1 bg-slate-950/40 rounded-2xl py-2 hover:bg-slate-950/60 transition-colors"
        >
          Reiniciar
        </button>
        <button 
          onClick={onNewGame}
          className="flex-1 bg-emerald-400/80 text-slate-950 rounded-2xl py-2 font-semibold hover:bg-emerald-400 transition-colors"
        >
          Nueva sopa
        </button>
      </div>
    </div>
  );
};

export default WordSearchControls;