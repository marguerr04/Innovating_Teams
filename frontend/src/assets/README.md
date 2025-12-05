# 📁 Assets Organization - Mision Emprende

## 🎯 Estructura Organizada

Esta es la nueva estructura organizacional para los assets multimedia del proyecto, diseñada para mayor escalabilidad y mantenibilidad.

```
src/assets/
├── index.js    # 🎛️ Centralizador de rutas (apuntan a /public/assets) y hook useAudio
└── README.md   # Este archivo

public/assets/
├── images/
│   ├── icons/
│   ├── instructions/
│   └── ...
├── sounds/
│   ├── games/
│   ├── rewards/
│   ├── ui/
│   └── ...
├── videos/
│   ├── robot/
│   ├── coins/
│   └── ...
└── gifs/backgrounds/etc.
```

## 🛠️ Uso del Sistema

### 1. Importar Assets Centralizados
```jsx
import { SOUNDS, IMAGES, useAudio } from '../../../assets/index.js';
```

### 2. Usar Hook de Audio
```jsx
const playSuccess = useAudio(SOUNDS.games.success);
const playClick = useAudio(SOUNDS.ui.click);

// En evento
playSuccess(); // ✅ Reproducir sonido de éxito
playClick();   // 🖱️ Reproducir sonido de clic
```

### 3. Agregar Nuevos Assets

#### Para sonidos:
1. Agregar archivo a `public/assets/sounds/[categoria]/`
2. (Opcional) Registrar la ruta en `src/assets/index.js` si quieres usarla centralizada:
```jsx
export const SOUNDS = {
  games: {
    // ...existentes
    newSound: '/assets/sounds/games/new_sound.mp3'
  }
};
```

#### Para imágenes:
1. Agregar archivo a `public/assets/images/[categoria]/`  
2. (Opcional) Registrar la ruta en `src/assets/index.js` si necesitas acceso centralizado:
```jsx
export const IMAGES = {
  logos: {
    brandLogo: '/assets/images/logos/brand.png'
  }
};
```

## ✅ Componentes Migrados

- ✅ **SopaLetrasGame** - Sonidos de éxito y clic
- ✅ **AnagramaGame** - Sonidos success, click, incorrect
- ✅ **RompeHielosGame** - Sonido button_click

## 🎵 Sonidos Disponibles

| Archivo | Uso | Componentes |
|---------|-----|-------------|
| `success.mp3` | ✅ Éxito en juegos | SopaLetrasGame, AnagramaGame |
| `incorrect.mp3` | ❌ Error en juegos | AnagramaGame |
| `click.mp3` | 🖱️ Clic general | SopaLetrasGame, AnagramaGame |
| `button_click.mp3` | 🔘 Clic botones | RompeHielosGame |

## 🔧 Beneficios

1. **🎯 Centralización**: Todas las rutas en un solo archivo
2. **🚀 Escalabilidad**: Fácil agregar nuevos assets
3. **🛠️ Mantenibilidad**: Cambios de rutas en un solo lugar
4. **♻️ Reutilización**: Hook `useAudio` reutilizable
5. **📦 Organización**: Estructura clara por categorías
6. **🔍 Trazabilidad**: Fácil encontrar y gestionar archivos

## 🎮 Próximos Pasos

- [ ] Migrar logos/imágenes cuando se agreguen
- [ ] Agregar soporte para videos
- [ ] Implementar lazy loading de assets
- [ ] Agregar system de volumen global
- [ ] Crear assets comprimidos para producción