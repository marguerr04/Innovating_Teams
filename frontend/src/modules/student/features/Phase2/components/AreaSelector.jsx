import React from "react";

export default function AreaSelector({ area, challengeId, onSelectArea, onSelectChallenge, areas, challenges }) {
  return (
    <div className="card p-6">
      <h2 className="font-bold mb-2">Área</h2>
      <div className="flex flex-col gap-2">
        {areas.map(a => (
          <button
            key={a.id}
            onClick={() => onSelectArea(a.id)}
            className={`btn text-left ${area === a.id ? "bg-mint-500 text-white" : "bg-slate-100"}`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <h2 className="font-bold mt-6 mb-2">Desafío</h2>
      <div className="flex flex-col gap-2">
        {!area && <div className="text-slate-500 text-sm">Primero elige un área</div>}
        {area && challenges[area].map(c => (
          <button
            key={c.id}
            onClick={() => onSelectChallenge(c.id)}
            className={`btn text-left ${challengeId === c.id ? "bg-mint-500 text-white" : "bg-slate-100"}`}
          >
            {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}
