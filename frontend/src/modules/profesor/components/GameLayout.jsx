import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Layout común para las páginas de juego del profesor
 * Incluye header con navegación y información del juego
 */
const GameLayout = ({ 
  children, 
  gamePin, 
  gameName = 'Juego de Emprendimiento',
  showTimer = false,
  timeRemaining,
  currentView = 'waiting' // waiting, playing
}) => {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVolverInicio = () => {
    const confirmacion = currentView === 'playing' 
      ? window.confirm('¿Estás seguro de que quieres abandonar el juego en progreso?')
      : true;
    
    if (confirmacion) {
      navigate('/profesor/home');
    }
  };

  const handleVolverSala = () => {
    if (currentView === 'playing') {
      navigate(`/profesor/waiting-room/${gamePin}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showTimer || gamePin ? (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Botones de navegación */}
              <div className="flex gap-4">
                <button 
                  onClick={handleVolverInicio}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  🏠 Inicio
                </button>
                {currentView === 'playing' && (
                  <button 
                    onClick={handleVolverSala}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    ← Volver a Sala
                  </button>
                )}
              </div>

              {/* Información central del juego */}
              {gamePin && (
                <div className="text-center">
                  <h1 className="text-xl font-bold text-white">{gameName}</h1>
                  <div className="text-lg font-mono text-blue-100">
                    PIN: <span className="font-bold text-yellow-300">{gamePin}</span>
                  </div>
                </div>
              )}

              {/* Temporizador */}
              {showTimer && timeRemaining !== undefined && (
                <div className="text-center">
                  <div className="text-sm text-blue-100 mb-1">Tiempo restante</div>
                  <div 
                    className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
                      timeRemaining < 300 ? 'text-red-100 bg-red-600' : 'text-green-100 bg-green-600'
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Contenido principal */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;