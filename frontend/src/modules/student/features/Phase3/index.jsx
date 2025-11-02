import React, { useState } from 'react';

import { load } from '../../../../utils/helpers.js'; 

// Importa los componentes
import LegoTimer from './components/LegoTimer';
import MapModal from './components/MapModal';

export default function Phase3({ role, onNext, onBack }) {
  // Carga los datos de la Fase 2 para pasarlos al modal
  const p2 = load('it_phase2_store', null) || {};
  
  // Estado para controlar la visibilidad del modal
  const [showMap, setShowMap] = useState(false);

  return (
    // Contenedor principal 
    <div className="max-w-4xl mx-auto text-center"> 
      
      {/* Títulos  */}
      <h1 className="text-3xl font-extrabold mb-1">Fase 3 · Construcción con LEGO</h1>
      <p className="opacity-80 mb-4">
        Tiempo para crear con LEGO. Puedes ver el mapa de empatía confirmado.
      </p>
      
      {/* Componente del Timer */}
      <LegoTimer 
        role={role} 
        onNext={onNext} 
        onBack={onBack} 
        onShowMap={() => setShowMap(true)} // Pasa la función para abrir el modal
      />
      
      {/* Componente del Modal */}
      <MapModal 
        show={showMap} 
        onClose={() => setShowMap(false)} 
        persona={p2?.persona} 
        bubbles={p2?.bubbles || []} 
      />
      
    </div>
  );
}