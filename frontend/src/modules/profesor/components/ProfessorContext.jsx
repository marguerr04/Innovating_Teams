import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto del profesor
const ProfesorContext = createContext();

// Hook personalizado para usar el contexto
export const useProfesor = () => {
  const context = useContext(ProfesorContext);
  if (!context) {
    throw new Error('useProfesor debe ser usado dentro de un ProfesorProvider');
  }
  return context;
};

// Proveedor del contexto
export const ProfesorProvider = ({ children }) => {
  const [profesor, setProfesor] = useState({
    id: null,
    nombre: '',
    email: '',
    isAuthenticated: false,
  });

  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para autenticar profesor
  const loginProfesor = (profesorData) => {
    setProfesor({
      ...profesorData,
      isAuthenticated: true,
    });
  };

  // Función para cerrar sesión
  const logoutProfesor = () => {
    setProfesor({
      id: null,
      nombre: '',
      email: '',
      isAuthenticated: false,
    });
    setJuegos([]);
  };

  // Función para actualizar perfil
  const updateProfesor = (updatedData) => {
    setProfesor(prev => ({
      ...prev,
      ...updatedData,
    }));
  };

  // Función para añadir un nuevo juego
  const addJuego = (nuevoJuego) => {
    setJuegos(prev => [...prev, nuevoJuego]);
  };

  // Función para actualizar un juego existente
  const updateJuego = (id, updatedJuego) => {
    setJuegos(prev => 
      prev.map(juego => 
        juego.id === id ? { ...juego, ...updatedJuego } : juego
      )
    );
  };

  // Función para eliminar un juego
  const deleteJuego = (id) => {
    setJuegos(prev => prev.filter(juego => juego.id !== id));
  };

  const value = {
    profesor,
    juegos,
    loading,
    setLoading,
    loginProfesor,
    logoutProfesor,
    updateProfesor,
    addJuego,
    updateJuego,
    deleteJuego,
  };

  return (
    <ProfesorContext.Provider value={value}>
      {children}
    </ProfesorContext.Provider>
  );
};

export default ProfesorContext;