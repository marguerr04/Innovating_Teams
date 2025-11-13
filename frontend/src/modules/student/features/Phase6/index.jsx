// src/modules/student/features/Phase6/index.jsx

import React, { useState, useEffect } from 'react';

// 1. IMPORTA tus helpers (load, save)
// (Ruta: Phase6 -> features -> student -> modules -> src -> utils)
import { load, save } from '../../../../utils/helpers.js';

// 2. IMPORTA los dos componentes que creamos
import CierrePedagogico from './components/CierrePedagogico.jsx';
import PodioFinal from './components/PodioFinal.jsx';

export default function Phase6({ role, isProf, onNext, onBack }) {
  
  // --- Lógica de estado (de index.html) ---
  const [showPodio, setShowPodio] = useState(false);
  
  // Lógica de Tokens (de index.html)
  // (Esta lógica se basa en la Fase 5 anterior,
  // pero tu index.html tiene una nueva lógica 'it_scores_v2_multi')
  
  // Carga los scores de la Fase 5
  const allScores = load("it_scores_v2_multi", { 1: {}, 2: {}, 3: {}, 4: {} });
  
  // Calcula los tokens de "mi" equipo (Equipo 1)
  const myScores = allScores[1] || {};
  const avg = ((myScores.creatividad || 0) + (myScores.solucion || 0) + (myScores.empatia || 0)) / 3;
  const computedTokens = Math.round(avg * 10);
  
  const [tokens, setTokens] = useState(() => load('it_tokens', computedTokens));
  useEffect(() => save('it_tokens', tokens), [tokens]);

  // Lista de equipos (simulada como en index.html)
  const baseTeams = [
    { name: 'Equipo Innovador', tokens: tokens }, // Tu equipo
    { name: 'Equipo Creativo', tokens: 117 },
    { name: 'Equipo Visionario', tokens: 108 },
    { name: 'Equipo Explorador', tokens: 96 },
  ].sort((a, b) => b.tokens - a.tokens);
  // --- Fin de la lógica ---
  
  // 3. Renderizado Condicional
  if (!showPodio) {
    // Si showPodio es falso, muestra la vista de Cierre Pedagógico
    return (
      <CierrePedagogico 
        isProf={isProf}
        onNext={() => setShowPodio(true)} // 'onNext' ahora muestra el podio
        onBack={onBack} 
      />
    );
  }

  // Si showPodio es verdadero, muestra la vista de Podio Final
  return (
    <PodioFinal
      baseTeams={baseTeams}
      onNext={onNext} // 'onNext' ahora pasa a la Fase 7
      onBack={() => setShowPodio(false)} // 'onBack' ahora vuelve al Cierre
    />
  );
}