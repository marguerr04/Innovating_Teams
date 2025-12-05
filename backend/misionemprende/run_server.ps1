# Script para correr el servidor Django sin conflictos de encoding

# Forzar encoding UTF-8 en la sesión
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

# Crear archivos vacíos para evitar que psycopg2 lea archivos con tildes
$pgpass = Join-Path $env:TEMP 'pgpass.empty'
$pgservice = Join-Path $env:TEMP 'pg_service.empty'
$pgconf = Join-Path $env:TEMP 'pgconf'

if (!(Test-Path $pgpass)) { New-Item -ItemType File -Path $pgpass -Force | Out-Null }
if (!(Test-Path $pgservice)) { New-Item -ItemType File -Path $pgservice -Force | Out-Null }
if (!(Test-Path $pgconf)) { New-Item -ItemType Directory -Path $pgconf -Force | Out-Null }

$env:PGPASSFILE = $pgpass
$env:PGSERVICEFILE = $pgservice
$env:PGSYSCONFDIR = $pgconf

# Variables de base de datos
$env:DB_NAME = 'InnovatingTeamsv5'
$env:DB_USER = 'postgres'
$env:DB_PASSWORD = '123456'
$env:DB_HOST = 'localhost'
$env:DB_PORT = '5432'

Write-Host "Iniciando servidor Django..." -ForegroundColor Green
Write-Host "Base de datos: $env:DB_NAME@$env:DB_HOST:$env:DB_PORT" -ForegroundColor Cyan

# Cambiar al directorio correcto
Set-Location "E:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\backend\misionemprende"

# Ejecutar el servidor
python manage.py runserver
