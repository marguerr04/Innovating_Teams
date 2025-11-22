import React, { useState, useEffect } from "react";
import { load, save } from '../../../../utils/helpers.js';
import Timer from '../../../../components/Timer.jsx';

// Importa los componentes
import AreaSelector from "./components/AreaSelector";
import PersonaCard from "./components/PersonCard";
import EmpathyEditor from "./components/EmpathyEditor";
import DraggableMap from "./components/DraggableMap";
import "./Phase2.css";

const STORAGE_KEY = 'it_phase2_store';
const PHASE_2_DURATION = 480;

export default function Phase2({ onNext, isProf }) {
  
  const AREAS = [
    { id: "salud", name: "Salud" },
    { id: "sustentabilidad", name: "Sustentabilidad" },
    { id: "educacion", name: "Educación" },
  ];

  // --- CAMBIO: DATA SEPARADA EN CONTEXTO Y HISTORIA ---
  const CHALL = {
    salud: [
      { 
        id: "tto", 
        title: "Autogestión de tratamientos", 
        persona: { 
          name: "Humberto", 
          age: 50, 
          // Contexto General
          context: "Muchos errores médicos y complicaciones surgen al cambiar de un centro de salud a otro, por falta de continuidad y seguimiento personalizado.",
          // Historia Personal
          story: "Don Humberto fue dado de alta con indicaciones médicas complejas, pero no entendió qué debía seguir tomando ni a quién acudir si se sentía mal." 
        }
      },
      { 
        id: "obesidad", 
        title: "Obesidad", 
        persona: { 
          name: "Simona", 
          age: 27, 
          context: "Más de un 70% de la población en Chile presenta sobrepeso u obesidad (MINSAL). Esta situación se debe a múltiples factores: falta de ejercicio, mala educación nutricional y exceso de productos ultraprocesados.",
          story: "Simona tiene una hija pequeña y trabaja tiempo completo. Sabe que la alimentación es clave, pero no ha podido organizar sus tiempos ni aprender a darle una nutrición saludable a su hija." 
        }
      },
      { 
        id: "envejecimiento", 
        title: "Envejecimiento activo", 
        persona: { 
          name: "Juana", 
          age: 72, 
          context: "La población chilena está envejeciendo rápidamente y muchos adultos mayores enfrentan soledad, pérdida de movilidad y falta de programas de prevención.",
          story: "Juana vive sola desde que sus hijos se independizaron. Le gustaría mantenerse activa, pero no conoce programas accesibles que la motiven a hacer ejercicio, socializar y prevenir enfermedades." 
        }
      },
    ],
    educacion: [
      { 
        id: "financiera", 
        title: "Educación financiera accesible", 
        persona: { 
          name: "Martina", 
          age: 22, 
          context: "La ausencia de educación financiera en realidades económicas inestables dificulta la planificación y el uso responsable del dinero.",
          story: "Martina es una joven emprendedora que vende productos por redes sociales. Aunque gana dinero, no sabe cómo organizarlo ni cuánto debe ahorrar o invertir, lo que la mantiene en constante inestabilidad." 
        }
      },
      { 
        id: "laboral", 
        title: "Inicio de vida laboral", 
        persona: { 
          name: "Andrés", 
          age: 23, 
          context: "Muchos estudiantes recién titulados enfrentan barreras para conseguir su primer empleo, ya que se les exige experiencia previa que aún no han podido adquirir.",
          story: "Andrés acaba de egresar de odontología. Le preocupa no poder trabajar pronto, pero ninguna clínica lo ha llamado porque no tiene experiencia previa." 
        }
      },
      { 
        id: "adultos-tec", 
        title: "Tecnología adultos mayores", 
        persona: { 
          name: "Osvaldo", 
          age: 70, 
          context: "El avance tecnológico ha beneficiado a múltiples sectores, sin embargo, la adaptación para los adultos mayores ha sido una gran dificultad por la brecha digital.",
          story: "Osvaldo es un adulto mayor que debe pedir ayuda a sus hijos o nietos cada vez que necesita hacer trámites digitales, sintiéndose dependiente." 
        }
      },
    ],
    sustentabilidad: [
      { 
        id: "fast-fashion", 
        title: "Contaminación por fast fashion", 
        persona: { 
          name: "Gabriela", 
          age: 18, 
          context: "La moda rápida ha traído graves consecuencias al medio ambiente, especialmente en el norte de Chile donde los vertederos textiles afectan la calidad de vida.",
          story: "Gabriela es una estudiante que vive cerca de esta zona y debe pasar a diario por lugares con desagradables olores y contaminación visual producto de la ropa desechada." 
        }
      },
      { 
        id: "agua", 
        title: "Acceso al agua en la agricultura", 
        persona: { 
          name: "Camila", 
          age: 50, 
          context: "El agua dulce es un recurso fundamental que se ha vuelto escaso en zonas rurales, afectando la agricultura y la vida diaria.",
          story: "Camila es una agricultora de paltas de exportación. Está muy complicada y teme perder su negocio familiar por la gran cantidad de agua que requiere su cultivo." 
        }
      },
      { 
        id: "residuos", 
        title: "Gestión de residuos electrónicos", 
        persona: { 
          name: "Francisco", 
          age: 29, 
          context: "El consumo tecnológico ha generado toneladas de desechos electrónicos difíciles de reciclar que terminan acumulados en los hogares.",
          story: "Francisco cambió su celular y computador el año pasado, pero no sabe dónde llevar los antiguos. Terminó guardándolos en un cajón, sin saber que existen alternativas de reciclaje." 
        }
      },
    ],
  };

  const CATS = [
    { id: "necesidades", name: "Necesidades", cls: "bg-emerald-100 text-emerald-900 border-emerald-200" },
    { id: "dolores", name: "Dolores", cls: "bg-rose-100 text-rose-900 border-rose-200" },
    { id: "objetivos", name: "Objetivos", cls: "bg-indigo-100 text-indigo-900 border-indigo-200" },
  ];

  // --- Lógica de estado (Igual que antes) ---
  const [state, setState] = useState(() => load(STORAGE_KEY, {
    area: null,
    challengeId: null,
    persona: null,
    bubbles: [],
  }));
  useEffect(() => {
    save(STORAGE_KEY, state);
  }, [state]); 
  
  const [view, setView] = useState('selection'); 
  const [showMap, setShowMap] = useState(false);
  
  const handleAdd = (bubble) => {
    const id = Math.random().toString(36).slice(2);
    setState((s) => ({
      ...s,
      bubbles: [ ...s.bubbles, { id, ...bubble } ],
    }));
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold">
            Empatía · {view === 'selection' ? 'Selección de Desafío' : 'Mapa de Empatía'}
          </h1>
          <div className="card p-4">
            <Timer 
              initialSeconds={PHASE_2_DURATION} 
              isProf={isProf} 
              autoStart={true}
            />
          </div>
        </div>

        {view === 'selection' ? (
          <div className="mb-8 max-w-4xl">
            <p className="text-xl md:text-3xl text-white/95 font-bold mb-3">
              Tu misión: Seleccionar a quién ayudarás hoy.
            </p>
            <p className="text-lg md:text-2xl text-white/80 leading-snug">
              Explora las áreas y desafíos abajo. Lee las historias y pregúntate: 
              <br/><em className="text-mint-200">¿Qué problema nos motiva más resolver como equipo?</em>
            </p>
          </div>
        ) : (
          <div className="mb-8 max-w-4xl">
             <p className="text-xl md:text-3xl text-white/95 font-bold mb-3">
              Misión de Empatía: Entender a profundidad a {state.persona?.name}.
            </p>
            <p className="text-lg md:text-2xl text-white/80 leading-snug">
              Usa el editor para responder: <strong>¿Qué piensa? ¿Qué le duele? ¿Qué necesita?</strong>
              <span className="block mt-2 text-base md:text-xl opacity-90">Cuanta más información completen en el mapa, mejor será su solución final.</span>
            </p>
          </div>
        )}

        {view === 'selection' && (
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
            <div className="md:col-span-2 card p-6 flex flex-col">
              <h2 className="font-bold mb-3 text-slate-800">Ficha de la Persona</h2>
              <div className="flex-1 grid lg:grid-cols-[280px,1fr] gap-6">
                <div className="h-full">
                   <PersonaCard persona={state.persona} />
                </div>

                {!state.persona ? (
                  <div className="flex items-center justify-center text-center text-slate-500 bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-200">
                    <p>Selecciona un desafío de la izquierda para ver la historia completa.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <p className="text-lg font-semibold text-slate-600 mb-1">Has seleccionado a:</p>
                    <p className="text-4xl font-extrabold text-slate-800 my-3">{state.persona.name}</p>
                    <p className="text-slate-500 mb-6 max-w-xs">
                        ¿Están listos para analizar sus necesidades y dolores?
                    </p>
                    <button
                      onClick={() => setView('empathy')}
                      className="btn bg-mint-500 hover:bg-mint-600 text-white text-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      ¡Aceptar Misión! 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'empathy' && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            <div className="card p-4 shadow-lg border-slate-200">
              <div className="flex justify-between items-center px-2 pt-2 mb-2">
                <h2 className="font-bold text-xl text-slate-800">Mapa de Empatía</h2>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lienzo Interactivo</span>
              </div>
              <DraggableMap
                persona={state.persona}
                bubbles={state.bubbles}
              />
            </div>

            <div className="space-y-6 h-full flex flex-col">
              <div className="card p-0 overflow-hidden max-h-[450px]"> 
                 <div className="h-full overflow-y-auto custom-scrollbar p-4">
                    <PersonaCard persona={state.persona} />
                 </div>
              </div>
              
              <div className="card p-6 flex-1 flex flex-col shadow-lg border-slate-200">
                <h2 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <span>✏️</span> Editor de Atributos
                </h2>
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
              </div>

              <button 
                onClick={() => setView('selection')}
                className="text-sm text-slate-400 hover:text-slate-600 underline text-center py-2"
              >
                Cambiar Persona (Volver atrás)
              </button>
            </div>
          </div>
        )}
      </div>

      {showMap && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowMap(false); }}
        >
          <div className="card bg-white p-6 w-[90%] max-w-4xl relative shadow-2xl">
            <button
              className="absolute top-4 right-5 text-2xl text-slate-400 hover:text-slate-600 z-20"
              onClick={() => setShowMap(false)}
            >
              &times;
            </button>
            <DraggableMap
              persona={state.persona}
              bubbles={state.bubbles}
            />
          </div>
        </div>
      )}
    </>
  );
}