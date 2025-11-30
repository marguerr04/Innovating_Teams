# Test de endpoints de estados de partida

$baseUrl = "http://127.0.0.1:8000/api"
$partidaId = 75  # Usar partida existente

Write-Host "===== TEST ENDPOINTS ESTADOS DE PARTIDA =====" -ForegroundColor Cyan
Write-Host ""

# 1. Consultar estado actual (debería devolver CONFIGURACION por defecto)
Write-Host "1. Consultando estado actual de partida $partidaId..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/estado-actual/" -Method GET
    Write-Host "Estado actual:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 2. Iniciar juego (profesor)
Write-Host "2. Iniciando juego (profesor clicks 'Comenzar Juego')..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/iniciar-juego/" -Method POST -ContentType "application/json"
    Write-Host "Resultado:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 3. Verificar que el estado cambió
Write-Host "3. Verificando que el estado cambió a INICIADA..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/estado-actual/" -Method GET
    Write-Host "Nuevo estado:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    
    if ($response.estado_actual -eq "INICIADA" -and $response.fase_actual -eq 1) {
        Write-Host "`n✅ Estado cambió correctamente a INICIADA, fase 1" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Estado NO cambió correctamente" -ForegroundColor Red
    }
} catch {
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "===== TESTS COMPLETADOS =====" -ForegroundColor Cyan
