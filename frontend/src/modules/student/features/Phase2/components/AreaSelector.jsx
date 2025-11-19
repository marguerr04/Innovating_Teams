import React from "react";
import JuicyButton from "../../../../../components/JuicyButton"; // <--- Importar

export default function AreaSelector({ area, challengeId, onSelectArea, onSelectChallenge, areas, challenges }) {
  return (
    <div className="card p-6">
      <h2 className="font-bold mb-2">Área</h2>
      <div className="flex flex-col gap-3"> {/* Aumenté gap a 3 para espacio del borde 3D */}
        {areas.map(a => (
          <JuicyButton
            key={a.id}
            color={area === a.id ? "mint" : "gray"}
            onClick={() => onSelectArea(a.id)}
            className="w-full text-left"
          >
            {a.name}
          </JuicyButton>
        ))}
      </div>

      <h2 className="font-bold mt-6 mb-2">Desafío</h2>
      <div className="flex flex-col gap-3">
        {!area && <div className="text-slate-500 text-sm">Primero elige un área</div>}
        {area && challenges[area].map(c => (
          <JuicyButton
            key={c.id}
            color={challengeId === c.id ? "blue" : "gray"}
            onClick={() => onSelectChallenge(c.id)}
            className="w-full text-left"
          >
            {c.title}
          </JuicyButton>
        ))}
      </div>
    </div>
  );
}