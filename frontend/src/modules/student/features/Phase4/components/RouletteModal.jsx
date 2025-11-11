import React, { useRef, useEffect, useState } from 'react';

export default function RouletteModal({ isOpen, onClose, names, onSpinEnd }) {
  const canvasRef = useRef(null);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Lógica para dibujar la rueda (de index.html)
  const drawWheel = (rotation = 0) => {
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
  };

  // Dibuja la rueda cuando se abre el modal o cambian los nombres
  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setIsSpinning(false);
      // Dibuja la rueda en el siguiente frame
      requestAnimationFrame(() => drawWheel(0));
    }
  }, [isOpen, names]); // Depende de 'names' para redibujar

  // Lógica para girar (de index.html)
  const handleSpin = () => {
    if (names.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    const canvas = canvasRef.current;
    const idx = Math.floor(Math.random() * names.length);
    const n = names.length;
    const step = 360 / n;
    const targetAngle = 360 - (idx * step + step / 2); // Puntero a 0deg
    const spins = 5 * 360;
    const finalDeg = spins + targetAngle;

    canvas.style.transition = 'transform 5.2s cubic-bezier(.17,.67,.21,1)';
    canvas.style.transform = `rotate(${finalDeg}deg)`;

    const onEnd = () => {
      canvas.removeEventListener('transitionend', onEnd);
      canvas.style.transition = 'none';
      canvas.style.transform = `rotate(${finalDeg % 360}deg)`; // Normaliza
      setWinner(names[idx]);
      setIsSpinning(false);
      
      // Llama al padre después de un momento
      setTimeout(() => onSpinEnd(names[idx]), 1200);
    };
    canvas.addEventListener('transitionend', onEnd);
  };
  
  if (!isOpen) return null;

  // JSX del Modal (copiado de index.html)
  // Estas clases 'me-roulette-*' deben estar en tu CSS global
  return (
    <div 
      className="me-roulette-backdrop me-open" 
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="me-roulette-modal">
        <div className="me-roulette-header">
          <div className="me-roulette-title">Seleccionar aleatoriamente</div>
          <button className="me-roulette-close" onClick={onClose}> Cerrar </button>
        </div>
        <div className="me-roulette-body">
          <div className="me-wheel-wrap">
            <div className="me-pointer"></div>
            <canvas ref={canvasRef} width="480" height="480" className="me-wheel"></canvas>
          </div>
          <div className="me-roulette-controls">
            <button 
              className="me-roulette-btn" 
              onClick={handleSpin} 
              disabled={isSpinning || names.length === 0}
            >
              {isSpinning ? 'Girando...' : (names.length === 0 ? 'No hay nombres' : 'Girar ruleta')}
            </button>
          </div>
          <div className="me-roulette-sub">Tip: se toman los nombres desde la lista de integrantes.</div>
          <div className="me-winner">{winner ? `Presenta: ${winner}` : ''}</div>
        </div>
      </div>
    </div>
  );
}