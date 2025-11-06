// src/modules/student/features/Phase6/components/CierrePedagogico.jsx
import React, { useState } from 'react';

// 1. Importa el Timer global
// (Ruta: .../Phase6/components -> Phase6 -> features -> student -> modules -> src -> components)
import Timer from '../../../../../components/Timer.jsx';

// Constantes de texto (de index.html)
const skillTexts = {
  empatia: [
    'La empatía fue clave para comprender las necesidades reales de las personas y diseñar propuestas con impacto social.',
    'Todo emprendimiento significativo comienza por mirar al otro y reconocer su contexto.',
    'Sin empatía no hay innovación útil: solo ideas desconectadas de la realidad.'
  ],
  equipo: [
    'El trabajo en equipo nos enseñó a coordinar esfuerzos, valorar las diferencias y alcanzar metas comunes.',
    'Los equipos que más avanzaron fueron los que colaboraron y construyeron sobre las ideas de los demás.',
    'Emprender no es un camino individual, sino una construcción colectiva.'
  ],
  creatividad: [
    'La creatividad impulsó la generación de ideas originales y la capacidad de innovar frente a los desafíos.',
    'La usamos para convertir problemas en oportunidades y para imaginar soluciones distintas.',
    'La creatividad es la chispa que mantiene vivo el espíritu emprendedor.'
  ],
  comunicacion: [
    'La comunicación fue el puente que unió a los equipos y permitió expresar, convencer e inspirar.',
    'Comunicar con claridad y propósito es esencial para liderar y proyectar una visión.',
    'Cuando las ideas se cuentan bien, las personas se suman.'
  ],
  feedback: [
    'El feedback nos permitió mejorar, ajustar y crecer.',
    'Aprendimos a recibir retroalimentación y a dar comentarios que ayuden al otro.',
    'Con esto claro, ahora sí podemos ver el resultado del juego: el ranking final por tokens.'
  ],
};

// Duración de la Fase 6 (5 minutos)
const PHASE_6_DURATION = 300; 

export default function CierrePedagogico({ isProf, onNext, onBack }) {
  const [activeSkill, setActiveSkill] = useState('empatia');

  return (
    // Contenedor principal de esta vista (de index.html)
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Cierre pedagógico</h1>
      <div className="bg-white/95 rounded-3xl shadow-2xl grid md:grid-cols-[270px,1fr] overflow-hidden">
        
        {/* Columna Izquierda (Menú de Habilidades y Timer) */}
        <div className="bg-gradient-to-b from-white via-sky-50 to-sea-500/80 p-5 space-y-3">
          
          {/* Reemplaza el timer estático por el componente Timer */}
          <div className="p-4 bg-white/60 rounded-xl">
            <Timer initialSeconds={PHASE_6_DURATION} isProf={isProf} />
          </div>

          <div className="space-y-2">
            {[
              ['empatia', '💗', 'Empatía'],
              ['equipo', '🤝', 'Trabajo en equipo'],
              ['creatividad', '✨', 'Creatividad'],
              ['comunicacion', '🗣', 'Comunicación'],
              ['feedback', '📩', 'Feedback'],
            ].map(([key, icon, label]) => (
              <button 
                key={key} 
                onClick={() => setActiveSkill(key)}
                className={`w-full px-4 py-2 rounded-xl flex items-center gap-3 text-sm transition ${
                  activeSkill === key ? 'bg-white text-sea-600 shadow-sm' : 'bg-white/40 text-slate-800/90'
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha (Texto Descriptivo) */}
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-sea-600 mb-1">En Misión Emprende,</h2>
          <p className="text-slate-700 mb-4">
            Cada etapa estuvo diseñada para fortalecer <b>habilidades emprendedoras</b> que permiten transformar ideas en soluciones con sentido humano.
          </p>
          <div className="space-y-2 text-slate-800 text-[0.9rem] leading-relaxed">
            {skillTexts[activeSkill].map((p, idx) => <p key={idx}>{p}</p>)}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={onNext} className="btn bg-sea-500 text-white hover:bg-sea-600">
              Ver podio final →
            </button>
            <button onClick={onBack} className="btn-ghost text-slate-700">← Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
}