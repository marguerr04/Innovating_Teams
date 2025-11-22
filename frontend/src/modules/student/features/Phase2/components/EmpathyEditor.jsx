// src/modules/student/features/Phase2/components/EmpathyEditor.jsx
import React, { useState } from "react";
import JuicyButton from "../../../../../components/JuicyButton";

export default function EmpathyEditor({ persona, bubbles, categories, onAdd, onRemove, onViewMap, onConfirm }) {
  const [txt, setTxt] = useState("");
  const [cat, setCat] = useState(categories[0].id);

  const add = () => {
    const t = txt.trim();
    if (!t) return;
    onAdd({ text: t, cat });
    setTxt("");
  };

  // Handler para agregar con la tecla Enter (sin Shift)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      add();
    }
  };

  const nonCenter = bubbles.filter(b => !b.center);

  return (
    <div className="flex flex-col h-full">
      
      {/* --- CAMBIO: Estructura Vertical --- */}
      <div className="flex flex-col gap-4 mb-6 bg-white p-1 rounded-xl">
        
        {/* 1. Categoría (Ahora Arriba) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            1. Selecciona Categoría
          </label>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-mint-500 outline-none text-base font-medium transition-colors cursor-pointer hover:border-slate-300"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Input de Texto (Ahora Abajo y más Grande) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            2. Escribe el atributo
          </label>
          <textarea
            value={txt}
            onChange={e => setTxt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Se siente frustrado porque..."
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 h-32 text-lg resize-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 outline-none transition-all placeholder:text-slate-400"
          />
          <div className="text-xs text-slate-400 text-right mt-1">Presiona Enter para añadir</div>
        </div>
        
        {/* 3. Botón Añadir (Full Width) */}
        <JuicyButton color="mint" onClick={add} className="w-full py-3 text-base shadow-md">
          + Añadir al Mapa
        </JuicyButton>
      </div>

      {/* Lista de burbujas agregadas */}
      <div className="flex-1 overflow-y-auto min-h-[100px] pr-1">
        <div className="grid grid-cols-1 gap-2">
          {nonCenter.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4 italic">
              Aún no has agregado nada. ¡Empieza arriba!
            </p>
          )}
          
          {nonCenter.map(b => {
            const cc = categories.find(x => x.id === b.cat);
            return (
              <div
                key={b.id}
                className={`px-4 py-3 rounded-xl border-l-4 text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${cc?.cls || "bg-slate-50 border-slate-300"}`}
              >
                <span className="break-words w-full mr-2">{b.text}</span>
                <button 
                  onClick={() => onRemove(b.id)} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <JuicyButton 
          color={nonCenter.length ? "blue" : "gray"} 
          disabled={!nonCenter.length}
          onClick={onConfirm}
          className="w-full sm:w-auto px-8"
        >
          Confirmar Mapa y Continuar →
        </JuicyButton>
      </div>
    </div>
  );
}