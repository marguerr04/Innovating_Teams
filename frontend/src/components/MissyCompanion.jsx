import React, { useState, useRef, useEffect } from 'react';

export default function MissyCompanion({ phase, showTokens }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Seleccionar el video apropiado según la fase
  const getVideoForPhase = () => {
    if (showTokens) return '/assets/videos/robot_celebration.webm';
    
    switch(phase) {
      case 1:
      case 2:
        return '/assets/videos/robot_explaining.webm';
      case 3:
      case 4:
        return '/assets/videos/robot_thinking.webm';
      case 5:
      case 6:
        return '/assets/videos/robot_celebration.webm';
      default:
        return '/assets/videos/robot_idle.webm';
    }
  };

  // Mensaje según la fase
  const getMessage = () => {
    if (showTokens) return "¡Excelente trabajo! 🎉";
    
    const messages = {
      '-1': "¡Hola, soy tu Robot Guía! 🤖",
      '0': "¡Hola, soy tu Robot Guía! 🤖",
      '1': "El primer paso es conectar.",
      '2': "Ponte en los zapatos del usuario.",
      '3': "¡No hay ideas locas! Construye tu prototipo.",
      '4': "Es hora de brillar.",
      '5': "Observa con atención.",
      '6': "¡Misión Cumplida!"
    };
    
    return messages[phase] || "¡Tú puedes!";
  };

  // Cambiar video cuando cambia la fase
  useEffect(() => {
    if (videoRef.current) {
      const newSrc = getVideoForPhase();
      videoRef.current.src = newSrc;
      videoRef.current.load(); // Recargar el video con el nuevo src
    }
  }, [phase, showTokens]);

  if (phase < -1) return null;

  const message = getMessage();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'end',
      gap: '15px'
    }}>
      {/* Contenedor del robot */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px'
      }}>
        {/* Video del robot */}
        <video
          ref={videoRef}
          width="80"
          height="80"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(false)}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease',
            display: videoLoaded ? 'block' : 'none'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          <source src={getVideoForPhase()} type="video/webm" />
        </video>
        
        {/* Fallback emoji si el video no carga */}
        <div
          style={{
            position: videoLoaded ? 'absolute' : 'static',
            top: 0,
            left: 0,
            width: '80px',
            height: '80px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: videoLoaded ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          🤖
        </div>
      </div>
      
      {/* Mensaje con animación */}
      <div style={{
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '200px',
        fontSize: '13px',
        color: '#333',
        border: '2px solid #3b82f6',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out'
      }}>
        {message}
        {showTokens && (
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginTop: '5px',
            fontWeight: 'bold'
          }}>
            Tokens: +{Math.floor(Math.random() * 50) + 10}
          </div>
        )}
      </div>
    </div>
  );
}