# UI Sounds (Development placeholders)

Este directorio contiene referencias de sonidos usados en la UI y temporizador.

Archivos esperados (agrega los reales en `public/assets/sounds/ui/` para producción):
- tick.mp3  (sonido corto "tic" cada segundo del último minuto)
- alarm.mp3 (sonido de alarma cuando el tiempo llega a 0)

Actualmente, el código los intenta cargar desde rutas públicas:
```
/assets/sounds/ui/tick.mp3
/assets/sounds/ui/alarm.mp3
```
Si no existen, se mostrará un warning silencioso en consola al intentar reproducir.

## Cómo reemplazar
1. Coloca tus archivos definitivos en `public/assets/sounds/ui/`.
2. Asegúrate que los nombres coincidan (`tick.mp3`, `alarm.mp3`).
3. Opcional: Ajusta calidad y duración (< 300ms para tick, 800–1500ms para alarma).
