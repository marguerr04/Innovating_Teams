// src/components/WordSearch.jsx
import React, { useState, useEffect } from 'react';

const words = ['UDD','TOKEN','GRUPO','JUEGO','INNOVA'];
const size = 12;

export default function WordSearch({ onComplete }) {
  const letters = React.useMemo(() => {
    // ... (todo el código de la función 'letters' va aquí)
  }, []);

  const [sel, setSel] = useState([]);
  const [found, setFound] = useState([]);

  const toggle = (r, c) => {
    // ... (código de 'toggle')
  };

  useEffect(() => {
    // ... (código del primer useEffect)
  }, [sel, letters, found, words]);

  useEffect(() => {
    // ... (código del segundo useEffect)
  }, [found, onComplete, words]);

  return (
    <div className="grid md:grid-cols-[1fr,260px] gap-6">
      <div className="card p-6">
        {/* ... (todo el JSX de 'grid-letters' va aquí) */}
      </div>
      <div className="card p-6">
        {/* ... (todo el JSX de la lista de palabras va aquí) */}
      </div>
    </div>
  );
}