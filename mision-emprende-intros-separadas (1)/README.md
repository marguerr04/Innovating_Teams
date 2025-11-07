# Misión Emprende – Intros separadas (1 archivo por fase)

Incluye `phase1.html` ... `phase5.html`. Cada archivo:
- Muestra solo **Saltar** y **auto-termina a los 30 s**.
- Las letras aparecen desde la nada; primero entra el fondo.
- **NO** deja pantalla negra: al terminar, queda visible y muestra “Intro finalizada…”.

## Integración simple (recomendada)
1. Abre el HTML correspondiente **antes** de cargar cada fase real.
2. Opcional: define un callback global para saber cuándo terminó:
   ```js
   window.misionEmprendeIntroDone = ({ phase, reason }) => {
     // reason: "auto" | "skip"
     // aquí continúa tu juego
   };
   ```
   También se emite `window.dispatchEvent(new CustomEvent('intro:done', {detail:{phase,reason}}))`.

## Archivos
- `phase1.html` – Trabajo en equipo
- `phase2.html` – Empatía
- `phase3.html` – Creatividad
- `phase4.html` – Comunicación (Pitch)
- `phase5.html` – Feedback
