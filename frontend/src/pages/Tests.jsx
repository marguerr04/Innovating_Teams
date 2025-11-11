// src/pages/TestAnimacion.jsx

import React from 'react';
import BouncingCircle from '../components/BouncingCircle';

export default function TestAnimacion() {
  return (
    // Fondo oscuro para ver bien la animación
    <div style={{ background: '#222', color: 'white', minHeight: '100vh', padding: '50px' }}>
      
      <h1>Página de Prueba de Animaciones</h1>
      <p>Si ves un círculo rebotando abajo, ¡Framer Motion funciona!</p>
      
      <hr style={{ margin: '20px 0' }} />

      {/* Aquí renderizamos el componente */}
      <BouncingCircle />
      
    </div>
  );
}