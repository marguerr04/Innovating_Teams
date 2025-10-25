import React, { createContext, useContext, useState, useEffect } from 'react';

// Cargar datos iniciales desde localStorage
const getInitialJuegos = () => JSON.parse(localStorage.getItem('juegos') || '[]');
const getInitialPerfil = () => JSON.parse(localStorage.getItem('perfilProfesor') || '{}');

const ProfesorContext = createContext();

// Hook personalizado para consumir el contexto fácilmente
export const useProfesor = () => useContext(ProfesorContext);

// Proveedor que envuelve la aplicación
export const ProfesorProvider = ({ children }) => {
  const [juegos, setJuegos] = useState(getInitialJuegos);
  const [perfil, setPerfil] = useState(getInitialPerfil);

  // Efecto para guardar juegos en localStorage CADA VEZ que cambien
  useEffect(() => {
    localStorage.setItem('juegos', JSON.stringify(juegos));
  }, [juegos]);

  // Efecto para guardar perfil en localStorage CADA VEZ que cambie
  useEffect(() => {
    localStorage.setItem('perfilProfesor', JSON.stringify(perfil));
  }, [perfil]);

  // Funciones para modificar el estado
  const addJuego = (game) => {
    setJuegos(prevJuegos => [...prevJuegos, game]);
  };
  
  const savePerfil = (newPerfil) => {
    setPerfil(newPerfil);
  };
  
  // (La lógica de primeAudioOnce también puede ir aquí)
  const primeAudioOnce = () => {
    if(localStorage.getItem('audioUnlocked')==='1') return;
    try{
      const a = new Audio('assets/cronometro.mp3');
      a.volume = 0.0;
      const p = a.play();
      if(p && typeof p.then==='function'){
        p.then(()=>{ a.pause(); localStorage.setItem('audioUnlocked','1'); }).catch(()=>{});
      }
    }catch(e){}
  };

  const value = {
    juegos,
    perfil,
    addJuego,
    savePerfil,
    primeAudioOnce
  };

  return (
    <ProfesorContext.Provider value={value}>
      {children}
    </ProfesorContext.Provider>
  );
};
