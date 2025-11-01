import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { load } from '../../../../utils/helpers'; // Ajusta la ruta a tus utils

// Importa los componentes que creamos
import LegoTimer from './components/LegoTimer';
import MapModal from './components/MapModal';

export default function Phase3({ role, onNext, onBack }) {
  // Carga los datos de la Fase 2 para pasarlos al modal
  const p2 = load('it_phase2_store', null) || {};
  
  // Estado para controlar la visibilidad del modal
  const [showMap, setShowMap] = useState(false);

  // Función para manejar los botones (Volver y Ver Mapa)
  const handleBack = (verMapa = false) => {
    if (verMapa) {
      setShowMap(true);
    } else {
      onBack(); // Llama a la función 'onBack' del 'App' principal
    }
  };

  return (
    // Contenedor principal de Bootstrap (traducido de 'max-w-4xl...')
    <Container style={{ maxWidth: '42rem' }}> 
      
      {/* Títulos (traducidos de Tailwind) */}
      <h1 className="h3 fw-bold mb-1 text-white text-center">Fase 3 · Construcción con LEGO</h1>
      <p className="text-white-50 mb-4 text-center">
        Tiempo para crear con LEGO. Puedes ver el mapa de empatía confirmado.
      </p>
      
      {/* Componente del Timer */}
      <LegoTimer 
        role={role} 
        onNext={onNext} 
        onBack={handleBack} // Pasa nuestra función 'handleBack'
      />
      
      {/* Componente del Modal */}
      <MapModal 
        show={showMap} 
        onHide={() => setShowMap(false)} 
        persona={p2?.persona} 
        bubbles={p2?.bubbles || []} 
      />
      
    </Container>
  );
}