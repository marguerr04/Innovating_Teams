import React, { useState } from "react";

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
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Nuevo atributo</label>
          <input
            value={txt}
            onChange={e => setTxt(e.target.value)}
            placeholder="Ej: No confía en pagos online"
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2"
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={add} className="btn bg-mint-500 text-white">Añadir</button>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {nonCenter.map(b => {
          const cc = categories.find(x => x.id === b.cat);
          return (
            <div
              key={b.id}
              className={`px-3 py-2 rounded-full border text-sm font-semibold flex items-center justify-between ${cc?.cls || "bg-slate-100 text-slate-900 border-slate-200"}`}
            >
              <span className="truncate">{b.text}</span>
              <button onClick={() => onRemove(b.id)} className="ml-2 text-xs opacity-70 hover:opacity-100">✕</button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="btn bg-slate-100" onClick={onViewMap}>Vista previa</button>
        <button
          className={`btn ${nonCenter.length ? "bg-accent-500 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
          disabled={!nonCenter.length}
          onClick={onConfirm}
        >
          Continuar a Fase 3
        </button>
      </div>
    </div>
  );
}
