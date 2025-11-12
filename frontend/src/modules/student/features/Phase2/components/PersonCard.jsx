// src/modules/student/features/Phase2/components/PersonCard.jsx
import React from "react";

// 1. LÓGICA PARA MAPEAR NOMBRES A AVATARES
// (Asegúrate que los nombres coincidan con los de tu const CHALL)
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
const DEFAULT_AVATAR = "/avatars/default.png"; // Imagen por defecto

export default function PersonCard({ persona }) {
  if (!persona) return <div className="text-slate-500 text-sm">Selecciona un desafío para ver la persona base.</div>;

  // 2. OBTENER LA IMAGEN
  const avatarSrc = AVATAR_MAP[persona.name] || DEFAULT_AVATAR;

  return (
    // 3. LAYOUT ACTUALIZADO CON FLEX
    <div
      className="rounded-2xl p-6 text-white flex flex-col h-full" // h-full para que ocupe el espacio en el grid del modal
      style={{ background: "linear-gradient(135deg,#162b52 0%, #2c5ea0 100%)" }}
    >
      {/* Contenedor del Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 shadow-lg mb-4 flex-shrink-0">
        <img src={avatarSrc} alt={persona.name} className="w-full h-full object-cover" />
      </div>
      
      {/* Contenido de Texto */}
      <div>
        <div className="text-sm uppercase tracking-wider text-slate-300 mb-1">Empatía</div>
        <div className="text-3xl font-extrabold">{persona.name}</div>
        <div className="mt-1 text-slate-300">Edad: {persona.age}</div>
        <p className="mt-3 text-slate-200 leading-relaxed">{persona.story}</p>
      </div>
    </div>
  );
}