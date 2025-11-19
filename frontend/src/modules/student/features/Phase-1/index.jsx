// src/modules/student/features/Phase-1/index.jsx
import React, { useState, useEffect } from 'react';

// --- SIMULACIÓN DE DATOS DEL BACKEND ---
const MOCK_BACKEND_RESPONSE = [
  { 
    id: 1, 
    name: "Grupo 1 - Innovadores", 
    members: ["Valentina", "Matías", "Sofía", "Lucas"], 
    max: 4, 
    color: "bg-amber-100 text-amber-800 border-amber-200" 
  },
  { 
    id: 2, 
    name: "Grupo 2 - Visionarios", 
    members: ["Isabella", "Benjamín", "Emma", "Joaquín"], 
    max: 4, 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200" 
  },
  { 
    id: 3, 
    name: "Grupo 3 - Estrategas", 
    members: ["Martina", "Agustín", "Emilia", "Tomás"], 
    max: 4, 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200" 
  },
  { 
    id: 4, 
    name: "Grupo 4 - Creativos", 
    members: ["Catalina", "Vicente", "Fernanda", "Nicolás"], 
    max: 4, 
    color: "bg-rose-100 text-rose-800 border-rose-200" 
  }
];

export default function PhaseSalaEspera({ onStart, isProf }) {
  
  // Estado inicial: grupos vacíos (Placeholder)
  const [groups, setGroups] = useState([
    { id: 1, name: "Grupo 1", members: [], max: 4, color: "bg-slate-100 text-slate-600 border-slate-200" },
    { id: 2, name: "Grupo 2", members: [], max: 4, color: "bg-slate-100 text-slate-600 border-slate-200" },
    { id: 3, name: "Grupo 3", members: [], max: 4, color: "bg-slate-100 text-slate-600 border-slate-200" },
    { id: 4, name: "Grupo 4", members: [], max: 4, color: "bg-slate-100 text-slate-600 border-slate-200" }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  // --- EFECTO: CONEXIÓN AL BACKEND (Simulada) ---
  useEffect(() => {
    let currentGroupIdx = 0;
    
    const interval = setInterval(() => {
      // Verificación de seguridad: detener si nos pasamos del límite
      if (currentGroupIdx >= MOCK_BACKEND_RESPONSE.length) {
        clearInterval(interval);
        setIsLoading(false);
        return;
      }

      setGroups(prev => {
        const nextGroups = [...prev];
        // Verificación extra: Asegurarnos de que el dato existe antes de asignarlo
        const incomingGroup = MOCK_BACKEND_RESPONSE[currentGroupIdx];
        if (incomingGroup) {
          nextGroups[currentGroupIdx] = incomingGroup;
        }
        return nextGroups;
      });
      
      currentGroupIdx++;
    }, 800); 

    return () => clearInterval(interval);
  }, []);

  // Calcular total de jugadores conectados (CON PROTECCIÓN '?.')
  const totalPlayers = groups.reduce((acc, g) => acc + (g?.members?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      
      {/* --- HEADER --- */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mint-400 via-blue-500 to-purple-500"></div>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Sala de Espera</h1>
        
        <div className="inline-block bg-slate-100 rounded-xl px-6 py-3 mb-6 border border-slate-200">
          <span className="text-slate-500 text-sm uppercase tracking-wider font-bold mr-3">PIN DE LA SALA:</span>
          <span className="text-3xl font-mono font-bold text-slate-800 tracking-widest">587455</span>
        </div>

        <p className="text-slate-600 mb-6 max-w-2xl mx-auto text-lg">
          {isLoading 
            ? "Sincronizando lista de grupos del profesor..." 
            : "¡Todos los grupos están listos! Esperando inicio."}
        </p>

        {/* GIF Lúdico */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXBhZ2Z5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5/xTk9ZvMnbIiIew7IpW/giphy.gif" 
            alt="Esperando..." 
            className="h-32 rounded-xl shadow-inner object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        
        {/* Botón de inicio */}
        {isProf && (
          <button
            onClick={onStart}
            className="btn bg-mint-500 hover:bg-mint-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105"
          >
            ▶ Iniciar Votación Ahora
          </button>
        )}
      </div>

      {/* --- GRID DE GRUPOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((group, index) => {
          // Protección: Si el grupo es undefined, renderizar un placeholder seguro
          if (!group) return <div key={index} className="bg-slate-50 rounded-2xl h-40 animate-pulse"></div>;

          const hasMembers = group.members && group.members.length > 0;
          const headerColorClass = hasMembers 
            ? group.color.replace('text-', 'bg-').replace('border-', '').split(' ')[0].replace('100', '50') 
            : 'bg-slate-50';

          return (
            <div key={group.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 flex flex-col transition-all duration-500">
              
              {/* Cabecera del Grupo */}
              <div className={`p-4 border-b border-slate-100 flex justify-between items-center transition-colors duration-500 ${headerColorClass}`}>
                <h3 className={`font-bold truncate ${hasMembers ? 'text-slate-800' : 'text-slate-400'}`}>
                  {group.name}
                </h3>
                <span className="bg-white/80 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                  {group.members?.length || 0}/{group.max}
                </span>
              </div>

              {/* Lista de Miembros */}
              <div className="p-4 flex-1 min-h-[140px] bg-slate-50/30">
                {!hasMembers ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-sm animate-pulse">
                    <span>Esperando datos...</span>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {group.members.map((member, idx) => (
                      <li key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-300">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getAvatarColor(idx)}`}>
                          {member.charAt(0)}
                        </div>
                        <span className="text-slate-700 font-medium text-sm">{member}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white px-5 py-2 rounded-full shadow-lg border border-white/10">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-75 ${isLoading ? 'block' : 'hidden'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLoading ? 'bg-mint-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className="font-mono font-bold text-lg">{totalPlayers}</span>
          <span className="text-sm font-medium opacity-90">jugadores cargados</span>
        </span>
      </div>

    </div>
  );
}

// Helper para colores (sin cambios)
function getAvatarColor(index) {
  const colors = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", 
    "bg-green-500", "bg-emerald-500", "bg-teal-500", 
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", 
    "bg-indigo-500", "bg-violet-500", "bg-purple-500", 
    "bg-fuchsia-500", "bg-pink-500", "bg-rose-500"
  ];
  return colors[index % colors.length];
}