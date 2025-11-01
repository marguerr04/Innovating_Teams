// src/modules/student/pages/StudentApp.jsx
import React, { useState } from "react";
import { useRole } from "../../../utils/helpers.js";

// ✅ Fases reales importadas
import Phase1 from "../features/Phase1";
import Phase2 from "../features/Phase2";

// ✅ Placeholders para futuras fases
const Phase3 = () => <div>Fase 3 (en construcción)</div>;
const Phase4 = () => <div>Fase 4 (en construcción)</div>;
const Phase5 = () => <div>Fase 5 (en construcción)</div>;
const Phase6 = () => <div>Fase 6 (en construcción)</div>;
const Phase7 = () => <div>Fase 7 (en construcción)</div>;

export default function StudentApp() {
  const { role, setRole, isProf } = useRole();
  const [phase, setPhase] = useState(1);

  const go = (n) => setPhase(n);

  return (
    <div>
      {/* Header de navegación */}
      <div className="sticky top-0 z-20 bg-sea-600/80 backdrop-blur border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-extrabold">Innovating Teams</div>
            <div className="progress ml-3">
              {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                <span key={n} className={`step ${phase === n ? "active" : ""}`}>
                  Fase {n}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">
              Rol: <b>{isProf ? "Profesor" : "Alumno"}</b>
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => setRole(isProf ? "alumno" : "profesor")}
            >
              {isProf ? "Cambiar a Alumno" : "Cambiar a Profesor"}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido dinámico de la fase */}
      <div className="max-w-6xl mx-auto p-6">
        {phase === 1 && <Phase1 role={role} onNext={() => go(2)} />}
        {phase === 2 && <Phase2 role={role} onNext={() => go(3)} />}
        {phase === 3 && <Phase3 role={role} onBack={() => go(2)} onNext={() => go(4)} />}
        {phase === 4 && <Phase4 role={role} onBack={() => go(3)} onNext={() => go(5)} />}
        {phase === 5 && <Phase5 role={role} onBack={() => go(4)} onNext={() => go(6)} />}
        {phase === 6 && <Phase6 role={role} onBack={() => go(5)} onNext={() => go(7)} />}
        {phase === 7 && <Phase7 onBack={() => go(6)} />}
      </div>
    </div>
  );
}
