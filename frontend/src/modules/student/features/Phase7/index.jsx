// src/modules/student/features/Phase7/index.jsx

import React from 'react';

// NOTA: Asegúrate de poner las imágenes QR
// en tu carpeta /public/ para que se puedan encontrar.
const FORM_QR_URL = '/encuestaQR.png';
const INSTA_QR_URL = '/instagramQR.png';

export default function Phase7({ onBack }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* --- Título --- */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-white">
          ¡Muchas gracias por participar!
        </h1>
        <p className="text-lg text-white/80">
          Los esperamos en futuras actividades de Emprendimiento UDD.
        </p>
      </div>

      {/* --- Contenedor de QR (Grid) --- */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* --- Card 1: Formulario de Evaluación --- */}
        <div className="card p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Evaluación de la Actividad
          </h2>
          <p className="text-slate-600 text-center mb-4">
            Por favor, escaneen este código QR para contestar una breve encuesta de evaluación.
          </p>
          <img 
            src={FORM_QR_URL} 
            alt="QR Evaluación Preincubación"
            className="w-full max-w-[320px] h-auto rounded-lg shadow-md"
          />
        </div>

        {/* --- Card 2: Instagram --- */}
        <div className="card p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            ¡Sigue a Emprendimiento UDD!
          </h2>
          <p className="text-slate-600 text-center mb-4">
            Entérate de todas las novedades, charlas y fondos concursables.
          </p>
          <img 
            src={INSTA_QR_URL} 
            alt="QR Instagram Emprendimiento UDD"
            className="w-full max-w-[320px] h-auto rounded-lg shadow-md"
          />
          <p className="mt-4 text-xl font-semibold text-slate-700">
            @EMPRENDIMIENTO.UDD
          </p>
        </div>

      </div>

      {/* --- Navegación --- */}
      <div className="mt-8 flex justify-center">
        <button 
          className="btn-ghost text-white/80 hover:bg-white/20 px-6 py-3 rounded-lg border border-white/30 transition-all" 
          onClick={onBack}
        >
          ← Volver al Podio
        </button>
      </div>

    </div>
  );
}