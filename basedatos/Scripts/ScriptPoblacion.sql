-- =====================================================
-- SCRIPT POBLACION 
-- =====================================================
-- =================================================================
-- SCRIPT DE POBLACIÓN CON FUNCIONES PL/pgSQL: Se decidio tomar enfoque de funciones
-- se espera que en etapas posteriores del desarrollo se cambien por 
-- datos que tengan sentido y según reglas de negocio del juego MisionEmprende
-- Sistema de Emprendimiento - InnovatingTeamsv5
-- Compatible con: PostgreSQL 12+
-- =================================================================

DROP FUNCTION IF EXISTS poblar_facultad();
DROP FUNCTION IF EXISTS poblar_tipo_curso();
DROP FUNCTION IF EXISTS poblar_usuario(integer);
DROP FUNCTION IF EXISTS poblar_categoria_atributo();
DROP FUNCTION IF EXISTS poblar_configuracion();
DROP FUNCTION IF EXISTS poblar_equipo(integer);
DROP FUNCTION IF EXISTS poblar_etapa();
DROP FUNCTION IF EXISTS poblar_ganas_emprender();
DROP FUNCTION IF EXISTS poblar_lista_participante(integer);
DROP FUNCTION IF EXISTS poblar_persona(integer);
DROP FUNCTION IF EXISTS poblar_tema_desafio();
DROP FUNCTION IF EXISTS poblar_video(integer);
DROP PROCEDURE IF EXISTS poblar_tablas_base();


-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: FACULTAD
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_facultad()
RETURNS void AS $$
BEGIN
    INSERT INTO FACULTAD (nombre) VALUES
    ('Facultad de Ingeniería y Ciencias'),
    ('Facultad de Economía y Negocios'),
    ('Facultad de Diseño y Comunicación'),
    ('Facultad de Ciencias Sociales'),
    ('Facultad de Artes Liberales');
    RAISE NOTICE '-> Tabla FACULTAD poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: TIPO_CURSO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_tipo_curso()
RETURNS void AS $$
BEGIN
    INSERT INTO TIPO_CURSO (nombre) VALUES
    ('Obligatorio'),
    ('Electivo'),
    ('Taller'),
    ('Práctica Profesional');
    RAISE NOTICE '-> Tabla TIPO_CURSO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: USUARIO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_usuario(cantidad integer)
RETURNS void AS $$
DECLARE
    tipos_usuario text[] := ARRAY['ADMINISTRADOR', 'ESTUDIANTE', 'PROFESOR'];
    estados text[] := ARRAY['ACTIVO', 'INACTIVO'];
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO USUARIO (email, nombre, apellido, tipoUsuario, contrasena, estado)
        VALUES (
            'usuario' || i || '@innovate.com',
            'Nombre' || i,
            'Apellido' || i,
            tipos_usuario[1 + floor(random() * 3)],
            md5(random()::text), -- Contraseña encriptada simple
            estados[1 + floor(random() * 2)]
        );
    END LOOP;
    RAISE NOTICE '-> Tabla USUARIO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: CATEGORIA_ATRIBUTO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_categoria_atributo()
RETURNS void AS $$
BEGIN
    INSERT INTO CATEGORIA_ATRIBUTO (nombreCategoria) VALUES
    ('Creatividad'),
    ('Comunicación Efectiva'),
    ('Liderazgo'),
    ('Resolución de Problemas'),
    ('Trabajo en Equipo');
    RAISE NOTICE '-> Tabla CATEGORIA_ATRIBUTO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: CONFIGURACION
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_configuracion()
RETURNS void AS $$
BEGIN
    INSERT INTO CONFIGURACION (nombre, tipoDato) VALUES
    ('Tiempo máximo por etapa', 'INTEGER'),
    ('Permitir registro de nuevos usuarios', 'BOOLEAN'),
    ('Mensaje de bienvenida del sistema', 'TEXT'),
    ('Versión del sistema', 'VARCHAR');
    RAISE NOTICE '-> Tabla CONFIGURACION poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: EQUIPO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_equipo(cantidad integer)
RETURNS void AS $$
DECLARE
    nombres text[] := ARRAY['Creativos', 'Innovadores', 'Titanes', 'Pioneros', 'Visionarios', 'Exploradores'];
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO EQUIPO (nombreEquipo, tamanoEquipo)
        VALUES (
            'Los ' || nombres[1 + floor(random() * array_length(nombres, 1))] || ' ' || i,
            floor(random() * 3 + 3)::integer -- Equipos de 3 a 5 miembros
        );
    END LOOP;
    RAISE NOTICE '-> Tabla EQUIPO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: ETAPA
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_etapa()
RETURNS void AS $$
BEGIN
    INSERT INTO ETAPA (nombreEtapa, duracionMinutos, orden, descripcion, textoHabilidad) VALUES
    ('Ideación', 30, 1, 'Generar ideas innovadoras para resolver el desafío.', 'Fomenta la creatividad y el pensamiento lateral.'),
    ('Prototipado', 45, 2, 'Construir un prototipo de baja fidelidad de la solución.', 'Desarrolla habilidades de construcción y diseño rápido.'),
    ('Validación', 20, 3, 'Obtener retroalimentación sobre el prototipo.', 'Practica la escucha activa y la empatía.'),
    ('Pitch Final', 15, 4, 'Presentar la solución final de forma convincente.', 'Mejora la comunicación y la persuasión.');
    RAISE NOTICE '-> Tabla ETAPA poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: GANAS_EMPRENDER
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_ganas_emprender()
RETURNS void AS $$
BEGIN
    INSERT INTO GANAS_EMPRENDER (descripcion) VALUES
    ('¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?'),
    ('¿Disfrutas de los desafíos y de resolver problemas complejos?'),
    ('¿Te sientes cómodo tomando riesgos calculados?'),
    ('¿Te motiva la idea de crear tu propio camino profesional?');
    RAISE NOTICE '-> Tabla GANAS_EMPRENDER poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================

-- FUNCIÓN PARA POBLAR LA TABLA: LISTA_PARTICIPANTE
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_lista_participante(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO LISTA_PARTICIPANTE (emailEstudiante, nombreEstudiante)
        VALUES (
            'estudiante' || i || '@pre-registro.com',
            'Participante ' || i
        );
    END LOOP;
    RAISE NOTICE '-> Tabla LISTA_PARTICIPANTE poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: PERSONA
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_persona(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO PERSONA (nombrePersona, imagenUrl, contextoPersona, edad)
        VALUES (
            'Arquetipo ' || i,
            'https://example.com/imagen' || i || '.jpg',
            'Este es el contexto de la persona ' || i || ', describe sus necesidades y problemas.',
            floor(random() * 50 + 18)::integer -- Edad entre 18 y 68
        );
    END LOOP;
    RAISE NOTICE '-> Tabla PERSONA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: TEMA_DESAFIO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_tema_desafio()
RETURNS void AS $$
BEGIN
    INSERT INTO TEMA_DESAFIO (nombreTema, descripcion) VALUES
    ('Sostenibilidad Ambiental', 'Crear soluciones para reducir el impacto ecológico en la ciudad.'),
    ('Salud y Bienestar', 'Desarrollar ideas para mejorar la calidad de vida y la salud de las personas.'),
    ('Educación Digital', 'Innovar en herramientas educativas para el aprendizaje en línea.'),
    ('Inclusión Financiera', 'Crear servicios financieros accesibles para todos.');
    RAISE NOTICE '-> Tabla TEMA_DESAFIO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: VIDEO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_video(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO VIDEO (nombreVideo, url)
        VALUES (
            'Video introductorio ' || i,
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ' -- URL de ejemplo
        );
    END LOOP;
    RAISE NOTICE '-> Tabla VIDEO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO PRINCIPAL PARA EJECUTAR TODO
-- =====================================================
CREATE OR REPLACE PROCEDURE poblar_tablas_base()
AS $$
BEGIN
    -- Llamamos a cada función de población en el orden correcto
    PERFORM poblar_facultad();
    PERFORM poblar_tipo_curso();
    PERFORM poblar_usuario(50); -- Poblar con 50 usuarios
    PERFORM poblar_categoria_atributo();
    PERFORM poblar_configuracion();
    PERFORM poblar_equipo(15); -- Poblar con 15 equipos
    PERFORM poblar_etapa();
    PERFORM poblar_ganas_emprender();
    PERFORM poblar_lista_participante(100); -- Poblar con 100 participantes
    PERFORM poblar_persona(10); -- Poblar con 10 arquetipos de persona
    PERFORM poblar_tema_desafio();
    PERFORM poblar_video(3); -- Poblar con 3 videos

    RAISE NOTICE 'Proceso de población de tablas base completado.';

END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EJECUCIÓN 
-- =====================================================
-- =================================================================
-- SCRIPT DE POBLACIÓN (TABLAS CON CLAVES FORÁNEAS)
-- Sistema de Emprendimiento - InnovatingTeamsv5
-- Compatible con: PostgreSQL 12+
-- =================================================================

-- Eliminamos funciones y procedimientos si ya existen
DROP FUNCTION IF EXISTS poblar_administrador(integer);
DROP FUNCTION IF EXISTS poblar_profesor(integer);
DROP FUNCTION IF EXISTS poblar_carrera(integer);
DROP FUNCTION IF EXISTS poblar_estudiante(integer);
DROP FUNCTION IF EXISTS poblar_desafio(integer);
DROP FUNCTION IF EXISTS poblar_partida(integer);
DROP FUNCTION IF EXISTS poblar_curso(integer);
DROP FUNCTION IF EXISTS poblar_evaluacion_pitch(integer);
DROP FUNCTION IF EXISTS poblar_solucion_lego(integer);
DROP FUNCTION IF EXISTS poblar_token(integer);
DROP FUNCTION IF EXISTS poblar_curso_estudiante(integer);
DROP FUNCTION IF EXISTS poblar_partida_usuario(integer);
DROP FUNCTION IF EXISTS poblar_equipo_desafio();
DROP PROCEDURE IF EXISTS poblar_tablas_foraneas();

-- =====================================================
-- FUNCIÓN AUXILIAR: Generar fecha aleatoria desde 2024
-- Se van a generar datos simulados desde 2024 para tener fechas de referencia
-- =====================================================
CREATE OR REPLACE FUNCTION random_date_from_2024()
RETURNS timestamp AS $$
BEGIN
    RETURN '2024-01-01'::timestamp + (random() * (now() - '2024-01-01'::timestamp));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NIVEL 1 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_administrador(cantidad integer)
RETURNS void AS $$
DECLARE
    -- Selecciona IDs de usuarios tipo 'ADMINISTRADOR' que aún no están en la tabla ADMINISTRADOR
    usuarios_disponibles integer[];
BEGIN
    SELECT array_agg(id) INTO usuarios_disponibles FROM USUARIO
    WHERE tipoUsuario = 'ADMINISTRADOR' AND id NOT IN (SELECT USUARIO_id FROM ADMINISTRADOR);

    IF array_length(usuarios_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay usuarios de tipo ADMINISTRADOR disponibles para asignar.';
        RETURN;
    END IF;

    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1)) LOOP
        INSERT INTO ADMINISTRADOR (USUARIO_id) VALUES (usuarios_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla ADMINISTRADOR poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_profesor(cantidad integer)
RETURNS void AS $$
DECLARE
    usuarios_disponibles integer[];
BEGIN
    -- Selecciona IDs de usuarios tipo 'PROFESOR' que aún no están en la tabla PROFESOR
    SELECT array_agg(id) INTO usuarios_disponibles FROM USUARIO
    WHERE tipoUsuario = 'PROFESOR' AND id NOT IN (SELECT USUARIO_id FROM PROFESOR);

    IF array_length(usuarios_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay usuarios de tipo PROFESOR disponibles para asignar.';
        RETURN;
    END IF;

    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1)) LOOP
        INSERT INTO PROFESOR (USUARIO_id) VALUES (usuarios_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla PROFESOR poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_carrera(cantidad integer)
RETURNS void AS $$
DECLARE
    facultad_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        -- Selecciona una facultad al azar
        SELECT id INTO facultad_id FROM FACULTAD ORDER BY random() LIMIT 1;

        INSERT INTO CARRERA (FACULTAD_id, nombre)
        VALUES (facultad_id, 'Carrera de ' || md5(random()::text)::char(10));
    END LOOP;
    RAISE NOTICE '-> Tabla CARRERA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_estudiante(cantidad integer)
RETURNS void AS $$
DECLARE
    
    usuarios_disponibles integer[] := (SELECT array_agg(id) FROM USUARIO WHERE tipoUsuario = 'ESTUDIANTE' AND id NOT IN (SELECT USUARIO_id FROM ESTUDIANTE));
    listas_disponibles integer[] := (SELECT array_agg(id) FROM LISTA_PARTICIPANTE WHERE id NOT IN (SELECT LISTA_PARTICIPANTE_id FROM ESTUDIANTE));
BEGIN
    IF array_length(usuarios_disponibles, 1) IS NULL OR array_length(listas_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay suficientes usuarios o listas de participantes disponibles.';
        RETURN;
    END IF;
    
    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1), array_length(listas_disponibles, 1)) LOOP
        INSERT INTO ESTUDIANTE (USUARIO_id, LISTA_PARTICIPANTE_id)
        VALUES (usuarios_disponibles[i], listas_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla ESTUDIANTE poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_desafio(cantidad integer)
RETURNS void AS $$
DECLARE
    tema_id integer;
    persona_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO tema_id FROM TEMA_DESAFIO ORDER BY random() LIMIT 1;
        SELECT id INTO persona_id FROM PERSONA ORDER BY random() LIMIT 1;
        
        INSERT INTO DESAFIO (TEMA_DESAFIO_id, PERSONA_id, titulo, descripcion, fechaCreacion)
        VALUES (
            tema_id,
            persona_id,
            'Desafío sobre ' || (SELECT nombreTema FROM TEMA_DESAFIO WHERE id = tema_id),
            'Descripción detallada del desafío número ' || i,
            random_date_from_2024()
        );
    END LOOP;
    RAISE NOTICE '-> Tabla DESAFIO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_partida(cantidad integer)
RETURNS void AS $$
DECLARE
    vid_id integer;
    estados text[] := ARRAY['CONFIGURACION', 'EN_CURSO', 'FINALIZADO'];
    fecha_inicio timestamp;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO vid_id FROM VIDEO ORDER BY random() LIMIT 1;
        fecha_inicio := random_date_from_2024();
        
        INSERT INTO PARTIDA (VIDEO_id, estado, codigoAcceso, fechaInicio, fechaFin)
        VALUES (
            vid_id,
            estados[1 + floor(random() * 3)],
            upper(substr(md5(random()::text), 1, 6)), -- Código de 6 caracteres
            fecha_inicio,
            fecha_inicio + (random() * interval '3 hours') -- Termina hasta 3 horas después
        );
    END LOOP;
    RAISE NOTICE '-> Tabla PARTIDA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NIVEL 2 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_curso(cantidad integer)
RETURNS void AS $$
DECLARE
    carr_id integer;
    tipo_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO carr_id FROM CARRERA ORDER BY random() LIMIT 1;
        SELECT id INTO tipo_id FROM TIPO_CURSO ORDER BY random() LIMIT 1;

        INSERT INTO CURSO (CARRERA_id, TIPO_CURSO_id, codigo, nombre)
        VALUES (
            carr_id,
            tipo_id,
            'SIG' || (100 + floor(random() * 900))::text,
            'Curso de ' || md5(random()::text)::char(15)
        );
    END LOOP;
    RAISE NOTICE '-> Tabla CURSO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_evaluacion_pitch(cantidad integer)
RETURNS void AS $$
DECLARE
    evaluador_id integer;
    evaluado_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        -- Asegurarse de que un equipo no se evalúe a sí mismo
        SELECT id INTO evaluador_id FROM EQUIPO ORDER BY random() LIMIT 1;
        SELECT id INTO evaluado_id FROM EQUIPO WHERE id <> evaluador_id ORDER BY random() LIMIT 1;

        -- Evitar duplicados si la combinación ya existe
        IF evaluado_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM EVALUACION_PITCH WHERE EQUIPO_EVALUADOR_id = evaluador_id AND EQUIPO_EVALUADO_id = evaluado_id
        ) THEN
            INSERT INTO EVALUACION_PITCH (EQUIPO_EVALUADOR_id, EQUIPO_EVALUADO_id, puntajeEquipo, puntajeEmpatia, puntajeCreatividad, puntajeComunicacion)
            VALUES (
                evaluador_id,
                evaluado_id,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint
            );
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla EVALUACION_PITCH poblada.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_solucion_lego(cantidad integer)
RETURNS void AS $$
DECLARE
    eq_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;
        INSERT INTO SOLUCION_LEGO (EQUIPO_id, fechaCreacion, descripSoluc, fotoPrototipUrl)
        VALUES (
            eq_id,
            random_date_from_2024(),
            'Esta es la descripción de la solución LEGO para el equipo ' || eq_id,
            'http://example.com/foto' || i || '.jpg'
        );
    END LOOP;
    RAISE NOTICE '-> Tabla SOLUCION_LEGO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_token(cantidad integer)
RETURNS void AS $$
DECLARE
    eq_id integer;
    et_id integer;
    tipos text[] := ARRAY['BONIFICACION', 'EVALUACION', 'RECOMPENSA_ETAPA'];
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;
        SELECT id INTO et_id FROM ETAPA ORDER BY random() LIMIT 1;
        INSERT INTO TOKEN (EQUIPO_id, ETAPA_id, tipoToken, cantidad, fechaOtorgada)
        VALUES (
            eq_id,
            et_id,
            tipos[1 + floor(random() * 3)],
            floor(random() * 50 + 10)::integer,
            random_date_from_2024()
        );
    END LOOP;
    RAISE NOTICE '-> Tabla TOKEN poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- NIVEL 3 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_curso_estudiante(cantidad integer)
RETURNS void AS $$
DECLARE
    cur_id integer;
    est_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO cur_id FROM CURSO ORDER BY random() LIMIT 1;
        SELECT id INTO est_id FROM ESTUDIANTE ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM CURSO_ESTUDIANTE WHERE CURSO_id = cur_id AND ESTUDIANTE_id = est_id) THEN
            INSERT INTO CURSO_ESTUDIANTE (CURSO_id, ESTUDIANTE_id) VALUES (cur_id, est_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla CURSO_ESTUDIANTE poblada.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_partida_usuario(cantidad integer)
RETURNS void AS $$
DECLARE
    usr_id integer;
    par_id integer;
    eq_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO usr_id FROM USUARIO WHERE tipoUsuario = 'ESTUDIANTE' ORDER BY random() LIMIT 1;
        SELECT id INTO par_id FROM PARTIDA ORDER BY random() LIMIT 1;
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM PARTIDA_USUARIO WHERE USUARIO_id = usr_id AND PARTIDA_id = par_id) THEN
            INSERT INTO PARTIDA_USUARIO (USUARIO_id, PARTIDA_id, EQUIPO_id) VALUES (usr_id, par_id, eq_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla PARTIDA_USUARIO poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_equipo_desafio()
RETURNS void AS $$
DECLARE
    eq_id integer;
    des_id integer;
    des_per_id integer;
    rec record;
BEGIN
    -- Asigna un desafío a cada equipo existente
    FOR rec IN SELECT id FROM EQUIPO LOOP
        eq_id := rec.id;
        
        -- Selecciona un desafío al azar
        SELECT id, PERSONA_id INTO des_id, des_per_id FROM DESAFIO ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM EQUIPO_DESAFIO WHERE EQUIPO_id = eq_id) THEN
            INSERT INTO EQUIPO_DESAFIO (EQUIPO_id, DESAFIO_id, DESAFIO_PERSONA_id)
            VALUES (eq_id, des_id, des_per_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla EQUIPO_DESAFIO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO PRINCIPAL PARA EJECUTAR TODO
-- =====================================================
CREATE OR REPLACE PROCEDURE poblar_tablas_foraneas()
AS $$
BEGIN
    RAISE NOTICE '--- INICIANDO POBLACIÓN DE TABLAS FORÁNEAS ---';

    -- Nivel 1
    PERFORM poblar_administrador(5);
    PERFORM poblar_profesor(10);
    PERFORM poblar_carrera(10);
    PERFORM poblar_estudiante(30);
    PERFORM poblar_desafio(20);
    PERFORM poblar_partida(15);
    
    -- Nivel 2
    PERFORM poblar_curso(25);
    PERFORM poblar_evaluacion_pitch(50);
    PERFORM poblar_solucion_lego(40);
    PERFORM poblar_token(100);
    
    -- Nivel 3
    PERFORM poblar_curso_estudiante(80);
    PERFORM poblar_partida_usuario(60);
    PERFORM poblar_equipo_desafio(); -- Asigna un desafío a cada equipo

    RAISE NOTICE 'Proceso de población de tablas foráneas completado.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EJECUCIÓN DEL PROCEDIMIENTO PRINCIPAL
-- =====================================================
CALL poblar_tablas_base();
CALL poblar_tablas_foraneas();
