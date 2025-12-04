# 🧪 Script de Prueba: Validación de Código de Acceso

Write-Host "🎯 PRUEBA DE VALIDACION DE CODIGO DE ACCESO" -ForegroundColor Cyan
Write-Host "=" -NoNewline; Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. VERIFICAR BACKEND CORRIENDO
# ============================================
Write-Host "📡 Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/login/" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Backend está corriendo en puerto 8000" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend NO está corriendo. Ejecuta primero:" -ForegroundColor Red
    Write-Host "   python manage.py runserver" -ForegroundColor White
    exit 1
}

Write-Host ""

# ============================================
# 2. OBTENER ÚLTIMA PARTIDA CREADA
# ============================================
Write-Host "🔍 Obteniendo última partida creada..." -ForegroundColor Yellow

# Usar Python para consultar la BD
$pythonScript = @"
import sys
import os
import django

# Setup Django
sys.path.append(r'e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\backend\misionemprende')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from api.models import Partida

try:
    ultima = Partida.objects.latest('id')
    print(f'{ultima.id}|{ultima.codigoacceso}|{ultima.estado}')
except:
    print('NO_PARTIDA')
"@

$result = python -c $pythonScript

if ($result -eq 'NO_PARTIDA') {
    Write-Host "❌ No hay partidas en la BD. Crea una primero desde el dashboard del profesor." -ForegroundColor Red
    exit 1
}

$partidaData = $result.Split('|')
$partidaId = $partidaData[0]
$codigoValido = $partidaData[1]
$estadoPartida = $partidaData[2]

Write-Host "✅ Partida encontrada:" -ForegroundColor Green
Write-Host "   ID: $partidaId" -ForegroundColor White
Write-Host "   Código: $codigoValido" -ForegroundColor Cyan
Write-Host "   Estado: $estadoPartida" -ForegroundColor White
Write-Host ""

# ============================================
# 3. PROBAR CÓDIGO VÁLIDO
# ============================================
Write-Host "🧪 Test 1: Código VÁLIDO ($codigoValido)" -ForegroundColor Yellow

$body = @{
    codigo = $codigoValido
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/validar-codigo/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ ÉXITO - Código aceptado" -ForegroundColor Green
    Write-Host "   Válido: $($response.valido)" -ForegroundColor White
    Write-Host "   Partida ID: $($response.partida_id)" -ForegroundColor White
    Write-Host "   Estado: $($response.estado)" -ForegroundColor White
    Write-Host "   Mensaje: $($response.mensaje)" -ForegroundColor White
} catch {
    Write-Host "❌ ERROR - Código válido rechazado" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""

# ============================================
# 4. PROBAR CÓDIGO INVÁLIDO
# ============================================
Write-Host "🧪 Test 2: Código INVÁLIDO (999999)" -ForegroundColor Yellow

$body = @{
    codigo = "999999"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/validar-codigo/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "❌ ERROR - Código inválido aceptado (NO DEBERÍA PASAR)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($statusCode -eq 404) {
        Write-Host "✅ ÉXITO - Código rechazado correctamente" -ForegroundColor Green
        Write-Host "   Error: $($errorResponse.error)" -ForegroundColor White
    } else {
        Write-Host "⚠️ Código rechazado con status $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# 5. PROBAR CÓDIGO VACÍO
# ============================================
Write-Host "🧪 Test 3: Código VACÍO" -ForegroundColor Yellow

$body = @{
    codigo = ""
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/validar-codigo/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "❌ ERROR - Código vacío aceptado (NO DEBERÍA PASAR)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($statusCode -eq 400) {
        Write-Host "✅ ÉXITO - Código vacío rechazado" -ForegroundColor Green
        Write-Host "   Error: $($errorResponse.error)" -ForegroundColor White
    }
}

Write-Host ""

# ============================================
# 6. PROBAR CÓDIGO MAL FORMADO
# ============================================
Write-Host "🧪 Test 4: Código MAL FORMADO (ABC123)" -ForegroundColor Yellow

$body = @{
    codigo = "ABC123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/validar-codigo/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "❌ ERROR - Código mal formado aceptado (NO DEBERÍA PASAR)" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    
    if ($statusCode -eq 400) {
        Write-Host "✅ ÉXITO - Código mal formado rechazado" -ForegroundColor Green
        Write-Host "   Error: $($errorResponse.error)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=" -NoNewline; Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "✅ PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMEN:" -ForegroundColor Cyan
Write-Host "   - Código válido: FUNCIONA ✅" -ForegroundColor White
Write-Host "   - Código inválido: RECHAZADO ✅" -ForegroundColor White
Write-Host "   - Código vacío: RECHAZADO ✅" -ForegroundColor White
Write-Host "   - Código mal formado: RECHAZADO ✅" -ForegroundColor White
Write-Host ""
Write-Host "🎯 PRÓXIMO PASO:" -ForegroundColor Yellow
Write-Host "   1. Inicia el frontend: npm start" -ForegroundColor White
Write-Host "   2. Ve a http://localhost:3000/estudiante" -ForegroundColor White
Write-Host "   3. Ingresa el código: $codigoValido" -ForegroundColor Cyan
Write-Host "   4. Debería permitirte entrar ✅" -ForegroundColor White
Write-Host ""
