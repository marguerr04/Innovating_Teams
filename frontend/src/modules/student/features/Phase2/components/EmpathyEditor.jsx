import React, { useState } from "react";
import JuicyButton from "../../../../../components/JuicyButton"; // <--- Importar

export default function EmpathyEditor({ persona, bubbles, categories, onAdd, onRemove, onViewMap, onConfirm }) {
  const [txt, setTxt] = useState("");
  const [cat, setCat] = useState(categories[0].id);

  const add = () => {
    const t = txt.trim();
    if (!t) return;
    onAdd({ text: t, cat });
    setTxt("");
  };

  const nonCenter = bubbles.filter(b => !b.center);

  return (
    <div>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Nuevo atributo</label>
          <textarea
            value={txt}
            onChange={e => setTxt(e.target.value)}
            placeholder="Ej: No confía en pagos online"
            className="w-full rounded-xl border-2 border-slate-300 px-3 py-2 h-20 resize-none focus:border-mint-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="rounded-xl border-2 border-slate-300 px-3 py-2 focus:border-mint-500 outline-none h-[42px]"
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <JuicyButton color="mint" onClick={add} className="self-end text-sm py-2">
          Añadir
        </JuicyButton>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {nonCenter.map(b => {
          const cc = categories.find(x => x.id === b.cat);
          return (
            <div
              key={b.id}
              className={`px-3 py-2 rounded-xl border-b-4 text-sm font-bold flex items-center justify-between ${cc?.cls || "bg-slate-100 text-slate-900 border-slate-300"}`}
            >
              <span className="truncate">{b.text}</span>
              <button onClick={() => onRemove(b.id)} className="ml-2 text-xs opacity-60 hover:opacity-100 font-black">✕</button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <JuicyButton 
          color={nonCenter.length ? "blue" : "gray"} 
          disabled={!nonCenter.length}
          onClick={onConfirm}
        >
          Continuar a Fase 3 →
        </JuicyButton>
      </div>
    </div>
  );
}