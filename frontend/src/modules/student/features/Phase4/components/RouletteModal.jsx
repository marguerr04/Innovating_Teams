import React, { useRef, useEffect, useState, useCallback } from 'react';
import JuicyButton from '../../../../../components/JuicyButton'; // Importamos el botón jugoso

export default function RouletteModal({ isOpen, onClose, names, onSpinEnd }) {
  const canvasRef = useRef(null);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // 1. SOLUCIÓN: Envolvemos la función en useCallback
  const drawWheel = useCallback((rotation = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const W = 480, H = 480;
    const cx = W / 2, cy = H / 2, r = Math.min(cx, cy) - 6;
    ctx.clearRect(0, 0, W, H);
    
    const n = names.length;
    const step = (Math.PI * 2) / n;
    
    for (let i = 0; i < n; i++) {
      const start = i * step + rotation;
      const end = start + step;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      const hue = (i * 360 / n);
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fill();
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + step / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px ui-sans-serif, system-ui';
      ctx.fillText(names[i], r - 16, 6);
      ctx.restore();
    }
    
    // Dibuja el centro
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }, [names]); // Dependencia: Solo se recrea si cambian los nombres

  // 2. Actualizamos el useEffect con la dependencia correcta
  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setIsSpinning(false);
      requestAnimationFrame(() => drawWheel(0));
    }
  }, [isOpen, drawWheel]); // Ahora drawWheel es una dependencia segura

  const handleSpin = () => {
    if (names.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    const canvas = canvasRef.current;
    const idx = Math.floor(Math.random() * names.length);
    const n = names.length;
    const step = 360 / n;
    const targetAngle = 360 - (idx * step + step / 2); 
    const spins = 5 * 360;
    const finalDeg = spins + targetAngle;

    canvas.style.transition = 'transform 5.2s cubic-bezier(.17,.67,.21,1)';
    canvas.style.transform = `rotate(${finalDeg}deg)`;

    const onEnd = () => {
      canvas.removeEventListener('transitionend', onEnd);
      canvas.style.transition = 'none';
      canvas.style.transform = `rotate(${finalDeg % 360}deg)`; 
      setWinner(names[idx]);
      setIsSpinning(false);
      
      setTimeout(() => onSpinEnd(names[idx]), 1200);
    };
    canvas.addEventListener('transitionend', onEnd);
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="me-roulette-backdrop me-open" 
      onMouseDown={(e) => { if (e.target === e.currentTarget && !isSpinning) onClose(); }}
    >
      <div className="me-roulette-modal">
        <div className="me-roulette-header">
          <div className="me-roulette-title">Seleccionar aleatoriamente</div>
          {/* Actualizamos a JuicyButton */}
          <JuicyButton color="gray" onClick={onClose} disabled={isSpinning} className="py-1 px-3 text-sm">
             Cerrar 
          </JuicyButton>
        </div>
        <div className="me-roulette-body">
          <div className="me-wheel-wrap">
            <div className="me-pointer"></div>
            <canvas ref={canvasRef} width="480" height="480" className="me-wheel"></canvas>
          </div>
          <div className="me-roulette-controls">
            {/* Actualizamos a JuicyButton */}
            <JuicyButton 
              color="yellow" // Amarillo para acción principal
              onClick={handleSpin} 
              disabled={isSpinning || names.length === 0}
            >
              {isSpinning ? 'Girando...' : (names.length === 0 ? 'No hay nombres' : '🎰 Girar ruleta')}
            </JuicyButton>
          </div>
          <div className="me-roulette-sub">Tip: se toman los nombres desde la lista de integrantes.</div>
          <div className="me-winner text-2xl text-mint-600">{winner ? `Presenta: ${winner}` : ''}</div>
        </div>
      </div>
    </div>
  );
}