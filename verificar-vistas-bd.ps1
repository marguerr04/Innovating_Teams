# Script para verificar vistas y tablas en PostgreSQL

Write-Host "===== VERIFICACIÓN DE VISTAS Y TABLAS EN POSTGRESQL =====" -ForegroundColor Cyan
Write-Host ""

# Conectar a PostgreSQL y ejecutar consultas
$queries = @"
-- 1. Listar todas las VIEWS (vistas normales)
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE schemaname = 'public'
ORDER BY viewname;

-- 2. Listar MATERIALIZED VIEWS (vistas materializadas)
SELECT 
    schemaname,
    matviewname,
    matviewowner
FROM pg_matviews
WHERE schemaname = 'public'
ORDER BY matviewname;

-- 3. Verificar índices en tabla estado_partida (para performance)
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'estado_partida'
ORDER BY indexname;

-- 4. Verificar índices en tabla conexion_partida
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'conexion_partida'
ORDER BY indexname;
"@

Write-Host "Consultas SQL a ejecutar:" -ForegroundColor Yellow
Write-Host $queries -ForegroundColor Gray
Write-Host ""
Write-Host "Para ejecutar manualmente, copia y pega en pgAdmin o psql" -ForegroundColor Green
Write-Host ""

# Guardar queries en archivo temporal
$queries | Out-File -FilePath ".\temp_verificacion_vistas.sql" -Encoding UTF8

Write-Host "✅ Queries guardadas en: temp_verificacion_vistas.sql" -ForegroundColor Green
Write-Host ""
Write-Host "📌 CÓMO EJECUTAR:" -ForegroundColor Cyan
Write-Host "1. Abre pgAdmin o psql" -ForegroundColor White
Write-Host "2. Conéctate a tu base de datos" -ForegroundColor White
Write-Host "3. Ejecuta las queries del archivo temp_verificacion_vistas.sql" -ForegroundColor White
