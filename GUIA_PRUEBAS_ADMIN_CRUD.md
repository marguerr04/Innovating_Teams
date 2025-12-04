# GUÍA DE PRUEBA - FRONTEND ADMIN CRUD

## 🚀 **Instrucciones para Probar el Sistema CRUD de Administrador**

### **Prerequisitos:**
1. ✅ Backend Django corriendo en: http://localhost:8000
2. ✅ Frontend React corriendo en: http://localhost:3000
3. ✅ Base de datos PostgreSQL con datos

### **URL de Acceso:**
```
http://localhost:3000/admin
```

---

## 🧪 **Casos de Prueba a Realizar**

### **1. Verificar Carga de Datos**
- [ ] Al cargar la página, se debe mostrar la lista de desafíos existentes
- [ ] Verificar que se muestren los temas/áreas disponibles
- [ ] Confirmar que se carguen las personas/arquetipos

### **2. Crear Nuevo Desafío**
- [ ] Hacer clic en "Mostrar Formulario de Creación"
- [ ] Llenar todos los campos requeridos:
  - [ ] Seleccionar área/tema
  - [ ] Título del desafío
  - [ ] Descripción
  - [ ] Contexto
  - [ ] Nombre de persona
  - [ ] Edad de persona
- [ ] Hacer clic en "FINALIZAR CREACIÓN"
- [ ] Verificar que aparece mensaje de éxito
- [ ] Confirmar que el nuevo desafío aparece en la tabla

### **3. Usar Personas Existentes**
- [ ] En el formulario, seleccionar "Arquetipo 1" del dropdown
- [ ] Verificar que se auto-completen el nombre y edad
- [ ] Crear desafío con persona existente
- [ ] Verificar asociación correcta en la tabla

### **4. Editar Desafío Existente**
- [ ] Hacer clic en el ícono de edición (lápiz) de un desafío
- [ ] Verificar que se abra el formulario con datos pre-cargados
- [ ] Modificar algún campo
- [ ] Hacer clic en "GUARDAR CAMBIOS"
- [ ] Verificar que se actualice en la tabla

### **5. Gestión de Temas/Áreas**
- [ ] En la sección "Gestión de Áreas/Temas", hacer clic en "Crear Nueva Área"
- [ ] Escribir nombre del nuevo tema
- [ ] Hacer clic en el ícono de guardar
- [ ] Verificar que el tema aparece en la lista
- [ ] Verificar que el nuevo tema aparece en el dropdown del formulario

### **6. Eliminación (Opcional)**
- [ ] Intentar eliminar un tema sin desafíos asociados
- [ ] Intentar eliminar un tema con desafíos (debería fallar)
- [ ] Eliminar un desafío individual

---

## 🔍 **Puntos de Verificación Importantes**

### **Frontend ⚡**
- [ ] No aparecen referencias "(MOCK)"
- [ ] Los dropdowns se llenan con datos reales de la API
- [ ] Los formularios se resetean después de crear/editar
- [ ] Los mensajes de éxito/error son claros
- [ ] La tabla se actualiza automáticamente después de cambios

### **Backend 🔧**
- [ ] Verificar en la terminal del backend que llegan las peticiones
- [ ] Confirmar respuestas HTTP 200/201 para operaciones exitosas
- [ ] Verificar que los datos se guardan en PostgreSQL

### **Base de Datos 📊**
Ejecutar estas queries para verificar:
```sql
-- Verificar nuevos desafíos
SELECT * FROM public.desafio ORDER BY id DESC LIMIT 5;

-- Verificar nuevos temas
SELECT * FROM public.tema_desafio ORDER BY id DESC LIMIT 3;

-- Verificar asociaciones con personas
SELECT d.titulo, d.nombrepersona, p.nombrepersona 
FROM public.desafio d 
LEFT JOIN public.persona p ON d.persona_id = p.id;
```

---

## ⚠️ **Solución de Problemas**

### **Si el frontend no carga:**
```bash
cd frontend
npm install
npm start
```

### **Si hay errores de conexión:**
- Verificar que Django esté en puerto 8000
- Verificar que React esté en puerto 3000
- Revisar la consola del navegador (F12)

### **Si no aparecen datos:**
- Verificar que la base de datos PostgreSQL esté corriendo
- Ejecutar las pruebas del backend: `.\test-admin-crud-endpoints.ps1`

---

## ✅ **Resultado Esperado**

Al completar todas las pruebas exitosamente, tendrás:
- ✅ Sistema CRUD completo y funcional
- ✅ Formularios que crean/editan datos reales
- ✅ Tablas que muestran información actualizada
- ✅ Integración completa Frontend ↔ Backend ↔ Base de Datos

---

## 📝 **Log de Pruebas**
Marcar con ✅ o ❌ cada prueba realizada:

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Carga de datos | ⏸️ | |
| Crear desafío | ⏸️ | |
| Usar personas existentes | ⏸️ | |
| Editar desafío | ⏸️ | |
| Gestión de temas | ⏸️ | |
| Eliminación | ⏸️ | |

**Fecha de prueba:** _______________
**Probado por:** _______________