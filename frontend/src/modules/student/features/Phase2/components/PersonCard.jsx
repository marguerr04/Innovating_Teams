// src/modules/student/features/Phase2/components/PersonCard.jsx
import React from "react";

const AVATAR_MAP = {
  Osvaldo: "/avatars/osvaldo.png",
  Humberto: "/avatars/humberto.png",
  Simona: "/avatars/simona.png",
  Juana: "/avatars/juana.png",
  Martina: "/avatars/martina.png",
  Andrés: "/avatars/andres.png",
  Gabriela: "/avatars/gabriela.png",
  Camila: "/avatars/camila.png",
  Francisco: "/avatars/francisco.png",
  Luis: "/avatars/luis.png",
};
const DEFAULT_AVATAR = "/avatars/default.png";

export default function PersonCard({ persona }) {
  if (!persona) return <div className="text-slate-500 text-sm bg-slate-100 p-4 rounded-xl text-center h-full flex items-center justify-center">Selecciona un desafío para ver a la persona.</div>;

  const avatarSrc = AVATAR_MAP[persona.name] || DEFAULT_AVATAR;

  return (
    <div
      className="rounded-2xl p-6 text-white flex flex-col h-full relative overflow-hidden shadow-xl"
      style={{ background: "linear-gradient(135deg,#162b52 0%, #2c5ea0 100%)" }}
    >
      {/* Cabecera Fija: Avatar + Nombre */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0 border-b border-white/20 pb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white flex-shrink-0">
          <img src={avatarSrc} alt={persona.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">Usuario</div>
          <div className="text-2xl font-extrabold leading-none">{persona.name}</div>
          <div className="text-sm text-blue-100 mt-1 font-medium">{persona.age} años</div>
        </div>
      </div>
      
      {/* Cuerpo Scrollable: Contexto + Historia */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        
        {/* Bloque 1: Contexto (Situación General) */}
        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
          <h4 className="text-blue-200 text-xs font-bold uppercase mb-2 flex items-center gap-2">
            <span>🌍</span> Contexto / Problemática
          </h4>
          <p className="text-sm text-white leading-relaxed font-light opacity-90">
            {persona.context}
          </p>
        </div>

        {/* Bloque 2: Historia (Situación Personal) */}
        <div className="bg-white/20 p-4 rounded-xl border border-white/20">
          <h4 className="text-blue-100 text-xs font-bold uppercase mb-2 flex items-center gap-2">
            <span>👤</span> Historia de {persona.name}
          </h4>
          <p className="text-base text-white leading-relaxed font-medium">
            {persona.story}
          </p>
        </div>

      </div>
    </div>
  );
}