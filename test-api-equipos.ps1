# Script de Pruebas API - Misión Emprende
# Ejecutar en PowerShell

Write-Host "🚀 Iniciando pruebas de API - Sistema de Equipos e Imágenes" -ForegroundColor Cyan
Write-Host "=" * 70

$baseUrl = "http://localhost:8000/api"

# Test 1: Verificar que el servidor está corriendo
Write-Host "`n📡 Test 1: Verificando servidor Django..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test-db/" -Method GET -ErrorAction Stop
    Write-Host "✅ Servidor activo - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: El servidor Django no está corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend/misionemprende; python manage.py runserver" -ForegroundColor Yellow
    exit
}

# Test 2: Obtener lista de equipos
Write-Host "`n👥 Test 2: Obteniendo lista de equipos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/equipos/" -Method GET
    $equiposCount = $response.Count
    Write-Host "✅ Equipos encontrados: $equiposCount" -ForegroundColor Green
    
    if ($equiposCount -gt 0) {
        Write-Host "`nEquipos disponibles:" -ForegroundColor Cyan
        foreach ($equipo in $response) {
            Write-Host "  • ID: $($equipo.id) - Nombre: $($equipo.nombre) - Tamaño: $($equipo.tamanoequipo)" -ForegroundColor White
        }
    } else {
        Write-Host "⚠️  No hay equipos en la base de datos" -ForegroundColor Yellow
        Write-Host "   Ejecuta el script SQL: basedatos/Scripts/VerificarEquipos.sql" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error al obtener equipos: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Probar guardar imagen (simulado)
Write-Host "`n📸 Test 3: Probando guardar imagen..." -ForegroundColor Yellow
if ($equiposCount -gt 0) {
    $primerEquipo = $response[0]
    $body = @{
        equipo_id = $primerEquipo.id
        image_url = "https://storage.googleapis.com/test-bucket/test_image_$(Get-Date -Format 'yyyyMMddHHmmss').jpg"
        descripcion = "Test automático desde PowerShell"
    } | ConvertTo-Json

    try {
        $saveResponse = Invoke-RestMethod -Uri "$baseUrl/guardar-imagen/" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ Imagen guardada exitosamente" -ForegroundColor Green
        Write-Host "   Solución ID: $($saveResponse.solucion_id)" -ForegroundColor White
        Write-Host "   URL: $($saveResponse.image_url)" -ForegroundColor White
        Write-Host "   Creado nuevo: $($saveResponse.created)" -ForegroundColor White
    } catch {
        Write-Host "❌ Error al guardar imagen: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Saltado - No hay equipos disponibles" -ForegroundColor Yellow
}

# Test 4: Obtener imagen de equipo
Write-Host "`n🖼️  Test 4: Obteniendo imagen de equipo..." -ForegroundColor Yellow
if ($equiposCount -gt 0) {
    $primerEquipo = $response[0]
    try {
        $imageResponse = Invoke-RestMethod -Uri "$baseUrl/obtener-imagen/?team_id=$($primerEquipo.id)" -Method GET
        if ($imageResponse.has_image) {
            Write-Host "✅ Imagen encontrada para equipo $($primerEquipo.nombre)" -ForegroundColor Green
            Write-Host "   URL: $($imageResponse.image_url)" -ForegroundColor White
            Write-Host "   Solución ID: $($imageResponse.solucion_id)" -ForegroundColor White
        } else {
            Write-Host "⚠️  No hay imagen para este equipo" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error al obtener imagen: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Saltado - No hay equipos disponibles" -ForegroundColor Yellow
}

# Resumen
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "✅ Pruebas completadas" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Verifica que haya equipos en la BD con: basedatos/Scripts/VerificarEquipos.sql"
Write-Host "  2. Inicia el frontend: cd frontend; npm start"
Write-Host "  3. Abre: http://localhost:3000/test-image-upload"
Write-Host "  4. Prueba el dropdown de equipos y sube una imagen"
Write-Host "`n📖 Documentación completa: backend/POSTMAN_TESTS.md" -ForegroundColor Yellow
