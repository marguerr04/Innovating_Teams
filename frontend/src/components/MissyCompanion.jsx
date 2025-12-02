import React, { useState, useRef, useEffect } from 'react';

export default function MissyCompanion({ phase, showTokens, positioning = 'fixed' }) {
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

  // Estilos base para el robot
  const getContainerStyle = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'end',
      gap: '15px'
    };

    if (positioning === 'relative') {
      // Para el overlay de tokens - sin posicionamiento fixed
      return {
        ...baseStyle,
        position: 'relative'
      };
    } else {
      // Posicionamiento normal en esquina inferior izquierda
      return {
        ...baseStyle,
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000
      };
    }
  };

  const getVideoStyle = () => {
    // CAMBIO: Robot más grande y SIN círculo para overlay
    const baseSize = positioning === 'relative' ? 300 : 80; // CAMBIO: 300px en overlay
    
    if (positioning === 'relative') {
      // Para overlay - SIN borde circular, más grande
      return {
        // SIN borderRadius para quitar el círculo
        objectFit: 'contain', // CAMBIO: contain en lugar de cover
        cursor: 'default',
        // SIN boxShadow para overlay
        transition: 'transform 0.2s ease',
        display: videoLoaded ? 'block' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
        width: baseSize + 'px',
        height: baseSize + 'px'
      };
    } else {
      // Para esquina - mantener círculo
      return {
        borderRadius: '50%',
        objectFit: 'cover',
        cursor: 'default',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        transition: 'transform 0.2s ease',
        display: videoLoaded ? 'block' : 'none',
        pointerEvents: 'none',
        userSelect: 'none',
        width: baseSize + 'px',
        height: baseSize + 'px'
      };
    }
  };

  const getFallbackStyle = () => {
    // CAMBIO: Robot más grande y SIN círculo para overlay
    const baseSize = positioning === 'relative' ? 300 : 80; // CAMBIO: 300px en overlay
    
    if (positioning === 'relative') {
      // Para overlay - SIN borde circular, más grande
      return {
        position: videoLoaded ? 'absolute' : 'static',
        top: 0,
        left: 0,
        width: baseSize + 'px',
        height: baseSize + 'px',
        backgroundColor: '#3b82f6',
        // SIN borderRadius para quitar el círculo
        display: videoLoaded ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '120px', // CAMBIO: emoji más grande
        color: 'white',
        cursor: 'default',
        // SIN boxShadow para overlay
        userSelect: 'none'
      };
    } else {
      // Para esquina - mantener círculo
      return {
        position: videoLoaded ? 'absolute' : 'static',
        top: 0,
        left: 0,
        width: baseSize + 'px',
        height: baseSize + 'px',
        backgroundColor: '#3b82f6',
        borderRadius: '50%',
        display: videoLoaded ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        color: 'white',
        cursor: 'default',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        userSelect: 'none'
      };
    }
  };

  const getMessageStyle = () => {
    const baseStyle = {
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
    };

    // Ocultar mensaje en overlay de tokens para que se vea más limpio
    if (positioning === 'relative') {
      return {
        ...baseStyle,
        display: 'none'
      };
    }

    return baseStyle;
  };

  return (
    <div style={getContainerStyle()}>
      {/* Contenedor del robot */}
      <div style={{
        position: 'relative',
        width: positioning === 'relative' ? '300px' : '80px',  // CAMBIO: 300px para overlay
        height: positioning === 'relative' ? '300px' : '80px'  // CAMBIO: 300px para overlay
      }}>
        {/* Video del robot */}
        <video
          ref={videoRef}
          width={positioning === 'relative' ? 300 : 80}  // CAMBIO: 300px para overlay
          height={positioning === 'relative' ? 300 : 80} // CAMBIO: 300px para overlay
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(false)}
          style={getVideoStyle()}
          onContextMenu={(e) => e.preventDefault()} // Deshabilitar menú contextual
        >
          <source src={getVideoForPhase()} type="video/webm" />
        </video>
        
        {/* Fallback emoji si el video no carga */}
        <div style={getFallbackStyle()}>
          🤖
        </div>
      </div>
      
      {/* Mensaje con animación */}
      <div style={getMessageStyle()}>
        {message}
        {showTokens && positioning !== 'relative' && (
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