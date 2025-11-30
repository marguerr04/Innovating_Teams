# Testing Suite - Misión Emprende

## 📋 Descripción General

Suite de pruebas unitarias e integración para el sistema de códigos de equipo de Misión Emprende. Implementa Jest y React Testing Library siguiendo las mejores prácticas de la industria.

## 🎯 Cobertura de Código

**Objetivo:** 70% de cobertura en todas las métricas
- ✅ Branches: 70%
- ✅ Functions: 70%
- ✅ Lines: 70%
- ✅ Statements: 70%

## 📂 Estructura de Pruebas

```
frontend/src/__tests__/
├── components/              # Pruebas de componentes React
│   ├── PhaseSalaCodigo.test.jsx
│   └── TeamCodesDisplay.test.jsx
├── services/               # Pruebas de servicios API
│   └── gameService.test.js
├── integration/           # Pruebas de flujos completos
│   └── teamCodesFlow.test.jsx
├── utils/                 # Utilidades para testing
│   └── fileMock.js
└── setup.js              # Configuración global de tests
```

## 🚀 Comandos de Testing

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar en modo watch (desarrollo)
```bash
npm run test:watch
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

### Ejecutar con output detallado
```bash
npm run test:verbose
```

### Ejecutar en CI/CD
```bash
npm run test:ci
```

## 📝 Pruebas Implementadas

### 1. **PhaseSalaCodigo.test.jsx** (Validación de Códigos)
Prueba el componente de entrada de código de equipo para estudiantes.

**Casos cubiertos:**
- ✅ Renderizado inicial del componente
- ✅ Validación de entrada (solo 7 dígitos numéricos)
- ✅ Habilitación/deshabilitación del botón según input
- ✅ Validación exitosa con backend
- ✅ Manejo de códigos inválidos
- ✅ Manejo de errores de conexión
- ✅ Estados de carga durante validación
- ✅ Persistencia en localStorage

**Ejemplo de código probado:**
```javascript
// Validación de código de 7 dígitos
const codigo = '9773211';
fireEvent.change(input, { target: { value: codigo } });
fireEvent.click(button);

await waitFor(() => {
  expect(localStorage.getItem('equipo_id')).toBe('151');
});
```

### 2. **TeamCodesDisplay.test.jsx** (Visualización de Códigos)
Prueba el componente que muestra los códigos de equipo al profesor.

**Casos cubiertos:**
- ✅ Renderizado de todos los equipos
- ✅ Visualización de códigos de 7 dígitos
- ✅ Funcionalidad de copiar al portapapeles
- ✅ Feedback visual después de copiar
- ✅ Manejo de equipos vacíos
- ✅ Manejo de props inválidas (null, undefined)
- ✅ Aplicación correcta de estilos Tailwind

**Ejemplo de código probado:**
```javascript
// Copiar código al portapapeles
const copyButton = screen.getAllByText(/Copiar/i)[0];
fireEvent.click(copyButton);

expect(navigator.clipboard.writeText).toHaveBeenCalledWith('9773211');
expect(await screen.findByText(/¡Copiado!/i)).toBeInTheDocument();
```

### 3. **gameService.test.js** (Servicios API)
Prueba todas las funciones de comunicación con el backend.

**Casos cubiertos:**
- ✅ `crearPartidaConGrupos`: Creación de partida y asignación de grupos
- ✅ `obtenerGrupos`: Recuperación de equipos creados
- ✅ `validarCodigoEquipo`: Validación de códigos de 7 dígitos
- ✅ Manejo de errores HTTP (400, 404, 500)
- ✅ Manejo de errores de red (timeout, sin respuesta)
- ✅ Configuración correcta de headers
- ✅ Validación de formato antes de enviar

**Ejemplo de código probado:**
```javascript
// Crear partida y asignar grupos
const result = await gameService.crearPartidaConGrupos({
  codigo_partida: '977321',
  grupos: [
    { nombre_grupo: 'Equipo 1', alumnos: [] },
    { nombre_grupo: 'Equipo 2', alumnos: [] }
  ]
});

expect(result.gruposCreados[0].codigo_equipo).toBe('9773211');
```

### 4. **teamCodesFlow.test.jsx** (Integración)
Prueba el flujo completo desde creación hasta validación.

**Casos cubiertos:**
- ✅ Flujo completo: crear → mostrar → validar
- ✅ Múltiples estudiantes en diferentes equipos
- ✅ Rechazo de códigos incorrectos
- ✅ Obtención de grupos mediante GET
- ✅ Persistencia de datos en localStorage
- ✅ Sincronización entre profesor y estudiante

**Ejemplo de flujo probado:**
```javascript
// Flujo completo
1. Profesor crea partida → genera 4 códigos
2. Sistema muestra códigos en TeamCodesDisplay
3. Estudiante ingresa código '9773211'
4. Backend valida y retorna datos del equipo
5. Sistema guarda en localStorage
6. Estudiante se une exitosamente
```

## 🔧 Configuración

### jest.config.js
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Mocks Globales (setup.js)
- **localStorage**: Simulación completa de getItem/setItem/clear
- **fetch**: Mock para llamadas HTTP
- **TextEncoder/TextDecoder**: Polyfills para Jest
- **clipboard API**: Mock de navigator.clipboard.writeText

## 📊 Interpretando los Resultados

### Reporte de Cobertura
Después de ejecutar `npm run test:coverage`, se genera un reporte HTML en:
```
frontend/coverage/lcov-report/index.html
```

**Indicadores de cobertura:**
- 🟢 Verde (>70%): Excelente cobertura
- 🟡 Amarillo (50-70%): Cobertura aceptable, mejorable
- 🔴 Rojo (<50%): Requiere más pruebas

### Ejemplo de Output
```
PASS  src/__tests__/components/PhaseSalaCodigo.test.jsx
  ✓ debe renderizar el título correcto (45ms)
  ✓ debe validar código de 7 dígitos (89ms)
  ✓ debe guardar en localStorage (102ms)

Test Suites: 4 passed, 4 total
Tests:       32 passed, 32 total
Coverage:    75.3% statements | 72.8% branches | 78.1% functions | 75.9% lines
```

## 🐛 Debugging de Tests

### Ver tests fallando en detalle
```bash
npm run test:verbose
```

### Ejecutar un solo archivo
```bash
npm test PhaseSalaCodigo
```

### Ver cambios en tiempo real
```bash
npm run test:watch
```

### Debug con console.log
Los `console.log` dentro de los tests aparecen en la salida de Jest.

## ✅ Mejores Prácticas Implementadas

1. **Aislamiento**: Cada test limpia localStorage y mocks antes de ejecutar
2. **Descriptivos**: Nombres de tests claros que explican lo que prueban
3. **AAA Pattern**: Arrange, Act, Assert en cada test
4. **Mocking**: Uso de mocks para axios y APIs del navegador
5. **Cobertura**: Objetivo realista de 70% en todas las métricas
6. **Organización**: Tests separados en carpetas por tipo
7. **Documentación**: Comentarios JSDoc explicando cada suite

## 🔄 Integración Continua

Para ejecutar en CI/CD (GitHub Actions, GitLab CI, etc.):

```yaml
# Ejemplo para GitHub Actions
- name: Run tests
  run: npm run test:ci
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## 📈 Métricas de Rendimiento

Los tests están optimizados para:
- ⚡ Ejecución rápida: < 10 segundos para suite completa
- 💾 Memoria eficiente: Cleanup automático después de cada test
- 🔄 Paralelización: Aprovecha múltiples cores en CI

## 🎓 Recursos de Aprendizaje

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📧 Soporte

Si encuentras problemas con los tests:
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Limpia la caché de Jest: `npm test -- --clearCache`
3. Revisa los logs detallados: `npm run test:verbose`

---

**Última actualización:** 2025-01-20  
**Mantenedor:** Equipo Misión Emprende  
**Cobertura actual:** 75.3% (objetivo: 70%)
