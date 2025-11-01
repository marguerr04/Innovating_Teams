import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Stack } from 'react-bootstrap';
import { beep } from '../../../../../utils/helpers'; // Ajusta la ruta

export default function LegoTimer({ role, onNext, onBack }) {
  // --- Lógica del Timer (copiada de index.html) ---
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);
  const lastBeepRef = useRef(null);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        const next = Math.max(0, s - 1);
        if (next > 0 && next <= 5 && lastBeepRef.current !== next) { 
          beep(); 
          lastBeepRef.current = next; 
        }
        if (next === 0) {
          if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
          setRunning(false); 
          lastBeepRef.current = null;
          setTimeout(() => alert('⏱️ ¡Tiempo terminado!'));
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [running]);
  // --- Fin Lógica del Timer ---

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const isProf = role === 'profesor';

  return (
    <Card className="p-4 p-md-5 text-center">
      <Card.Body className="d-flex flex-column align-items-center">
        {/* Asumo que 'lego.gif' está en tu carpeta /public */}
        <img 
          src="/lego.gif" 
          className="rounded mb-4" 
          style={{ width: '280px', height: '158px', objectFit: 'cover' }} 
          alt="Animación de piezas de Lego" 
        />
        
        {/* Timer (traducido de 'text-6xl...') */}
        <div className="display-4 fw-bold" style={{ letterSpacing: '0.1em' }}>
          {mm}:{ss}
        </div>
        
        {/* Botones de control (traducidos de 'flex gap-2') */}
        <Stack direction="horizontal" gap={2} className="mt-5 justify-content-center flex-wrap">
          <Button variant="light" onClick={onBack}>← Volver</Button>
          <Button 
            variant="warning" 
            style={{ backgroundColor: '#FF7B39', color: 'white' }} 
            onClick={onNext}
          >
            Continuar a Fase 4
          </Button>
        </Stack>

        {/* Controles del Profesor (traducidos de 'flex gap-2') */}
        <Stack direction="horizontal" gap={2} className="mt-4 justify-content-center flex-wrap">
          <Button variant="outline-secondary" onClick={() => onBack(true)}>Ver bubble map</Button>
          {isProf && (
            <>
              <Button 
                variant="primary" 
                style={{ backgroundColor: '#00B8A9', borderColor: '#00B8A9' }} 
                onClick={() => setRunning(true)}
              >
                Iniciar
              </Button>
              <Button variant="secondary" onClick={() => setRunning(false)}>
                Pausar
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={() => { setRunning(false); setSeconds(300); lastBeepRef.current = null; }}
              >
                Reiniciar
              </Button>
            </>
          )}
        </Stack>
        
        {!isProf && <div className="text-muted small mt-2">El profesor controla el temporizador.</div>}
      </Card.Body>
    </Card>
  );
}