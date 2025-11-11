-- =====================================================
-- Codigo de creación de vistas 
-- =====================================================


CREATE OR REPLACE VIEW VISTA_DETALLE_EQUIPO AS
SELECT 
    e.id AS equipo_id,
    e.nombreEquipo,
    -- Datos del Profesor (asumiendo un profesor crea la partida)
    prof.id AS profesor_id,
    prof_usuario.nombre AS nombre_profesor,
    prof_usuario.apellido AS apellido_profesor,
    prof_usuario.email AS email_profesor,
    
    -- Datos del Estudiante
    est.id AS estudiante_id,
    est_usuario.nombre AS nombre_estudiante,
    est_usuario.apellido AS apellido_estudiante,
    est_usuario.email AS email_estudiante,
    
    -- Datos Académicos
    c.nombre AS nombre_carrera,
    f.nombre AS nombre_facultad,
    
    -- Datos de la Partida
    p.id as partida_id,
    p.codigoAcceso
FROM 
    EQUIPO e
-- Unir equipo con los usuarios que participan en una partida
LEFT JOIN PARTIDA_USUARIO pu ON e.id = pu.EQUIPO_id
-- Unir con la tabla de usuarios para obtener datos del estudiante
LEFT JOIN USUARIO est_usuario ON pu.USUARIO_id = est_usuario.id AND est_usuario.tipoUsuario = 'ESTUDIANTE'
-- Unir con la tabla estudiante para obtener más detalles si es necesario
LEFT JOIN ESTUDIANTE est ON est_usuario.id = est.USUARIO_id
-- Unir con la partida para encontrar al profesor
LEFT JOIN PARTIDA p ON pu.PARTIDA_id = p.id
-- Asumiendo que el "creador" de la partida es el profesor. Una forma de vincularlo.
-- NOTA: El modelo no une directamente un profesor a una partida. Haremos una suposición lógica.
-- Vamos a suponer que el primer usuario de tipo 'PROFESOR' en la BD está a cargo. (Esto es una simplificación)
-- Para una relación real, la tabla PARTIDA necesitaría un campo PROFESOR_id.
CROSS JOIN (
    SELECT u.id, u.nombre, u.apellido, u.email 
    FROM PROFESOR pr 
    JOIN USUARIO u ON pr.USUARIO_id = u.id 
    LIMIT 1
) AS prof_usuario
LEFT JOIN PROFESOR prof ON prof.USUARIO_id = prof_usuario.id

-- Unir con datos académicos del estudiante
LEFT JOIN CURSO_ESTUDIANTE ce ON est.id = ce.ESTUDIANTE_id
LEFT JOIN CURSO cur ON ce.CURSO_id = cur.id
LEFT JOIN CARRERA c ON cur.CARRERA_id = c.id
LEFT JOIN FACULTAD f ON c.FACULTAD_id = f.id
WHERE 
    est_usuario.id IS NOT NULL
ORDER BY
    e.nombreEquipo, est_usuario.apellido;


SELECT 
    nombreEquipo,
    nombre_profesor,
    email_profesor,
    nombre_estudiante,
    apellido_estudiante,
    email_estudiante,
    nombre_carrera
FROM 
    VISTA_DETALLE_EQUIPO
WHERE 
    equipo_id = 5;