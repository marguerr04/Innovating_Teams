import React from 'react';

export default function SkillRater({ skill, value, onRate }) {
  const val = value; // 'value' es el score actual (ej. 5)

  return (
    // Card de habilidad simple
    <div className="bg-slate-50 rounded-2xl p-4">
      {/* Header con título y descripción */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex-1">
          <span className="font-semibold text-slate-900">{skill.label}</span>
          {/* Descripción siempre visible debajo del título */}
          <p className="text-sm text-slate-500 mt-1">{skill.desc}</p>
        </div>
        <span className="hidden md:inline text-xs text-slate-400">Califica de 1 a 10</span>
      </div>

      {/* Grilla de 10 botones */}
      <div className="grid grid-cols-10 gap-3 mt-4">
        {Array.from({ length: 10 }).map((_, i) => {
          const n = i + 1;
          const isActive = n === val;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onRate(skill.key, n)}
              className={
                "w-full aspect-square rounded-xl font-bold text-lg transition-all border-b-4 active:border-b-0 active:translate-y-1 " +
                (isActive
                  ? "bg-[#3AB6B5] border-[#2E8F8E] text-white" // Mint activo
                  : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200")
              }
            >
              {n}
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>1 = no se reflejó</span>
        <span>5 = se reflejó</span>
        <span>10 = totalmente reflejada</span>
      </div>
    </div>
  );
}