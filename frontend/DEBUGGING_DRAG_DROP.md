# 🔧 Guía de Debugging para Drag & Drop

## Problema Reportado
"muevo un chip de una persona y se mueve otra" - El drag & drop no está moviendo al estudiante correcto.

## Pasos para Diagnosticar

### 1. Preparar el Debugging
1. Abrir el navegador en `http://localhost:3001`
2. Abrir las **DevTools** (F12)
3. Ir a la pestaña **Console**
4. Cargar un archivo CSV con estudiantes

### 2. Verificar la Carga Inicial
Al cargar estudiantes, debes ver en la consola:
```
✅ Validación de IDs: Todos son únicos {totalStudents: X, sampleIds: [...], sampleStudents: [...]}
```

Si ves un error de IDs duplicados:
```
🚨 PROBLEMA: IDs duplicados detectados!
```
**→ Este es el problema principal**

### 3. Probar el Drag & Drop
1. Intenta mover un estudiante específico (nota cuál arrastras)
2. En la consola verás logs detallados:

```
🔧 Drag End Debug: {studentId: "csv-X", targetContainerId: "grupo-Y", containers: {...}}
✅ Estudiante encontrado: {sourceContainer: "unassigned", studentFound: {id: "csv-X", name: "Nombre"}}
📝 Estado previo completo: {...}
🔍 Índice del estudiante encontrado: X
🔄 Después de filtrar/agregar (con índices): {...}
🎯 Estado final de containers: {...}
```

### 4. Identificar el Problema

#### Caso A: IDs Correctos pero Estudiante Incorrecto
- Si `studentId` coincide con el estudiante que arrastraste
- Pero el `studentFound.name` es diferente
- **→ Problema de referencia de objetos**

#### Caso B: ID Incorrecto desde el Inicio
- Si `studentId` no coincide con el estudiante arrastrado
- **→ Problema en la configuración de draggable**

#### Caso C: Estudiante No Encontrado
- Si ves: `🚨 ERROR: Estudiante no encontrado en contenedor origen!`
- **→ Problema de sincronización de estado**

### 5. Información de Diagnóstico Clave

Revisa estos campos en los logs:

1. **StudentId vs Estudiante Real**: ¿Coinciden?
2. **Índices**: ¿El índice encontrado es correcto?
3. **Referencias**: ¿Los objetos antes y después son consistentes?
4. **Estado Final**: ¿El resultado final es el esperado?

## Posibles Causas y Soluciones

### Causa 1: Referencias de Objeto Compartidas
**Síntoma**: El ID es correcto pero se mueve otro estudiante
**Solución**: Ya implementada con copias profundas

### Causa 2: IDs Duplicados o Conflictivos
**Síntoma**: `🚨 PROBLEMA: IDs duplicados detectados!`
**Solución**: Revisar generación de IDs en `processStudentsFromCsv`

### Causa 3: Problema de React Keys
**Síntoma**: Componentes se renderizan incorrectamente
**Solución**: Verificar que `key={student.id}` sea único y estable

### Causa 4: Estado Desactualizado
**Síntoma**: `containers` no refleja la UI actual
**Solución**: Verificar sincronización entre estado y componentes

## Comandos Útiles para Testing

### En la Consola del Navegador:
```javascript
// Ver estado actual de containers
console.log('Estado actual:', containers);

// Ver todos los IDs
console.log('IDs únicos:', new Set(Object.values(containers).flat().map(s => s.id)));

// Verificar estudiante específico
console.log('Estudiante csv-1:', Object.values(containers).flat().find(s => s.id === 'csv-1'));
```

## Reporte de Resultados

Una vez que ejecutes las pruebas, reporta:

1. **¿Hay IDs duplicados?** (Sí/No)
2. **¿El studentId correcto se captura?** (Sí/No)
3. **¿Se encuentra el estudiante correcto?** (Sí/No)
4. **¿Los logs muestran el movimiento correcto?** (Sí/No)

Con esta información podremos identificar exactamente dónde está el problema.