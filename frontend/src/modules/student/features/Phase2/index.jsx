
import React, { useState } from "react";
import AreaSelector from "./components/AreaSelector";
import PersonaCard from "./components/PersonCard";
import EmpathyEditor from "./components/EmpathyEditor";
import DraggableMap from "./components/DraggableMap";
import "./Phase2.css"; // Estilos locales de la Fase 2

export default function Phase2({ onNext }) {
  const AREAS = [
    { id: "salud", name: "Salud" },
    { id: "sustentabilidad", name: "Sustentabilidad" },
    { id: "educacion", name: "Educación" },
  ];

  const CHALL = {
    salud: [
      {
        id: "adultos",
        title: "Adultos mayores y tecnología",
        persona: {
          name: "Osvaldo",
          age: 70,
          story: "Le cuesta adaptarse a trámites digitales y apps; depende de su familia para gestiones en línea.",
        },
      },
    ],
    sustentabilidad: [
      {
        id: "agua",
        title: "Sustentabilidad del agua en agricultura",
        persona: {
          name: "Camila",
          age: 50,
          story: "Productora agrícola preocupada por la escasez de agua dulce.",
        },
      },
    ],
    educacion: [
      {
        id: "brecha",
        title: "Brecha digital en educación",
        persona: {
          name: "Luis",
          age: 12,
          story: "Acceso limitado a internet y dispositivos; se atrasa en clases.",
        },
      },
    ],
  };

  const CATS = [
    { id: "necesidades", name: "Necesidades", cls: "bg-emerald-100 text-emerald-900 border-emerald-200" },
    { id: "dolores", name: "Dolores", cls: "bg-rose-100 text-rose-900 border-rose-200" },
    { id: "objetivos", name: "Objetivos", cls: "bg-indigo-100 text-indigo-900 border-indigo-200" },
  ];

  const [state, setState] = useState({
    area: null,
    challengeId: null,
    persona: null,
    bubbles: [],
  });

  const [showMap, setShowMap] = useState(false);

  const handleAdd = (bubble) => {
    const id = Math.random().toString(36).slice(2);
    setState((s) => ({
      ...s,
      bubbles: [
        ...s.bubbles,
        { id, ...bubble, x: 80 + Math.random() * 200, y: 100 + Math.random() * 200 },
      ],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">
        Fase 2 · Selección y Mapa de Empatía
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <AreaSelector
          area={state.area}
          challengeId={state.challengeId}
          areas={AREAS}
          challenges={CHALL}
          onSelectArea={(id) =>
            setState((s) => ({ ...s, area: id, challengeId: null, persona: null }))
          }
          onSelectChallenge={(id) => {
            const persona = CHALL[state.area].find((c) => c.id === id)?.persona;
            setState((s) => ({ ...s, challengeId: id, persona }));
          }}
        />

        <div className="md:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Ficha de la Persona</h2>
            {state.persona && (
              <button
                className="btn bg-slate-100"
                onClick={() => setShowMap(true)}
              >
                Ver / Editar bubble map
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-[260px,1fr] gap-6">
            {/* Tarjeta de persona */}
            <PersonaCard persona={state.persona} />

            {/* Editor de empatía */}
            {state.persona && (
              <EmpathyEditor
                persona={state.persona}
                bubbles={state.bubbles}
                categories={CATS}
                onAdd={handleAdd}
                onRemove={(id) =>
                  setState((s) => ({
                    ...s,
                    bubbles: s.bubbles.filter((b) => b.id !== id),
                  }))
                }
                onViewMap={() => setShowMap(true)}
                onConfirm={onNext}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal del mapa */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card bg-white p-6 w-[90%] max-w-4xl relative">
            <button
              className="absolute top-4 right-4 btn btn-ghost"
              onClick={() => setShowMap(false)}
            >
              ✕
            </button>
            <DraggableMap
              persona={state.persona}
              bubbles={state.bubbles}
              applyBubbles={(b) =>
                setState((s) => ({ ...s, bubbles: b }))
              }
              canDrag
            />
          </div>
        </div>
      )}
    </div>
  );
}
