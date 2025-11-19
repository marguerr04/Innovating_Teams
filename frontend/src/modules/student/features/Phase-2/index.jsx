// src/modules/student/features/Phase-2/index.jsx
import React, { useState } from 'react';

// Esta será la pantalla para "Ingresar Código de Sala"

export default function PhaseSalaCodigo({ onJoin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    // Aquí puedes añadir lógica de validación de código
    if (code.trim().length === 0) {
      setError('Por favor, ingresa un código');
      return;
    }
    // Si es válido, llama a la función onJoin que le pasa el padre
    onJoin(code);
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="card p-8">
        <h1 className="text-3xl font-extrabold mb-4 text-slate-800">
          Unirse a la Sala
        </h1>
        <p className="text-slate-600 mb-6">
          Ingresa el código de 6 dígitos proporcionado por tu profesor para unirte a la sesión.
        </p>
        
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="XXXXXX"
          className="w-full text-center text-3xl font-mono tracking-widest p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mint-500"
        />
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
        
        <button
          onClick={handleJoin}
          className="btn bg-mint-500 text-white w-full mt-6 py-3 text-lg"
        >
          Unirse
        </button>
      </div>
    </div>
  );
}