# Script para probar los endpoints del CRUD de administrador
# Ejecutar desde la carpeta raiz del proyecto

Write-Host "========================================" -ForegroundColor Green
Write-Host "PRUEBA DE ENDPOINTS CRUD ADMINISTRADOR" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$baseUrl = "http://localhost:8000/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "`n1. Probando listar temas de desafio..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/temas/" -Method Get -Headers $headers
    Write-Host "SUCCESS - Temas encontrados: $($response.data.Count)" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        Write-Host "Primer tema: $($response.data[0].nombretema)" -ForegroundColor Cyan
        Write-Host "Descripcion: $($response.data[0].descripcion)" -ForegroundColor Cyan
        Write-Host "Desafios asociados: $($response.data[0].total_desafios)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "ERROR al obtener temas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Probando crear nuevo tema..." -ForegroundColor Yellow
$nuevoTema = @{
    nombretema = "Tema de Prueba PowerShell"
    descripcion = "Tema creado desde script de prueba"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/temas/" -Method Post -Body $nuevoTema -Headers $headers
    Write-Host "SUCCESS - Tema creado con ID: $($response.data.id)" -ForegroundColor Green
    $temaIdCreado = $response.data.id
} catch {
    Write-Host "ERROR al crear tema: $($_.Exception.Message)" -ForegroundColor Red
    $temaIdCreado = $null
}

Write-Host "`n3. Probando obtener personas/arquetipos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/personas/" -Method Get -Headers $headers
    Write-Host "SUCCESS - Personas encontradas: $($response.data.Count)" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        Write-Host "Primera persona: $($response.data[0].nombre)" -ForegroundColor Cyan
        $personaId = $response.data[0].id
    } else {
        $personaId = $null
    }
} catch {
    Write-Host "ERROR al obtener personas: $($_.Exception.Message)" -ForegroundColor Red
    $personaId = $null
}

Write-Host "`n4. Probando listar desafios (primera pagina)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/desafios/?page=1&limit=5" -Method Get -Headers $headers
    Write-Host "SUCCESS - Desafios encontrados: $($response.data.pagination.total)" -ForegroundColor Green
    Write-Host "Pagina actual: $($response.data.pagination.page) de $($response.data.pagination.pages)" -ForegroundColor Cyan
    
    if ($response.data.desafios.Count -gt 0) {
        Write-Host "Primer desafio: $($response.data.desafios[0].titulo)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "ERROR al obtener desafios: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Probando crear nuevo desafio (si tenemos datos)..." -ForegroundColor Yellow
if ($temaIdCreado -and $personaId) {
    $nuevoDesafio = @{
        titulo = "Desafio de Prueba PowerShell"
        descripcion = "Desafio creado desde script de prueba para verificar funcionalidad"
        tema_desafio_id = $temaIdCreado
        persona_id = $personaId
        nombrepersona = "Persona de Prueba"
        edadpersona = 25
        contexto = "Contexto de prueba para el nuevo desafio"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/desafios/" -Method Post -Body $nuevoDesafio -Headers $headers
        Write-Host "SUCCESS - Desafio creado con ID: $($response.data.id)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR al crear desafio: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP - No hay datos suficientes para crear desafio" -ForegroundColor Yellow
}

Write-Host "`n6. Probando busqueda de desafios..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/desafios/?search=Sostenibilidad" -Method Get -Headers $headers
    Write-Host "SUCCESS - Desafios encontrados con 'Sostenibilidad': $($response.data.pagination.total)" -ForegroundColor Green
} catch {
    Write-Host "ERROR en busqueda: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n7. Probando filtro por tema..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/admin/desafios/?tema_id=11" -Method Get -Headers $headers
    Write-Host "SUCCESS - Desafios del tema 11: $($response.data.pagination.total)" -ForegroundColor Green
} catch {
    Write-Host "ERROR en filtro: $($_.Exception.Message)" -ForegroundColor Red
}

if ($temaIdCreado) {
    Write-Host "`n8. Probando actualizar tema creado..." -ForegroundColor Yellow
    $temaActualizado = @{
        nombretema = "Tema Actualizado PowerShell"
        descripcion = "Descripcion actualizada desde script de prueba"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/temas/$temaIdCreado/" -Method Put -Body $temaActualizado -Headers $headers
        Write-Host "SUCCESS - Tema actualizado: $($response.data.nombretema)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR al actualizar tema: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n9. Probando eliminar tema creado..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/admin/temas/$temaIdCreado/" -Method Delete -Headers $headers
        Write-Host "SUCCESS - Tema eliminado: $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR al eliminar tema: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nSi todos los tests muestran SUCCESS, los endpoints estan funcionando correctamente." -ForegroundColor White
Write-Host "Puedes usar estos endpoints desde el frontend de administrador." -ForegroundColor White