import React from 'react';
import { motion } from 'framer-motion'; // 1. Importa 'motion' de la librería

// 2. Define las "variantes" de la animación
const bounceVariant = {
  // Este es el nombre de la animación
  bounce: {
    y: ["-20px", "20px"], // Anima la posición Y (vertical) desde -20px a 20px
    transition: {
      duration: 0.8,         // Duración de cada rebote
      repeat: Infinity,      // Repite la animación infinitamente
      repeatType: "reverse", // Hace que rebote (va y vuelve)
      ease: "easeInOut",     // Tipo de suavizado
    }
  }
};

export default function BouncingCircle() {
  return (
    // Un div simple para centrar el círculo
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
      
      {/* 3. Usa 'motion.div' en lugar de 'div' */}
      <motion.div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#00B8A9' // Color "mint" de tu proyecto
        }}
        variants={bounceVariant} // 4. Pasa las variantes que definiste
        animate="bounce"          // 5. Indica qué animación debe ejecutar
      />
    </div>
  );
}