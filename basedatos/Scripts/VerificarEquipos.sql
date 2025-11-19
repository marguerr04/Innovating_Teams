-- Script de Verificación y Población de Equipos para Testing
-- Ejecutar en PostgreSQL

-- 1. Verificar equipos existentes
SELECT id, nombreequipo, tamanoequipo 
FROM equipo 
ORDER BY id;

-- 2. Si no hay equipos, insertar datos de prueba
-- (Descomenta las siguientes líneas si necesitas crear equipos de prueba)

/*
INSERT INTO equipo (nombreequipo, tamanoequipo) VALUES
    ('Equipo Alpha', 5),
    ('Equipo Beta', 4),
    ('Equipo Gamma', 6),
    ('Equipo Delta', 5),
    ('Equipo Epsilon', 3)
ON CONFLICT DO NOTHING;
*/

-- 3. Verificar soluciones LEGO asociadas a equipos
SELECT 
    e.id as equipo_id,
    e.nombreequipo,
    sl.id as solucion_id,
    sl.fotoprototipurl,
    sl.descripsoluc,
    sl.fechacreacion
FROM equipo e
LEFT JOIN solucion_lego sl ON e.id = sl.equipo_id
ORDER BY e.id, sl.fechacreacion DESC;

-- 4. Contar equipos sin imágenes
SELECT 
    COUNT(*) as equipos_sin_imagen
FROM equipo e
LEFT JOIN solucion_lego sl ON e.id = sl.equipo_id
WHERE sl.id IS NULL;

-- 5. Ver últimas 10 soluciones guardadas
SELECT 
    sl.id,
    e.nombreequipo,
    sl.fotoprototipurl,
    sl.fechacreacion
FROM solucion_lego sl
JOIN equipo e ON sl.equipo_id = e.id
ORDER BY sl.fechacreacion DESC
LIMIT 10;
