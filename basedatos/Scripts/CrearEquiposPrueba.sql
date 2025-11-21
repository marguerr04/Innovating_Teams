-- Script rápido para crear equipos de prueba si no existen
-- Ejecutar en PostgreSQL

-- Verificar equipos actuales
SELECT COUNT(*) as total_equipos FROM equipo;

-- Insertar equipos de prueba (solo si no existen)
INSERT INTO equipo (nombreequipo, tamanoequipo) 
SELECT 'Equipo Alpha', 5
WHERE NOT EXISTS (SELECT 1 FROM equipo WHERE nombreequipo = 'Equipo Alpha');

INSERT INTO equipo (nombreequipo, tamanoequipo) 
SELECT 'Equipo Beta', 4
WHERE NOT EXISTS (SELECT 1 FROM equipo WHERE nombreequipo = 'Equipo Beta');

INSERT INTO equipo (nombreequipo, tamanoequipo) 
SELECT 'Equipo Gamma', 6
WHERE NOT EXISTS (SELECT 1 FROM equipo WHERE nombreequipo = 'Equipo Gamma');

INSERT INTO equipo (nombreequipo, tamanoequipo) 
SELECT 'Equipo Delta', 5
WHERE NOT EXISTS (SELECT 1 FROM equipo WHERE nombreequipo = 'Equipo Delta');

INSERT INTO equipo (nombreequipo, tamanoequipo) 
SELECT 'Equipo Epsilon', 3
WHERE NOT EXISTS (SELECT 1 FROM equipo WHERE nombreequipo = 'Equipo Epsilon');

-- Verificar equipos después de la inserción
SELECT id, nombreequipo, tamanoequipo FROM equipo ORDER BY id;
