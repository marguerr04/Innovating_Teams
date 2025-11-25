// src/modules/student/features/Phase-2/index.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Esta será la pantalla para "Ingresar Código de Sala"

export default function PhaseSalaCodigo({ onJoin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleJoin = async () => {
    // Validación básica
    if (code.trim().length === 0) {
      setError('Por favor, ingresa un código');
      return;
    }

    // Validar formato (6 dígitos)
    if (!/^\d{6}$/.test(code.trim())) {
      setError('El código debe ser de 6 dígitos numéricos');
      return;
    }

    // Validar contra el backend
    setIsValidating(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/validar-codigo/', {
        codigo: code.trim()
      });

      // Código válido
      if (response.data.valido) {
        // Guardar partida_id en localStorage por si se necesita después
        localStorage.setItem('partida_id', response.data.partida_id);
        localStorage.setItem('codigo_acceso', code.trim());
        
        // Llamar a onJoin para avanzar
        onJoin(code);
      }
    } catch (err) {
      // Manejar errores
      if (err.response) {
        setError(err.response.data.error || 'Código inválido');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. ¿Está el backend corriendo?');
      } else {
        setError('Error al validar el código');
      }
    } finally {
      setIsValidating(false);
    }
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
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Solo números
            setCode(value);
            setError(''); // Limpiar error al escribir
          }}
          maxLength={6}
          placeholder="123456"
          disabled={isValidating}
          className="w-full text-center text-3xl font-mono tracking-widest p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mint-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">❌ {error}</p>
          </div>
        )}
        
        <button
          onClick={handleJoin}
          disabled={isValidating || code.length !== 6}
          className="btn bg-mint-500 hover:bg-mint-600 text-white w-full mt-6 py-3 text-lg font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isValidating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validando...
            </span>
          ) : (
            '🚀 Unirse al Juego'
          )}
        </button>
      </div>
    </div>
  );
}