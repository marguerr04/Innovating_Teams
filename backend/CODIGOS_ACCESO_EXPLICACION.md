# 🔑 Códigos de Acceso (PIN) - Documentación Completa

## 📋 Resumen

El **código de acceso** (también llamado PIN del juego) es un identificador único que permite a los estudiantes unirse a una partida específica. Este documento explica cómo se genera, por qué es único y cómo se puede mejorar.

---

## 🎯 ¿Qué es el Código de Acceso?

### **Definición:**
Un string único y corto que identifica una partida específica en el sistema.

### **Propósito:**
- ✅ Permitir que estudiantes se unan al juego sin necesidad de conocer el ID interno
- ✅ Fácil de compartir en clase (en pantalla, voz, chat)
- ✅ Identificador memorable y corto

### **Ejemplo de uso:**
```
Profesor: "El código para unirse al juego es: 4-5-6-7-8-9"
Estudiante: Ingresa "456789" en la aplicación
Sistema: Lo conecta automáticamente a la partida correcta
```

---

## 🔧 Implementación Actual (MEJORADA)

### **Código en Backend:**

```python
# backend/misionemprende/api/views.py - función crear_partida()

# NUEVA IMPLEMENTACIÓN: PIN Numérico de 6 dígitos
codigo_acceso = None
intentos = 0
max_intentos = 10

while codigo_acceso is None and intentos < max_intentos:
    # Generar PIN de 6 dígitos (100000 a 999999)
    pin_candidato = str(random.randint(100000, 999999))
    
    # Verificar que no exista en la BD
    if not Partida.objects.filter(codigoacceso=pin_candidato).exists():
        codigo_acceso = pin_candidato
    
    intentos += 1

# Fallback: Si después de 10 intentos no se encontró PIN único, usar UUID
if codigo_acceso is None:
    codigo_acceso = str(uuid.uuid4())[:8]
```

---

## 🔒 Garantía de Unicidad

### **Nivel 1: Constraint de Base de Datos**

```python
# En models.py
class Partida(models.Model):
    codigoacceso = models.CharField(unique=True, max_length=10, ...)
    #                               ↑↑↑↑↑↑↑↑↑↑↑
    #                               CONSTRAINT UNIQUE
```

**¿Qué significa esto?**
- La base de datos PostgreSQL/MySQL/SQLite **garantiza** que no puede haber dos partidas con el mismo código
- Si intentas insertar un código duplicado, la BD lanza un error: `IntegrityError`
- Es imposible tener códigos duplicados en la tabla `partida`

### **Nivel 2: Verificación en Código**

```python
# Antes de usar un código, verificamos que no exista
if not Partida.objects.filter(codigoacceso=pin_candidato).exists():
    codigo_acceso = pin_candidato  # ✅ Es único
```

**Doble protección:**
1. Verificación en Python antes de insertar
2. Constraint en la BD por si falla la verificación

---

## 📊 Estadísticas de Colisiones

### **PIN Numérico de 6 Dígitos (100000 - 999999)**

**Combinaciones posibles:** 900,000

**Probabilidad de colisión:**
```
Para 1,000 juegos activos:
  P(colisión) ≈ 0.00056% 
  ≈ 1 en 180,000 intentos

Para 10,000 juegos activos:
  P(colisión) ≈ 0.056%
  ≈ 1 en 1,800 intentos

Para 100,000 juegos activos:
  P(colisión) ≈ 5.6%
  ≈ 1 en 18 intentos
```

**Conclusión para uso educativo:**
- ✅ **Perfecto para instituciones pequeñas/medianas** (< 10,000 juegos simultáneos)
- ✅ **Con 10 intentos de generación**, prácticamente imposible no encontrar PIN único
- ⚠️ Para escalabilidad masiva (> 100,000 juegos), considerar 7-8 dígitos

---

## 🎨 Formatos de Código de Acceso

### **Formato 1: PIN Numérico Puro (IMPLEMENTADO)**

```python
random.randint(100000, 999999)
```

**Ejemplos:**
```
"123456"
"789012"
"456789"
"234567"
```

**Ventajas:**
- ✅ Muy fácil de leer en voz alta: "uno-dos-tres-cuatro-cinco-seis"
- ✅ Funciona en cualquier teclado (móvil, tablet, PC)
- ✅ Sin confusión de caracteres
- ✅ Rápido de escribir

**Desventajas:**
- ⚠️ Solo 900,000 combinaciones (puede ser poco para sistemas muy grandes)
- ⚠️ No tan "único" como UUID

---

### **Formato 2: Alfanumérico Sin Confusión**

```python
# Excluir: O, 0, I, 1, l para evitar confusión
caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
codigo = ''.join(random.choices(caracteres, k=6))
```

**Ejemplos:**
```
"AB3C4D"
"XY7Z8K"
"PQ2RS5"
"MN9TU6"
```

**Ventajas:**
- ✅ Más combinaciones: 30^6 = 729 millones
- ✅ Sin confusión visual (no hay O/0, I/1)
- ✅ Más corto que UUID

**Desventajas:**
- ⚠️ Más difícil de leer en voz alta (mezcla letras y números)
- ⚠️ Puede requerir distinguir mayúsculas

---

### **Formato 3: Con Guión (Más Legible)**

```python
parte1 = ''.join(random.choices(letras, k=3))  # Ej: "ABC"
parte2 = ''.join(random.choices(numeros, k=3))  # Ej: "234"
codigo = f"{parte1}-{parte2}"  # Resultado: "ABC-234"
```

**Ejemplos:**
```
"ABC-234"
"XYZ-789"
"PQR-456"
"MNT-567"
```

**Ventajas:**
- ✅ Visual: El guión ayuda a distinguir partes
- ✅ Más fácil de leer: "A-B-C guión dos-tres-cuatro"
- ✅ Menos errores de transcripción

**Desventajas:**
- ⚠️ Un carácter más largo (7 vs 6)
- ⚠️ El guión puede ser confuso en algunos contextos

---

### **Formato 4: UUID (IMPLEMENTACIÓN ANTERIOR)**

```python
str(uuid.uuid4())[:8]  # Ej: "a7b3c9d2"
```

**Ejemplos:**
```
"a7b3c9d2"
"f3e8d1a0"
"9c4b2f7e"
```

**Ventajas:**
- ✅ Prácticamente imposible colisión (4 mil millones de combinaciones)
- ✅ No requiere verificación en BD

**Desventajas:**
- ❌ Difícil de leer en voz alta
- ❌ Confusión entre caracteres similares
- ❌ No muy amigable para usuarios

---

## 🔄 ¿Son Reutilizables los Códigos?

### **Respuesta Corta: NO**

Cada código de acceso es **único y permanente** para una partida específica.

### **Ciclo de Vida de un Código:**

```
1. CREACIÓN
   ├─ Partida creada → Se genera PIN único
   ├─ PIN se guarda en BD: partida.codigoacceso
   └─ PIN se envía al frontend

2. USO ACTIVO
   ├─ Profesor muestra PIN a estudiantes
   ├─ Estudiantes ingresan PIN para unirse
   └─ Sistema valida: ¿Existe partida con este PIN?

3. JUEGO FINALIZADO
   ├─ Partida termina (estado = 'FINALIZADA')
   ├─ PIN sigue en BD (para histórico)
   └─ PIN YA NO SE PUEDE REUTILIZAR
       (aunque técnicamente podría, no se recomienda)

4. HISTÓRICO
   ├─ PIN permanece en BD para auditoría
   ├─ Se puede consultar resultados del juego por PIN
   └─ No se reutiliza para nuevas partidas
```

### **¿Por qué no reutilizar códigos?**

**Razones técnicas:**
1. **Constraint UNIQUE en BD:** No puedes insertar el mismo código dos veces
2. **Integridad de datos:** Cada PIN debe referenciar UNA partida específica
3. **Auditoría:** Necesitas histórico de todas las partidas

**Razones de UX:**
1. **Confusión:** Estudiantes podrían unirse al juego incorrecto
2. **Seguridad:** Evita acceso no autorizado a partidas antiguas
3. **Simplicidad:** Más fácil generar nuevo PIN que gestionar reutilización

---

## 🚀 Mejoras Futuras Sugeridas

### **1. PIN Temporal con Expiración**

```python
# Agregar campo de expiración
class Partida(models.Model):
    codigoacceso = models.CharField(unique=True, max_length=10)
    fecha_expiracion = models.DateTimeField()  # ← NUEVO
    
# Al validar el PIN
def validar_pin(pin):
    partida = Partida.objects.get(codigoacceso=pin)
    
    if partida.fecha_expiracion < timezone.now():
        raise ValidationError("Este PIN ha expirado")
    
    return partida
```

**Ventajas:**
- ✅ PINs antiguos no funcionan después de cierto tiempo
- ✅ Mejora seguridad (no se puede acceder a juegos viejos)
- ✅ Permite liberar PINs para reutilización (si quieres)

---

### **2. PIN con Prefijo por Institución**

```python
# Formato: INS-123456
# INS = código de la institución
# 123456 = número único

codigo = f"{institucion.codigo}-{random.randint(100000, 999999)}"
```

**Ejemplo:**
```
"USACH-456789"  → Universidad de Santiago
"UCH-234567"    → Universidad de Chile
"PUC-789012"    → Pontificia Universidad Católica
```

**Ventajas:**
- ✅ Identifica visualmente de qué institución es el juego
- ✅ Evita colisiones entre instituciones
- ✅ Útil para sistemas multi-tenancy

---

### **3. PIN con Validación de Checksum**

```python
def generar_pin_con_checksum():
    """
    Genera PIN de 6 dígitos con dígito verificador
    Formato: 12345-6 (último dígito es checksum)
    """
    base = random.randint(10000, 99999)  # 5 dígitos
    checksum = calcular_checksum(base)   # 1 dígito
    return f"{base}{checksum}"

def calcular_checksum(numero):
    """Algoritmo de Luhn o similar"""
    digitos = [int(d) for d in str(numero)]
    suma = sum(digitos)
    return (10 - (suma % 10)) % 10
```

**Ventajas:**
- ✅ Detecta errores de transcripción (typos)
- ✅ Reduce ingresos incorrectos
- ✅ Mejora experiencia de usuario

---

## 📝 Consultas Útiles en Base de Datos

### **Ver todos los códigos activos:**
```sql
SELECT id, codigoacceso, estado, fechacreacion 
FROM partida 
WHERE estado = 'CREADA' OR estado = 'EN_CURSO'
ORDER BY fechacreacion DESC;
```

### **Buscar partida por PIN:**
```sql
SELECT * FROM partida WHERE codigoacceso = '456789';
```

### **Verificar si un PIN está disponible:**
```sql
SELECT COUNT(*) FROM partida WHERE codigoacceso = '456789';
-- Si retorna 0: está disponible
-- Si retorna 1: ya existe
```

### **Ver historial de PINs generados:**
```sql
SELECT 
    codigoacceso AS "PIN",
    estado AS "Estado",
    fechacreacion AS "Creado",
    COUNT(pu.id) AS "Estudiantes"
FROM partida p
LEFT JOIN partida_usuario pu ON p.id = pu.partida_id
GROUP BY p.id
ORDER BY fechacreacion DESC
LIMIT 20;
```

---

## 🎯 Recomendaciones Finales

### **Para Sistemas Pequeños/Medianos (< 10,000 juegos simultáneos):**
✅ **Usar PIN numérico de 6 dígitos** (implementación actual)
- Fácil de compartir
- Suficientes combinaciones
- Experiencia de usuario óptima

### **Para Sistemas Grandes (> 10,000 juegos simultáneos):**
✅ **Usar PIN numérico de 7-8 dígitos**
```python
random.randint(1000000, 9999999)  # 7 dígitos
```

### **Para Máxima Seguridad/Escalabilidad:**
✅ **Usar formato alfanumérico sin confusión + checksum**
```python
# Ejemplo: "AB3C4D-7"
# 6 caracteres + 1 dígito verificador
```

---

## ✅ Conclusión

**Implementación actual (PIN de 6 dígitos):**
- ✅ **Único:** Garantizado por BD y verificación en código
- ✅ **Fácil de usar:** Números simples, fácil de compartir
- ✅ **Suficiente:** 900,000 combinaciones para uso educativo
- ✅ **No reutilizable:** Cada PIN identifica una partida específica
- ✅ **Seguro:** Doble verificación (código + BD)

**El sistema actual es robusto y apropiado para el contexto educativo.** 🎉
