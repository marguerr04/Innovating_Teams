# Instalación de Dependencias de Testing

## 📦 Dependencias Requeridas

Para ejecutar la suite de pruebas, necesitas instalar las siguientes dependencias:

### 1. React Testing Library
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**¿Por qué estas librerías?**
- `@testing-library/react`: Utilidades para probar componentes React
- `@testing-library/jest-dom`: Matchers personalizados para Jest (toBeInTheDocument, toHaveClass, etc.)
- `@testing-library/user-event`: Simulación avanzada de eventos de usuario

### 2. Babel Transform para JSX (opcional, puede ya estar)
```bash
npm install --save-dev @babel/preset-react
```

### 3. Verificar instalación de Jest
Jest ya está instalado (v27.5.1), pero verifica que `jest-environment-jsdom` esté presente:
```bash
npm list jest-environment-jsdom
```

## 🚀 Instalación Rápida (Todo en uno)

Ejecuta este comando para instalar todas las dependencias necesarias:

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## ✅ Verificación de Instalación

Después de instalar, verifica que todo esté correcto:

```bash
npm list @testing-library/react
npm list @testing-library/jest-dom
npm list jest
```

Deberías ver:
```
frontend@1.0.0 e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\frontend
├── @testing-library/jest-dom@6.x.x
├── @testing-library/react@14.x.x
└── jest@27.5.1
```

## 🔧 Configuración Babel (si es necesaria)

Si encuentras errores con JSX, crea/actualiza `.babelrc`:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

## 🧪 Ejecutar Primera Prueba

Una vez instaladas las dependencias:

```bash
npm test
```

Deberías ver:
```
PASS  src/__tests__/components/TeamCodesDisplay.test.jsx
PASS  src/__tests__/components/PhaseSalaCodigo.test.jsx
PASS  src/__tests__/services/gameService.test.js
PASS  src/__tests__/integration/teamCodesFlow.test.jsx

Test Suites: 4 passed, 4 total
Tests:       32 passed, 32 total
```

## 🐛 Solución de Problemas

### Error: Cannot find module '@testing-library/react'
**Solución:** Ejecuta `npm install --save-dev @testing-library/react`

### Error: Jest encountered an unexpected token (JSX)
**Solución:** Verifica que `babel-jest` esté instalado y configurado
```bash
npm install --save-dev babel-jest @babel/preset-react
```

### Error: ReferenceError: TextEncoder is not defined
**Solución:** Ya está configurado en `src/__tests__/setup.js`, verifica que se esté cargando:
```javascript
// En jest.config.js debe estar:
setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js']
```

### Tests pasan pero no se ve cobertura
**Solución:** Ejecuta con el flag de coverage:
```bash
npm run test:coverage
```

## 📊 Versiones Recomendadas

| Paquete | Versión Mínima | Versión Recomendada |
|---------|----------------|---------------------|
| jest | 27.5.1 | 27.5.1 ✅ |
| @testing-library/react | 12.0.0 | 14.x |
| @testing-library/jest-dom | 5.16.0 | 6.x |
| @testing-library/user-event | 13.0.0 | 14.x |

## 🔄 Actualizar Dependencias (opcional)

Si quieres actualizar Jest a una versión más reciente:

```bash
npm install --save-dev jest@latest jest-environment-jsdom@latest
```

**Nota:** Jest 27.5.1 es suficiente para todas las pruebas actuales.

## ✨ Estado Actual

**Dependencias ya instaladas:**
- ✅ jest (27.5.1)
- ✅ jest-environment-jsdom (27.5.1)
- ✅ babel-jest (27.5.1)

**Dependencias pendientes de instalar:**
- ⏳ @testing-library/react
- ⏳ @testing-library/jest-dom
- ⏳ @testing-library/user-event

## 📝 Siguiente Paso

Después de instalar las dependencias:

1. Ejecuta `npm test` para correr todas las pruebas
2. Ejecuta `npm run test:coverage` para ver el reporte de cobertura
3. Revisa `frontend/coverage/lcov-report/index.html` en tu navegador

---

**¿Listo para instalar?** Ejecuta:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm test
```
