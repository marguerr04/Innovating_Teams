import React, { useState, useEffect } from 'react';

export default function MissyCompanion({ phase, showTokens }) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Lógica de mensajes (Igual que antes)
  useEffect(() => {
    if (showTokens) {
      setMessage("¡Excelente trabajo! 🎉 Has ganado nuevos tokens.");
      setIsVisible(true);
      return;
    }

    switch (phase) {
      case -1: 
      case 0:  
        setMessage("¡Hola, soy Missy! 🤖 Estoy aquí para guiarte en tu misión de innovación.");
        break;
      case 1: 
        setMessage("El primer paso es conectar. ¡Un buen equipo es la base del éxito!");
        break;
      case 2: 
        setMessage("Ponte en los zapatos del usuario. ¿Qué siente? ¿Qué le duele realmente?");
        break;
      case 3: 
        setMessage("¡No hay ideas locas! Construye tu prototipo sin miedo a equivocarte.");
        break;
      case 4: 
        setMessage("Es hora de brillar. Cuéntanos tu historia con seguridad y pasión.");
        break;
      case 5: 
        setMessage("Observa con atención. El feedback honesto ayuda a crecer.");
        break;
      case 6: 
        setMessage("¡Misión Cumplida! Lo han hecho increíble.");
        break;
      default:
        setMessage("¡Tú puedes! Sigue adelante.");
        break;
    }
    
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 500);

  }, [phase, showTokens]);

  // Renderizado del "Avatar" (Placeholder CSS)
  const RobotAvatar = () => (
    <div className="relative w-24 h-24 transition-transform duration-300 hover:scale-110 cursor-pointer">
      {/* Animación de flotación */}
      <div className="animate-[bounce_3s_infinite]">
        
        {/* Cabeza */}
        <div className="w-16 h-14 bg-slate-800 rounded-2xl mx-auto relative border-2 border-mint-400 shadow-lg z-10">
          {/* Ojos */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full bg-mint-400 ${isHovered ? 'animate-pulse' : ''}`}></div>
            <div className={`w-3 h-3 rounded-full bg-mint-400 ${isHovered ? 'animate-pulse' : ''}`}></div>
          </div>
          {/* Boca */}
          <div className="w-6 h-1 bg-slate-600 rounded-full mx-auto mt-2"></div>
          
          {/* Antena */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-400"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>

        {/* Cuerpo */}
        <div className="w-10 h-8 bg-slate-700 mx-auto -mt-1 rounded-b-xl border-x-2 border-b-2 border-slate-600"></div>
        
        {/* Brazos */}
        <div className="absolute top-10 left-2 w-3 h-8 bg-slate-500 rounded-full -rotate-45"></div>
        <div className="absolute top-10 right-2 w-3 h-8 bg-slate-500 rounded-full rotate-45"></div>
      </div>
      
      {/* Sombra */}
      <div className="w-12 h-2 bg-black/20 rounded-full mx-auto mt-2 blur-sm"></div>
    </div>
  );

  if (phase < -1) return null;

  return (
    // CAMBIOS DE POSICIÓN: left-6 y items-start
    <div 
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2 pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Burbuja de Diálogo */}
      <div 
        className={`
          bg-white text-slate-800 p-4 rounded-2xl rounded-bl-none shadow-xl border-2 border-mint-100
          max-w-[250px] text-sm font-medium leading-relaxed
          transition-all duration-500 transform origin-bottom-left pointer-events-auto
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}
        `}
      >
        <p>{message}</p>
        {/* Triangulito de la burbuja (Ajustado a la izquierda) */}
        <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white border-l-2 border-b-2 border-mint-100 transform -rotate-45 translate-x-[10px] translate-y-[-10px]"></div>
      </div>

      {/* Avatar de Missy */}
      <div className="pointer-events-auto relative ml-2">
        <RobotAvatar />
        
        {/* Etiqueta del nombre */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-mint-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          Missy
        </div>
      </div>
    </div>
  );
}