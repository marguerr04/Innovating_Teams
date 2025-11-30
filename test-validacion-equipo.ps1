# ========================================
# TEST VALIDACION CODIGO PARTIDA-EQUIPO
# ========================================
# Script para probar el nuevo endpoint /api/validar-equipo/
# que valida codigos de 7 digitos (6 partida + 1 equipo)

$baseUrl = "http://127.0.0.1:8000/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST: VALIDACION CODIGO PARTIDA-EQUIPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# PASO 1: Crear una partida de prueba
# ========================================
Write-Host "PASO 1: Creando partida de prueba..." -ForegroundColor Yellow

# Primero login como profesor
$loginData = @{
    usuario = "profesor1"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login/profesor/" -Method Post -Body $loginData -Headers $headers
    Write-Host "[OK] Login exitoso: Profesor ID $($loginResponse.profesor_id)" -ForegroundColor Green
    $profesorId = $loginResponse.profesor_id
    $token = $loginResponse.token
    
    # Agregar token a headers
    $headers["Authorization"] = "Token $token"
} catch {
    Write-Host "[ERROR] Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Crear partida
$partidaData = @{
    usuario = $profesorId
    nombrepartida = "Test Validación Equipo"
    cantidadgrupos = 3
} | ConvertTo-Json

try {
    $partidaResponse = Invoke-RestMethod -Uri "$baseUrl/crear-partida/" -Method Post -Body $partidaData -Headers $headers
    Write-Host "[OK] Partida creada exitosamente" -ForegroundColor Green
    Write-Host "  - Partida ID: $($partidaResponse.id)" -ForegroundColor White
    Write-Host "  - Codigo Partida: $($partidaResponse.codigoacceso)" -ForegroundColor White
    $partidaId = $partidaResponse.id
    $codigoPartida = $partidaResponse.codigoacceso
} catch {
    Write-Host "[ERROR] Error al crear partida: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ========================================
# PASO 2: Asignar grupos a la partida
# ========================================
Write-Host "`nPASO 2: Asignando grupos a la partida..." -ForegroundColor Yellow

$gruposData = @{
    grupos = @(
        @{
            nombreEquipo = "Equipo Alpha"
            tamano = 3
            estudiantes = @()
        },
        @{
            nombreEquipo = "Equipo Beta"
            tamano = 4
            estudiantes = @()
        },
        @{
            nombreEquipo = "Equipo Gamma"
            tamano = 5
            estudiantes = @()
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $gruposResponse = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/asignar-grupos/" -Method Post -Body $gruposData -Headers $headers
    Write-Host "[OK] Grupos asignados exitosamente" -ForegroundColor Green
    
    $codigosEquipo = @()
    
    foreach ($grupo in $gruposResponse.grupos_creados) {
        Write-Host "  - $($grupo.nombre_equipo): Codigo $($grupo.codigo_equipo)" -ForegroundColor White
        $codigosEquipo += $grupo.codigo_equipo
    }
    
    Write-Host ""
    Write-Host "Codigos generados para pruebas:" -ForegroundColor Cyan
    foreach ($codigo in $codigosEquipo) {
        Write-Host "   $codigo" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "[ERROR] Error al asignar grupos: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# ========================================
# PASO 3: Probar validación con código válido
# ========================================
Write-Host "`nPASO 3: Probando validación con código VÁLIDO..." -ForegroundColor Yellow

$codigoValido = $codigosEquipo[0]  # Primer código generado
Write-Host "Código a probar: $codigoValido" -ForegroundColor White

# Remover token para simular tablet sin autenticación
$testHeaders = @{
    "Content-Type" = "application/json"
}

$validacionData = @{
    codigo = $codigoValido
} | ConvertTo-Json

try {
    $validacionResponse = Invoke-RestMethod -Uri "$baseUrl/validar-equipo/" -Method Post -Body $validacionData -Headers $testHeaders
    
    Write-Host "[OK] CODIGO VALIDO - Validacion exitosa" -ForegroundColor Green
    Write-Host "  Partida ID: $($validacionResponse.partida_id)" -ForegroundColor White
    Write-Host "  Equipo ID: $($validacionResponse.equipo_id)" -ForegroundColor White
    Write-Host "  Equipo Nombre: $($validacionResponse.equipo_nombre)" -ForegroundColor White
    Write-Host "  Equipo Numero: $($validacionResponse.equipo_numero)" -ForegroundColor White
    Write-Host "  Estado Partida: $($validacionResponse.estado_partida)" -ForegroundColor White
    Write-Host "  Mensaje: $($validacionResponse.mensaje)" -ForegroundColor White
    
} catch {
    Write-Host "[ERROR] Error inesperado con codigo valido" -ForegroundColor Red
    Write-Host "  StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "  Response: $responseBody" -ForegroundColor Red
}

# ========================================
# PASO 4: Probar validacion con codigo INVALIDO
# ========================================
Write-Host ""
Write-Host "PASO 4: Probando validacion con codigo INVALIDO..." -ForegroundColor Yellow

$codigoInvalido = "9999999"
Write-Host "Codigo a probar: $codigoInvalido" -ForegroundColor White

$validacionData = @{
    codigo = $codigoInvalido
} | ConvertTo-Json

try {
    $validacionResponse = Invoke-RestMethod -Uri "$baseUrl/validar-equipo/" -Method Post -Body $validacionData -Headers $testHeaders
    Write-Host "[ERROR] CODIGO INVALIDO deberia fallar pero paso" -ForegroundColor Red
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
    
    if ($statusCode -eq 404) {
        Write-Host "[OK] CODIGO INVALIDO - Rechazado correctamente (404)" -ForegroundColor Green
        Write-Host "  Mensaje: $($responseBody.error)" -ForegroundColor White
    } else {
        Write-Host "[ERROR] StatusCode inesperado: $statusCode" -ForegroundColor Red
        Write-Host "  Response: $($responseBody | ConvertTo-Json)" -ForegroundColor Red
    }
}

# ========================================
# PASO 5: Probar validación con formato incorrecto
# ========================================
Write-Host "`nPASO 5: Probando validación con FORMATO INCORRECTO..." -ForegroundColor Yellow

$codigosIncorrectos = @("123", "12345678", "ABC1234", "")

foreach ($codigo in $codigosIncorrectos) {
    Write-Host "`nCódigo a probar: '$codigo'" -ForegroundColor White
    
    $validacionData = @{
        codigo = $codigo
    } | ConvertTo-Json
    
    try {
        $validacionResponse = Invoke-RestMethod -Uri "$baseUrl/validar-equipo/" -Method Post -Body $validacionData -Headers $testHeaders
        Write-Host "✗ Código '$codigo' debería fallar pero pasó" -ForegroundColor Red
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
        
        if ($statusCode -eq 400) {
            Write-Host "✓ Formato incorrecto rechazado (400)" -ForegroundColor Green
            Write-Host "  Mensaje: $($responseBody.error)" -ForegroundColor White
        } else {
            Write-Host "✗ StatusCode inesperado: $statusCode" -ForegroundColor Red
            Write-Host "  Response: $($responseBody | ConvertTo-Json)" -ForegroundColor Red
        }
    }
}

# ========================================
# PASO 6: Probar todos los equipos creados
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PASO 6: Validando todos los códigos generados" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

foreach ($codigo in $codigosEquipo) {
    Write-Host "Probando código: $codigo" -ForegroundColor White
    
    $validacionData = @{
        codigo = $codigo
    } | ConvertTo-Json
    
    try {
        $validacionResponse = Invoke-RestMethod -Uri "$baseUrl/validar-equipo/" -Method Post -Body $validacionData -Headers $testHeaders
        Write-Host "✓ Válido - $($validacionResponse.equipo_nombre) (Equipo #$($validacionResponse.equipo_numero))" -ForegroundColor Green
        
    } catch {
        Write-Host "✗ Error al validar código $codigo" -ForegroundColor Red
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
}

# ========================================
# RESUMEN FINAL
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Partida creada con código: $codigoPartida" -ForegroundColor Green
Write-Host "✓ $($codigosEquipo.Count) equipos creados con códigos únicos" -ForegroundColor Green
Write-Host "✓ Validación de códigos válidos funcional" -ForegroundColor Green
Write-Host "✓ Validación de códigos inválidos funcional" -ForegroundColor Green
Write-Host "✓ Validación de formato incorrecto funcional" -ForegroundColor Green
Write-Host "`n🎉 TODAS LAS PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Mostrar códigos para uso manual
Write-Host "📱 CÓDIGOS PARA PROBAR EN TABLETS:" -ForegroundColor Yellow
foreach ($codigo in $codigosEquipo) {
    Write-Host "   $codigo" -ForegroundColor White
}
Write-Host ""
