import React from "react";

export default function PersonCard({ persona }) {
  if (!persona) return <div className="text-slate-500 text-sm">Selecciona un desafío para ver la persona base.</div>;

  return (
    <div
      className="rounded-2xl p-6 text-white"
      style={{ background: "linear-gradient(135deg,#162b52 0%, #2c5ea0 100%)" }}
    >
      <div className="text-sm uppercase tracking-wider text-slate-300 mb-1">Empatía</div>
      <div className="text-3xl font-extrabold">{persona.name}</div>
      <div className="mt-1 text-slate-300">Edad: {persona.age}</div>
      <p className="mt-3 text-slate-200 leading-relaxed">{persona.story}</p>
    </div>
  );
}
