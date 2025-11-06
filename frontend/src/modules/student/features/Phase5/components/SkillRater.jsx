import React, { useState } from 'react';

export default function SkillRater({ skill, value, onRate }) {
  // Estado local para mostrar/ocultar la descripción
  const [showDesc, setShowDesc] = useState(false);
  const val = value; // 'value' es el score actual (ej. 5)

  return (
    // Card de habilidad (de index.html)
    <div className="bg-slate-50 rounded-2xl p-4">
      {/* Header de la habilidad (título y botón 'ver') */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => setShowDesc(!showDesc)} // Controla el estado local
        >
          <span className="font-semibold text-slate-900">{skill.label}</span>
          <span className="text-xs bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full">
            ver descripción
          </span>
        </button>
        <span className="hidden md:inline text-xs text-slate-400">Califica de 1 a 10</span>
      </div>

      {/* Descripción (se muestra con 'max-h-40') */}
      <div
        className={`text-sm text-slate-500 overflow-hidden transition-all duration-200 ${
          showDesc ? 'max-h-40' : 'max-h-0'
        }`}
      >
        {skill.desc}
      </div>

      {/* Grilla de 10 botones (de index.html) */}
      <div className="mt-4">
        <div className="grid grid-cols-10 gap-3">
          {Array.from({ length: 10 }).map((_, i) => {
            const n = i + 1;
            const isActive = n === val;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onRate(skill.key, n)} // Llama a la función del padre
                className={
                  "w-full aspect-square min-h-[38px] rounded-full flex items-center justify-center font-semibold transition " +
                  (isActive
                    ? "bg-[#00B8A9] text-white shadow-md" // bg-mint-500
                    : "bg-white text-slate-600 hover:bg-slate-100")
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
    </div>
  );
}