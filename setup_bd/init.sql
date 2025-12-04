--
-- PostgreSQL database dump
--


-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-30 17:48:08

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = 'postgres'
    ) THEN
        CREATE ROLE postgres WITH LOGIN SUPERUSER CREATEDB CREATEROLE;
    END IF;
END
$$;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5621 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 336 (class 1255 OID 49715)
-- Name: poblar_administrador(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_administrador(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_administrador(cantidad integer) OWNER TO postgres;

--
-- TOC entry 338 (class 1255 OID 49717)
-- Name: poblar_carrera(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_carrera(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_carrera(cantidad integer) OWNER TO postgres;

--
-- TOC entry 332 (class 1255 OID 49678)
-- Name: poblar_categoria_atributo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_categoria_atributo() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO CATEGORIA_ATRIBUTO (nombreCategoria) VALUES
    ('Creatividad'),
    ('Comunicación Efectiva'),
    ('Liderazgo'),
    ('Resolución de Problemas'),
    ('Trabajo en Equipo');
    RAISE NOTICE '-> Tabla CATEGORIA_ATRIBUTO poblada.';
END;
$$;


ALTER FUNCTION public.poblar_categoria_atributo() OWNER TO postgres;

--
-- TOC entry 333 (class 1255 OID 49679)
-- Name: poblar_configuracion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_configuracion() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO CONFIGURACION (nombre, tipoDato) VALUES
    ('Tiempo máximo por etapa', 'INTEGER'),
    ('Permitir registro de nuevos usuarios', 'BOOLEAN'),
    ('Mensaje de bienvenida del sistema', 'TEXT'),
    ('Versión del sistema', 'VARCHAR');
    RAISE NOTICE '-> Tabla CONFIGURACION poblada.';
END;
$$;


ALTER FUNCTION public.poblar_configuracion() OWNER TO postgres;

--
-- TOC entry 342 (class 1255 OID 49721)
-- Name: poblar_curso(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_curso(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_curso(cantidad integer) OWNER TO postgres;

--
-- TOC entry 346 (class 1255 OID 49725)
-- Name: poblar_curso_estudiante(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_curso_estudiante(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_curso_estudiante(cantidad integer) OWNER TO postgres;

--
-- TOC entry 328 (class 1255 OID 49673)
-- Name: poblar_datos(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_datos(num_registros integer DEFAULT 5) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    i INTEGER;
    j INTEGER;
    usuario_id_admin INTEGER;
    usuario_id_prof INTEGER;
    usuario_id_est INTEGER;
    facultad_id INTEGER;
    carrera_id INTEGER;
    curso_id INTEGER;
    equipo_id INTEGER;
    partida_id INTEGER;
    estudiante_id INTEGER;
    desafio_id INTEGER;
    persona_id INTEGER;
BEGIN
    -- =====================================================
    -- 1. TABLAS INDEPENDIENTES (Sin FK)
    -- =====================================================
    
    -- FACULTAD
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO FACULTAD (nombre) VALUES 
        (CASE i
            WHEN 1 THEN 'Facultad de Ingeniería'
            WHEN 2 THEN 'Facultad de Ciencias Económicas'
            WHEN 3 THEN 'Facultad de Diseño'
            WHEN 4 THEN 'Facultad de Comunicaciones'
            WHEN 5 THEN 'Facultad de Medicina'
        END);
    END LOOP;

    -- TIPO_CURSO
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO TIPO_CURSO (nombre) VALUES 
        (CASE i
            WHEN 1 THEN 'Obligatorio'
            WHEN 2 THEN 'Electivo'
            WHEN 3 THEN 'Taller'
            WHEN 4 THEN 'Seminario'
            WHEN 5 THEN 'Práctica Profesional'
        END);
    END LOOP;

    -- TEMA_DESAFIO
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO TEMA_DESAFIO (nombreTema, descripcion, estado) VALUES 
        (CASE i
            WHEN 1 THEN 'Sostenibilidad'
            WHEN 2 THEN 'Tecnología e Innovación'
            WHEN 3 THEN 'Salud y Bienestar'
            WHEN 4 THEN 'Educación'
            WHEN 5 THEN 'Inclusión Social'
        END,
        CASE i
            WHEN 1 THEN 'Desafíos relacionados con el medio ambiente y desarrollo sostenible'
            WHEN 2 THEN 'Soluciones tecnológicas innovadoras para problemas actuales'
            WHEN 3 THEN 'Mejora de la calidad de vida y acceso a la salud'
            WHEN 4 THEN 'Transformación de los procesos educativos'
            WHEN 5 THEN 'Reducción de brechas sociales y económicas'
        END,
        'ACTIVO');
    END LOOP;

    -- CATEGORIA_ATRIBUTO
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO CATEGORIA_ATRIBUTO (nombreCategoria) VALUES 
        (CASE i
            WHEN 1 THEN 'Innovación'
            WHEN 2 THEN 'Factibilidad'
            WHEN 3 THEN 'Impacto Social'
            WHEN 4 THEN 'Escalabilidad'
            WHEN 5 THEN 'Sostenibilidad Económica'
        END);
    END LOOP;

    -- GANAS_EMPRENDER
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO GANAS_EMPRENDER (descripcion) VALUES 
        (CASE i
            WHEN 1 THEN 'No, no tengo interés en emprender'
            WHEN 2 THEN 'No mucho, prefiero trabajar para otros'
            WHEN 3 THEN 'Más o menos, depende de la oportunidad'
            WHEN 4 THEN 'Sí, me gustaría tener mi propio negocio'
            WHEN 5 THEN 'Sí mucho, es mi principal objetivo'
        END);
    END LOOP;

    -- ETAPA (6 etapas del Design Thinking)
    FOR i IN 1..6 LOOP
        INSERT INTO ETAPA (nombreEtapa, duracionMinutos, orden, descripcion, estado, textoHabilidad) VALUES 
        (CASE i
            WHEN 1 THEN 'Empatizar'
            WHEN 2 THEN 'Definir'
            WHEN 3 THEN 'Idear'
            WHEN 4 THEN 'Prototipar'
            WHEN 5 THEN 'Testear'
            WHEN 6 THEN 'Pitch'
        END,
        CASE i
            WHEN 1 THEN 15
            WHEN 2 THEN 20
            WHEN 3 THEN 25
            WHEN 4 THEN 30
            WHEN 5 THEN 20
            WHEN 6 THEN 10
        END,
        i,
        CASE i
            WHEN 1 THEN 'Conocer y comprender las necesidades del usuario'
            WHEN 2 THEN 'Definir claramente el problema a resolver'
            WHEN 3 THEN 'Generar múltiples ideas creativas'
            WHEN 4 THEN 'Construir una solución tangible'
            WHEN 5 THEN 'Validar la solución con usuarios'
            WHEN 6 THEN 'Presentar la propuesta final'
        END,
        'ACTIVO',
        CASE i
            WHEN 1 THEN 'Desarrolla la empatía y comprensión del usuario'
            WHEN 2 THEN 'Mejora la capacidad de síntesis y análisis'
            WHEN 3 THEN 'Potencia la creatividad y pensamiento lateral'
            WHEN 4 THEN 'Fortalece habilidades de construcción rápida'
            WHEN 5 THEN 'Desarrolla capacidad de validación y mejora'
            WHEN 6 THEN 'Mejora habilidades de comunicación y persuasión'
        END);
    END LOOP;

    -- VIDEO
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO VIDEO (nombreVideo, url) VALUES 
        (CASE i
            WHEN 1 THEN 'Introducción al Design Thinking'
            WHEN 2 THEN 'Metodologías Ágiles'
            WHEN 3 THEN 'Lean Startup Basics'
            WHEN 4 THEN 'Pitch Perfecto'
            WHEN 5 THEN 'Casos de Éxito'
        END,
        'https://youtube.com/watch?v=' || CHR(65 + i) || CHR(66 + i) || CHR(67 + i) || '123');
    END LOOP;

    -- CONFIGURACION
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO CONFIGURACION (nombre, tipoDato) VALUES 
        (CASE i
            WHEN 1 THEN 'tiempoMaximoPorEtapa'
            WHEN 2 THEN 'numeroIntentosPermitidos'
            WHEN 3 THEN 'notificacionesActivas'
            WHEN 4 THEN 'idiomaPreferido'
            WHEN 5 THEN 'modoOscuro'
        END,
        CASE i
            WHEN 1 THEN 'INTEGER'
            WHEN 2 THEN 'INTEGER'
            WHEN 3 THEN 'BOOLEAN'
            WHEN 4 THEN 'STRING'
            WHEN 5 THEN 'BOOLEAN'
        END);
    END LOOP;

    -- LISTA_PARTICIPANTE (Corregido: 3 por cada iteración)
    FOR i IN 1..(num_registros * 3) LOOP
        INSERT INTO LISTA_PARTICIPANTE (emailEstudiante, nombreEstudiante) VALUES 
        ('estudiante' || i || '@universidad.cl', 
         'Estudiante Prueba ' || i);
    END LOOP;

    -- PERSONA
    FOR i IN 1..LEAST(num_registros, 5) LOOP
        INSERT INTO PERSONA (nombrePersona, imagenUrl, contextoPersona, edad) VALUES 
        (CASE i
            WHEN 1 THEN 'María González'
            WHEN 2 THEN 'Juan Pérez'
            WHEN 3 THEN 'Ana Silva'
            WHEN 4 THEN 'Carlos Rodríguez'
            WHEN 5 THEN 'Laura Martínez'
        END,
        'https://ejemplo.com/persona' || i || '.jpg',
        CASE i
            WHEN 1 THEN 'Emprendedora de 35 años, madre soltera con dos hijos, busca soluciones para conciliar trabajo y familia'
            WHEN 2 THEN 'Adulto mayor de 68 años, jubilado que quiere mantenerse activo y conectado con la tecnología'
            WHEN 3 THEN 'Estudiante universitaria de bajos recursos, necesita opciones accesibles para su educación'
            WHEN 4 THEN 'Pequeño comerciante afectado por la pandemia, busca digitalizar su negocio'
            WHEN 5 THEN 'Profesional con discapacidad visual, requiere herramientas inclusivas para su trabajo'
        END,
        CASE i
            WHEN 1 THEN 35
            WHEN 2 THEN 68
            WHEN 3 THEN 22
            WHEN 4 THEN 45
            WHEN 5 THEN 30
        END);
    END LOOP;

    -- =====================================================
    -- 2. USUARIOS Y ROLES
    -- =====================================================
    
    FOR i IN 1..num_registros LOOP
        -- Administrador
        INSERT INTO USUARIO (email, nombre, apellido, tipoUsuario, estado, contrasena) 
        VALUES ('admin' || i || '@universidad.cl', 'Admin' || i, 'Sistema' || i, 
                'ADMINISTRADOR', 'ACTIVO', 'password123')
        RETURNING id INTO usuario_id_admin;
        
        INSERT INTO ADMINISTRADOR (USUARIO_id) VALUES (usuario_id_admin);
        
        -- Profesor
        INSERT INTO USUARIO (email, nombre, apellido, tipoUsuario, estado, contrasena) 
        VALUES ('profesor' || i || '@universidad.cl', 'Profesor' || i, 'Apellido' || i, 
                'PROFESOR', 'ACTIVO', 'password123')
        RETURNING id INTO usuario_id_prof;
        
        INSERT INTO PROFESOR (USUARIO_id) VALUES (usuario_id_prof);
        
        -- Estudiantes (3 por iteración)
        FOR j IN 1..3 LOOP
            INSERT INTO USUARIO (email, nombre, apellido, tipoUsuario, estado, contrasena) 
            VALUES ('estudiante' || ((i-1)*3 + j) || '@universidad.cl', 
                    'Estudiante' || ((i-1)*3 + j), 
                    'Apellido' || ((i-1)*3 + j), 
                    'ESTUDIANTE', 'ACTIVO', 'password123')
            RETURNING id INTO usuario_id_est;
            
            INSERT INTO ESTUDIANTE (USUARIO_id, LISTA_PARTICIPANTE_id) 
            VALUES (usuario_id_est, ((i-1)*3 + j));
        END LOOP;
    END LOOP;

    -- =====================================================
    -- 3. ESTRUCTURA ACADÉMICA
    -- =====================================================
    
    -- CARRERA
    FOR i IN 1..num_registros LOOP
        facultad_id := ((i-1) % 5) + 1;
        INSERT INTO CARRERA (FACULTAD_id, nombre, estado) VALUES 
        (facultad_id,
         CASE ((i-1) % 5) + 1
            WHEN 1 THEN 'Ingeniería Civil Industrial'
            WHEN 2 THEN 'Administración de Empresas'
            WHEN 3 THEN 'Diseño Gráfico'
            WHEN 4 THEN 'Periodismo'
            WHEN 5 THEN 'Medicina General'
         END || CASE WHEN i > 5 THEN ' - Sección ' || (i/5) ELSE '' END,
         'ACTIVO')
        RETURNING id INTO carrera_id;
    END LOOP;

    -- CURSO
    FOR i IN 1..num_registros LOOP
        carrera_id := ((i-1) % num_registros) + 1;
        INSERT INTO CURSO (CARRERA_id, TIPO_CURSO_id, codigo, nombre, descripcion) VALUES 
        (carrera_id,
         ((i-1) % 5) + 1,
         'CUR' || LPAD(i::text, 3, '0'),
         CASE ((i-1) % 5) + 1
            WHEN 1 THEN 'Emprendimiento e Innovación'
            WHEN 2 THEN 'Creatividad y Design Thinking'
            WHEN 3 THEN 'Taller de Proyectos'
            WHEN 4 THEN 'Seminario de Startups'
            WHEN 5 THEN 'Práctica en Emprendimiento'
         END || ' ' || i,
         'Curso enfocado en desarrollar habilidades de emprendimiento y pensamiento innovador')
        RETURNING id INTO curso_id;
    END LOOP;

    -- =====================================================
    -- 4. DESAFÍOS Y EQUIPOS
    -- =====================================================
    
    -- DESAFIO
    FOR i IN 1..num_registros LOOP
        persona_id := ((i-1) % 5) + 1;
        INSERT INTO DESAFIO (TEMA_DESAFIO_id, titulo, descripcion, nombrePersona, 
                            edadPersona, contexto, estado, PERSONA_id) VALUES 
        (((i-1) % 5) + 1,
         'Desafío ' || i || ': ' || 
         CASE ((i-1) % 5) + 1
            WHEN 1 THEN 'Reducir huella de carbono'
            WHEN 2 THEN 'App para adultos mayores'
            WHEN 3 THEN 'Telemedicina accesible'
            WHEN 4 THEN 'Plataforma educativa inclusiva'
            WHEN 5 THEN 'Marketplace para emprendedores locales'
         END,
         'Este desafío busca encontrar soluciones innovadoras para mejorar la calidad de vida de las personas',
         (SELECT nombrePersona FROM PERSONA WHERE id = persona_id),
         (SELECT edad FROM PERSONA WHERE id = persona_id),
         (SELECT contextoPersona FROM PERSONA WHERE id = persona_id),
         'ACTIVO',
         persona_id)
        RETURNING id INTO desafio_id;
    END LOOP;

    -- EQUIPO
    FOR i IN 1..num_registros LOOP
        INSERT INTO EQUIPO (nombreEquipo, tamanoEquipo) VALUES 
        ('Equipo ' || 
         CASE ((i-1) % 5) + 1
            WHEN 1 THEN 'Innovadores'
            WHEN 2 THEN 'Creativos'
            WHEN 3 THEN 'Disruptivos'
            WHEN 4 THEN 'Visionarios'
            WHEN 5 THEN 'Pioneros'
         END || ' ' || i,
         3 + (i % 3))
        RETURNING id INTO equipo_id;
    END LOOP;

    -- =====================================================
    -- 5. PARTIDAS Y JUEGOS
    -- =====================================================
    
    -- PARTIDA
    FOR i IN 1..num_registros LOOP
        INSERT INTO PARTIDA (VIDEO_id, estado, codigoAcceso, fechaInicio, fechaFin, 
                           maxEquipos, maxParticipantes) VALUES 
        (((i-1) % 5) + 1,
         CASE 
            WHEN i <= 2 THEN 'FINALIZADO'
            WHEN i = 3 THEN 'EN_CURSO'
            ELSE 'CONFIGURACION'
         END,
         'GAM' || LPAD(i::text, 4, '0'),
         CASE 
            WHEN i <= 3 THEN CURRENT_TIMESTAMP - INTERVAL '10 days' + (i * INTERVAL '1 day')
            ELSE NULL
         END,
         CASE 
            WHEN i <= 2 THEN CURRENT_TIMESTAMP - INTERVAL '10 days' + (i * INTERVAL '1 day') + INTERVAL '2 hours'
            ELSE NULL
         END,
         4 + i,
         15 + (i * 3))
        RETURNING id INTO partida_id;
    END LOOP;

    -- =====================================================
    -- 6. RELACIONES Y EVALUACIONES
    -- =====================================================
    
    -- INSTRUCCION_ETAPA
    FOR i IN 1..6 LOOP
        INSERT INTO INSTRUCCION_ETAPA (ETAPA_id, contenido) VALUES 
        (i,
         CASE i
            WHEN 1 THEN 'Instrucciones para Empatizar: 1) Observar al usuario, 2) Hacer preguntas abiertas, 3) Escuchar activamente, 4) Tomar notas de insights'
            WHEN 2 THEN 'Instrucciones para Definir: 1) Sintetizar la información, 2) Identificar patrones, 3) Formular el problema, 4) Crear punto de vista'
            WHEN 3 THEN 'Instrucciones para Idear: 1) Brainstorming sin censura, 2) Construir sobre ideas de otros, 3) Buscar cantidad, 4) Ideas locas bienvenidas'
            WHEN 4 THEN 'Instrucciones para Prototipar: 1) Construir rápido, 2) Usar materiales simples, 3) Hacer tangible la idea, 4) Permitir interacción'
            WHEN 5 THEN 'Instrucciones para Testear: 1) Mostrar no explicar, 2) Observar reacciones, 3) Hacer preguntas de seguimiento, 4) Iterar según feedback'
            WHEN 6 THEN 'Instrucciones para Pitch: 1) Contexto del problema, 2) Solución propuesta, 3) Impacto esperado, 4) Viabilidad y escalabilidad'
         END);
    END LOOP;

    -- CURSO_ESTUDIANTE
    FOR i IN 1..num_registros LOOP
        FOR j IN 1..3 LOOP
            estudiante_id := ((i-1)*3 + j);
            IF estudiante_id <= (num_registros * 3) THEN
                INSERT INTO CURSO_ESTUDIANTE (CURSO_id, ESTUDIANTE_id) 
                VALUES (((i-1) % num_registros) + 1, estudiante_id);
            END IF;
        END LOOP;
    END LOOP;

    -- EQUIPO_DESAFIO
    FOR i IN 1..num_registros LOOP
        equipo_id := i;
        desafio_id := ((i-1) % num_registros) + 1;
        persona_id := ((desafio_id - 1) % 5) + 1;
        
        INSERT INTO EQUIPO_DESAFIO (EQUIPO_id, DESAFIO_id, DESAFIO_PERSONA_id) 
        VALUES (equipo_id, desafio_id, persona_id);
    END LOOP;

    -- ATRIBUTO
    FOR i IN 1..num_registros LOOP
        FOR j IN 1..3 LOOP
            INSERT INTO ATRIBUTO (valorAtributo, CATEGORIA_ATRIBUTO_id, EQUIPO_DESAFIO_id) 
            VALUES (
                CASE j
                    WHEN 1 THEN 'Alto nivel de innovación con uso de IA'
                    WHEN 2 THEN 'Implementación factible en 6 meses'
                    WHEN 3 THEN 'Impacto estimado en 10,000 personas'
                END,
                ((j-1) % 5) + 1,
                i
            );
        END LOOP;
    END LOOP;

    -- PARTIDA_USUARIO
    FOR i IN 1..LEAST(num_registros, 3) LOOP
        FOR j IN 1..3 LOOP
            INSERT INTO PARTIDA_USUARIO (USUARIO_id, PARTIDA_id, EQUIPO_id) 
            VALUES (
                (i-1)*3 + j + 10,
                i,
                ((j-1) % num_registros) + 1
            );
        END LOOP;
    END LOOP;

    -- EVALUACION_AUTOENCUESTA
    FOR i IN 1..num_registros LOOP
        FOR j IN 1..2 LOOP
            INSERT INTO EVALUACION_AUTOENCUESTA (ESTUDIANTE_id, GANAS_EMPRENDER_id, 
                                                evalSatisf, comentarios) 
            VALUES (
                ((i-1) % (num_registros * 3)) + 1,
                ((i + j - 2) % 5) + 1,
                1 + (i % 5),
                'Comentario de evaluación ' || i || '-' || j || 
                ': La experiencia fue muy enriquecedora y aprendí mucho sobre emprendimiento'
            );
        END LOOP;
    END LOOP;

    -- EVALUACION_PITCH
    FOR i IN 1..num_registros LOOP
        FOR j IN 1..num_registros LOOP
            IF i != j THEN
                INSERT INTO EVALUACION_PITCH (EQUIPO_EVALUADOR_id, EQUIPO_EVALUADO_id, 
                                            puntajeEquipo, puntajeEmpatia, 
                                            puntajeCreatividad, puntajeComunicacion) 
                VALUES (i, j,
                       1 + (i % 4),
                       1 + ((i+1) % 4),
                       1 + ((i+2) % 4),
                       1 + ((i+3) % 4))
                ON CONFLICT (EQUIPO_EVALUADOR_id, EQUIPO_EVALUADO_id) DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;

    -- RANKING
    FOR i IN 1..LEAST(num_registros, 3) LOOP
        INSERT INTO RANKING (EQUIPO_id, totalTokens, posicionFinal) 
        VALUES (i, 100 * (4 - i), i);
    END LOOP;

    -- SOLUCION_LEGO
    FOR i IN 1..num_registros LOOP
        INSERT INTO SOLUCION_LEGO (EQUIPO_id, descripSoluc, fotoPrototipUrl) 
        VALUES (
            i,
            'Prototipo ' || i || ': Solución innovadora usando metodología LEGO Serious Play. ' ||
            'El modelo representa una plataforma colaborativa que conecta usuarios con proveedores.',
            'https://ejemplo.com/prototipos/lego_equipo_' || i || '.jpg'
        );
    END LOOP;

    -- TOKEN
    FOR i IN 1..num_registros LOOP
        -- Tokens de bonificación
        INSERT INTO TOKEN (EQUIPO_id, tipoToken, cantidad, ETAPA_id) 
        VALUES (i, 'BONIFICACION', 10 + (i * 5), 1);
        
        -- Tokens de evaluación
        INSERT INTO TOKEN (EQUIPO_id, tipoToken, cantidad, ETAPA_id) 
        VALUES (i, 'EVALUACION', 15 + (i * 3), 3);
        
        -- Tokens de recompensa por etapa
        FOR j IN 1..3 LOOP
            INSERT INTO TOKEN (EQUIPO_id, tipoToken, cantidad, ETAPA_id) 
            VALUES (i, 'RECOMPENSA_ETAPA', 20 + (j * 10), j);
        END LOOP;
    END LOOP;

    -- CONFIGURACION_VALOR
    FOR i IN 1..num_registros LOOP
        FOR j IN 1..3 LOOP
            INSERT INTO CONFIGURACION_VALOR (valor, CONFIGURACION_id, USUARIO_id) 
            VALUES (
                CASE j
                    WHEN 1 THEN '30'
                    WHEN 2 THEN '3'
                    WHEN 3 THEN 'true'
                END,
                j,
                i
            );
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Población de datos completada con % registros base', num_registros;
END;
$$;


ALTER FUNCTION public.poblar_datos(num_registros integer) OWNER TO postgres;

--
-- TOC entry 340 (class 1255 OID 49719)
-- Name: poblar_desafio(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_desafio(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_desafio(cantidad integer) OWNER TO postgres;

--
-- TOC entry 334 (class 1255 OID 49680)
-- Name: poblar_equipo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_equipo(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_equipo(cantidad integer) OWNER TO postgres;

--
-- TOC entry 348 (class 1255 OID 49727)
-- Name: poblar_equipo_desafio(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_equipo_desafio() RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_equipo_desafio() OWNER TO postgres;

--
-- TOC entry 339 (class 1255 OID 49718)
-- Name: poblar_estudiante(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_estudiante(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- SE ELIMINARON LAS VARIABLES "usuario_id" Y "lista_id" QUE CAUSABAN AMBIGÜEDAD
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
$$;


ALTER FUNCTION public.poblar_estudiante(cantidad integer) OWNER TO postgres;

--
-- TOC entry 309 (class 1255 OID 49681)
-- Name: poblar_etapa(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_etapa() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO ETAPA (nombreEtapa, duracionMinutos, orden, descripcion, textoHabilidad) VALUES
    ('Ideación', 30, 1, 'Generar ideas innovadoras para resolver el desafío.', 'Fomenta la creatividad y el pensamiento lateral.'),
    ('Prototipado', 45, 2, 'Construir un prototipo de baja fidelidad de la solución.', 'Desarrolla habilidades de construcción y diseño rápido.'),
    ('Validación', 20, 3, 'Obtener retroalimentación sobre el prototipo.', 'Practica la escucha activa y la empatía.'),
    ('Pitch Final', 15, 4, 'Presentar la solución final de forma convincente.', 'Mejora la comunicación y la persuasión.');
    RAISE NOTICE '-> Tabla ETAPA poblada.';
END;
$$;


ALTER FUNCTION public.poblar_etapa() OWNER TO postgres;

--
-- TOC entry 343 (class 1255 OID 49722)
-- Name: poblar_evaluacion_pitch(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_evaluacion_pitch(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_evaluacion_pitch(cantidad integer) OWNER TO postgres;

--
-- TOC entry 329 (class 1255 OID 49675)
-- Name: poblar_facultad(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_facultad() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO FACULTAD (nombre) VALUES
    ('Facultad de Ingeniería y Ciencias'),
    ('Facultad de Economía y Negocios'),
    ('Facultad de Diseño y Comunicación'),
    ('Facultad de Ciencias Sociales'),
    ('Facultad de Artes Liberales');
    RAISE NOTICE '-> Tabla FACULTAD poblada.';
END;
$$;


ALTER FUNCTION public.poblar_facultad() OWNER TO postgres;

--
-- TOC entry 310 (class 1255 OID 49682)
-- Name: poblar_ganas_emprender(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_ganas_emprender() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO GANAS_EMPRENDER (descripcion) VALUES
    ('¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?'),
    ('¿Disfrutas de los desafíos y de resolver problemas complejos?'),
    ('¿Te sientes cómodo tomando riesgos calculados?'),
    ('¿Te motiva la idea de crear tu propio camino profesional?');
    RAISE NOTICE '-> Tabla GANAS_EMPRENDER poblada.';
END;
$$;


ALTER FUNCTION public.poblar_ganas_emprender() OWNER TO postgres;

--
-- TOC entry 311 (class 1255 OID 49683)
-- Name: poblar_lista_participante(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_lista_participante(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_lista_participante(cantidad integer) OWNER TO postgres;

--
-- TOC entry 341 (class 1255 OID 49720)
-- Name: poblar_partida(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_partida(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_partida(cantidad integer) OWNER TO postgres;

--
-- TOC entry 347 (class 1255 OID 49726)
-- Name: poblar_partida_usuario(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_partida_usuario(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_partida_usuario(cantidad integer) OWNER TO postgres;

--
-- TOC entry 312 (class 1255 OID 49684)
-- Name: poblar_persona(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_persona(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_persona(cantidad integer) OWNER TO postgres;

--
-- TOC entry 337 (class 1255 OID 49716)
-- Name: poblar_profesor(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_profesor(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_profesor(cantidad integer) OWNER TO postgres;

--
-- TOC entry 344 (class 1255 OID 49723)
-- Name: poblar_solucion_lego(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_solucion_lego(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_solucion_lego(cantidad integer) OWNER TO postgres;

--
-- TOC entry 315 (class 1255 OID 49687)
-- Name: poblar_tablas_base(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.poblar_tablas_base()
    LANGUAGE plpgsql
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

    RAISE NOTICE '---';
    RAISE NOTICE '✅ Proceso de población de tablas base completado.';
    RAISE NOTICE '---';
END;
$$;


ALTER PROCEDURE public.poblar_tablas_base() OWNER TO postgres;

--
-- TOC entry 349 (class 1255 OID 49728)
-- Name: poblar_tablas_foraneas(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.poblar_tablas_foraneas()
    LANGUAGE plpgsql
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

    RAISE NOTICE '---';
    RAISE NOTICE '✅ Proceso de población de tablas foráneas completado.';
    RAISE NOTICE '---';
END;
$$;


ALTER PROCEDURE public.poblar_tablas_foraneas() OWNER TO postgres;

--
-- TOC entry 313 (class 1255 OID 49685)
-- Name: poblar_tema_desafio(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_tema_desafio() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO TEMA_DESAFIO (nombreTema, descripcion) VALUES
    ('Sostenibilidad Ambiental', 'Crear soluciones para reducir el impacto ecológico en la ciudad.'),
    ('Salud y Bienestar', 'Desarrollar ideas para mejorar la calidad de vida y la salud de las personas.'),
    ('Educación Digital', 'Innovar en herramientas educativas para el aprendizaje en línea.'),
    ('Inclusión Financiera', 'Crear servicios financieros accesibles para todos.');
    RAISE NOTICE '-> Tabla TEMA_DESAFIO poblada.';
END;
$$;


ALTER FUNCTION public.poblar_tema_desafio() OWNER TO postgres;

--
-- TOC entry 330 (class 1255 OID 49676)
-- Name: poblar_tipo_curso(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_tipo_curso() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO TIPO_CURSO (nombre) VALUES
    ('Obligatorio'),
    ('Electivo'),
    ('Taller'),
    ('Práctica Profesional');
    RAISE NOTICE '-> Tabla TIPO_CURSO poblada.';
END;
$$;


ALTER FUNCTION public.poblar_tipo_curso() OWNER TO postgres;

--
-- TOC entry 345 (class 1255 OID 49724)
-- Name: poblar_token(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_token(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_token(cantidad integer) OWNER TO postgres;

--
-- TOC entry 331 (class 1255 OID 49677)
-- Name: poblar_usuario(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_usuario(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_usuario(cantidad integer) OWNER TO postgres;

--
-- TOC entry 314 (class 1255 OID 49686)
-- Name: poblar_video(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poblar_video(cantidad integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.poblar_video(cantidad integer) OWNER TO postgres;

--
-- TOC entry 335 (class 1255 OID 49714)
-- Name: random_date_from_2024(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.random_date_from_2024() RETURNS timestamp without time zone
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN '2024-01-01'::timestamp + (random() * (now() - '2024-01-01'::timestamp));
END;
$$;


ALTER FUNCTION public.random_date_from_2024() OWNER TO postgres;

--
-- TOC entry 327 (class 1255 OID 49670)
-- Name: reset_sequences(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reset_sequences() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    ALTER SEQUENCE usuario_id_seq RESTART WITH 1;
    ALTER SEQUENCE facultad_id_seq RESTART WITH 1;
    ALTER SEQUENCE tipo_curso_id_seq RESTART WITH 1;
    ALTER SEQUENCE tema_desafio_id_seq RESTART WITH 1;
    ALTER SEQUENCE categoria_atributo_id_seq RESTART WITH 1;
    ALTER SEQUENCE ganas_emprender_id_seq RESTART WITH 1;
    ALTER SEQUENCE etapa_id_seq RESTART WITH 1;
    ALTER SEQUENCE video_id_seq RESTART WITH 1;
    ALTER SEQUENCE configuracion_id_seq RESTART WITH 1;
    ALTER SEQUENCE lista_participante_id_seq RESTART WITH 1;
    ALTER SEQUENCE persona_id_seq RESTART WITH 1;
    ALTER SEQUENCE administrador_id_seq RESTART WITH 1;
    ALTER SEQUENCE profesor_id_seq RESTART WITH 1;
    ALTER SEQUENCE estudiante_id_seq RESTART WITH 1;
    ALTER SEQUENCE carrera_id_seq RESTART WITH 1;
    ALTER SEQUENCE curso_id_seq RESTART WITH 1;
    ALTER SEQUENCE instruccion_etapa_id_seq RESTART WITH 1;
    ALTER SEQUENCE desafio_id_seq RESTART WITH 1;
    ALTER SEQUENCE equipo_id_seq RESTART WITH 1;
    ALTER SEQUENCE partida_id_seq RESTART WITH 1;
    ALTER SEQUENCE curso_estudiante_id_seq RESTART WITH 1;
    ALTER SEQUENCE atributo_id_seq RESTART WITH 1;
    ALTER SEQUENCE partida_usuario_id_seq RESTART WITH 1;
    ALTER SEQUENCE evaluacion_autoencuesta_id_seq RESTART WITH 1;
    ALTER SEQUENCE evaluacion_pitch_id_seq RESTART WITH 1;
    ALTER SEQUENCE ranking_id_seq RESTART WITH 1;
    ALTER SEQUENCE solucion_lego_id_seq RESTART WITH 1;
    ALTER SEQUENCE token_id_seq RESTART WITH 1;
    ALTER SEQUENCE configuracion_valor_id_seq RESTART WITH 1;
END;
$$;


ALTER FUNCTION public.reset_sequences() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 49154)
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    id integer NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- TOC entry 5622 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE administrador; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.administrador IS 'Información específica de administradores';


--
-- TOC entry 219 (class 1259 OID 49153)
-- Name: administrador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administrador_id_seq OWNER TO postgres;

--
-- TOC entry 5623 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_seq OWNED BY public.administrador.id;


--
-- TOC entry 298 (class 1259 OID 74029)
-- Name: api_progresoetapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_progresoetapa (
    id bigint NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone,
    finished_by_system boolean NOT NULL,
    equipo_id bigint NOT NULL,
    etapa_id bigint NOT NULL,
    finished_by_user_id bigint
);


ALTER TABLE public.api_progresoetapa OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 74028)
-- Name: api_progresoetapa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.api_progresoetapa ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.api_progresoetapa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 275 (class 1259 OID 49475)
-- Name: api_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_usuario (
    id integer CONSTRAINT usuario_id_not_null NOT NULL,
    email character varying(254) CONSTRAINT usuario_email_not_null NOT NULL,
    nombre character varying(50) CONSTRAINT usuario_nombre_not_null NOT NULL,
    apellido character varying(50) CONSTRAINT usuario_apellido_not_null NOT NULL,
    tipousuario character varying(20) CONSTRAINT usuario_tipousuario_not_null NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP CONSTRAINT usuario_fechacreacion_not_null NOT NULL,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    password character varying(128) CONSTRAINT usuario_password_not_null NOT NULL,
    is_active boolean CONSTRAINT usuario_is_active_not_null NOT NULL,
    is_staff boolean CONSTRAINT usuario_is_staff_not_null NOT NULL,
    is_superuser boolean CONSTRAINT usuario_is_superuser_not_null NOT NULL,
    last_login timestamp with time zone,
    CONSTRAINT usuario_estado_chk CHECK (((estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[]))),
    CONSTRAINT usuario_tipo_chk CHECK (((tipousuario)::text = ANY ((ARRAY['ADMINISTRADOR'::character varying, 'ESTUDIANTE'::character varying, 'PROFESOR'::character varying])::text[])))
);


ALTER TABLE public.api_usuario OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 74084)
-- Name: api_usuario_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_usuario_groups (
    id bigint CONSTRAINT usuario_groups_id_not_null NOT NULL,
    usuario_id bigint CONSTRAINT usuario_groups_usuario_id_not_null NOT NULL,
    group_id integer CONSTRAINT usuario_groups_group_id_not_null NOT NULL
);


ALTER TABLE public.api_usuario_groups OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 74099)
-- Name: api_usuario_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_usuario_user_permissions (
    id bigint CONSTRAINT usuario_user_permissions_id_not_null NOT NULL,
    usuario_id bigint CONSTRAINT usuario_user_permissions_usuario_id_not_null NOT NULL,
    permission_id integer CONSTRAINT usuario_user_permissions_permission_id_not_null NOT NULL
);


ALTER TABLE public.api_usuario_user_permissions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49163)
-- Name: atributo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atributo (
    id integer NOT NULL,
    valoratributo character varying(255),
    categoria_atributo_id integer NOT NULL,
    equipo_desafio_id integer NOT NULL
);


ALTER TABLE public.atributo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49162)
-- Name: atributo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atributo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atributo_id_seq OWNER TO postgres;

--
-- TOC entry 5624 (class 0 OID 0)
-- Dependencies: 221
-- Name: atributo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atributo_id_seq OWNED BY public.atributo.id;


--
-- TOC entry 285 (class 1259 OID 57379)
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 57378)
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 287 (class 1259 OID 57389)
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 57388)
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 283 (class 1259 OID 57369)
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 57368)
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 289 (class 1259 OID 57398)
-- Name: auth_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 57417)
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 57416)
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 288 (class 1259 OID 57397)
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 293 (class 1259 OID 57426)
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 57425)
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 304 (class 1259 OID 82221)
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49173)
-- Name: carrera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrera (
    id integer NOT NULL,
    facultad_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    CONSTRAINT carrera_estado_chk CHECK (((estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE public.carrera OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49172)
-- Name: carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrera_id_seq OWNER TO postgres;

--
-- TOC entry 5625 (class 0 OID 0)
-- Dependencies: 223
-- Name: carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrera_id_seq OWNED BY public.carrera.id;


--
-- TOC entry 226 (class 1259 OID 49185)
-- Name: categoria_atributo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_atributo (
    id integer NOT NULL,
    nombrecategoria character varying(100) NOT NULL
);


ALTER TABLE public.categoria_atributo OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49184)
-- Name: categoria_atributo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_atributo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_atributo_id_seq OWNER TO postgres;

--
-- TOC entry 5626 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_atributo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_atributo_id_seq OWNED BY public.categoria_atributo.id;


--
-- TOC entry 306 (class 1259 OID 90485)
-- Name: conexion_partida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conexion_partida (
    id bigint NOT NULL,
    codigo_ingresado character varying(7) NOT NULL,
    timestamp_conexion timestamp with time zone NOT NULL,
    activo boolean NOT NULL,
    equipo_id bigint NOT NULL,
    partida_id bigint NOT NULL,
    usuario_id bigint
);


ALTER TABLE public.conexion_partida OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 90484)
-- Name: conexion_partida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.conexion_partida ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.conexion_partida_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 49194)
-- Name: configuracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    tipodato character varying(50) NOT NULL
);


ALTER TABLE public.configuracion OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49193)
-- Name: configuracion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_id_seq OWNER TO postgres;

--
-- TOC entry 5627 (class 0 OID 0)
-- Dependencies: 227
-- Name: configuracion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_id_seq OWNED BY public.configuracion.id;


--
-- TOC entry 230 (class 1259 OID 49204)
-- Name: configuracion_valor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_valor (
    id integer NOT NULL,
    valor character varying(500) NOT NULL,
    configuracion_id integer NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.configuracion_valor OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49203)
-- Name: configuracion_valor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_valor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_valor_id_seq OWNER TO postgres;

--
-- TOC entry 5628 (class 0 OID 0)
-- Dependencies: 229
-- Name: configuracion_valor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_valor_id_seq OWNED BY public.configuracion_valor.id;


--
-- TOC entry 232 (class 1259 OID 49217)
-- Name: curso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curso (
    id integer NOT NULL,
    carrera_id integer NOT NULL,
    tipo_curso_id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text
);


ALTER TABLE public.curso OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 49231)
-- Name: curso_estudiante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curso_estudiante (
    id integer NOT NULL,
    curso_id integer NOT NULL,
    estudiante_id integer NOT NULL
);


ALTER TABLE public.curso_estudiante OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 49230)
-- Name: curso_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curso_estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curso_estudiante_id_seq OWNER TO postgres;

--
-- TOC entry 5629 (class 0 OID 0)
-- Dependencies: 233
-- Name: curso_estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curso_estudiante_id_seq OWNED BY public.curso_estudiante.id;


--
-- TOC entry 231 (class 1259 OID 49216)
-- Name: curso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curso_id_seq OWNER TO postgres;

--
-- TOC entry 5630 (class 0 OID 0)
-- Dependencies: 231
-- Name: curso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curso_id_seq OWNED BY public.curso.id;


--
-- TOC entry 236 (class 1259 OID 49241)
-- Name: desafio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.desafio (
    id integer NOT NULL,
    tema_desafio_id integer NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text NOT NULL,
    nombrepersona character varying(100),
    edadpersona smallint,
    contexto text,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    persona_id integer NOT NULL
);


ALTER TABLE public.desafio OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 49240)
-- Name: desafio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.desafio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.desafio_id_seq OWNER TO postgres;

--
-- TOC entry 5631 (class 0 OID 0)
-- Dependencies: 235
-- Name: desafio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.desafio_id_seq OWNED BY public.desafio.id;


--
-- TOC entry 295 (class 1259 OID 57487)
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 57486)
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 281 (class 1259 OID 57357)
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 57356)
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 279 (class 1259 OID 57345)
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 57344)
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 296 (class 1259 OID 57527)
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 49258)
-- Name: equipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo (
    id integer NOT NULL,
    nombreequipo character varying(100) NOT NULL,
    tamanoequipo integer,
    codigo_equipo character varying(10)
);


ALTER TABLE public.equipo OWNER TO postgres;

--
-- TOC entry 5632 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE equipo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.equipo IS 'Equipos de estudiantes por juego';


--
-- TOC entry 239 (class 1259 OID 49266)
-- Name: equipo_desafio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipo_desafio (
    equipo_id integer NOT NULL,
    desafio_id integer NOT NULL,
    desafio_persona_id integer NOT NULL
);


ALTER TABLE public.equipo_desafio OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 49257)
-- Name: equipo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipo_id_seq OWNER TO postgres;

--
-- TOC entry 5633 (class 0 OID 0)
-- Dependencies: 237
-- Name: equipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_id_seq OWNED BY public.equipo.id;


--
-- TOC entry 308 (class 1259 OID 90525)
-- Name: estado_partida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_partida (
    id bigint NOT NULL,
    estado_actual character varying(50) NOT NULL,
    fase_actual integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    activo boolean NOT NULL,
    mensaje character varying(255),
    partida_id bigint NOT NULL
);


ALTER TABLE public.estado_partida OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 90524)
-- Name: estado_partida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estado_partida ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.estado_partida_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 49275)
-- Name: estudiante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudiante (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    lista_participante_id integer NOT NULL
);


ALTER TABLE public.estudiante OWNER TO postgres;

--
-- TOC entry 5634 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE estudiante; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.estudiante IS 'Información específica de estudiantes';


--
-- TOC entry 240 (class 1259 OID 49274)
-- Name: estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudiante_id_seq OWNER TO postgres;

--
-- TOC entry 5635 (class 0 OID 0)
-- Dependencies: 240
-- Name: estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estudiante_id_seq OWNED BY public.estudiante.id;


--
-- TOC entry 243 (class 1259 OID 49285)
-- Name: etapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etapa (
    id integer NOT NULL,
    nombreetapa character varying(50) NOT NULL,
    duracionminutos integer NOT NULL,
    orden integer NOT NULL,
    descripcion character varying(500),
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    textohabilidad character varying(500)
);


ALTER TABLE public.etapa OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 49284)
-- Name: etapa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etapa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etapa_id_seq OWNER TO postgres;

--
-- TOC entry 5636 (class 0 OID 0)
-- Dependencies: 242
-- Name: etapa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etapa_id_seq OWNED BY public.etapa.id;


--
-- TOC entry 245 (class 1259 OID 49299)
-- Name: evaluacion_autoencuesta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluacion_autoencuesta (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    ganas_emprender_id integer NOT NULL,
    evalsatisf smallint,
    comentarios text,
    CONSTRAINT eval_satisf_chk CHECK (((evalsatisf >= 1) AND (evalsatisf <= 5)))
);


ALTER TABLE public.evaluacion_autoencuesta OWNER TO postgres;

--
-- TOC entry 5637 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN evaluacion_autoencuesta.evalsatisf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.evaluacion_autoencuesta.evalsatisf IS 'Puntuacion de 1-5, que se mapea con : No, No mucho, Más o menos, Si, Si, mucho';


--
-- TOC entry 244 (class 1259 OID 49298)
-- Name: evaluacion_autoencuesta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluacion_autoencuesta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluacion_autoencuesta_id_seq OWNER TO postgres;

--
-- TOC entry 5638 (class 0 OID 0)
-- Dependencies: 244
-- Name: evaluacion_autoencuesta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluacion_autoencuesta_id_seq OWNED BY public.evaluacion_autoencuesta.id;


--
-- TOC entry 247 (class 1259 OID 49312)
-- Name: evaluacion_pitch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluacion_pitch (
    id integer NOT NULL,
    equipo_evaluador_id integer NOT NULL,
    equipo_evaluado_id integer NOT NULL,
    puntajeequipo smallint,
    puntajeempatia smallint,
    puntajecreatividad smallint,
    puntajecomunicacion smallint,
    CONSTRAINT evaluacion_comunicacion_chk CHECK (((puntajecomunicacion >= 1) AND (puntajecomunicacion <= 4))),
    CONSTRAINT evaluacion_creatividad_chk CHECK (((puntajecreatividad >= 1) AND (puntajecreatividad <= 4))),
    CONSTRAINT evaluacion_empatia_chk CHECK (((puntajeempatia >= 1) AND (puntajeempatia <= 4))),
    CONSTRAINT evaluacion_equipo_chk CHECK (((puntajeequipo >= 1) AND (puntajeequipo <= 4)))
);


ALTER TABLE public.evaluacion_pitch OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 49311)
-- Name: evaluacion_pitch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluacion_pitch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluacion_pitch_id_seq OWNER TO postgres;

--
-- TOC entry 5639 (class 0 OID 0)
-- Dependencies: 246
-- Name: evaluacion_pitch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluacion_pitch_id_seq OWNED BY public.evaluacion_pitch.id;


--
-- TOC entry 249 (class 1259 OID 49326)
-- Name: facultad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facultad (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.facultad OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 49325)
-- Name: facultad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facultad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facultad_id_seq OWNER TO postgres;

--
-- TOC entry 5640 (class 0 OID 0)
-- Dependencies: 248
-- Name: facultad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facultad_id_seq OWNED BY public.facultad.id;


--
-- TOC entry 251 (class 1259 OID 49335)
-- Name: ganas_emprender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ganas_emprender (
    id integer NOT NULL,
    descripcion character varying(500) NOT NULL
);


ALTER TABLE public.ganas_emprender OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 49334)
-- Name: ganas_emprender_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ganas_emprender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ganas_emprender_id_seq OWNER TO postgres;

--
-- TOC entry 5641 (class 0 OID 0)
-- Dependencies: 250
-- Name: ganas_emprender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ganas_emprender_id_seq OWNED BY public.ganas_emprender.id;


--
-- TOC entry 253 (class 1259 OID 49344)
-- Name: instruccion_etapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instruccion_etapa (
    id integer NOT NULL,
    etapa_id integer NOT NULL,
    contenido text NOT NULL
);


ALTER TABLE public.instruccion_etapa OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 49343)
-- Name: instruccion_etapa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instruccion_etapa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instruccion_etapa_id_seq OWNER TO postgres;

--
-- TOC entry 5642 (class 0 OID 0)
-- Dependencies: 252
-- Name: instruccion_etapa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instruccion_etapa_id_seq OWNED BY public.instruccion_etapa.id;


--
-- TOC entry 255 (class 1259 OID 49356)
-- Name: lista_participante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_participante (
    id integer NOT NULL,
    emailestudiante character varying(100) NOT NULL,
    nombreestudiante character varying(150) NOT NULL
);


ALTER TABLE public.lista_participante OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 49355)
-- Name: lista_participante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_participante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lista_participante_id_seq OWNER TO postgres;

--
-- TOC entry 5643 (class 0 OID 0)
-- Dependencies: 254
-- Name: lista_participante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_participante_id_seq OWNED BY public.lista_participante.id;


--
-- TOC entry 257 (class 1259 OID 49366)
-- Name: partida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partida (
    id integer NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado character varying(20) DEFAULT 'CONFIGURACION'::character varying NOT NULL,
    codigoacceso character varying(10),
    fechainicio timestamp without time zone,
    fechafin timestamp without time zone,
    maxequipos integer DEFAULT 4,
    maxparticipantes integer,
    CONSTRAINT juego_estado_chk CHECK (((estado)::text = ANY ((ARRAY['CONFIGURACION'::character varying, 'EN_CURSO'::character varying, 'FINALIZADO'::character varying])::text[])))
);


ALTER TABLE public.partida OWNER TO postgres;

--
-- TOC entry 5644 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE partida; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.partida IS 'Sesiones de juego del sistema de emprendimiento';


--
-- TOC entry 256 (class 1259 OID 49365)
-- Name: partida_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partida_id_seq OWNER TO postgres;

--
-- TOC entry 5645 (class 0 OID 0)
-- Dependencies: 256
-- Name: partida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partida_id_seq OWNED BY public.partida.id;


--
-- TOC entry 259 (class 1259 OID 49381)
-- Name: partida_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partida_usuario (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    partida_id integer NOT NULL,
    equipo_id integer NOT NULL
);


ALTER TABLE public.partida_usuario OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 49380)
-- Name: partida_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partida_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partida_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5646 (class 0 OID 0)
-- Dependencies: 258
-- Name: partida_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partida_usuario_id_seq OWNED BY public.partida_usuario.id;


--
-- TOC entry 261 (class 1259 OID 49392)
-- Name: persona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persona (
    id integer NOT NULL,
    nombrepersona character varying(150) NOT NULL,
    imagenurl character varying(500) NOT NULL,
    contextopersona text NOT NULL,
    edad smallint
);


ALTER TABLE public.persona OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 49391)
-- Name: persona_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.persona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.persona_id_seq OWNER TO postgres;

--
-- TOC entry 5647 (class 0 OID 0)
-- Dependencies: 260
-- Name: persona_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.persona_id_seq OWNED BY public.persona.id;


--
-- TOC entry 263 (class 1259 OID 49405)
-- Name: profesor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesor (
    id integer NOT NULL,
    usuario_id integer NOT NULL
);


ALTER TABLE public.profesor OWNER TO postgres;

--
-- TOC entry 5648 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE profesor; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.profesor IS 'Información específica de profesores';


--
-- TOC entry 262 (class 1259 OID 49404)
-- Name: profesor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesor_id_seq OWNER TO postgres;

--
-- TOC entry 5649 (class 0 OID 0)
-- Dependencies: 262
-- Name: profesor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesor_id_seq OWNED BY public.profesor.id;


--
-- TOC entry 265 (class 1259 OID 49414)
-- Name: ranking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ranking (
    id integer NOT NULL,
    equipo_id integer NOT NULL,
    totaltokens integer DEFAULT 0 NOT NULL,
    posicionfinal integer NOT NULL
);


ALTER TABLE public.ranking OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 49413)
-- Name: ranking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ranking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ranking_id_seq OWNER TO postgres;

--
-- TOC entry 5650 (class 0 OID 0)
-- Dependencies: 264
-- Name: ranking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ranking_id_seq OWNED BY public.ranking.id;


--
-- TOC entry 267 (class 1259 OID 49426)
-- Name: solucion_lego; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solucion_lego (
    id integer NOT NULL,
    equipo_id integer NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripsoluc text,
    fotoprototipurl character varying(500)
);


ALTER TABLE public.solucion_lego OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 49425)
-- Name: solucion_lego_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solucion_lego_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solucion_lego_id_seq OWNER TO postgres;

--
-- TOC entry 5651 (class 0 OID 0)
-- Dependencies: 266
-- Name: solucion_lego_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solucion_lego_id_seq OWNED BY public.solucion_lego.id;


--
-- TOC entry 269 (class 1259 OID 49439)
-- Name: tema_desafio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tema_desafio (
    id integer NOT NULL,
    nombretema character varying(100) NOT NULL,
    descripcion character varying(500) NOT NULL,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying
);


ALTER TABLE public.tema_desafio OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 49438)
-- Name: tema_desafio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tema_desafio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tema_desafio_id_seq OWNER TO postgres;

--
-- TOC entry 5652 (class 0 OID 0)
-- Dependencies: 268
-- Name: tema_desafio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tema_desafio_id_seq OWNED BY public.tema_desafio.id;


--
-- TOC entry 271 (class 1259 OID 49452)
-- Name: tipo_curso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_curso (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.tipo_curso OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 49451)
-- Name: tipo_curso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_curso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_curso_id_seq OWNER TO postgres;

--
-- TOC entry 5653 (class 0 OID 0)
-- Dependencies: 270
-- Name: tipo_curso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_curso_id_seq OWNED BY public.tipo_curso.id;


--
-- TOC entry 273 (class 1259 OID 49461)
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id integer NOT NULL,
    equipo_id integer NOT NULL,
    tipotoken character varying(30) NOT NULL,
    cantidad integer NOT NULL,
    etapa_id integer,
    fechaotorgada timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT token_tipo_chk CHECK (((tipotoken)::text = ANY ((ARRAY['BONIFICACION'::character varying, 'EVALUACION'::character varying, 'RECOMPENSA_ETAPA'::character varying])::text[])))
);


ALTER TABLE public.token OWNER TO postgres;

--
-- TOC entry 5654 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.token IS 'Sistema de tokens y recompensas';


--
-- TOC entry 5655 (class 0 OID 0)
-- Dependencies: 273
-- Name: COLUMN token.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.token.id IS 'Esta entidad permite trazabilidad de los tokens ganados por etapas';


--
-- TOC entry 272 (class 1259 OID 49460)
-- Name: token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.token_id_seq OWNER TO postgres;

--
-- TOC entry 5656 (class 0 OID 0)
-- Dependencies: 272
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;


--
-- TOC entry 299 (class 1259 OID 74083)
-- Name: usuario_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.api_usuario_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.usuario_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 274 (class 1259 OID 49474)
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5657 (class 0 OID 0)
-- Dependencies: 274
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.api_usuario.id;


--
-- TOC entry 301 (class 1259 OID 74098)
-- Name: usuario_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.api_usuario_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.usuario_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 277 (class 1259 OID 49494)
-- Name: video; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video (
    id integer NOT NULL,
    nombrevideo character varying(150) NOT NULL,
    url character varying(500) NOT NULL,
    partida_id bigint
);


ALTER TABLE public.video OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 49493)
-- Name: video_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_id_seq OWNER TO postgres;

--
-- TOC entry 5658 (class 0 OID 0)
-- Dependencies: 276
-- Name: video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_id_seq OWNED BY public.video.id;


--
-- TOC entry 303 (class 1259 OID 74152)
-- Name: vista_detalle_equipo; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_detalle_equipo AS
 SELECT e.id AS equipo_id,
    e.nombreequipo,
    prof.id AS profesor_id,
    prof_usuario.nombre AS nombre_profesor,
    prof_usuario.apellido AS apellido_profesor,
    prof_usuario.email AS email_profesor,
    est.id AS estudiante_id,
    est_usuario.nombre AS nombre_estudiante,
    est_usuario.apellido AS apellido_estudiante,
    est_usuario.email AS email_estudiante,
    c.nombre AS nombre_carrera,
    f.nombre AS nombre_facultad,
    p.id AS partida_id,
    p.codigoacceso
   FROM (((((((public.equipo e
     LEFT JOIN public.profesor prof ON ((e.id = prof.usuario_id)))
     LEFT JOIN public.api_usuario prof_usuario ON ((prof.usuario_id = prof_usuario.id)))
     LEFT JOIN public.estudiante est ON ((e.id = est.usuario_id)))
     LEFT JOIN public.api_usuario est_usuario ON ((est.usuario_id = est_usuario.id)))
     LEFT JOIN public.carrera c ON ((c.id = est_usuario.id)))
     LEFT JOIN public.facultad f ON ((f.id = c.facultad_id)))
     LEFT JOIN public.partida p ON ((p.id = e.id)));


ALTER VIEW public.vista_detalle_equipo OWNER TO postgres;

--
-- TOC entry 5112 (class 2604 OID 49157)
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- TOC entry 5150 (class 2604 OID 49478)
-- Name: api_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 5113 (class 2604 OID 49166)
-- Name: atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo ALTER COLUMN id SET DEFAULT nextval('public.atributo_id_seq'::regclass);


--
-- TOC entry 5114 (class 2604 OID 49176)
-- Name: carrera id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera ALTER COLUMN id SET DEFAULT nextval('public.carrera_id_seq'::regclass);


--
-- TOC entry 5116 (class 2604 OID 49188)
-- Name: categoria_atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo ALTER COLUMN id SET DEFAULT nextval('public.categoria_atributo_id_seq'::regclass);


--
-- TOC entry 5117 (class 2604 OID 49197)
-- Name: configuracion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion ALTER COLUMN id SET DEFAULT nextval('public.configuracion_id_seq'::regclass);


--
-- TOC entry 5118 (class 2604 OID 49207)
-- Name: configuracion_valor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor ALTER COLUMN id SET DEFAULT nextval('public.configuracion_valor_id_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 49220)
-- Name: curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso ALTER COLUMN id SET DEFAULT nextval('public.curso_id_seq'::regclass);


--
-- TOC entry 5120 (class 2604 OID 49234)
-- Name: curso_estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante ALTER COLUMN id SET DEFAULT nextval('public.curso_estudiante_id_seq'::regclass);


--
-- TOC entry 5121 (class 2604 OID 49244)
-- Name: desafio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio ALTER COLUMN id SET DEFAULT nextval('public.desafio_id_seq'::regclass);


--
-- TOC entry 5124 (class 2604 OID 49261)
-- Name: equipo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo ALTER COLUMN id SET DEFAULT nextval('public.equipo_id_seq'::regclass);


--
-- TOC entry 5125 (class 2604 OID 49278)
-- Name: estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante ALTER COLUMN id SET DEFAULT nextval('public.estudiante_id_seq'::regclass);


--
-- TOC entry 5126 (class 2604 OID 49288)
-- Name: etapa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapa ALTER COLUMN id SET DEFAULT nextval('public.etapa_id_seq'::regclass);


--
-- TOC entry 5128 (class 2604 OID 49302)
-- Name: evaluacion_autoencuesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_autoencuesta_id_seq'::regclass);


--
-- TOC entry 5129 (class 2604 OID 49315)
-- Name: evaluacion_pitch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_pitch_id_seq'::regclass);


--
-- TOC entry 5130 (class 2604 OID 49329)
-- Name: facultad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultad ALTER COLUMN id SET DEFAULT nextval('public.facultad_id_seq'::regclass);


--
-- TOC entry 5131 (class 2604 OID 49338)
-- Name: ganas_emprender id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ganas_emprender ALTER COLUMN id SET DEFAULT nextval('public.ganas_emprender_id_seq'::regclass);


--
-- TOC entry 5132 (class 2604 OID 49347)
-- Name: instruccion_etapa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa ALTER COLUMN id SET DEFAULT nextval('public.instruccion_etapa_id_seq'::regclass);


--
-- TOC entry 5133 (class 2604 OID 49359)
-- Name: lista_participante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_participante ALTER COLUMN id SET DEFAULT nextval('public.lista_participante_id_seq'::regclass);


--
-- TOC entry 5134 (class 2604 OID 49369)
-- Name: partida id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida ALTER COLUMN id SET DEFAULT nextval('public.partida_id_seq'::regclass);


--
-- TOC entry 5138 (class 2604 OID 49384)
-- Name: partida_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario ALTER COLUMN id SET DEFAULT nextval('public.partida_usuario_id_seq'::regclass);


--
-- TOC entry 5139 (class 2604 OID 49395)
-- Name: persona id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona ALTER COLUMN id SET DEFAULT nextval('public.persona_id_seq'::regclass);


--
-- TOC entry 5140 (class 2604 OID 49408)
-- Name: profesor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor ALTER COLUMN id SET DEFAULT nextval('public.profesor_id_seq'::regclass);


--
-- TOC entry 5141 (class 2604 OID 49417)
-- Name: ranking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking ALTER COLUMN id SET DEFAULT nextval('public.ranking_id_seq'::regclass);


--
-- TOC entry 5143 (class 2604 OID 49429)
-- Name: solucion_lego id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego ALTER COLUMN id SET DEFAULT nextval('public.solucion_lego_id_seq'::regclass);


--
-- TOC entry 5145 (class 2604 OID 49442)
-- Name: tema_desafio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema_desafio ALTER COLUMN id SET DEFAULT nextval('public.tema_desafio_id_seq'::regclass);


--
-- TOC entry 5147 (class 2604 OID 49455)
-- Name: tipo_curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_curso ALTER COLUMN id SET DEFAULT nextval('public.tipo_curso_id_seq'::regclass);


--
-- TOC entry 5148 (class 2604 OID 49464)
-- Name: token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- TOC entry 5153 (class 2604 OID 49497)
-- Name: video id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video ALTER COLUMN id SET DEFAULT nextval('public.video_id_seq'::regclass);


--
-- TOC entry 5528 (class 0 OID 49154)
-- Dependencies: 220
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.administrador VALUES (9, 14);
INSERT INTO public.administrador VALUES (10, 18);
INSERT INTO public.administrador VALUES (11, 19);
INSERT INTO public.administrador VALUES (12, 22);
INSERT INTO public.administrador VALUES (13, 24);


--
-- TOC entry 5606 (class 0 OID 74029)
-- Dependencies: 298
-- Data for Name: api_progresoetapa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5583 (class 0 OID 49475)
-- Dependencies: 275
-- Data for Name: api_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.api_usuario VALUES (16, 'usuario3@innovate.com', 'Nombre3', 'Apellido3', 'PROFESOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$Cr816VCHvZoQxy1U4syzm3$m3eFTceHZsFr5f9Nsv14ybjff7lQjZWqo1cWw7GIfN4=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (17, 'usuario4@innovate.com', 'Nombre4', 'Apellido4', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$OxofMDo8fMsdzfbw6xbS9r$Tby+XGy4qXpe8htoKQMpXDLvijlYyor0jDTievrzXmg=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (18, 'usuario5@innovate.com', 'Nombre5', 'Apellido5', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$6arZ6STuaxNoAtSxZ0o25d$NFjzMi8DdvPZjiUT5S6t5xQaWjQA3pIcbXmk+7kBFeE=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (19, 'usuario6@innovate.com', 'Nombre6', 'Apellido6', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$c5fHc2vGAFbxeShshka0Do$BuiKJRk/StfzrfagkxXAEuMrUHizhXyEQZWO8jze+Tc=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (20, 'usuario7@innovate.com', 'Nombre7', 'Apellido7', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$LxqAXwhu92bO6OYquQYS0T$BNKonmvJxdajN5FsC4ufJyQWsy8mqav2YG1koDdvC4Y=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (21, 'usuario8@innovate.com', 'Nombre8', 'Apellido8', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$9yPZe5RmwRiRrPjkBWGLQF$cdGeCCvh6wKX+nI7vF3bEZwHXtMhDPpM+TyYnOIYIjo=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (22, 'usuario9@innovate.com', 'Nombre9', 'Apellido9', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$JeAVZp5WuJf1KuzWjASPxv$HcuYGe1XOrKzFJbgfQfdYMBlWr/G9jo6pwxzAMeZKwY=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (24, 'usuario11@innovate.com', 'Nombre11', 'Apellido11', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$SpHo8J6tvLYl9gWg85e0Z0$tJjmIJeziOse7SQbvWcCz3qaRRdnchEkewpw4wDPkoM=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (25, 'usuario12@innovate.com', 'Nombre12', 'Apellido12', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$f6Gd1E1h2MXSfRYs0EMgvX$ijLD/yEa7q1EaAVtIfru+BVop7sPzOUrWW41HO0xJ20=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (26, 'usuario13@innovate.com', 'Nombre13', 'Apellido13', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$hVzeoexl3byydQZYPFYgOj$EPHUC3hRplnbXgcSdpK0e4372xTNZEhQLZvpXjVAdT8=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (28, 'usuario15@innovate.com', 'Nombre15', 'Apellido15', 'PROFESOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$zlzSGoRheOHd6pnk68AXUj$soxajG2nHrHTS9BFbk1uQEKdkqQquE6P3gsgeGHLtB4=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (29, 'usuario16@innovate.com', 'Nombre16', 'Apellido16', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$sciykl0d5rSnwWRDOwXepz$4yAVkUJ+Fdi8itE7AripHukaD0hA5q8j83wOXwQrWhs=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (31, 'usuario18@innovate.com', 'Nombre18', 'Apellido18', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$G9srVdfZPMhGTkTZgvJsdP$XISO+WsfGb2hR6yRLvfj1tu5xQiFpC7KWpLWNZdS/Sk=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (32, 'usuario19@innovate.com', 'Nombre19', 'Apellido19', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$iThHJPM93m4R7HOEsw68oY$zaWeNy0Z4GV5GkDU0RWD4HSb5y+nce+ir2QkKZTUjOI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (33, 'usuario20@innovate.com', 'Nombre20', 'Apellido20', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$jWfM9nkaD4UIbDPJhpil6f$gjB81+0WkgLcebtwJqJO/0mDsHTBUu0V6md88G0ZDQ4=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (35, 'usuario22@innovate.com', 'Nombre22', 'Apellido22', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$B076wHM5Vyvt0U5LYOecLE$0b/PasSeEu5E5BXZO/Mg5WcwMQxnsneoe0bEa5PW29w=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (36, 'usuario23@innovate.com', 'Nombre23', 'Apellido23', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$lUgOkodNLT8HVWQjX3T14e$NhTTeCmapGtFG+Jg86VGN/E1Wq7nnU/6l/SNdE3ZbBo=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (38, 'usuario25@innovate.com', 'Nombre25', 'Apellido25', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$XYB51riOfOxSQaKwFE8r9d$dw0TielviyKvxTgyrLKXPI681LxfAUTG1m1n2YsovSU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (39, 'usuario26@innovate.com', 'Nombre26', 'Apellido26', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$1vZi3rmdJEPA7f3KDjrib5$B/w9Vrr+4OMHRpxaUmArHSsK7+4eTyE2GTKfNO5bUAA=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (41, 'usuario28@innovate.com', 'Nombre28', 'Apellido28', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$C8pv1CD2tWSZaAsAPaoy0X$lQuXGATkDIadY9FLcTX6WoICrekeMDUEzGiLtZ4eU2E=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (42, 'usuario29@innovate.com', 'Nombre29', 'Apellido29', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$32nYsf6JSwYjHffWFJ66Pj$tfgGssk7HIAyG2XbrkjkH3y0apXbVbxN6a/1iQ98QzU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (43, 'usuario30@innovate.com', 'Nombre30', 'Apellido30', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$aK3RWZnvAuigtUoBRHkPVS$JufkZDacYcSeVcjkQusWgvaw14HO7aJiZgPRYIh97yE=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (45, 'usuario32@innovate.com', 'Nombre32', 'Apellido32', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$tJT3wyIgT0fzJSXrazC4mw$jufK6nUSDhVWDuPAweKV+Zp4nFdqQR4QW1a6Od/+CG4=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (46, 'usuario33@innovate.com', 'Nombre33', 'Apellido33', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$6ThmMGNIIcsKwQAAbEklRN$pS4FFDCKLif0PCoWIOB9A7O29ICoGirTKB+GSXAn7kI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (47, 'usuario34@innovate.com', 'Nombre34', 'Apellido34', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$xl5J1Jpi0AGWi0I65GR3V7$5GRjXstBqu18FgEV1nseinbwBKhmknqgucdhgsaFXcU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (49, 'usuario36@innovate.com', 'Nombre36', 'Apellido36', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$GlVDmbfBaQTxBDxiR8SzKM$9X/aFb8vCAwH11yU+iVJtQ93NpZNbdor4ie36c3W73A=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (50, 'usuario37@innovate.com', 'Nombre37', 'Apellido37', 'PROFESOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$2vc4cYes7Rqhai379YNC16$Zc214TnF5zkDxw/HUI/erWfQdNgFuWOhPQDGoNKfTAw=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (52, 'usuario39@innovate.com', 'Nombre39', 'Apellido39', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$3UDBwLHeWv3jS2jjOBITEm$FkdQ2wQsHLyzobM12qWMh1KUaxwqesATbvAJZ8MN2JU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (53, 'usuario40@innovate.com', 'Nombre40', 'Apellido40', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$REoR74PFubTo23lWgiC5q3$eqL4BcjEqEBdMLYmP3AiRPSwuofvtF22Yg7fwqeDvh8=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (54, 'usuario41@innovate.com', 'Nombre41', 'Apellido41', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$9QxaGD6HrewF5GekcKTy4u$RXulO1Lir3ATflhscczJn7dvkiWhJJ8uqiEgs4MAhJc=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (56, 'usuario43@innovate.com', 'Nombre43', 'Apellido43', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$gVnB9Fvum4RwYD78JyYHYi$UtxtvehizzAw9dfjky4O2UEbpPrrcvFWGFXa9aF5iI0=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (15, 'usuario2@innovate.com', 'Nombre2', 'Apellido2', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$PdyNr9iUQU2wHKfTonep85$flRHvgcFDXGcegJCm79SVCUszWwX3/Wl/c/xCBat3HM=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (57, 'usuario44@innovate.com', 'Nombre44', 'Apellido44', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$zXQiGIe6Flv60XHV3ANllS$5qR0mQn65tl+wLXNsa9F2an/oNeY9qAQlJUu8rNlx0A=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (59, 'usuario46@innovate.com', 'Nombre46', 'Apellido46', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$rCph7eV0Jf74PjWROCFD1v$W2uHjQaLy6S3K7OG+ZLCNrwO16YO4a0BrZu1UYh4Qq0=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (60, 'usuario47@innovate.com', 'Nombre47', 'Apellido47', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$S9F6hPJUdnVV7VrvpPPcjw$z5b0XlUQOC5sZLHkvAmkZVZHE1sRNLhs252Ft2FFXN4=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (61, 'usuario48@innovate.com', 'Nombre48', 'Apellido48', 'PROFESOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$eVclmqsZt5Ihv4AiV5OXE0$7C3XSGRPHci/m9EO3iR1/NcLOk8yNmSmzs+us9i8RKI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (63, 'usuario50@innovate.com', 'Nombre50', 'Apellido50', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$Gi22eji49Me9GnSgGu8zzu$ep+Mx2m9HZHJQuOAgwOoGJ04K68A3ITSPUUMt6pXXQM=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (79, 'matvergaraf@udd.cl', 'MATÍAS ALEJANDRO', 'VERGARA FLORES', 'ESTUDIANTE', '2025-11-07 09:43:43.277927', 'ACTIVO', 'pbkdf2_sha256$1000000$vo3aqNlQCwZ724RwC7h0Mg$8qfTgV3rA3/7VRLkvJAb+rSndNfqku/vuHEYmvwZNOw=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (80, 'lanascot@udd.cl', 'LEANDRO', 'AÑASCO TELLERI', 'ESTUDIANTE', '2025-11-07 09:43:43.281866', 'ACTIVO', 'pbkdf2_sha256$1000000$BKFNdbsaa7PZZX3cmLekDk$TOMlMPgTQ+5T7IOrB/0kmLyKqs2hJ7vk8/4o1z1HiAI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (81, 'spagem@udd.cl', 'SANTIAGO ANDRÉS', 'PAGE MUNITA', 'ESTUDIANTE', '2025-11-07 09:43:43.286407', 'ACTIVO', 'pbkdf2_sha256$1000000$qeeVsajtMjGv5CdLmJqMQX$X0pfoG6rfmVzAnJkXkufF1/HSHeTeik11NEwtySzW3k=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (82, 'jsaavedrah@udd.cl', 'JOSE IGNACIO', 'SAAVEDRA HANS', 'ESTUDIANTE', '2025-11-07 09:43:43.290242', 'ACTIVO', 'pbkdf2_sha256$1000000$tI3Ym8QUVGpCKHvSlL1NrE$wVqFYioaKROruCFoV6SRXW+ri5nLXjtXO2WwghBRSjg=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (85, 'j.azuajep@udd.cl', 'JESUS ALEJANDRO', 'AZUAJE PEREZ', 'ESTUDIANTE', '2025-11-07 09:43:43.302956', 'ACTIVO', 'pbkdf2_sha256$1000000$3O2SKbppU89YDCEHagAoCC$IhJ5UnFBEwbPKqDo62Lt5TCf66L5lNt+WbbjLjyBHTE=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (86, 'r.barbosap@udd.cl', 'RAIMUNDO', 'BARBOSA PETIT', 'ESTUDIANTE', '2025-11-07 09:43:43.306022', 'ACTIVO', 'pbkdf2_sha256$1000000$4256Qz7nKPcncRyIDXFyYS$hW8Mv9+UioX/6fS9193ppzW1jdjYvsJLudLqIQdFlZ8=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (87, 'a.reyesp@udd.cl', 'AGUSTÍN EDUARDO', 'REYES PEREIRA', 'ESTUDIANTE', '2025-11-07 09:43:43.308965', 'ACTIVO', 'pbkdf2_sha256$1000000$IFVUmumqfOhIYUyqihNsUd$TGjvVAYGrHayX3rZRcgfXobv5/RcZuHumM++Zs2+j5E=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (88, 'alumno1@correo.com', 'Juan', 'Pérez Gómez', 'ESTUDIANTE', '2025-11-15 23:08:07.478461', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (89, 'alumno2@correo.com', 'Ana', 'López Martínez', 'ESTUDIANTE', '2025-11-15 23:08:08.426436', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (90, 'alumno3@correo.com', 'Carlos', 'Ramírez Torres', 'ESTUDIANTE', '2025-11-15 23:08:08.43118', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (91, 'alumno1@mail.com', 'Juan', 'Perez Gonzalez', 'ESTUDIANTE', '2025-11-24 12:27:06.335543', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (92, 'alumno2@mail.com', 'Maria', 'Lopez Silva', 'ESTUDIANTE', '2025-11-24 12:27:06.655818', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (93, 'alumno3@mail.com', 'Pedro', 'Martinez Rojas', 'ESTUDIANTE', '2025-11-24 12:27:06.660084', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (23, 'usuario10@innovate.com', 'Nombre10', 'Apellido10', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$aZX6VxYhc0ANi54L6QK3oc$vLLf18jATbnczrFtAfhDuF6pJrfllM4uKdpFxgR6ZTA=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (27, 'usuario14@innovate.com', 'Nombre14', 'Apellido14', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$ccy88dzD68JU82JRKdLEoI$ikP9LqEaz55J3tY5o88zgPqQdbzXPJedbgf/pQR0mfc=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (30, 'usuario17@innovate.com', 'Nombre17', 'Apellido17', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$1qZVVBGZw0qkEev4TX5jTm$qd8PcqsRyq0EjIVcauOabTxkih8DhAtJCCej7XKWKf8=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (34, 'usuario21@innovate.com', 'Nombre21', 'Apellido21', 'PROFESOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$HITgggqjMQNOkSk54vwx3z$USR01jnKLxCNmgyTcA0h9FDLpm08BDYTzbNVpW5QEdU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (37, 'usuario24@innovate.com', 'Nombre24', 'Apellido24', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$qeG48BIDB16eMCHzM7tJ3Y$V+Fp7UqSQoxsX7TsAwDwnpuKbQBl8E/AAR9GpQm6CaI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (40, 'usuario27@innovate.com', 'Nombre27', 'Apellido27', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$UyvzIMfAOotmBBirYrmYUq$GeC4cpq/3XvyrUYVBWUOuLHBZtp5nO6IRNDvwPZfrIc=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (44, 'usuario31@innovate.com', 'Nombre31', 'Apellido31', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$2yWo51vrBc4gBBWRi9kU0k$zRlaLUoH/dD0HKybXeFA6HwQ0WLT4u3eb0c5kbl3Q9Q=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (48, 'usuario35@innovate.com', 'Nombre35', 'Apellido35', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$s6V9sDvOa1vJqG2t3LqwhH$lg97r2dskmJqCYSwWMUZGapyZFD/UWY/r7dmzX7PIDo=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (51, 'usuario38@innovate.com', 'Nombre38', 'Apellido38', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$oT7B2RoOMw3xaNb3S0MnIz$55oLByq4C+euOuvCwBfaLiQXIrOeUg0qrZMIDEpC7tI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (55, 'usuario42@innovate.com', 'Nombre42', 'Apellido42', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'ACTIVO', 'pbkdf2_sha256$1000000$s7deGtcMgx4OogOg67UDUF$qwdPg/aVH7DqxSPaCrZlY7BwuVGJiNmP3BQ7aKo0wsY=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (58, 'usuario45@innovate.com', 'Nombre45', 'Apellido45', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$9BPNXt0DN4uIToYnsKo2vi$UhIYnsPUXX7vaTz7nbzCvoOIHzvyiGwhI2A3yDO+FFU=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (62, 'usuario49@innovate.com', 'Nombre49', 'Apellido49', 'ESTUDIANTE', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$lyqWzLmdMIxjIu0VYmaDOf$t4cJtYofs/RfSHhTfI/mmmkSABmrJ86RAcrk0Zd3jnY=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (14, 'usuario1@innovate.com', 'Nombre1', 'Apellido1', 'ADMINISTRADOR', '2025-10-18 14:40:49.170842', 'INACTIVO', 'pbkdf2_sha256$1000000$5pLg4SdSwj5yATmthJP2oz$xbNWfg9vaLzWmPiKlxefD7McBYprNUD2xluVP6nTU5M=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (71, 's.ruizr@udd.cl', 'SEBASTIAN FERNANDO', 'RUIZ RIFFO', 'ESTUDIANTE', '2025-11-07 09:43:43.119475', 'ACTIVO', 'pbkdf2_sha256$1000000$hjd01TjUlUGCBrUiO0tEL9$fBbYMQFzCq8CXoik3DLYfv7NtBqXRzMHr1ZJFwqXWok=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (72, 'd.romerob@udd.cl', 'DANIEL ANDRÉS', 'ROMERO BELTRÁN', 'ESTUDIANTE', '2025-11-07 09:43:43.24881', 'ACTIVO', 'pbkdf2_sha256$1000000$tToQfuNnsWqlGpPeKyXuK7$70Kd4hXPx+cL1yM4iOXD27HAW7EGSRloUaqd52Nn6JE=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (73, 'm.guerreroa@udd.cl', 'MARTÍN ISAIAS', 'GUERRERO ANCAPICHÚN', 'ESTUDIANTE', '2025-11-07 09:43:43.25485', 'ACTIVO', 'pbkdf2_sha256$1000000$lpRQ4M6Si8lzMwxUsSTY6t$pD4j6FAFpN6itqB36QtUIGVEZmId1vZXXpo3zJVA28Q=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (74, 'l.riquelmet@udd.cl', 'LUCAS JEREMÍAS', 'RIQUELME TORRES', 'ESTUDIANTE', '2025-11-07 09:43:43.258776', 'ACTIVO', 'pbkdf2_sha256$1000000$2PdKNYGCtGPNPXSlQVwjiK$FJ392p3ca6w/pfpJ+tK6AhmLnh06yDZ9WbWlHKp30Tg=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (75, 'm.olivaresr@udd.cl', 'MARTÍN ALEJANDRO', 'OLIVARES ROJAS', 'ESTUDIANTE', '2025-11-07 09:43:43.262529', 'ACTIVO', 'pbkdf2_sha256$1000000$xBLICaO2jO9cY5m0ATAjd0$jhN1H4ntdcStUlpGHj7rsFIpe1eM/klMv+r1oKvUQAo=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (76, 'r.varelar@udd.cl', 'RENATO IGNACIO', 'VARELA ROJAS', 'ESTUDIANTE', '2025-11-07 09:43:43.265929', 'ACTIVO', 'pbkdf2_sha256$1000000$V2wqJjylEC8GcntD5lnwwp$caxhha1xpICGH3SaCYe7kBYJ2GPqRBZd2jSOL2Ac4Nc=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (77, 'sramorinoc@udd.cl', 'SEBASTIÁN', 'RAMORINO CARRILLO', 'ESTUDIANTE', '2025-11-07 09:43:43.270801', 'ACTIVO', 'pbkdf2_sha256$1000000$0dWp11XUW2X007C9fVqYeK$h7CBHe6xDoB9BPc46ZucYvyfXajg5D7HEeD/++2kmyI=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (78, 'a.barrientosv@udd.cl', 'ALEJANDRO PATRICIO', 'BARRIENTOS VILLALOBOS', 'ESTUDIANTE', '2025-11-07 09:43:43.273608', 'ACTIVO', 'pbkdf2_sha256$1000000$8kzpyBmOkumLZEjxnXZdIL$trsfvHrvsYPTcxuztaLvlXV7pCqsDlVbMOZY+VVilic=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (83, 'a.torresf@udd.cl', 'ÁLVARO FRANCISCO', 'TORRES FERNÁNDEZ', 'ESTUDIANTE', '2025-11-07 09:43:43.294272', 'ACTIVO', 'pbkdf2_sha256$1000000$hdEHMkBFWi9TofRznwvZa5$uhyofInGfAv5caDFGEn/gQkSmBPDtkCDDluVv/ISkcs=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (84, 'b.farinal@udd.cl', 'BASTIÁN IGNACIO', 'FARIÑA LARA', 'ESTUDIANTE', '2025-11-07 09:43:43.298558', 'ACTIVO', 'pbkdf2_sha256$1000000$Yeioa9dXz3q79ddMhcUS8n$DdnZiIa6UVjw8BGT04/4VC/ndCTK9YGKlGhtB06lVco=', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (94, 'alumno4@mail.com', 'Ana', 'Garcia Torres', 'ESTUDIANTE', '2025-11-24 12:27:06.663932', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (95, 'alumno5@mail.com', 'Luis', 'Fernandez Vargas', 'ESTUDIANTE', '2025-11-24 12:27:06.667705', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (96, 'alumno6@mail.com', 'Sofia', 'Ramirez Castro', 'ESTUDIANTE', '2025-11-24 12:27:06.672077', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (97, 'alumno7@mail.com', 'Carlos', 'Diaz Morales', 'ESTUDIANTE', '2025-11-24 12:27:06.675799', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (98, 'alumno8@mail.com', 'Laura', 'Sanchez Ortiz', 'ESTUDIANTE', '2025-11-24 12:27:06.679382', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (99, 'alumno9@mail.com', 'Diego', 'Herrera Nunez', 'ESTUDIANTE', '2025-11-24 12:27:06.683196', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (100, 'alumno10@mail.com', 'Valentina', 'Rojas Campos', 'ESTUDIANTE', '2025-11-24 12:27:06.68761', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (101, 'alumno11@mail.com', 'Mateo', 'Vega Paredes', 'ESTUDIANTE', '2025-11-24 12:27:06.740026', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (102, 'alumno12@mail.com', 'Camila', 'Molina Espinoza', 'ESTUDIANTE', '2025-11-24 12:27:06.742925', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (103, 'alumno13@mail.com', 'Sebastian', 'Ponce Ramos', 'ESTUDIANTE', '2025-11-24 12:27:06.745741', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (104, 'alumno14@mail.com', 'Isabella', 'Salazar Caceres', 'ESTUDIANTE', '2025-11-24 12:27:06.748482', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (105, 'alumno15@mail.com', 'Emilio', 'Acosta Figueroa', 'ESTUDIANTE', '2025-11-24 12:27:06.751871', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (106, 'alumno16@mail.com', 'Martina', 'Navarro Bravo', 'ESTUDIANTE', '2025-11-24 12:27:06.754768', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (107, 'alumno17@mail.com', 'Benjamin', 'Parra Munoz', 'ESTUDIANTE', '2025-11-24 12:27:06.757695', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (108, 'alumno18@mail.com', 'Antonella', 'Contreras Soto', 'ESTUDIANTE', '2025-11-24 12:27:06.760513', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (109, 'test@mail.com', 'Test', 'User Demo', 'ESTUDIANTE', '2025-11-24 12:28:48.368053', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (110, 'a1@mail.com', 'A1', 'Test 1', 'ESTUDIANTE', '2025-11-24 12:36:41.015479', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (111, 'a2@mail.com', 'A2', 'Test 2', 'ESTUDIANTE', '2025-11-24 12:36:41.099862', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (112, 'a3@mail.com', 'A3', 'Test 3', 'ESTUDIANTE', '2025-11-24 12:36:41.103342', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (113, 'a4@mail.com', 'A4', 'Test 4', 'ESTUDIANTE', '2025-11-24 12:36:41.106334', 'ACTIVO', 'password_temporal_123', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (117, 'estudiante_74_167_1@temp.com', 'Estudiante 1', '', 'ESTUDIANTE', '2025-11-30 04:04:29.423557', NULL, '', true, false, false, NULL);
INSERT INTO public.api_usuario VALUES (118, 'estudiante_74_168_1@temp.com', 'Estudiante 1', '', 'ESTUDIANTE', '2025-11-30 04:04:31.448471', NULL, '', true, false, false, NULL);


--
-- TOC entry 5608 (class 0 OID 74084)
-- Dependencies: 300
-- Data for Name: api_usuario_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5610 (class 0 OID 74099)
-- Dependencies: 302
-- Data for Name: api_usuario_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5530 (class 0 OID 49163)
-- Dependencies: 222
-- Data for Name: atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5593 (class 0 OID 57379)
-- Dependencies: 285
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5595 (class 0 OID 57389)
-- Dependencies: 287
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5591 (class 0 OID 57369)
-- Dependencies: 283
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.auth_permission VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO public.auth_permission VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO public.auth_permission VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO public.auth_permission VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO public.auth_permission VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO public.auth_permission VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO public.auth_permission VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO public.auth_permission VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO public.auth_permission VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO public.auth_permission VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO public.auth_permission VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO public.auth_permission VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO public.auth_permission VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO public.auth_permission VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO public.auth_permission VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO public.auth_permission VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO public.auth_permission VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO public.auth_permission VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO public.auth_permission VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO public.auth_permission VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO public.auth_permission VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO public.auth_permission VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO public.auth_permission VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO public.auth_permission VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO public.auth_permission VALUES (25, 'Can add carrera', 7, 'add_carrera');
INSERT INTO public.auth_permission VALUES (26, 'Can change carrera', 7, 'change_carrera');
INSERT INTO public.auth_permission VALUES (27, 'Can delete carrera', 7, 'delete_carrera');
INSERT INTO public.auth_permission VALUES (28, 'Can view carrera', 7, 'view_carrera');
INSERT INTO public.auth_permission VALUES (29, 'Can add token', 8, 'add_token');
INSERT INTO public.auth_permission VALUES (30, 'Can change token', 8, 'change_token');
INSERT INTO public.auth_permission VALUES (31, 'Can delete token', 8, 'delete_token');
INSERT INTO public.auth_permission VALUES (32, 'Can view token', 8, 'view_token');
INSERT INTO public.auth_permission VALUES (33, 'Can add curso estudiante', 9, 'add_cursoestudiante');
INSERT INTO public.auth_permission VALUES (34, 'Can change curso estudiante', 9, 'change_cursoestudiante');
INSERT INTO public.auth_permission VALUES (35, 'Can delete curso estudiante', 9, 'delete_cursoestudiante');
INSERT INTO public.auth_permission VALUES (36, 'Can view curso estudiante', 9, 'view_cursoestudiante');
INSERT INTO public.auth_permission VALUES (37, 'Can add categoria atributo', 10, 'add_categoriaatributo');
INSERT INTO public.auth_permission VALUES (38, 'Can change categoria atributo', 10, 'change_categoriaatributo');
INSERT INTO public.auth_permission VALUES (39, 'Can delete categoria atributo', 10, 'delete_categoriaatributo');
INSERT INTO public.auth_permission VALUES (40, 'Can view categoria atributo', 10, 'view_categoriaatributo');
INSERT INTO public.auth_permission VALUES (41, 'Can add partida usuario', 11, 'add_partidausuario');
INSERT INTO public.auth_permission VALUES (42, 'Can change partida usuario', 11, 'change_partidausuario');
INSERT INTO public.auth_permission VALUES (43, 'Can delete partida usuario', 11, 'delete_partidausuario');
INSERT INTO public.auth_permission VALUES (44, 'Can view partida usuario', 11, 'view_partidausuario');
INSERT INTO public.auth_permission VALUES (45, 'Can add usuario', 12, 'add_usuario');
INSERT INTO public.auth_permission VALUES (46, 'Can change usuario', 12, 'change_usuario');
INSERT INTO public.auth_permission VALUES (47, 'Can delete usuario', 12, 'delete_usuario');
INSERT INTO public.auth_permission VALUES (48, 'Can view usuario', 12, 'view_usuario');
INSERT INTO public.auth_permission VALUES (49, 'Can add ranking', 13, 'add_ranking');
INSERT INTO public.auth_permission VALUES (50, 'Can change ranking', 13, 'change_ranking');
INSERT INTO public.auth_permission VALUES (51, 'Can delete ranking', 13, 'delete_ranking');
INSERT INTO public.auth_permission VALUES (52, 'Can view ranking', 13, 'view_ranking');
INSERT INTO public.auth_permission VALUES (53, 'Can add facultad', 14, 'add_facultad');
INSERT INTO public.auth_permission VALUES (54, 'Can change facultad', 14, 'change_facultad');
INSERT INTO public.auth_permission VALUES (55, 'Can delete facultad', 14, 'delete_facultad');
INSERT INTO public.auth_permission VALUES (56, 'Can view facultad', 14, 'view_facultad');
INSERT INTO public.auth_permission VALUES (57, 'Can add solucion lego', 15, 'add_solucionlego');
INSERT INTO public.auth_permission VALUES (58, 'Can change solucion lego', 15, 'change_solucionlego');
INSERT INTO public.auth_permission VALUES (59, 'Can delete solucion lego', 15, 'delete_solucionlego');
INSERT INTO public.auth_permission VALUES (60, 'Can view solucion lego', 15, 'view_solucionlego');
INSERT INTO public.auth_permission VALUES (61, 'Can add etapa', 16, 'add_etapa');
INSERT INTO public.auth_permission VALUES (62, 'Can change etapa', 16, 'change_etapa');
INSERT INTO public.auth_permission VALUES (63, 'Can delete etapa', 16, 'delete_etapa');
INSERT INTO public.auth_permission VALUES (64, 'Can view etapa', 16, 'view_etapa');
INSERT INTO public.auth_permission VALUES (65, 'Can add evaluacion pitch', 17, 'add_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (66, 'Can change evaluacion pitch', 17, 'change_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (67, 'Can delete evaluacion pitch', 17, 'delete_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (68, 'Can view evaluacion pitch', 17, 'view_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (69, 'Can add configuracion valor', 18, 'add_configuracionvalor');
INSERT INTO public.auth_permission VALUES (70, 'Can change configuracion valor', 18, 'change_configuracionvalor');
INSERT INTO public.auth_permission VALUES (71, 'Can delete configuracion valor', 18, 'delete_configuracionvalor');
INSERT INTO public.auth_permission VALUES (72, 'Can view configuracion valor', 18, 'view_configuracionvalor');
INSERT INTO public.auth_permission VALUES (73, 'Can add ganas emprender', 19, 'add_ganasemprender');
INSERT INTO public.auth_permission VALUES (74, 'Can change ganas emprender', 19, 'change_ganasemprender');
INSERT INTO public.auth_permission VALUES (75, 'Can delete ganas emprender', 19, 'delete_ganasemprender');
INSERT INTO public.auth_permission VALUES (76, 'Can view ganas emprender', 19, 'view_ganasemprender');
INSERT INTO public.auth_permission VALUES (77, 'Can add estudiante', 20, 'add_estudiante');
INSERT INTO public.auth_permission VALUES (78, 'Can change estudiante', 20, 'change_estudiante');
INSERT INTO public.auth_permission VALUES (79, 'Can delete estudiante', 20, 'delete_estudiante');
INSERT INTO public.auth_permission VALUES (80, 'Can view estudiante', 20, 'view_estudiante');
INSERT INTO public.auth_permission VALUES (81, 'Can add persona', 21, 'add_persona');
INSERT INTO public.auth_permission VALUES (82, 'Can change persona', 21, 'change_persona');
INSERT INTO public.auth_permission VALUES (83, 'Can delete persona', 21, 'delete_persona');
INSERT INTO public.auth_permission VALUES (84, 'Can view persona', 21, 'view_persona');
INSERT INTO public.auth_permission VALUES (85, 'Can add curso', 22, 'add_curso');
INSERT INTO public.auth_permission VALUES (86, 'Can change curso', 22, 'change_curso');
INSERT INTO public.auth_permission VALUES (87, 'Can delete curso', 22, 'delete_curso');
INSERT INTO public.auth_permission VALUES (88, 'Can view curso', 22, 'view_curso');
INSERT INTO public.auth_permission VALUES (89, 'Can add video', 23, 'add_video');
INSERT INTO public.auth_permission VALUES (90, 'Can change video', 23, 'change_video');
INSERT INTO public.auth_permission VALUES (91, 'Can delete video', 23, 'delete_video');
INSERT INTO public.auth_permission VALUES (92, 'Can view video', 23, 'view_video');
INSERT INTO public.auth_permission VALUES (93, 'Can add profesor', 24, 'add_profesor');
INSERT INTO public.auth_permission VALUES (94, 'Can change profesor', 24, 'change_profesor');
INSERT INTO public.auth_permission VALUES (95, 'Can delete profesor', 24, 'delete_profesor');
INSERT INTO public.auth_permission VALUES (96, 'Can view profesor', 24, 'view_profesor');
INSERT INTO public.auth_permission VALUES (97, 'Can add administrador', 25, 'add_administrador');
INSERT INTO public.auth_permission VALUES (98, 'Can change administrador', 25, 'change_administrador');
INSERT INTO public.auth_permission VALUES (99, 'Can delete administrador', 25, 'delete_administrador');
INSERT INTO public.auth_permission VALUES (100, 'Can view administrador', 25, 'view_administrador');
INSERT INTO public.auth_permission VALUES (101, 'Can add configuracion', 26, 'add_configuracion');
INSERT INTO public.auth_permission VALUES (102, 'Can change configuracion', 26, 'change_configuracion');
INSERT INTO public.auth_permission VALUES (103, 'Can delete configuracion', 26, 'delete_configuracion');
INSERT INTO public.auth_permission VALUES (104, 'Can view configuracion', 26, 'view_configuracion');
INSERT INTO public.auth_permission VALUES (105, 'Can add evaluacion autoencuesta', 27, 'add_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (106, 'Can change evaluacion autoencuesta', 27, 'change_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (107, 'Can delete evaluacion autoencuesta', 27, 'delete_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (108, 'Can view evaluacion autoencuesta', 27, 'view_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (109, 'Can add tipo curso', 28, 'add_tipocurso');
INSERT INTO public.auth_permission VALUES (110, 'Can change tipo curso', 28, 'change_tipocurso');
INSERT INTO public.auth_permission VALUES (111, 'Can delete tipo curso', 28, 'delete_tipocurso');
INSERT INTO public.auth_permission VALUES (112, 'Can view tipo curso', 28, 'view_tipocurso');
INSERT INTO public.auth_permission VALUES (113, 'Can add tema desafio', 29, 'add_temadesafio');
INSERT INTO public.auth_permission VALUES (114, 'Can change tema desafio', 29, 'change_temadesafio');
INSERT INTO public.auth_permission VALUES (115, 'Can delete tema desafio', 29, 'delete_temadesafio');
INSERT INTO public.auth_permission VALUES (116, 'Can view tema desafio', 29, 'view_temadesafio');
INSERT INTO public.auth_permission VALUES (117, 'Can add partida', 30, 'add_partida');
INSERT INTO public.auth_permission VALUES (118, 'Can change partida', 30, 'change_partida');
INSERT INTO public.auth_permission VALUES (119, 'Can delete partida', 30, 'delete_partida');
INSERT INTO public.auth_permission VALUES (120, 'Can view partida', 30, 'view_partida');
INSERT INTO public.auth_permission VALUES (121, 'Can add equipo desafio', 31, 'add_equipodesafio');
INSERT INTO public.auth_permission VALUES (122, 'Can change equipo desafio', 31, 'change_equipodesafio');
INSERT INTO public.auth_permission VALUES (123, 'Can delete equipo desafio', 31, 'delete_equipodesafio');
INSERT INTO public.auth_permission VALUES (124, 'Can view equipo desafio', 31, 'view_equipodesafio');
INSERT INTO public.auth_permission VALUES (125, 'Can add atributo', 32, 'add_atributo');
INSERT INTO public.auth_permission VALUES (126, 'Can change atributo', 32, 'change_atributo');
INSERT INTO public.auth_permission VALUES (127, 'Can delete atributo', 32, 'delete_atributo');
INSERT INTO public.auth_permission VALUES (128, 'Can view atributo', 32, 'view_atributo');
INSERT INTO public.auth_permission VALUES (129, 'Can add equipo', 33, 'add_equipo');
INSERT INTO public.auth_permission VALUES (130, 'Can change equipo', 33, 'change_equipo');
INSERT INTO public.auth_permission VALUES (131, 'Can delete equipo', 33, 'delete_equipo');
INSERT INTO public.auth_permission VALUES (132, 'Can view equipo', 33, 'view_equipo');
INSERT INTO public.auth_permission VALUES (133, 'Can add lista participante', 34, 'add_listaparticipante');
INSERT INTO public.auth_permission VALUES (134, 'Can change lista participante', 34, 'change_listaparticipante');
INSERT INTO public.auth_permission VALUES (135, 'Can delete lista participante', 34, 'delete_listaparticipante');
INSERT INTO public.auth_permission VALUES (136, 'Can view lista participante', 34, 'view_listaparticipante');
INSERT INTO public.auth_permission VALUES (137, 'Can add instruccion etapa', 35, 'add_instruccionetapa');
INSERT INTO public.auth_permission VALUES (138, 'Can change instruccion etapa', 35, 'change_instruccionetapa');
INSERT INTO public.auth_permission VALUES (139, 'Can delete instruccion etapa', 35, 'delete_instruccionetapa');
INSERT INTO public.auth_permission VALUES (140, 'Can view instruccion etapa', 35, 'view_instruccionetapa');
INSERT INTO public.auth_permission VALUES (141, 'Can add desafio', 36, 'add_desafio');
INSERT INTO public.auth_permission VALUES (142, 'Can change desafio', 36, 'change_desafio');
INSERT INTO public.auth_permission VALUES (143, 'Can delete desafio', 36, 'delete_desafio');
INSERT INTO public.auth_permission VALUES (144, 'Can view desafio', 36, 'view_desafio');
INSERT INTO public.auth_permission VALUES (145, 'Can add administrador', 37, 'add_administrador');
INSERT INTO public.auth_permission VALUES (146, 'Can change administrador', 37, 'change_administrador');
INSERT INTO public.auth_permission VALUES (147, 'Can delete administrador', 37, 'delete_administrador');
INSERT INTO public.auth_permission VALUES (148, 'Can view administrador', 37, 'view_administrador');
INSERT INTO public.auth_permission VALUES (149, 'Can add atributo', 38, 'add_atributo');
INSERT INTO public.auth_permission VALUES (150, 'Can change atributo', 38, 'change_atributo');
INSERT INTO public.auth_permission VALUES (151, 'Can delete atributo', 38, 'delete_atributo');
INSERT INTO public.auth_permission VALUES (152, 'Can view atributo', 38, 'view_atributo');
INSERT INTO public.auth_permission VALUES (153, 'Can add carrera', 39, 'add_carrera');
INSERT INTO public.auth_permission VALUES (154, 'Can change carrera', 39, 'change_carrera');
INSERT INTO public.auth_permission VALUES (155, 'Can delete carrera', 39, 'delete_carrera');
INSERT INTO public.auth_permission VALUES (156, 'Can view carrera', 39, 'view_carrera');
INSERT INTO public.auth_permission VALUES (157, 'Can add categoria atributo', 40, 'add_categoriaatributo');
INSERT INTO public.auth_permission VALUES (158, 'Can change categoria atributo', 40, 'change_categoriaatributo');
INSERT INTO public.auth_permission VALUES (159, 'Can delete categoria atributo', 40, 'delete_categoriaatributo');
INSERT INTO public.auth_permission VALUES (160, 'Can view categoria atributo', 40, 'view_categoriaatributo');
INSERT INTO public.auth_permission VALUES (161, 'Can add configuracion', 41, 'add_configuracion');
INSERT INTO public.auth_permission VALUES (162, 'Can change configuracion', 41, 'change_configuracion');
INSERT INTO public.auth_permission VALUES (163, 'Can delete configuracion', 41, 'delete_configuracion');
INSERT INTO public.auth_permission VALUES (164, 'Can view configuracion', 41, 'view_configuracion');
INSERT INTO public.auth_permission VALUES (165, 'Can add configuracion valor', 42, 'add_configuracionvalor');
INSERT INTO public.auth_permission VALUES (166, 'Can change configuracion valor', 42, 'change_configuracionvalor');
INSERT INTO public.auth_permission VALUES (167, 'Can delete configuracion valor', 42, 'delete_configuracionvalor');
INSERT INTO public.auth_permission VALUES (168, 'Can view configuracion valor', 42, 'view_configuracionvalor');
INSERT INTO public.auth_permission VALUES (169, 'Can add curso', 43, 'add_curso');
INSERT INTO public.auth_permission VALUES (170, 'Can change curso', 43, 'change_curso');
INSERT INTO public.auth_permission VALUES (171, 'Can delete curso', 43, 'delete_curso');
INSERT INTO public.auth_permission VALUES (172, 'Can view curso', 43, 'view_curso');
INSERT INTO public.auth_permission VALUES (173, 'Can add curso estudiante', 44, 'add_cursoestudiante');
INSERT INTO public.auth_permission VALUES (174, 'Can change curso estudiante', 44, 'change_cursoestudiante');
INSERT INTO public.auth_permission VALUES (175, 'Can delete curso estudiante', 44, 'delete_cursoestudiante');
INSERT INTO public.auth_permission VALUES (176, 'Can view curso estudiante', 44, 'view_cursoestudiante');
INSERT INTO public.auth_permission VALUES (177, 'Can add desafio', 45, 'add_desafio');
INSERT INTO public.auth_permission VALUES (178, 'Can change desafio', 45, 'change_desafio');
INSERT INTO public.auth_permission VALUES (179, 'Can delete desafio', 45, 'delete_desafio');
INSERT INTO public.auth_permission VALUES (180, 'Can view desafio', 45, 'view_desafio');
INSERT INTO public.auth_permission VALUES (181, 'Can add estudiante', 46, 'add_estudiante');
INSERT INTO public.auth_permission VALUES (182, 'Can change estudiante', 46, 'change_estudiante');
INSERT INTO public.auth_permission VALUES (183, 'Can delete estudiante', 46, 'delete_estudiante');
INSERT INTO public.auth_permission VALUES (184, 'Can view estudiante', 46, 'view_estudiante');
INSERT INTO public.auth_permission VALUES (185, 'Can add etapa', 47, 'add_etapa');
INSERT INTO public.auth_permission VALUES (186, 'Can change etapa', 47, 'change_etapa');
INSERT INTO public.auth_permission VALUES (187, 'Can delete etapa', 47, 'delete_etapa');
INSERT INTO public.auth_permission VALUES (188, 'Can view etapa', 47, 'view_etapa');
INSERT INTO public.auth_permission VALUES (189, 'Can add evaluacion autoencuesta', 48, 'add_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (190, 'Can change evaluacion autoencuesta', 48, 'change_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (191, 'Can delete evaluacion autoencuesta', 48, 'delete_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (192, 'Can view evaluacion autoencuesta', 48, 'view_evaluacionautoencuesta');
INSERT INTO public.auth_permission VALUES (193, 'Can add evaluacion pitch', 49, 'add_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (194, 'Can change evaluacion pitch', 49, 'change_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (195, 'Can delete evaluacion pitch', 49, 'delete_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (196, 'Can view evaluacion pitch', 49, 'view_evaluacionpitch');
INSERT INTO public.auth_permission VALUES (197, 'Can add facultad', 50, 'add_facultad');
INSERT INTO public.auth_permission VALUES (198, 'Can change facultad', 50, 'change_facultad');
INSERT INTO public.auth_permission VALUES (199, 'Can delete facultad', 50, 'delete_facultad');
INSERT INTO public.auth_permission VALUES (200, 'Can view facultad', 50, 'view_facultad');
INSERT INTO public.auth_permission VALUES (201, 'Can add ganas emprender', 51, 'add_ganasemprender');
INSERT INTO public.auth_permission VALUES (202, 'Can change ganas emprender', 51, 'change_ganasemprender');
INSERT INTO public.auth_permission VALUES (203, 'Can delete ganas emprender', 51, 'delete_ganasemprender');
INSERT INTO public.auth_permission VALUES (204, 'Can view ganas emprender', 51, 'view_ganasemprender');
INSERT INTO public.auth_permission VALUES (205, 'Can add instruccion etapa', 52, 'add_instruccionetapa');
INSERT INTO public.auth_permission VALUES (206, 'Can change instruccion etapa', 52, 'change_instruccionetapa');
INSERT INTO public.auth_permission VALUES (207, 'Can delete instruccion etapa', 52, 'delete_instruccionetapa');
INSERT INTO public.auth_permission VALUES (208, 'Can view instruccion etapa', 52, 'view_instruccionetapa');
INSERT INTO public.auth_permission VALUES (209, 'Can add lista participante', 53, 'add_listaparticipante');
INSERT INTO public.auth_permission VALUES (210, 'Can change lista participante', 53, 'change_listaparticipante');
INSERT INTO public.auth_permission VALUES (211, 'Can delete lista participante', 53, 'delete_listaparticipante');
INSERT INTO public.auth_permission VALUES (212, 'Can view lista participante', 53, 'view_listaparticipante');
INSERT INTO public.auth_permission VALUES (213, 'Can add partida', 54, 'add_partida');
INSERT INTO public.auth_permission VALUES (214, 'Can change partida', 54, 'change_partida');
INSERT INTO public.auth_permission VALUES (215, 'Can delete partida', 54, 'delete_partida');
INSERT INTO public.auth_permission VALUES (216, 'Can view partida', 54, 'view_partida');
INSERT INTO public.auth_permission VALUES (217, 'Can add partida usuario', 55, 'add_partidausuario');
INSERT INTO public.auth_permission VALUES (218, 'Can change partida usuario', 55, 'change_partidausuario');
INSERT INTO public.auth_permission VALUES (219, 'Can delete partida usuario', 55, 'delete_partidausuario');
INSERT INTO public.auth_permission VALUES (220, 'Can view partida usuario', 55, 'view_partidausuario');
INSERT INTO public.auth_permission VALUES (221, 'Can add persona', 56, 'add_persona');
INSERT INTO public.auth_permission VALUES (222, 'Can change persona', 56, 'change_persona');
INSERT INTO public.auth_permission VALUES (223, 'Can delete persona', 56, 'delete_persona');
INSERT INTO public.auth_permission VALUES (224, 'Can view persona', 56, 'view_persona');
INSERT INTO public.auth_permission VALUES (225, 'Can add profesor', 57, 'add_profesor');
INSERT INTO public.auth_permission VALUES (226, 'Can change profesor', 57, 'change_profesor');
INSERT INTO public.auth_permission VALUES (227, 'Can delete profesor', 57, 'delete_profesor');
INSERT INTO public.auth_permission VALUES (228, 'Can view profesor', 57, 'view_profesor');
INSERT INTO public.auth_permission VALUES (229, 'Can add ranking', 58, 'add_ranking');
INSERT INTO public.auth_permission VALUES (230, 'Can change ranking', 58, 'change_ranking');
INSERT INTO public.auth_permission VALUES (231, 'Can delete ranking', 58, 'delete_ranking');
INSERT INTO public.auth_permission VALUES (232, 'Can view ranking', 58, 'view_ranking');
INSERT INTO public.auth_permission VALUES (233, 'Can add solucion lego', 59, 'add_solucionlego');
INSERT INTO public.auth_permission VALUES (234, 'Can change solucion lego', 59, 'change_solucionlego');
INSERT INTO public.auth_permission VALUES (235, 'Can delete solucion lego', 59, 'delete_solucionlego');
INSERT INTO public.auth_permission VALUES (236, 'Can view solucion lego', 59, 'view_solucionlego');
INSERT INTO public.auth_permission VALUES (237, 'Can add tema desafio', 60, 'add_temadesafio');
INSERT INTO public.auth_permission VALUES (238, 'Can change tema desafio', 60, 'change_temadesafio');
INSERT INTO public.auth_permission VALUES (239, 'Can delete tema desafio', 60, 'delete_temadesafio');
INSERT INTO public.auth_permission VALUES (240, 'Can view tema desafio', 60, 'view_temadesafio');
INSERT INTO public.auth_permission VALUES (241, 'Can add tipo curso', 61, 'add_tipocurso');
INSERT INTO public.auth_permission VALUES (242, 'Can change tipo curso', 61, 'change_tipocurso');
INSERT INTO public.auth_permission VALUES (243, 'Can delete tipo curso', 61, 'delete_tipocurso');
INSERT INTO public.auth_permission VALUES (244, 'Can view tipo curso', 61, 'view_tipocurso');
INSERT INTO public.auth_permission VALUES (245, 'Can add token', 62, 'add_token');
INSERT INTO public.auth_permission VALUES (246, 'Can change token', 62, 'change_token');
INSERT INTO public.auth_permission VALUES (247, 'Can delete token', 62, 'delete_token');
INSERT INTO public.auth_permission VALUES (248, 'Can view token', 62, 'view_token');
INSERT INTO public.auth_permission VALUES (249, 'Can add usuario', 63, 'add_usuario');
INSERT INTO public.auth_permission VALUES (250, 'Can change usuario', 63, 'change_usuario');
INSERT INTO public.auth_permission VALUES (251, 'Can delete usuario', 63, 'delete_usuario');
INSERT INTO public.auth_permission VALUES (252, 'Can view usuario', 63, 'view_usuario');
INSERT INTO public.auth_permission VALUES (253, 'Can add video', 64, 'add_video');
INSERT INTO public.auth_permission VALUES (254, 'Can change video', 64, 'change_video');
INSERT INTO public.auth_permission VALUES (255, 'Can delete video', 64, 'delete_video');
INSERT INTO public.auth_permission VALUES (256, 'Can view video', 64, 'view_video');
INSERT INTO public.auth_permission VALUES (257, 'Can add vista detalle equipo', 65, 'add_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (258, 'Can change vista detalle equipo', 65, 'change_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (259, 'Can delete vista detalle equipo', 65, 'delete_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (260, 'Can view vista detalle equipo', 65, 'view_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (261, 'Can add equipo', 66, 'add_equipo');
INSERT INTO public.auth_permission VALUES (262, 'Can change equipo', 66, 'change_equipo');
INSERT INTO public.auth_permission VALUES (263, 'Can delete equipo', 66, 'delete_equipo');
INSERT INTO public.auth_permission VALUES (264, 'Can view equipo', 66, 'view_equipo');
INSERT INTO public.auth_permission VALUES (265, 'Can add equipo desafio', 67, 'add_equipodesafio');
INSERT INTO public.auth_permission VALUES (266, 'Can change equipo desafio', 67, 'change_equipodesafio');
INSERT INTO public.auth_permission VALUES (267, 'Can delete equipo desafio', 67, 'delete_equipodesafio');
INSERT INTO public.auth_permission VALUES (268, 'Can view equipo desafio', 67, 'view_equipodesafio');
INSERT INTO public.auth_permission VALUES (269, 'Can add Token', 68, 'add_token');
INSERT INTO public.auth_permission VALUES (270, 'Can change Token', 68, 'change_token');
INSERT INTO public.auth_permission VALUES (271, 'Can delete Token', 68, 'delete_token');
INSERT INTO public.auth_permission VALUES (272, 'Can view Token', 68, 'view_token');
INSERT INTO public.auth_permission VALUES (273, 'Can add Token', 69, 'add_tokenproxy');
INSERT INTO public.auth_permission VALUES (274, 'Can change Token', 69, 'change_tokenproxy');
INSERT INTO public.auth_permission VALUES (275, 'Can delete Token', 69, 'delete_tokenproxy');
INSERT INTO public.auth_permission VALUES (276, 'Can view Token', 69, 'view_tokenproxy');
INSERT INTO public.auth_permission VALUES (277, 'Can add progreso etapa', 70, 'add_progresoetapa');
INSERT INTO public.auth_permission VALUES (278, 'Can change progreso etapa', 70, 'change_progresoetapa');
INSERT INTO public.auth_permission VALUES (279, 'Can delete progreso etapa', 70, 'delete_progresoetapa');
INSERT INTO public.auth_permission VALUES (280, 'Can view progreso etapa', 70, 'view_progresoetapa');
INSERT INTO public.auth_permission VALUES (281, 'Can add vista detalle equipo', 71, 'add_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (282, 'Can change vista detalle equipo', 71, 'change_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (283, 'Can delete vista detalle equipo', 71, 'delete_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (284, 'Can view vista detalle equipo', 71, 'view_vistadetalleequipo');
INSERT INTO public.auth_permission VALUES (285, 'Can add conexion partida', 72, 'add_conexionpartida');
INSERT INTO public.auth_permission VALUES (286, 'Can change conexion partida', 72, 'change_conexionpartida');
INSERT INTO public.auth_permission VALUES (287, 'Can delete conexion partida', 72, 'delete_conexionpartida');
INSERT INTO public.auth_permission VALUES (288, 'Can view conexion partida', 72, 'view_conexionpartida');
INSERT INTO public.auth_permission VALUES (289, 'Can add estado partida', 73, 'add_estadopartida');
INSERT INTO public.auth_permission VALUES (290, 'Can change estado partida', 73, 'change_estadopartida');
INSERT INTO public.auth_permission VALUES (291, 'Can delete estado partida', 73, 'delete_estadopartida');
INSERT INTO public.auth_permission VALUES (292, 'Can view estado partida', 73, 'view_estadopartida');


--
-- TOC entry 5597 (class 0 OID 57398)
-- Dependencies: 289
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.auth_user VALUES (1, 'pbkdf2_sha256$1000000$Lzvl79qvi1g8q7haCRUcWv$b51F5jhvhwBpeF/BRvqLNAPa/ntx8+zInTM7S+rWAWo=', '2025-10-25 15:32:31.829619-03', true, 'Laura', '', '', 'Laura@udd.cl', true, true, '2025-10-25 15:28:31.58239-03');
INSERT INTO public.auth_user VALUES (2, 'pbkdf2_sha256$1000000$GmevnN8D3SINJ8VoyhuZdM$lzD7UzIi4HxASgACYYbLx2xrUHdRlzSZFCc1fBlKdA8=', '2025-11-05 00:20:46.579178-03', true, 'administrador', '', '', 'admin@udd.cl', true, true, '2025-11-05 00:20:17.602472-03');
INSERT INTO public.auth_user VALUES (3, 'pbkdf2_sha256$1000000$hSGkehSkiwNmkcpL4yOmaL$gbdrbq2+3+8FVvPxBYL4Ukr51jbsPGOCB0AHiSHGJcM=', '2025-11-14 21:40:41.196963-03', true, 'admin', '', '', 'admin@gmail.com', true, true, '2025-11-14 21:38:44.622697-03');


--
-- TOC entry 5599 (class 0 OID 57417)
-- Dependencies: 291
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5601 (class 0 OID 57426)
-- Dependencies: 293
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5611 (class 0 OID 82221)
-- Dependencies: 304
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authtoken_token VALUES ('18c402745b7577166f6fa509e67cb2737e5ffc7a', '2025-11-15 16:21:13.796049-03', 20);
INSERT INTO public.authtoken_token VALUES ('9de11e0fa92442db62eab9dea5bf81082a88d317', '2025-11-15 16:23:53.424103-03', 18);
INSERT INTO public.authtoken_token VALUES ('ddfb180e1541c04be19b013d920d148b42208dd4', '2025-11-15 16:25:48.477995-03', 15);


--
-- TOC entry 5532 (class 0 OID 49173)
-- Dependencies: 224
-- Data for Name: carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.carrera VALUES (11, 14, 'Carrera de 4bb259f9f4', 'ACTIVO');
INSERT INTO public.carrera VALUES (12, 14, 'Carrera de e00c0ad633', 'ACTIVO');
INSERT INTO public.carrera VALUES (13, 13, 'Carrera de d0c971bf5b', 'ACTIVO');
INSERT INTO public.carrera VALUES (14, 15, 'Carrera de 3397ef3136', 'ACTIVO');
INSERT INTO public.carrera VALUES (15, 14, 'Carrera de d358976667', 'ACTIVO');
INSERT INTO public.carrera VALUES (16, 11, 'Carrera de e756f5e315', 'ACTIVO');
INSERT INTO public.carrera VALUES (17, 12, 'Carrera de ece4403d6f', 'ACTIVO');
INSERT INTO public.carrera VALUES (18, 11, 'Carrera de 8443a903e3', 'ACTIVO');
INSERT INTO public.carrera VALUES (19, 13, 'Carrera de 2c7dd3dceb', 'ACTIVO');
INSERT INTO public.carrera VALUES (20, 12, 'Carrera de 2ce100e415', 'ACTIVO');


--
-- TOC entry 5534 (class 0 OID 49185)
-- Dependencies: 226
-- Data for Name: categoria_atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categoria_atributo VALUES (11, 'Creatividad');
INSERT INTO public.categoria_atributo VALUES (12, 'Comunicación Efectiva');
INSERT INTO public.categoria_atributo VALUES (13, 'Liderazgo');
INSERT INTO public.categoria_atributo VALUES (14, 'Resolución de Problemas');
INSERT INTO public.categoria_atributo VALUES (15, 'Trabajo en Equipo');


--
-- TOC entry 5613 (class 0 OID 90485)
-- Dependencies: 306
-- Data for Name: conexion_partida; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.conexion_partida VALUES (1, '4172861', '2025-11-30 01:04:29.693197-03', true, 167, 74, 117);
INSERT INTO public.conexion_partida VALUES (2, '4172862', '2025-11-30 01:04:31.454253-03', true, 168, 74, 118);
INSERT INTO public.conexion_partida VALUES (4, '3963572', '2025-11-30 01:16:30.198919-03', true, 172, 75, NULL);
INSERT INTO public.conexion_partida VALUES (5, '3963573', '2025-11-30 01:16:41.667506-03', true, 173, 75, NULL);
INSERT INTO public.conexion_partida VALUES (3, '3963571', '2025-11-30 01:15:58.780779-03', true, 171, 75, NULL);
INSERT INTO public.conexion_partida VALUES (6, '6978591', '2025-11-30 02:04:28.599532-03', true, 174, 76, NULL);
INSERT INTO public.conexion_partida VALUES (8, '6978592', '2025-11-30 02:04:42.619846-03', true, 175, 76, NULL);
INSERT INTO public.conexion_partida VALUES (7, '6978593', '2025-11-30 02:04:33.91296-03', true, 176, 76, NULL);
INSERT INTO public.conexion_partida VALUES (9, '6978594', '2025-11-30 02:19:00.218732-03', true, 177, 76, NULL);
INSERT INTO public.conexion_partida VALUES (10, '9071651', '2025-11-30 02:30:52.716668-03', true, 178, 77, NULL);
INSERT INTO public.conexion_partida VALUES (11, '9071652', '2025-11-30 02:30:59.816609-03', true, 179, 77, NULL);
INSERT INTO public.conexion_partida VALUES (12, '9071653', '2025-11-30 02:31:07.667302-03', true, 180, 77, NULL);
INSERT INTO public.conexion_partida VALUES (13, '9071654', '2025-11-30 02:36:09.360535-03', true, 181, 77, NULL);
INSERT INTO public.conexion_partida VALUES (16, '2138771', '2025-11-30 02:45:38.702411-03', true, 182, 78, NULL);
INSERT INTO public.conexion_partida VALUES (18, '2138772', '2025-11-30 02:45:38.741527-03', true, 183, 78, NULL);
INSERT INTO public.conexion_partida VALUES (14, '2138773', '2025-11-30 02:45:38.740908-03', true, 184, 78, NULL);
INSERT INTO public.conexion_partida VALUES (19, '2138774', '2025-11-30 02:46:26.982908-03', true, 185, 78, NULL);
INSERT INTO public.conexion_partida VALUES (20, '5211251', '2025-11-30 14:53:37.707491-03', true, 186, 79, NULL);


--
-- TOC entry 5536 (class 0 OID 49194)
-- Dependencies: 228
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.configuracion VALUES (11, 'Tiempo máximo por etapa', 'INTEGER');
INSERT INTO public.configuracion VALUES (12, 'Permitir registro de nuevos usuarios', 'BOOLEAN');
INSERT INTO public.configuracion VALUES (13, 'Mensaje de bienvenida del sistema', 'TEXT');
INSERT INTO public.configuracion VALUES (14, 'Versión del sistema', 'VARCHAR');


--
-- TOC entry 5538 (class 0 OID 49204)
-- Dependencies: 230
-- Data for Name: configuracion_valor; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5540 (class 0 OID 49217)
-- Dependencies: 232
-- Data for Name: curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.curso VALUES (1, 16, 12, 'SIG978', 'Curso de da944ce280f66e3', NULL);
INSERT INTO public.curso VALUES (2, 18, 11, 'SIG326', 'Curso de 76e985311a116c1', NULL);
INSERT INTO public.curso VALUES (3, 11, 13, 'SIG138', 'Curso de 0dd04b38abcbd3a', NULL);
INSERT INTO public.curso VALUES (4, 14, 13, 'SIG745', 'Curso de 382f7582150787f', NULL);
INSERT INTO public.curso VALUES (5, 16, 11, 'SIG895', 'Curso de 9078b98a29d1407', NULL);
INSERT INTO public.curso VALUES (6, 15, 14, 'SIG143', 'Curso de a432bbb6af9d11b', NULL);
INSERT INTO public.curso VALUES (7, 13, 13, 'SIG463', 'Curso de 461832b9dd96a35', NULL);
INSERT INTO public.curso VALUES (8, 16, 12, 'SIG665', 'Curso de 89134499b1220f6', NULL);
INSERT INTO public.curso VALUES (9, 12, 11, 'SIG951', 'Curso de 741c81d89c6da61', NULL);
INSERT INTO public.curso VALUES (10, 14, 14, 'SIG293', 'Curso de f8233f44afd057a', NULL);
INSERT INTO public.curso VALUES (11, 13, 11, 'SIG617', 'Curso de e3d85f3ac997e0d', NULL);
INSERT INTO public.curso VALUES (12, 13, 13, 'SIG999', 'Curso de 1b1c6a45246d076', NULL);
INSERT INTO public.curso VALUES (13, 13, 13, 'SIG477', 'Curso de 74701ff0c893874', NULL);
INSERT INTO public.curso VALUES (14, 17, 11, 'SIG569', 'Curso de ff0ac7b67fe3ec9', NULL);
INSERT INTO public.curso VALUES (15, 17, 11, 'SIG446', 'Curso de 689430b8df98cc2', NULL);
INSERT INTO public.curso VALUES (16, 16, 13, 'SIG755', 'Curso de a16e36e63060471', NULL);
INSERT INTO public.curso VALUES (17, 16, 11, 'SIG688', 'Curso de 3087ad307a04df6', NULL);
INSERT INTO public.curso VALUES (18, 18, 14, 'SIG860', 'Curso de cc6e0f380c393fc', NULL);
INSERT INTO public.curso VALUES (19, 18, 13, 'SIG656', 'Curso de 07194ea4c1f4e19', NULL);
INSERT INTO public.curso VALUES (20, 14, 12, 'SIG172', 'Curso de 5472535e8d4221f', NULL);
INSERT INTO public.curso VALUES (21, 14, 13, 'SIG411', 'Curso de 6caf38f711fbccc', NULL);
INSERT INTO public.curso VALUES (22, 11, 13, 'SIG992', 'Curso de 648c2516c80d7a2', NULL);
INSERT INTO public.curso VALUES (23, 20, 11, 'SIG162', 'Curso de 3749981c663a012', NULL);
INSERT INTO public.curso VALUES (24, 11, 11, 'SIG766', 'Curso de 61eae6f3a4f4968', NULL);
INSERT INTO public.curso VALUES (25, 15, 14, 'SIG325', 'Curso de 55ce74e28563a02', NULL);


--
-- TOC entry 5542 (class 0 OID 49231)
-- Dependencies: 234
-- Data for Name: curso_estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.curso_estudiante VALUES (1, 24, 17);
INSERT INTO public.curso_estudiante VALUES (2, 15, 20);
INSERT INTO public.curso_estudiante VALUES (3, 11, 16);
INSERT INTO public.curso_estudiante VALUES (4, 8, 10);
INSERT INTO public.curso_estudiante VALUES (5, 19, 17);
INSERT INTO public.curso_estudiante VALUES (6, 25, 14);
INSERT INTO public.curso_estudiante VALUES (7, 18, 20);
INSERT INTO public.curso_estudiante VALUES (8, 1, 22);
INSERT INTO public.curso_estudiante VALUES (9, 7, 21);
INSERT INTO public.curso_estudiante VALUES (10, 6, 9);
INSERT INTO public.curso_estudiante VALUES (11, 17, 16);
INSERT INTO public.curso_estudiante VALUES (12, 14, 9);
INSERT INTO public.curso_estudiante VALUES (13, 22, 18);
INSERT INTO public.curso_estudiante VALUES (14, 4, 21);
INSERT INTO public.curso_estudiante VALUES (15, 9, 8);
INSERT INTO public.curso_estudiante VALUES (16, 20, 8);
INSERT INTO public.curso_estudiante VALUES (17, 19, 15);
INSERT INTO public.curso_estudiante VALUES (18, 10, 22);
INSERT INTO public.curso_estudiante VALUES (19, 12, 14);
INSERT INTO public.curso_estudiante VALUES (20, 6, 16);
INSERT INTO public.curso_estudiante VALUES (21, 15, 17);
INSERT INTO public.curso_estudiante VALUES (22, 13, 21);
INSERT INTO public.curso_estudiante VALUES (23, 19, 18);
INSERT INTO public.curso_estudiante VALUES (24, 9, 23);
INSERT INTO public.curso_estudiante VALUES (25, 9, 16);
INSERT INTO public.curso_estudiante VALUES (26, 9, 18);
INSERT INTO public.curso_estudiante VALUES (27, 16, 13);
INSERT INTO public.curso_estudiante VALUES (28, 21, 18);
INSERT INTO public.curso_estudiante VALUES (29, 3, 13);
INSERT INTO public.curso_estudiante VALUES (30, 12, 12);
INSERT INTO public.curso_estudiante VALUES (31, 21, 22);
INSERT INTO public.curso_estudiante VALUES (32, 10, 14);
INSERT INTO public.curso_estudiante VALUES (33, 3, 17);
INSERT INTO public.curso_estudiante VALUES (34, 4, 23);
INSERT INTO public.curso_estudiante VALUES (35, 3, 23);
INSERT INTO public.curso_estudiante VALUES (36, 1, 10);
INSERT INTO public.curso_estudiante VALUES (37, 12, 20);
INSERT INTO public.curso_estudiante VALUES (38, 20, 12);
INSERT INTO public.curso_estudiante VALUES (39, 2, 23);
INSERT INTO public.curso_estudiante VALUES (40, 14, 20);
INSERT INTO public.curso_estudiante VALUES (41, 14, 10);
INSERT INTO public.curso_estudiante VALUES (42, 6, 15);
INSERT INTO public.curso_estudiante VALUES (43, 4, 8);
INSERT INTO public.curso_estudiante VALUES (44, 8, 16);
INSERT INTO public.curso_estudiante VALUES (45, 15, 18);
INSERT INTO public.curso_estudiante VALUES (46, 9, 9);
INSERT INTO public.curso_estudiante VALUES (47, 3, 11);
INSERT INTO public.curso_estudiante VALUES (48, 4, 9);
INSERT INTO public.curso_estudiante VALUES (49, 20, 19);
INSERT INTO public.curso_estudiante VALUES (50, 8, 8);
INSERT INTO public.curso_estudiante VALUES (51, 24, 11);
INSERT INTO public.curso_estudiante VALUES (52, 24, 10);
INSERT INTO public.curso_estudiante VALUES (53, 22, 11);
INSERT INTO public.curso_estudiante VALUES (54, 13, 8);
INSERT INTO public.curso_estudiante VALUES (55, 15, 19);
INSERT INTO public.curso_estudiante VALUES (56, 25, 9);
INSERT INTO public.curso_estudiante VALUES (57, 16, 23);
INSERT INTO public.curso_estudiante VALUES (58, 3, 15);
INSERT INTO public.curso_estudiante VALUES (59, 5, 13);
INSERT INTO public.curso_estudiante VALUES (60, 2, 17);
INSERT INTO public.curso_estudiante VALUES (61, 2, 9);
INSERT INTO public.curso_estudiante VALUES (62, 7, 13);
INSERT INTO public.curso_estudiante VALUES (63, 3, 19);
INSERT INTO public.curso_estudiante VALUES (64, 14, 11);
INSERT INTO public.curso_estudiante VALUES (65, 23, 22);
INSERT INTO public.curso_estudiante VALUES (66, 2, 16);
INSERT INTO public.curso_estudiante VALUES (67, 11, 20);
INSERT INTO public.curso_estudiante VALUES (68, 24, 18);
INSERT INTO public.curso_estudiante VALUES (69, 25, 19);


--
-- TOC entry 5544 (class 0 OID 49241)
-- Dependencies: 236
-- Data for Name: desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.desafio VALUES (1, 11, '2025-09-01 23:01:47.877898', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 1', NULL, NULL, NULL, 'ACTIVO', 17);
INSERT INTO public.desafio VALUES (2, 13, '2025-08-09 09:11:51.291562', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 2', NULL, NULL, NULL, 'ACTIVO', 15);
INSERT INTO public.desafio VALUES (3, 14, '2024-07-04 12:39:30.305611', 'Desafío sobre Inclusión Financiera', 'Descripción detallada del desafío número 3', NULL, NULL, NULL, 'ACTIVO', 11);
INSERT INTO public.desafio VALUES (4, 12, '2024-03-08 22:13:11.957012', 'Desafío sobre Salud y Bienestar', 'Descripción detallada del desafío número 4', NULL, NULL, NULL, 'ACTIVO', 12);
INSERT INTO public.desafio VALUES (5, 11, '2024-10-16 19:56:39.800008', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 5', NULL, NULL, NULL, 'ACTIVO', 15);
INSERT INTO public.desafio VALUES (6, 13, '2025-01-07 08:22:20.146426', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 6', NULL, NULL, NULL, 'ACTIVO', 15);
INSERT INTO public.desafio VALUES (7, 14, '2025-03-31 04:28:34.865083', 'Desafío sobre Inclusión Financiera', 'Descripción detallada del desafío número 7', NULL, NULL, NULL, 'ACTIVO', 11);
INSERT INTO public.desafio VALUES (8, 13, '2025-06-11 23:54:19.939649', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 8', NULL, NULL, NULL, 'ACTIVO', 20);
INSERT INTO public.desafio VALUES (9, 11, '2025-09-21 09:47:40.8443', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 9', NULL, NULL, NULL, 'ACTIVO', 17);
INSERT INTO public.desafio VALUES (10, 13, '2024-07-12 13:08:12.36341', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 10', NULL, NULL, NULL, 'ACTIVO', 14);
INSERT INTO public.desafio VALUES (11, 12, '2025-06-30 17:12:46.038242', 'Desafío sobre Salud y Bienestar', 'Descripción detallada del desafío número 11', NULL, NULL, NULL, 'ACTIVO', 19);
INSERT INTO public.desafio VALUES (12, 11, '2024-08-30 15:39:12.824944', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 12', NULL, NULL, NULL, 'ACTIVO', 17);
INSERT INTO public.desafio VALUES (13, 12, '2024-07-14 00:36:39.465698', 'Desafío sobre Salud y Bienestar', 'Descripción detallada del desafío número 13', NULL, NULL, NULL, 'ACTIVO', 13);
INSERT INTO public.desafio VALUES (14, 12, '2025-08-09 03:21:48.091541', 'Desafío sobre Salud y Bienestar', 'Descripción detallada del desafío número 14', NULL, NULL, NULL, 'ACTIVO', 20);
INSERT INTO public.desafio VALUES (15, 13, '2025-08-13 18:05:39.388644', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 15', NULL, NULL, NULL, 'ACTIVO', 20);
INSERT INTO public.desafio VALUES (16, 13, '2024-02-23 10:30:31.165824', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 16', NULL, NULL, NULL, 'ACTIVO', 14);
INSERT INTO public.desafio VALUES (17, 11, '2024-09-10 09:07:47.002826', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 17', NULL, NULL, NULL, 'ACTIVO', 15);
INSERT INTO public.desafio VALUES (18, 11, '2024-12-05 09:41:30.169727', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 18', NULL, NULL, NULL, 'ACTIVO', 19);
INSERT INTO public.desafio VALUES (19, 13, '2024-04-08 20:01:19.502879', 'Desafío sobre Educación Digital', 'Descripción detallada del desafío número 19', NULL, NULL, NULL, 'ACTIVO', 18);
INSERT INTO public.desafio VALUES (20, 11, '2025-01-29 10:45:21.299431', 'Desafío sobre Sostenibilidad Ambiental', 'Descripción detallada del desafío número 20', NULL, NULL, NULL, 'ACTIVO', 12);


--
-- TOC entry 5603 (class 0 OID 57487)
-- Dependencies: 295
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5589 (class 0 OID 57357)
-- Dependencies: 281
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.django_content_type VALUES (1, 'admin', 'logentry');
INSERT INTO public.django_content_type VALUES (2, 'auth', 'permission');
INSERT INTO public.django_content_type VALUES (3, 'auth', 'group');
INSERT INTO public.django_content_type VALUES (4, 'auth', 'user');
INSERT INTO public.django_content_type VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO public.django_content_type VALUES (6, 'sessions', 'session');
INSERT INTO public.django_content_type VALUES (7, 'api', 'carrera');
INSERT INTO public.django_content_type VALUES (8, 'api', 'token');
INSERT INTO public.django_content_type VALUES (9, 'api', 'cursoestudiante');
INSERT INTO public.django_content_type VALUES (10, 'api', 'categoriaatributo');
INSERT INTO public.django_content_type VALUES (11, 'api', 'partidausuario');
INSERT INTO public.django_content_type VALUES (12, 'api', 'usuario');
INSERT INTO public.django_content_type VALUES (13, 'api', 'ranking');
INSERT INTO public.django_content_type VALUES (14, 'api', 'facultad');
INSERT INTO public.django_content_type VALUES (15, 'api', 'solucionlego');
INSERT INTO public.django_content_type VALUES (16, 'api', 'etapa');
INSERT INTO public.django_content_type VALUES (17, 'api', 'evaluacionpitch');
INSERT INTO public.django_content_type VALUES (18, 'api', 'configuracionvalor');
INSERT INTO public.django_content_type VALUES (19, 'api', 'ganasemprender');
INSERT INTO public.django_content_type VALUES (20, 'api', 'estudiante');
INSERT INTO public.django_content_type VALUES (21, 'api', 'persona');
INSERT INTO public.django_content_type VALUES (22, 'api', 'curso');
INSERT INTO public.django_content_type VALUES (23, 'api', 'video');
INSERT INTO public.django_content_type VALUES (24, 'api', 'profesor');
INSERT INTO public.django_content_type VALUES (25, 'api', 'administrador');
INSERT INTO public.django_content_type VALUES (26, 'api', 'configuracion');
INSERT INTO public.django_content_type VALUES (27, 'api', 'evaluacionautoencuesta');
INSERT INTO public.django_content_type VALUES (28, 'api', 'tipocurso');
INSERT INTO public.django_content_type VALUES (29, 'api', 'temadesafio');
INSERT INTO public.django_content_type VALUES (30, 'api', 'partida');
INSERT INTO public.django_content_type VALUES (31, 'api', 'equipodesafio');
INSERT INTO public.django_content_type VALUES (32, 'api', 'atributo');
INSERT INTO public.django_content_type VALUES (33, 'api', 'equipo');
INSERT INTO public.django_content_type VALUES (34, 'api', 'listaparticipante');
INSERT INTO public.django_content_type VALUES (35, 'api', 'instruccionetapa');
INSERT INTO public.django_content_type VALUES (36, 'api', 'desafio');
INSERT INTO public.django_content_type VALUES (37, 'usuarios', 'administrador');
INSERT INTO public.django_content_type VALUES (38, 'usuarios', 'atributo');
INSERT INTO public.django_content_type VALUES (39, 'usuarios', 'carrera');
INSERT INTO public.django_content_type VALUES (40, 'usuarios', 'categoriaatributo');
INSERT INTO public.django_content_type VALUES (41, 'usuarios', 'configuracion');
INSERT INTO public.django_content_type VALUES (42, 'usuarios', 'configuracionvalor');
INSERT INTO public.django_content_type VALUES (43, 'usuarios', 'curso');
INSERT INTO public.django_content_type VALUES (44, 'usuarios', 'cursoestudiante');
INSERT INTO public.django_content_type VALUES (45, 'usuarios', 'desafio');
INSERT INTO public.django_content_type VALUES (46, 'usuarios', 'estudiante');
INSERT INTO public.django_content_type VALUES (47, 'usuarios', 'etapa');
INSERT INTO public.django_content_type VALUES (48, 'usuarios', 'evaluacionautoencuesta');
INSERT INTO public.django_content_type VALUES (49, 'usuarios', 'evaluacionpitch');
INSERT INTO public.django_content_type VALUES (50, 'usuarios', 'facultad');
INSERT INTO public.django_content_type VALUES (51, 'usuarios', 'ganasemprender');
INSERT INTO public.django_content_type VALUES (52, 'usuarios', 'instruccionetapa');
INSERT INTO public.django_content_type VALUES (53, 'usuarios', 'listaparticipante');
INSERT INTO public.django_content_type VALUES (54, 'usuarios', 'partida');
INSERT INTO public.django_content_type VALUES (55, 'usuarios', 'partidausuario');
INSERT INTO public.django_content_type VALUES (56, 'usuarios', 'persona');
INSERT INTO public.django_content_type VALUES (57, 'usuarios', 'profesor');
INSERT INTO public.django_content_type VALUES (58, 'usuarios', 'ranking');
INSERT INTO public.django_content_type VALUES (59, 'usuarios', 'solucionlego');
INSERT INTO public.django_content_type VALUES (60, 'usuarios', 'temadesafio');
INSERT INTO public.django_content_type VALUES (61, 'usuarios', 'tipocurso');
INSERT INTO public.django_content_type VALUES (62, 'usuarios', 'token');
INSERT INTO public.django_content_type VALUES (63, 'usuarios', 'usuario');
INSERT INTO public.django_content_type VALUES (64, 'usuarios', 'video');
INSERT INTO public.django_content_type VALUES (65, 'usuarios', 'vistadetalleequipo');
INSERT INTO public.django_content_type VALUES (66, 'usuarios', 'equipo');
INSERT INTO public.django_content_type VALUES (67, 'usuarios', 'equipodesafio');
INSERT INTO public.django_content_type VALUES (68, 'authtoken', 'token');
INSERT INTO public.django_content_type VALUES (69, 'authtoken', 'tokenproxy');
INSERT INTO public.django_content_type VALUES (70, 'api', 'progresoetapa');
INSERT INTO public.django_content_type VALUES (71, 'api', 'vistadetalleequipo');
INSERT INTO public.django_content_type VALUES (72, 'api', 'conexionpartida');
INSERT INTO public.django_content_type VALUES (73, 'api', 'estadopartida');


--
-- TOC entry 5587 (class 0 OID 57345)
-- Dependencies: 279
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.django_migrations VALUES (1, 'contenttypes', '0001_initial', '2025-10-25 15:23:03.106593-03');
INSERT INTO public.django_migrations VALUES (2, 'auth', '0001_initial', '2025-10-25 15:23:03.603182-03');
INSERT INTO public.django_migrations VALUES (3, 'admin', '0001_initial', '2025-10-25 15:23:03.672413-03');
INSERT INTO public.django_migrations VALUES (4, 'admin', '0002_logentry_remove_auto_add', '2025-10-25 15:23:03.679025-03');
INSERT INTO public.django_migrations VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', '2025-10-25 15:23:03.684182-03');
INSERT INTO public.django_migrations VALUES (6, 'contenttypes', '0002_remove_content_type_name', '2025-10-25 15:23:03.748912-03');
INSERT INTO public.django_migrations VALUES (7, 'auth', '0002_alter_permission_name_max_length', '2025-10-25 15:23:03.754342-03');
INSERT INTO public.django_migrations VALUES (8, 'auth', '0003_alter_user_email_max_length', '2025-10-25 15:23:03.760869-03');
INSERT INTO public.django_migrations VALUES (9, 'auth', '0004_alter_user_username_opts', '2025-10-25 15:23:03.766725-03');
INSERT INTO public.django_migrations VALUES (10, 'auth', '0005_alter_user_last_login_null', '2025-10-25 15:23:03.772258-03');
INSERT INTO public.django_migrations VALUES (11, 'auth', '0006_require_contenttypes_0002', '2025-10-25 15:23:03.773678-03');
INSERT INTO public.django_migrations VALUES (12, 'auth', '0007_alter_validators_add_error_messages', '2025-10-25 15:23:03.778007-03');
INSERT INTO public.django_migrations VALUES (13, 'auth', '0008_alter_user_username_max_length', '2025-10-25 15:23:03.914902-03');
INSERT INTO public.django_migrations VALUES (14, 'auth', '0009_alter_user_last_name_max_length', '2025-10-25 15:23:03.921672-03');
INSERT INTO public.django_migrations VALUES (15, 'auth', '0010_alter_group_name_max_length', '2025-10-25 15:23:03.928168-03');
INSERT INTO public.django_migrations VALUES (16, 'auth', '0011_update_proxy_permissions', '2025-10-25 15:23:03.933781-03');
INSERT INTO public.django_migrations VALUES (17, 'auth', '0012_alter_user_first_name_max_length', '2025-10-25 15:23:03.942185-03');
INSERT INTO public.django_migrations VALUES (18, 'sessions', '0001_initial', '2025-10-25 15:23:04.056943-03');
INSERT INTO public.django_migrations VALUES (19, 'api', '0001_initial', '2025-10-25 16:16:05.507758-03');
INSERT INTO public.django_migrations VALUES (20, 'api', '0002_alter_estudiante_table_comment_and_more', '2025-10-25 16:29:22.018552-03');
INSERT INTO public.django_migrations VALUES (21, 'usuarios', '0001_initial', '2025-11-05 00:29:52.011786-03');
INSERT INTO public.django_migrations VALUES (26, 'api', '0003_rename_contrasena_usuario_password_progresoetapa', '2025-11-14 21:09:57.340567-03');
INSERT INTO public.django_migrations VALUES (27, 'api', '0004_alter_usuario_fechacreacion', '2025-11-14 21:22:52.898293-03');
INSERT INTO public.django_migrations VALUES (28, 'api', '0005_alter_usuario_table_comment_and_more', '2025-11-14 22:03:38.306614-03');
INSERT INTO public.django_migrations VALUES (29, 'api', '0006_vistadetalleequipo_alter_usuario_table', '2025-11-15 16:10:09.175636-03');
INSERT INTO public.django_migrations VALUES (30, 'authtoken', '0001_initial', '2025-11-15 16:18:41.842467-03');
INSERT INTO public.django_migrations VALUES (31, 'authtoken', '0002_auto_20160226_1747', '2025-11-15 16:18:41.916193-03');
INSERT INTO public.django_migrations VALUES (32, 'authtoken', '0003_tokenproxy', '2025-11-15 16:18:41.919205-03');
INSERT INTO public.django_migrations VALUES (33, 'authtoken', '0004_alter_tokenproxy_options', '2025-11-15 16:18:41.922889-03');
INSERT INTO public.django_migrations VALUES (34, 'api', '0007_alter_partida_video', '2025-11-15 19:14:23.575038-03');
INSERT INTO public.django_migrations VALUES (35, 'api', '0008_add_partida_to_video', '2025-11-19 02:17:25.228474-03');
INSERT INTO public.django_migrations VALUES (36, 'api', '0009_copy_partida_video_data', '2025-11-19 02:17:25.458055-03');
INSERT INTO public.django_migrations VALUES (37, 'api', '0010_remove_partida_video', '2025-11-19 02:17:25.915378-03');
INSERT INTO public.django_migrations VALUES (38, 'api', '0011_equipo_codigo_equipo', '2025-11-25 23:28:49.54342-03');
INSERT INTO public.django_migrations VALUES (39, 'api', '0012_conexionpartida', '2025-11-30 00:56:26.658443-03');
INSERT INTO public.django_migrations VALUES (40, 'api', '0013_alter_conexionpartida_unique_together_and_more', '2025-11-30 01:12:50.094537-03');
INSERT INTO public.django_migrations VALUES (41, 'api', '0014_estadopartida', '2025-11-30 01:53:43.324116-03');


--
-- TOC entry 5604 (class 0 OID 57527)
-- Dependencies: 296
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.django_session VALUES ('ppj0y2dr5w5qtk030tnvbp5mll3pr52v', '.eJxVjDsOwjAQBe_iGlleB-xASc8ZrP0ZB5AjxUmFuDuJlALamXnvbRIuc0lL0ykNYi4GzOGXEfJT6ybkgfU-Wh7rPA1kt8TuttnbKPq67u3fQcFW1rU6DCdVyhnJs0BQAD064oBn8nkllEn7DmIX0InHniUG1YgZ0DGZzxcvaTnu:1vCj43:oKmssOlJWYddn1ul7gNaPOduDbIxBFcAYQif6C-mUn4', '2025-11-08 15:32:31.944624-03');
INSERT INTO public.django_session VALUES ('gmjtlir1yc3sqq5smvdnj7seyspq6sex', '.eJxVjEEOwiAQRe_C2pBSKjAu3XsGMsOAVA0kpV0Z7y5NutDt--_9t_C4rdlvLS5-ZnERozj9MsLwjGUf-IHlXmWoZV1mkrsij7XJW-X4uh7u30HGlnttNBtUanDJAATUMBE4tudBm0ScrEUFxAam6LrQOQOSpjgGdK634vMF1lc3zA:1vGU4k:YcG6weU5VNgHK_3sfzRSVwezG-bG2WsToKEsMbYIICU', '2025-11-19 00:20:46.697904-03');
INSERT INTO public.django_session VALUES ('zx1nqhy7alvyw5d5z4p2suh6shc16p6t', '.eJxVjMsOwiAUBf-FtSG8Hy7d9xsIFy5SNZCUdmX8d9ukC92emTlvEuK21rANXMKcyZVIcvndIKYntgPkR2z3TlNv6zIDPRR60kGnnvF1O92_gxpH3WslFSDXXDqZk0SnkjNCF800Uzklz7NRUTLnlPXFCNBg0AtuC9idRUE-X8IVNxw:1vK4LJ:D6coT0UY0NsFD731JSHccq3L7DcJRGYQwV80OfAuTqc', '2025-11-28 21:40:41.27002-03');


--
-- TOC entry 5546 (class 0 OID 49258)
-- Dependencies: 238
-- Data for Name: equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.equipo VALUES (1, 'Los Pioneros 1', 3, NULL);
INSERT INTO public.equipo VALUES (2, 'Los Visionarios 2', 4, NULL);
INSERT INTO public.equipo VALUES (3, 'Los Innovadores 3', 3, NULL);
INSERT INTO public.equipo VALUES (4, 'Los Creativos 4', 3, NULL);
INSERT INTO public.equipo VALUES (5, 'Los Titanes 5', 4, NULL);
INSERT INTO public.equipo VALUES (6, 'Los Creativos 6', 3, NULL);
INSERT INTO public.equipo VALUES (7, 'Los Pioneros 7', 3, NULL);
INSERT INTO public.equipo VALUES (8, 'Los Titanes 8', 3, NULL);
INSERT INTO public.equipo VALUES (9, 'Los Visionarios 9', 3, NULL);
INSERT INTO public.equipo VALUES (10, 'Los Pioneros 10', 5, NULL);
INSERT INTO public.equipo VALUES (11, 'Los Creativos 11', 4, NULL);
INSERT INTO public.equipo VALUES (12, 'Los Exploradores 12', 3, NULL);
INSERT INTO public.equipo VALUES (13, 'Los Creativos 13', 4, NULL);
INSERT INTO public.equipo VALUES (14, 'Los Titanes 14', 5, NULL);
INSERT INTO public.equipo VALUES (15, 'Los Pioneros 15', 4, NULL);
INSERT INTO public.equipo VALUES (16, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (17, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (18, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (19, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (20, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (21, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (22, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (23, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (24, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (25, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (26, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (27, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (182, 'Equipo 1', 5, '2138771');
INSERT INTO public.equipo VALUES (183, 'Equipo 2', 4, '2138772');
INSERT INTO public.equipo VALUES (184, 'Equipo 3', 4, '2138773');
INSERT INTO public.equipo VALUES (185, 'Equipo 4', 4, '2138774');
INSERT INTO public.equipo VALUES (186, 'Equipo 1', 5, '5211251');
INSERT INTO public.equipo VALUES (187, 'Equipo 2', 4, '5211252');
INSERT INTO public.equipo VALUES (60, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (61, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (62, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (63, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (64, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (65, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (66, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (67, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (68, 'Equipo 1', NULL, NULL);
INSERT INTO public.equipo VALUES (69, 'Equipo 2', NULL, NULL);
INSERT INTO public.equipo VALUES (70, 'Equipo 3', NULL, NULL);
INSERT INTO public.equipo VALUES (71, 'Equipo 4', NULL, NULL);
INSERT INTO public.equipo VALUES (72, 'Los Exploradores', 2, NULL);
INSERT INTO public.equipo VALUES (73, 'Los Innovadores', 1, NULL);
INSERT INTO public.equipo VALUES (74, 'Los Exploradores', 2, NULL);
INSERT INTO public.equipo VALUES (75, 'Los Innovadores', 1, NULL);
INSERT INTO public.equipo VALUES (76, 'Los Exploradores', 2, NULL);
INSERT INTO public.equipo VALUES (77, 'Los Innovadores', 1, NULL);
INSERT INTO public.equipo VALUES (81, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (82, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (83, 'Equipo 3', 5, NULL);
INSERT INTO public.equipo VALUES (84, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (85, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (86, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (87, 'Equipo 3', 5, NULL);
INSERT INTO public.equipo VALUES (88, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (91, 'Equipo 1', 1, NULL);
INSERT INTO public.equipo VALUES (92, 'Equipo 2', 1, NULL);
INSERT INTO public.equipo VALUES (93, 'Equipo 3', 1, NULL);
INSERT INTO public.equipo VALUES (94, 'Equipo 4', 1, NULL);
INSERT INTO public.equipo VALUES (95, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (96, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (97, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (98, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (99, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (100, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (101, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (102, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (103, 'Equipo 1', 4, NULL);
INSERT INTO public.equipo VALUES (104, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (105, 'Equipo 3', 5, NULL);
INSERT INTO public.equipo VALUES (106, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (107, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (108, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (109, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (110, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (111, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (112, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (113, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (114, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (115, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (116, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (117, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (118, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (119, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (120, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (121, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (122, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (123, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (124, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (125, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (126, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (127, 'Equipo 1', 6, NULL);
INSERT INTO public.equipo VALUES (128, 'Equipo 2', 6, NULL);
INSERT INTO public.equipo VALUES (129, 'Equipo 3', 5, NULL);
INSERT INTO public.equipo VALUES (130, 'Equipo 1', 5, NULL);
INSERT INTO public.equipo VALUES (131, 'Equipo 2', 4, NULL);
INSERT INTO public.equipo VALUES (132, 'Equipo 3', 4, NULL);
INSERT INTO public.equipo VALUES (133, 'Equipo 4', 4, NULL);
INSERT INTO public.equipo VALUES (142, 'Equipo Innovadores', 0, '1915681');
INSERT INTO public.equipo VALUES (143, 'Equipo Emprendedores', 0, '1915682');
INSERT INTO public.equipo VALUES (144, 'Equipo Creativos', 0, '1915683');
INSERT INTO public.equipo VALUES (145, 'Equipo Lideres', 0, '1915684');
INSERT INTO public.equipo VALUES (147, 'Equipo Innovadores', 0, '4315661');
INSERT INTO public.equipo VALUES (148, 'Equipo Emprendedores', 0, '4315662');
INSERT INTO public.equipo VALUES (149, 'Equipo Creativos', 0, '4315663');
INSERT INTO public.equipo VALUES (150, 'Equipo Lideres', 0, '4315664');
INSERT INTO public.equipo VALUES (151, 'Equipo Innovadores', 0, '9773211');
INSERT INTO public.equipo VALUES (152, 'Equipo Emprendedores', 0, '9773212');
INSERT INTO public.equipo VALUES (153, 'Equipo Creativos', 0, '9773213');
INSERT INTO public.equipo VALUES (154, 'Equipo Lideres', 0, '9773214');
INSERT INTO public.equipo VALUES (155, 'Equipo 1', 5, '1778921');
INSERT INTO public.equipo VALUES (156, 'Equipo 2', 4, '1778922');
INSERT INTO public.equipo VALUES (157, 'Equipo 3', 4, '1778923');
INSERT INTO public.equipo VALUES (158, 'Equipo 4', 4, '1778924');
INSERT INTO public.equipo VALUES (159, 'Equipo 1', 5, '9622681');
INSERT INTO public.equipo VALUES (160, 'Equipo 2', 4, '9622682');
INSERT INTO public.equipo VALUES (161, 'Equipo 3', 4, '9622683');
INSERT INTO public.equipo VALUES (162, 'Equipo 4', 4, '9622684');
INSERT INTO public.equipo VALUES (163, 'Equipo 1', 5, '2650431');
INSERT INTO public.equipo VALUES (164, 'Equipo 2', 4, '2650432');
INSERT INTO public.equipo VALUES (165, 'Equipo 3', 4, '2650433');
INSERT INTO public.equipo VALUES (166, 'Equipo 4', 4, '2650434');
INSERT INTO public.equipo VALUES (167, 'Equipo 1', 5, '4172861');
INSERT INTO public.equipo VALUES (168, 'Equipo 2', 4, '4172862');
INSERT INTO public.equipo VALUES (169, 'Equipo 3', 4, '4172863');
INSERT INTO public.equipo VALUES (170, 'Equipo 4', 4, '4172864');
INSERT INTO public.equipo VALUES (171, 'Equipo 1', 6, '3963571');
INSERT INTO public.equipo VALUES (172, 'Equipo 2', 6, '3963572');
INSERT INTO public.equipo VALUES (173, 'Equipo 3', 5, '3963573');
INSERT INTO public.equipo VALUES (174, 'Equipo 1', 5, '6978591');
INSERT INTO public.equipo VALUES (175, 'Equipo 2', 4, '6978592');
INSERT INTO public.equipo VALUES (176, 'Equipo 3', 4, '6978593');
INSERT INTO public.equipo VALUES (177, 'Equipo 4', 4, '6978594');
INSERT INTO public.equipo VALUES (178, 'Equipo 1', 5, '9071651');
INSERT INTO public.equipo VALUES (179, 'Equipo 2', 4, '9071652');
INSERT INTO public.equipo VALUES (180, 'Equipo 3', 4, '9071653');
INSERT INTO public.equipo VALUES (181, 'Equipo 4', 4, '9071654');
INSERT INTO public.equipo VALUES (188, 'Equipo 3', 4, '5211253');
INSERT INTO public.equipo VALUES (189, 'Equipo 4', 4, '5211254');


--
-- TOC entry 5547 (class 0 OID 49266)
-- Dependencies: 239
-- Data for Name: equipo_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.equipo_desafio VALUES (1, 4, 12);
INSERT INTO public.equipo_desafio VALUES (2, 13, 13);
INSERT INTO public.equipo_desafio VALUES (3, 1, 17);
INSERT INTO public.equipo_desafio VALUES (4, 20, 12);
INSERT INTO public.equipo_desafio VALUES (5, 16, 14);
INSERT INTO public.equipo_desafio VALUES (6, 6, 15);
INSERT INTO public.equipo_desafio VALUES (7, 3, 11);
INSERT INTO public.equipo_desafio VALUES (8, 20, 12);
INSERT INTO public.equipo_desafio VALUES (9, 14, 20);
INSERT INTO public.equipo_desafio VALUES (10, 8, 20);
INSERT INTO public.equipo_desafio VALUES (11, 15, 20);
INSERT INTO public.equipo_desafio VALUES (12, 9, 17);
INSERT INTO public.equipo_desafio VALUES (13, 10, 14);
INSERT INTO public.equipo_desafio VALUES (14, 8, 20);
INSERT INTO public.equipo_desafio VALUES (15, 11, 19);


--
-- TOC entry 5615 (class 0 OID 90525)
-- Dependencies: 308
-- Data for Name: estado_partida; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estado_partida VALUES (1, 'INICIADA', 1, '2025-11-30 02:39:20.32836-03', true, 'Profesor inició el juego', 77);
INSERT INTO public.estado_partida VALUES (2, 'INICIADA', 1, '2025-11-30 02:45:40.26733-03', true, 'Profesor inició el juego', 78);
INSERT INTO public.estado_partida VALUES (3, 'INICIADA', 1, '2025-11-30 02:45:40.963367-03', true, 'Profesor inició el juego', 78);


--
-- TOC entry 5549 (class 0 OID 49275)
-- Dependencies: 241
-- Data for Name: estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estudiante VALUES (8, 17, 21);
INSERT INTO public.estudiante VALUES (9, 21, 22);
INSERT INTO public.estudiante VALUES (10, 23, 23);
INSERT INTO public.estudiante VALUES (11, 25, 24);
INSERT INTO public.estudiante VALUES (12, 30, 25);
INSERT INTO public.estudiante VALUES (13, 37, 26);
INSERT INTO public.estudiante VALUES (14, 40, 27);
INSERT INTO public.estudiante VALUES (15, 42, 28);
INSERT INTO public.estudiante VALUES (16, 43, 29);
INSERT INTO public.estudiante VALUES (17, 45, 30);
INSERT INTO public.estudiante VALUES (18, 52, 31);
INSERT INTO public.estudiante VALUES (19, 54, 32);
INSERT INTO public.estudiante VALUES (20, 57, 33);
INSERT INTO public.estudiante VALUES (21, 58, 34);
INSERT INTO public.estudiante VALUES (22, 59, 35);
INSERT INTO public.estudiante VALUES (23, 62, 36);
INSERT INTO public.estudiante VALUES (28, 71, 122);
INSERT INTO public.estudiante VALUES (29, 72, 123);
INSERT INTO public.estudiante VALUES (30, 73, 124);
INSERT INTO public.estudiante VALUES (31, 74, 125);
INSERT INTO public.estudiante VALUES (32, 75, 126);
INSERT INTO public.estudiante VALUES (33, 76, 127);
INSERT INTO public.estudiante VALUES (34, 77, 128);
INSERT INTO public.estudiante VALUES (35, 78, 129);
INSERT INTO public.estudiante VALUES (36, 79, 130);
INSERT INTO public.estudiante VALUES (37, 80, 131);
INSERT INTO public.estudiante VALUES (38, 81, 132);
INSERT INTO public.estudiante VALUES (39, 82, 133);
INSERT INTO public.estudiante VALUES (40, 83, 134);
INSERT INTO public.estudiante VALUES (41, 84, 135);
INSERT INTO public.estudiante VALUES (42, 85, 136);
INSERT INTO public.estudiante VALUES (43, 86, 137);
INSERT INTO public.estudiante VALUES (44, 87, 138);
INSERT INTO public.estudiante VALUES (45, 88, 139);
INSERT INTO public.estudiante VALUES (46, 89, 140);
INSERT INTO public.estudiante VALUES (47, 90, 141);
INSERT INTO public.estudiante VALUES (48, 91, 142);
INSERT INTO public.estudiante VALUES (49, 92, 143);
INSERT INTO public.estudiante VALUES (50, 93, 144);
INSERT INTO public.estudiante VALUES (51, 94, 145);
INSERT INTO public.estudiante VALUES (52, 95, 146);
INSERT INTO public.estudiante VALUES (53, 96, 147);
INSERT INTO public.estudiante VALUES (54, 97, 148);
INSERT INTO public.estudiante VALUES (55, 98, 149);
INSERT INTO public.estudiante VALUES (56, 99, 150);
INSERT INTO public.estudiante VALUES (57, 100, 151);
INSERT INTO public.estudiante VALUES (58, 101, 152);
INSERT INTO public.estudiante VALUES (59, 102, 153);
INSERT INTO public.estudiante VALUES (60, 103, 154);
INSERT INTO public.estudiante VALUES (61, 104, 155);
INSERT INTO public.estudiante VALUES (62, 105, 156);
INSERT INTO public.estudiante VALUES (63, 106, 157);
INSERT INTO public.estudiante VALUES (64, 107, 158);
INSERT INTO public.estudiante VALUES (65, 108, 159);
INSERT INTO public.estudiante VALUES (66, 109, 160);
INSERT INTO public.estudiante VALUES (67, 110, 161);
INSERT INTO public.estudiante VALUES (68, 111, 162);
INSERT INTO public.estudiante VALUES (69, 112, 163);
INSERT INTO public.estudiante VALUES (70, 113, 164);


--
-- TOC entry 5551 (class 0 OID 49285)
-- Dependencies: 243
-- Data for Name: etapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.etapa VALUES (12, 'Ideación', 30, 1, 'Generar ideas innovadoras para resolver el desafío.', 'ACTIVO', 'Fomenta la creatividad y el pensamiento lateral.');
INSERT INTO public.etapa VALUES (13, 'Prototipado', 45, 2, 'Construir un prototipo de baja fidelidad de la solución.', 'ACTIVO', 'Desarrolla habilidades de construcción y diseño rápido.');
INSERT INTO public.etapa VALUES (14, 'Validación', 20, 3, 'Obtener retroalimentación sobre el prototipo.', 'ACTIVO', 'Practica la escucha activa y la empatía.');
INSERT INTO public.etapa VALUES (15, 'Pitch Final', 15, 4, 'Presentar la solución final de forma convincente.', 'ACTIVO', 'Mejora la comunicación y la persuasión.');


--
-- TOC entry 5553 (class 0 OID 49299)
-- Dependencies: 245
-- Data for Name: evaluacion_autoencuesta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5555 (class 0 OID 49312)
-- Dependencies: 247
-- Data for Name: evaluacion_pitch; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.evaluacion_pitch VALUES (1, 8, 1, 2, 2, 4, 3);
INSERT INTO public.evaluacion_pitch VALUES (2, 2, 7, 2, 4, 2, 3);
INSERT INTO public.evaluacion_pitch VALUES (3, 7, 8, 3, 2, 4, 1);
INSERT INTO public.evaluacion_pitch VALUES (4, 14, 15, 3, 3, 3, 4);
INSERT INTO public.evaluacion_pitch VALUES (5, 1, 9, 1, 2, 4, 4);
INSERT INTO public.evaluacion_pitch VALUES (6, 9, 3, 3, 1, 1, 2);
INSERT INTO public.evaluacion_pitch VALUES (7, 7, 11, 2, 4, 2, 3);
INSERT INTO public.evaluacion_pitch VALUES (8, 4, 10, 4, 2, 2, 4);
INSERT INTO public.evaluacion_pitch VALUES (9, 4, 12, 2, 4, 1, 4);
INSERT INTO public.evaluacion_pitch VALUES (10, 13, 14, 2, 4, 3, 3);
INSERT INTO public.evaluacion_pitch VALUES (11, 4, 3, 3, 3, 3, 4);
INSERT INTO public.evaluacion_pitch VALUES (12, 15, 3, 4, 4, 4, 4);
INSERT INTO public.evaluacion_pitch VALUES (13, 6, 8, 1, 1, 4, 1);
INSERT INTO public.evaluacion_pitch VALUES (14, 5, 10, 2, 4, 3, 2);
INSERT INTO public.evaluacion_pitch VALUES (15, 6, 10, 4, 1, 1, 1);
INSERT INTO public.evaluacion_pitch VALUES (16, 5, 9, 2, 2, 3, 1);
INSERT INTO public.evaluacion_pitch VALUES (17, 1, 3, 4, 4, 1, 1);
INSERT INTO public.evaluacion_pitch VALUES (18, 4, 1, 4, 2, 3, 2);
INSERT INTO public.evaluacion_pitch VALUES (19, 13, 1, 1, 1, 1, 2);
INSERT INTO public.evaluacion_pitch VALUES (20, 3, 14, 1, 2, 2, 4);
INSERT INTO public.evaluacion_pitch VALUES (21, 11, 2, 4, 1, 2, 4);
INSERT INTO public.evaluacion_pitch VALUES (22, 15, 11, 2, 4, 1, 2);
INSERT INTO public.evaluacion_pitch VALUES (23, 10, 5, 1, 3, 1, 4);
INSERT INTO public.evaluacion_pitch VALUES (24, 8, 5, 2, 1, 2, 2);
INSERT INTO public.evaluacion_pitch VALUES (25, 6, 9, 2, 2, 3, 3);
INSERT INTO public.evaluacion_pitch VALUES (26, 12, 5, 1, 2, 2, 4);
INSERT INTO public.evaluacion_pitch VALUES (27, 14, 1, 2, 1, 1, 4);
INSERT INTO public.evaluacion_pitch VALUES (28, 4, 7, 1, 2, 1, 4);
INSERT INTO public.evaluacion_pitch VALUES (29, 6, 5, 3, 1, 4, 2);
INSERT INTO public.evaluacion_pitch VALUES (30, 12, 14, 3, 2, 2, 4);
INSERT INTO public.evaluacion_pitch VALUES (31, 10, 2, 3, 3, 2, 2);
INSERT INTO public.evaluacion_pitch VALUES (32, 9, 1, 2, 3, 3, 1);
INSERT INTO public.evaluacion_pitch VALUES (33, 11, 15, 2, 1, 4, 4);
INSERT INTO public.evaluacion_pitch VALUES (34, 1, 4, 3, 2, 3, 3);
INSERT INTO public.evaluacion_pitch VALUES (35, 3, 11, 3, 2, 2, 1);
INSERT INTO public.evaluacion_pitch VALUES (36, 15, 2, 3, 2, 4, 1);
INSERT INTO public.evaluacion_pitch VALUES (37, 11, 6, 4, 3, 1, 3);
INSERT INTO public.evaluacion_pitch VALUES (38, 10, 13, 4, 4, 2, 3);
INSERT INTO public.evaluacion_pitch VALUES (39, 13, 7, 2, 3, 4, 4);
INSERT INTO public.evaluacion_pitch VALUES (40, 1, 13, 3, 4, 4, 1);
INSERT INTO public.evaluacion_pitch VALUES (41, 9, 2, 4, 3, 1, 4);
INSERT INTO public.evaluacion_pitch VALUES (42, 7, 6, 4, 4, 3, 4);


--
-- TOC entry 5557 (class 0 OID 49326)
-- Dependencies: 249
-- Data for Name: facultad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.facultad VALUES (11, 'Facultad de Ingeniería y Ciencias');
INSERT INTO public.facultad VALUES (12, 'Facultad de Economía y Negocios');
INSERT INTO public.facultad VALUES (13, 'Facultad de Diseño y Comunicación');
INSERT INTO public.facultad VALUES (14, 'Facultad de Ciencias Sociales');
INSERT INTO public.facultad VALUES (15, 'Facultad de Artes Liberales');


--
-- TOC entry 5559 (class 0 OID 49335)
-- Dependencies: 251
-- Data for Name: ganas_emprender; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ganas_emprender VALUES (11, '¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?');
INSERT INTO public.ganas_emprender VALUES (12, '¿Disfrutas de los desafíos y de resolver problemas complejos?');
INSERT INTO public.ganas_emprender VALUES (13, '¿Te sientes cómodo tomando riesgos calculados?');
INSERT INTO public.ganas_emprender VALUES (14, '¿Te motiva la idea de crear tu propio camino profesional?');
INSERT INTO public.ganas_emprender VALUES (15, '¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?');
INSERT INTO public.ganas_emprender VALUES (16, '¿Disfrutas de los desafíos y de resolver problemas complejos?');
INSERT INTO public.ganas_emprender VALUES (17, '¿Te sientes cómodo tomando riesgos calculados?');
INSERT INTO public.ganas_emprender VALUES (18, '¿Te motiva la idea de crear tu propio camino profesional?');


--
-- TOC entry 5561 (class 0 OID 49344)
-- Dependencies: 253
-- Data for Name: instruccion_etapa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5563 (class 0 OID 49356)
-- Dependencies: 255
-- Data for Name: lista_participante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lista_participante VALUES (21, 'estudiante1@pre-registro.com', 'Participante 1');
INSERT INTO public.lista_participante VALUES (22, 'estudiante2@pre-registro.com', 'Participante 2');
INSERT INTO public.lista_participante VALUES (23, 'estudiante3@pre-registro.com', 'Participante 3');
INSERT INTO public.lista_participante VALUES (24, 'estudiante4@pre-registro.com', 'Participante 4');
INSERT INTO public.lista_participante VALUES (25, 'estudiante5@pre-registro.com', 'Participante 5');
INSERT INTO public.lista_participante VALUES (26, 'estudiante6@pre-registro.com', 'Participante 6');
INSERT INTO public.lista_participante VALUES (27, 'estudiante7@pre-registro.com', 'Participante 7');
INSERT INTO public.lista_participante VALUES (28, 'estudiante8@pre-registro.com', 'Participante 8');
INSERT INTO public.lista_participante VALUES (29, 'estudiante9@pre-registro.com', 'Participante 9');
INSERT INTO public.lista_participante VALUES (30, 'estudiante10@pre-registro.com', 'Participante 10');
INSERT INTO public.lista_participante VALUES (31, 'estudiante11@pre-registro.com', 'Participante 11');
INSERT INTO public.lista_participante VALUES (32, 'estudiante12@pre-registro.com', 'Participante 12');
INSERT INTO public.lista_participante VALUES (33, 'estudiante13@pre-registro.com', 'Participante 13');
INSERT INTO public.lista_participante VALUES (34, 'estudiante14@pre-registro.com', 'Participante 14');
INSERT INTO public.lista_participante VALUES (35, 'estudiante15@pre-registro.com', 'Participante 15');
INSERT INTO public.lista_participante VALUES (36, 'estudiante16@pre-registro.com', 'Participante 16');
INSERT INTO public.lista_participante VALUES (37, 'estudiante17@pre-registro.com', 'Participante 17');
INSERT INTO public.lista_participante VALUES (38, 'estudiante18@pre-registro.com', 'Participante 18');
INSERT INTO public.lista_participante VALUES (39, 'estudiante19@pre-registro.com', 'Participante 19');
INSERT INTO public.lista_participante VALUES (40, 'estudiante20@pre-registro.com', 'Participante 20');
INSERT INTO public.lista_participante VALUES (41, 'estudiante21@pre-registro.com', 'Participante 21');
INSERT INTO public.lista_participante VALUES (42, 'estudiante22@pre-registro.com', 'Participante 22');
INSERT INTO public.lista_participante VALUES (43, 'estudiante23@pre-registro.com', 'Participante 23');
INSERT INTO public.lista_participante VALUES (44, 'estudiante24@pre-registro.com', 'Participante 24');
INSERT INTO public.lista_participante VALUES (45, 'estudiante25@pre-registro.com', 'Participante 25');
INSERT INTO public.lista_participante VALUES (46, 'estudiante26@pre-registro.com', 'Participante 26');
INSERT INTO public.lista_participante VALUES (47, 'estudiante27@pre-registro.com', 'Participante 27');
INSERT INTO public.lista_participante VALUES (48, 'estudiante28@pre-registro.com', 'Participante 28');
INSERT INTO public.lista_participante VALUES (49, 'estudiante29@pre-registro.com', 'Participante 29');
INSERT INTO public.lista_participante VALUES (50, 'estudiante30@pre-registro.com', 'Participante 30');
INSERT INTO public.lista_participante VALUES (51, 'estudiante31@pre-registro.com', 'Participante 31');
INSERT INTO public.lista_participante VALUES (52, 'estudiante32@pre-registro.com', 'Participante 32');
INSERT INTO public.lista_participante VALUES (53, 'estudiante33@pre-registro.com', 'Participante 33');
INSERT INTO public.lista_participante VALUES (54, 'estudiante34@pre-registro.com', 'Participante 34');
INSERT INTO public.lista_participante VALUES (55, 'estudiante35@pre-registro.com', 'Participante 35');
INSERT INTO public.lista_participante VALUES (56, 'estudiante36@pre-registro.com', 'Participante 36');
INSERT INTO public.lista_participante VALUES (57, 'estudiante37@pre-registro.com', 'Participante 37');
INSERT INTO public.lista_participante VALUES (58, 'estudiante38@pre-registro.com', 'Participante 38');
INSERT INTO public.lista_participante VALUES (59, 'estudiante39@pre-registro.com', 'Participante 39');
INSERT INTO public.lista_participante VALUES (60, 'estudiante40@pre-registro.com', 'Participante 40');
INSERT INTO public.lista_participante VALUES (61, 'estudiante41@pre-registro.com', 'Participante 41');
INSERT INTO public.lista_participante VALUES (62, 'estudiante42@pre-registro.com', 'Participante 42');
INSERT INTO public.lista_participante VALUES (63, 'estudiante43@pre-registro.com', 'Participante 43');
INSERT INTO public.lista_participante VALUES (64, 'estudiante44@pre-registro.com', 'Participante 44');
INSERT INTO public.lista_participante VALUES (65, 'estudiante45@pre-registro.com', 'Participante 45');
INSERT INTO public.lista_participante VALUES (66, 'estudiante46@pre-registro.com', 'Participante 46');
INSERT INTO public.lista_participante VALUES (67, 'estudiante47@pre-registro.com', 'Participante 47');
INSERT INTO public.lista_participante VALUES (68, 'estudiante48@pre-registro.com', 'Participante 48');
INSERT INTO public.lista_participante VALUES (69, 'estudiante49@pre-registro.com', 'Participante 49');
INSERT INTO public.lista_participante VALUES (70, 'estudiante50@pre-registro.com', 'Participante 50');
INSERT INTO public.lista_participante VALUES (71, 'estudiante51@pre-registro.com', 'Participante 51');
INSERT INTO public.lista_participante VALUES (72, 'estudiante52@pre-registro.com', 'Participante 52');
INSERT INTO public.lista_participante VALUES (73, 'estudiante53@pre-registro.com', 'Participante 53');
INSERT INTO public.lista_participante VALUES (74, 'estudiante54@pre-registro.com', 'Participante 54');
INSERT INTO public.lista_participante VALUES (75, 'estudiante55@pre-registro.com', 'Participante 55');
INSERT INTO public.lista_participante VALUES (76, 'estudiante56@pre-registro.com', 'Participante 56');
INSERT INTO public.lista_participante VALUES (77, 'estudiante57@pre-registro.com', 'Participante 57');
INSERT INTO public.lista_participante VALUES (78, 'estudiante58@pre-registro.com', 'Participante 58');
INSERT INTO public.lista_participante VALUES (79, 'estudiante59@pre-registro.com', 'Participante 59');
INSERT INTO public.lista_participante VALUES (80, 'estudiante60@pre-registro.com', 'Participante 60');
INSERT INTO public.lista_participante VALUES (81, 'estudiante61@pre-registro.com', 'Participante 61');
INSERT INTO public.lista_participante VALUES (82, 'estudiante62@pre-registro.com', 'Participante 62');
INSERT INTO public.lista_participante VALUES (83, 'estudiante63@pre-registro.com', 'Participante 63');
INSERT INTO public.lista_participante VALUES (84, 'estudiante64@pre-registro.com', 'Participante 64');
INSERT INTO public.lista_participante VALUES (85, 'estudiante65@pre-registro.com', 'Participante 65');
INSERT INTO public.lista_participante VALUES (86, 'estudiante66@pre-registro.com', 'Participante 66');
INSERT INTO public.lista_participante VALUES (87, 'estudiante67@pre-registro.com', 'Participante 67');
INSERT INTO public.lista_participante VALUES (88, 'estudiante68@pre-registro.com', 'Participante 68');
INSERT INTO public.lista_participante VALUES (89, 'estudiante69@pre-registro.com', 'Participante 69');
INSERT INTO public.lista_participante VALUES (90, 'estudiante70@pre-registro.com', 'Participante 70');
INSERT INTO public.lista_participante VALUES (91, 'estudiante71@pre-registro.com', 'Participante 71');
INSERT INTO public.lista_participante VALUES (92, 'estudiante72@pre-registro.com', 'Participante 72');
INSERT INTO public.lista_participante VALUES (93, 'estudiante73@pre-registro.com', 'Participante 73');
INSERT INTO public.lista_participante VALUES (94, 'estudiante74@pre-registro.com', 'Participante 74');
INSERT INTO public.lista_participante VALUES (95, 'estudiante75@pre-registro.com', 'Participante 75');
INSERT INTO public.lista_participante VALUES (96, 'estudiante76@pre-registro.com', 'Participante 76');
INSERT INTO public.lista_participante VALUES (97, 'estudiante77@pre-registro.com', 'Participante 77');
INSERT INTO public.lista_participante VALUES (98, 'estudiante78@pre-registro.com', 'Participante 78');
INSERT INTO public.lista_participante VALUES (99, 'estudiante79@pre-registro.com', 'Participante 79');
INSERT INTO public.lista_participante VALUES (100, 'estudiante80@pre-registro.com', 'Participante 80');
INSERT INTO public.lista_participante VALUES (101, 'estudiante81@pre-registro.com', 'Participante 81');
INSERT INTO public.lista_participante VALUES (102, 'estudiante82@pre-registro.com', 'Participante 82');
INSERT INTO public.lista_participante VALUES (103, 'estudiante83@pre-registro.com', 'Participante 83');
INSERT INTO public.lista_participante VALUES (104, 'estudiante84@pre-registro.com', 'Participante 84');
INSERT INTO public.lista_participante VALUES (105, 'estudiante85@pre-registro.com', 'Participante 85');
INSERT INTO public.lista_participante VALUES (106, 'estudiante86@pre-registro.com', 'Participante 86');
INSERT INTO public.lista_participante VALUES (107, 'estudiante87@pre-registro.com', 'Participante 87');
INSERT INTO public.lista_participante VALUES (108, 'estudiante88@pre-registro.com', 'Participante 88');
INSERT INTO public.lista_participante VALUES (109, 'estudiante89@pre-registro.com', 'Participante 89');
INSERT INTO public.lista_participante VALUES (110, 'estudiante90@pre-registro.com', 'Participante 90');
INSERT INTO public.lista_participante VALUES (111, 'estudiante91@pre-registro.com', 'Participante 91');
INSERT INTO public.lista_participante VALUES (112, 'estudiante92@pre-registro.com', 'Participante 92');
INSERT INTO public.lista_participante VALUES (113, 'estudiante93@pre-registro.com', 'Participante 93');
INSERT INTO public.lista_participante VALUES (114, 'estudiante94@pre-registro.com', 'Participante 94');
INSERT INTO public.lista_participante VALUES (115, 'estudiante95@pre-registro.com', 'Participante 95');
INSERT INTO public.lista_participante VALUES (116, 'estudiante96@pre-registro.com', 'Participante 96');
INSERT INTO public.lista_participante VALUES (117, 'estudiante97@pre-registro.com', 'Participante 97');
INSERT INTO public.lista_participante VALUES (118, 'estudiante98@pre-registro.com', 'Participante 98');
INSERT INTO public.lista_participante VALUES (119, 'estudiante99@pre-registro.com', 'Participante 99');
INSERT INTO public.lista_participante VALUES (120, 'estudiante100@pre-registro.com', 'Participante 100');
INSERT INTO public.lista_participante VALUES (122, 's.ruizr@udd.cl', 'SEBASTIAN FERNANDO');
INSERT INTO public.lista_participante VALUES (123, 'd.romerob@udd.cl', 'DANIEL ANDRÉS');
INSERT INTO public.lista_participante VALUES (124, 'm.guerreroa@udd.cl', 'MARTÍN ISAIAS');
INSERT INTO public.lista_participante VALUES (125, 'l.riquelmet@udd.cl', 'LUCAS JEREMÍAS');
INSERT INTO public.lista_participante VALUES (126, 'm.olivaresr@udd.cl', 'MARTÍN ALEJANDRO');
INSERT INTO public.lista_participante VALUES (127, 'r.varelar@udd.cl', 'RENATO IGNACIO');
INSERT INTO public.lista_participante VALUES (128, 'sramorinoc@udd.cl', 'SEBASTIÁN');
INSERT INTO public.lista_participante VALUES (129, 'a.barrientosv@udd.cl', 'ALEJANDRO PATRICIO');
INSERT INTO public.lista_participante VALUES (130, 'matvergaraf@udd.cl', 'MATÍAS ALEJANDRO');
INSERT INTO public.lista_participante VALUES (131, 'lanascot@udd.cl', 'LEANDRO');
INSERT INTO public.lista_participante VALUES (132, 'spagem@udd.cl', 'SANTIAGO ANDRÉS');
INSERT INTO public.lista_participante VALUES (133, 'jsaavedrah@udd.cl', 'JOSE IGNACIO');
INSERT INTO public.lista_participante VALUES (134, 'a.torresf@udd.cl', 'ÁLVARO FRANCISCO');
INSERT INTO public.lista_participante VALUES (135, 'b.farinal@udd.cl', 'BASTIÁN IGNACIO');
INSERT INTO public.lista_participante VALUES (136, 'j.azuajep@udd.cl', 'JESUS ALEJANDRO');
INSERT INTO public.lista_participante VALUES (137, 'r.barbosap@udd.cl', 'RAIMUNDO');
INSERT INTO public.lista_participante VALUES (138, 'a.reyesp@udd.cl', 'AGUSTÍN EDUARDO');
INSERT INTO public.lista_participante VALUES (139, 'alumno1@correo.com', 'Juan');
INSERT INTO public.lista_participante VALUES (140, 'alumno2@correo.com', 'Ana');
INSERT INTO public.lista_participante VALUES (141, 'alumno3@correo.com', 'Carlos');
INSERT INTO public.lista_participante VALUES (142, 'alumno1@mail.com', 'Juan');
INSERT INTO public.lista_participante VALUES (143, 'alumno2@mail.com', 'Maria');
INSERT INTO public.lista_participante VALUES (144, 'alumno3@mail.com', 'Pedro');
INSERT INTO public.lista_participante VALUES (145, 'alumno4@mail.com', 'Ana');
INSERT INTO public.lista_participante VALUES (146, 'alumno5@mail.com', 'Luis');
INSERT INTO public.lista_participante VALUES (147, 'alumno6@mail.com', 'Sofia');
INSERT INTO public.lista_participante VALUES (148, 'alumno7@mail.com', 'Carlos');
INSERT INTO public.lista_participante VALUES (149, 'alumno8@mail.com', 'Laura');
INSERT INTO public.lista_participante VALUES (150, 'alumno9@mail.com', 'Diego');
INSERT INTO public.lista_participante VALUES (151, 'alumno10@mail.com', 'Valentina');
INSERT INTO public.lista_participante VALUES (152, 'alumno11@mail.com', 'Mateo');
INSERT INTO public.lista_participante VALUES (153, 'alumno12@mail.com', 'Camila');
INSERT INTO public.lista_participante VALUES (154, 'alumno13@mail.com', 'Sebastian');
INSERT INTO public.lista_participante VALUES (155, 'alumno14@mail.com', 'Isabella');
INSERT INTO public.lista_participante VALUES (156, 'alumno15@mail.com', 'Emilio');
INSERT INTO public.lista_participante VALUES (157, 'alumno16@mail.com', 'Martina');
INSERT INTO public.lista_participante VALUES (158, 'alumno17@mail.com', 'Benjamin');
INSERT INTO public.lista_participante VALUES (159, 'alumno18@mail.com', 'Antonella');
INSERT INTO public.lista_participante VALUES (160, 'test@mail.com', 'Test');
INSERT INTO public.lista_participante VALUES (161, 'a1@mail.com', 'A1');
INSERT INTO public.lista_participante VALUES (162, 'a2@mail.com', 'A2');
INSERT INTO public.lista_participante VALUES (163, 'a3@mail.com', 'A3');
INSERT INTO public.lista_participante VALUES (164, 'a4@mail.com', 'A4');


--
-- TOC entry 5565 (class 0 OID 49366)
-- Dependencies: 257
-- Data for Name: partida; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.partida VALUES (1, '2025-10-18 14:50:40.112565', 'CONFIGURACION', '98738E', '2024-03-19 02:55:22.408867', '2024-03-19 03:27:45.447719', 4, NULL);
INSERT INTO public.partida VALUES (2, '2025-10-18 14:50:40.112565', 'CONFIGURACION', 'F78799', '2024-06-03 19:02:46.259056', '2024-06-03 19:09:58.137267', 4, NULL);
INSERT INTO public.partida VALUES (3, '2025-10-18 14:50:40.112565', 'FINALIZADO', 'FC453C', '2025-03-22 13:54:09.109928', '2025-03-22 16:05:22.673101', 4, NULL);
INSERT INTO public.partida VALUES (4, '2025-10-18 14:50:40.112565', 'FINALIZADO', '4170D9', '2025-06-11 16:58:52.647256', '2025-06-11 17:44:26.089538', 4, NULL);
INSERT INTO public.partida VALUES (5, '2025-10-18 14:50:40.112565', 'CONFIGURACION', '31CD8B', '2024-09-02 20:58:44.034226', '2024-09-02 21:36:02.936818', 4, NULL);
INSERT INTO public.partida VALUES (6, '2025-10-18 14:50:40.112565', 'EN_CURSO', '17B431', '2025-09-19 19:18:14.806233', '2025-09-19 19:56:43.439446', 4, NULL);
INSERT INTO public.partida VALUES (7, '2025-10-18 14:50:40.112565', 'FINALIZADO', 'CE15FE', '2025-02-14 11:00:37.42886', '2025-02-14 13:48:37.985098', 4, NULL);
INSERT INTO public.partida VALUES (8, '2025-10-18 14:50:40.112565', 'CONFIGURACION', 'ED84F5', '2024-02-18 21:20:49.296616', '2024-02-18 22:55:53.280601', 4, NULL);
INSERT INTO public.partida VALUES (9, '2025-10-18 14:50:40.112565', 'FINALIZADO', '4C48BB', '2025-05-12 03:35:14.71211', '2025-05-12 05:26:24.67552', 4, NULL);
INSERT INTO public.partida VALUES (10, '2025-10-18 14:50:40.112565', 'CONFIGURACION', '4CCA5F', '2024-04-12 08:32:46.697173', '2024-04-12 11:19:15.070375', 4, NULL);
INSERT INTO public.partida VALUES (11, '2025-10-18 14:50:40.112565', 'FINALIZADO', '024951', '2025-10-14 12:02:07.57281', '2025-10-14 14:55:58.072399', 4, NULL);
INSERT INTO public.partida VALUES (12, '2025-10-18 14:50:40.112565', 'FINALIZADO', '0463BE', '2024-03-28 02:10:03.55197', '2024-03-28 02:50:29.840274', 4, NULL);
INSERT INTO public.partida VALUES (13, '2025-10-18 14:50:40.112565', 'FINALIZADO', 'BC5C17', '2024-08-29 01:13:16.951274', '2024-08-29 02:33:45.895574', 4, NULL);
INSERT INTO public.partida VALUES (14, '2025-10-18 14:50:40.112565', 'CONFIGURACION', '0FE9E6', '2024-10-08 20:27:19.009803', '2024-10-08 20:44:32.172144', 4, NULL);
INSERT INTO public.partida VALUES (15, '2025-10-18 14:50:40.112565', 'EN_CURSO', '62FEE8', '2024-09-05 07:42:35.581965', '2024-09-05 08:50:24.391801', 4, NULL);
INSERT INTO public.partida VALUES (35, '2025-11-07 09:43:43.113288', 'EN_CURSO', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.partida VALUES (36, '2025-11-07 09:49:42.994644', 'EN_CURSO', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.partida VALUES (37, '2025-11-07 17:48:47.388679', 'EN_CURSO', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.partida VALUES (40, '2025-11-15 22:14:56.887095', 'EN_CURSO', '2d756056', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (44, '2025-11-24 12:27:05.114048', 'CONFIGURACION', '768338', NULL, NULL, 4, 100);
INSERT INTO public.partida VALUES (46, '2025-11-24 12:27:57.614319', 'CONFIGURACION', '741062', NULL, NULL, 4, 100);
INSERT INTO public.partida VALUES (49, '2025-11-24 12:36:40.85283', 'CONFIGURACION', '743624', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (50, '2025-11-24 16:26:42.41529', 'CONFIGURACION', '543817', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (51, '2025-11-24 18:38:11.600748', 'CONFIGURACION', '304311', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (52, '2025-11-24 18:53:00.456494', 'CONFIGURACION', '790975', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (53, '2025-11-24 19:00:20.417538', 'CONFIGURACION', '160507', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (54, '2025-11-24 19:02:34.999051', 'CONFIGURACION', '296823', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (55, '2025-11-24 19:14:34.880075', 'CONFIGURACION', '181208', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (56, '2025-11-24 19:16:16.583262', 'CONFIGURACION', '595660', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (57, '2025-11-25 06:23:03.281041', 'CONFIGURACION', '479343', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (59, '2025-11-25 07:02:05.4499', 'CONFIGURACION', '283959', NULL, NULL, 3, 17);
INSERT INTO public.partida VALUES (60, '2025-11-25 14:20:39.095183', 'CONFIGURACION', '472088', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (65, '2025-11-30 01:38:36.851889', 'CONFIGURACION', '191568', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (66, '2025-11-30 01:48:18.461623', 'CONFIGURACION', '198091', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (67, '2025-11-30 02:13:16.568842', 'CONFIGURACION', '642748', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (68, '2025-11-30 02:14:51.758181', 'CONFIGURACION', '880910', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (69, '2025-11-30 02:16:19.481708', 'CONFIGURACION', '431566', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (70, '2025-11-30 02:22:07.218003', 'CONFIGURACION', '977321', NULL, NULL, 4, 20);
INSERT INTO public.partida VALUES (71, '2025-11-30 03:08:20.520304', 'CONFIGURACION', '177892', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (72, '2025-11-30 03:23:11.5564', 'CONFIGURACION', '962268', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (73, '2025-11-30 03:34:08.048018', 'CONFIGURACION', '265043', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (74, '2025-11-30 03:58:17.980968', 'CONFIGURACION', '417286', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (75, '2025-11-30 04:15:54.105529', 'CONFIGURACION', '396357', NULL, NULL, 3, 17);
INSERT INTO public.partida VALUES (76, '2025-11-30 05:04:21.851435', 'CONFIGURACION', '697859', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (77, '2025-11-30 05:30:47.488563', 'CONFIGURACION', '907165', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (78, '2025-11-30 05:43:25.257609', 'CONFIGURACION', '213877', NULL, NULL, 4, 17);
INSERT INTO public.partida VALUES (79, '2025-11-30 17:53:29.71634', 'CONFIGURACION', '521125', NULL, NULL, 4, 17);


--
-- TOC entry 5567 (class 0 OID 49381)
-- Dependencies: 259
-- Data for Name: partida_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.partida_usuario VALUES (1, 59, 12, 5);
INSERT INTO public.partida_usuario VALUES (2, 54, 1, 5);
INSERT INTO public.partida_usuario VALUES (3, 52, 12, 2);
INSERT INTO public.partida_usuario VALUES (4, 57, 9, 7);
INSERT INTO public.partida_usuario VALUES (5, 17, 7, 14);
INSERT INTO public.partida_usuario VALUES (6, 43, 12, 2);
INSERT INTO public.partida_usuario VALUES (7, 40, 3, 13);
INSERT INTO public.partida_usuario VALUES (8, 40, 14, 10);
INSERT INTO public.partida_usuario VALUES (9, 17, 12, 4);
INSERT INTO public.partida_usuario VALUES (10, 30, 13, 5);
INSERT INTO public.partida_usuario VALUES (11, 42, 13, 4);
INSERT INTO public.partida_usuario VALUES (12, 57, 12, 13);
INSERT INTO public.partida_usuario VALUES (13, 21, 4, 13);
INSERT INTO public.partida_usuario VALUES (14, 42, 3, 11);
INSERT INTO public.partida_usuario VALUES (15, 42, 5, 14);
INSERT INTO public.partida_usuario VALUES (16, 21, 6, 7);
INSERT INTO public.partida_usuario VALUES (17, 17, 6, 7);
INSERT INTO public.partida_usuario VALUES (18, 30, 2, 8);
INSERT INTO public.partida_usuario VALUES (19, 43, 10, 14);
INSERT INTO public.partida_usuario VALUES (20, 42, 6, 12);
INSERT INTO public.partida_usuario VALUES (21, 30, 11, 8);
INSERT INTO public.partida_usuario VALUES (22, 62, 12, 2);
INSERT INTO public.partida_usuario VALUES (23, 43, 8, 14);
INSERT INTO public.partida_usuario VALUES (24, 17, 1, 15);
INSERT INTO public.partida_usuario VALUES (25, 52, 11, 1);
INSERT INTO public.partida_usuario VALUES (26, 58, 12, 6);
INSERT INTO public.partida_usuario VALUES (27, 30, 8, 5);
INSERT INTO public.partida_usuario VALUES (28, 30, 10, 4);
INSERT INTO public.partida_usuario VALUES (29, 45, 2, 2);
INSERT INTO public.partida_usuario VALUES (30, 25, 2, 4);
INSERT INTO public.partida_usuario VALUES (31, 62, 15, 12);
INSERT INTO public.partida_usuario VALUES (32, 57, 2, 7);
INSERT INTO public.partida_usuario VALUES (33, 43, 13, 4);
INSERT INTO public.partida_usuario VALUES (34, 52, 4, 5);
INSERT INTO public.partida_usuario VALUES (35, 58, 8, 4);
INSERT INTO public.partida_usuario VALUES (36, 37, 8, 13);
INSERT INTO public.partida_usuario VALUES (37, 59, 9, 7);
INSERT INTO public.partida_usuario VALUES (38, 62, 8, 9);
INSERT INTO public.partida_usuario VALUES (39, 30, 12, 8);
INSERT INTO public.partida_usuario VALUES (40, 37, 13, 13);
INSERT INTO public.partida_usuario VALUES (41, 62, 7, 11);
INSERT INTO public.partida_usuario VALUES (42, 45, 13, 4);
INSERT INTO public.partida_usuario VALUES (43, 52, 14, 14);
INSERT INTO public.partida_usuario VALUES (44, 45, 9, 12);
INSERT INTO public.partida_usuario VALUES (45, 17, 15, 14);
INSERT INTO public.partida_usuario VALUES (46, 30, 3, 3);
INSERT INTO public.partida_usuario VALUES (47, 30, 6, 8);
INSERT INTO public.partida_usuario VALUES (48, 25, 9, 14);
INSERT INTO public.partida_usuario VALUES (49, 59, 14, 13);
INSERT INTO public.partida_usuario VALUES (50, 57, 15, 10);
INSERT INTO public.partida_usuario VALUES (51, 23, 5, 1);
INSERT INTO public.partida_usuario VALUES (52, 37, 5, 9);
INSERT INTO public.partida_usuario VALUES (53, 71, 35, 60);
INSERT INTO public.partida_usuario VALUES (54, 72, 35, 61);
INSERT INTO public.partida_usuario VALUES (55, 73, 35, 62);
INSERT INTO public.partida_usuario VALUES (56, 74, 35, 63);
INSERT INTO public.partida_usuario VALUES (57, 75, 35, 60);
INSERT INTO public.partida_usuario VALUES (58, 76, 35, 61);
INSERT INTO public.partida_usuario VALUES (59, 77, 35, 62);
INSERT INTO public.partida_usuario VALUES (60, 78, 35, 63);
INSERT INTO public.partida_usuario VALUES (61, 79, 35, 60);
INSERT INTO public.partida_usuario VALUES (62, 80, 35, 61);
INSERT INTO public.partida_usuario VALUES (63, 81, 35, 62);
INSERT INTO public.partida_usuario VALUES (64, 82, 35, 63);
INSERT INTO public.partida_usuario VALUES (65, 83, 35, 60);
INSERT INTO public.partida_usuario VALUES (66, 84, 35, 61);
INSERT INTO public.partida_usuario VALUES (67, 85, 35, 62);
INSERT INTO public.partida_usuario VALUES (68, 86, 35, 63);
INSERT INTO public.partida_usuario VALUES (69, 87, 35, 60);
INSERT INTO public.partida_usuario VALUES (70, 71, 36, 64);
INSERT INTO public.partida_usuario VALUES (71, 75, 36, 65);
INSERT INTO public.partida_usuario VALUES (72, 84, 36, 66);
INSERT INTO public.partida_usuario VALUES (73, 85, 36, 67);
INSERT INTO public.partida_usuario VALUES (74, 78, 36, 64);
INSERT INTO public.partida_usuario VALUES (75, 73, 36, 65);
INSERT INTO public.partida_usuario VALUES (76, 79, 36, 66);
INSERT INTO public.partida_usuario VALUES (77, 86, 36, 67);
INSERT INTO public.partida_usuario VALUES (78, 87, 36, 64);
INSERT INTO public.partida_usuario VALUES (79, 77, 36, 65);
INSERT INTO public.partida_usuario VALUES (80, 80, 36, 66);
INSERT INTO public.partida_usuario VALUES (81, 81, 36, 67);
INSERT INTO public.partida_usuario VALUES (82, 82, 36, 64);
INSERT INTO public.partida_usuario VALUES (83, 76, 36, 65);
INSERT INTO public.partida_usuario VALUES (84, 74, 36, 66);
INSERT INTO public.partida_usuario VALUES (85, 72, 36, 67);
INSERT INTO public.partida_usuario VALUES (86, 83, 36, 64);
INSERT INTO public.partida_usuario VALUES (87, 72, 37, 68);
INSERT INTO public.partida_usuario VALUES (88, 79, 37, 69);
INSERT INTO public.partida_usuario VALUES (89, 76, 37, 70);
INSERT INTO public.partida_usuario VALUES (90, 77, 37, 71);
INSERT INTO public.partida_usuario VALUES (91, 73, 37, 68);
INSERT INTO public.partida_usuario VALUES (92, 74, 37, 69);
INSERT INTO public.partida_usuario VALUES (93, 86, 37, 70);
INSERT INTO public.partida_usuario VALUES (94, 87, 37, 71);
INSERT INTO public.partida_usuario VALUES (95, 78, 37, 68);
INSERT INTO public.partida_usuario VALUES (96, 71, 37, 69);
INSERT INTO public.partida_usuario VALUES (97, 84, 37, 70);
INSERT INTO public.partida_usuario VALUES (98, 75, 37, 71);
INSERT INTO public.partida_usuario VALUES (99, 80, 37, 68);
INSERT INTO public.partida_usuario VALUES (100, 83, 37, 69);
INSERT INTO public.partida_usuario VALUES (101, 81, 37, 70);
INSERT INTO public.partida_usuario VALUES (102, 85, 37, 71);
INSERT INTO public.partida_usuario VALUES (103, 82, 37, 68);
INSERT INTO public.partida_usuario VALUES (104, 88, 40, 72);
INSERT INTO public.partida_usuario VALUES (105, 89, 40, 72);
INSERT INTO public.partida_usuario VALUES (106, 90, 40, 73);
INSERT INTO public.partida_usuario VALUES (107, 91, 44, 81);
INSERT INTO public.partida_usuario VALUES (108, 92, 44, 81);
INSERT INTO public.partida_usuario VALUES (109, 93, 44, 81);
INSERT INTO public.partida_usuario VALUES (110, 94, 44, 81);
INSERT INTO public.partida_usuario VALUES (111, 95, 44, 81);
INSERT INTO public.partida_usuario VALUES (112, 96, 44, 82);
INSERT INTO public.partida_usuario VALUES (113, 97, 44, 82);
INSERT INTO public.partida_usuario VALUES (114, 98, 44, 82);
INSERT INTO public.partida_usuario VALUES (115, 99, 44, 82);
INSERT INTO public.partida_usuario VALUES (116, 100, 44, 83);
INSERT INTO public.partida_usuario VALUES (117, 101, 44, 83);
INSERT INTO public.partida_usuario VALUES (118, 102, 44, 83);
INSERT INTO public.partida_usuario VALUES (119, 103, 44, 83);
INSERT INTO public.partida_usuario VALUES (120, 104, 44, 83);
INSERT INTO public.partida_usuario VALUES (121, 105, 44, 84);
INSERT INTO public.partida_usuario VALUES (122, 106, 44, 84);
INSERT INTO public.partida_usuario VALUES (123, 107, 44, 84);
INSERT INTO public.partida_usuario VALUES (124, 108, 44, 84);
INSERT INTO public.partida_usuario VALUES (125, 91, 46, 85);
INSERT INTO public.partida_usuario VALUES (126, 92, 46, 85);
INSERT INTO public.partida_usuario VALUES (127, 93, 46, 85);
INSERT INTO public.partida_usuario VALUES (128, 94, 46, 85);
INSERT INTO public.partida_usuario VALUES (129, 95, 46, 85);
INSERT INTO public.partida_usuario VALUES (130, 96, 46, 86);
INSERT INTO public.partida_usuario VALUES (131, 97, 46, 86);
INSERT INTO public.partida_usuario VALUES (132, 98, 46, 86);
INSERT INTO public.partida_usuario VALUES (133, 99, 46, 86);
INSERT INTO public.partida_usuario VALUES (134, 100, 46, 87);
INSERT INTO public.partida_usuario VALUES (135, 101, 46, 87);
INSERT INTO public.partida_usuario VALUES (136, 102, 46, 87);
INSERT INTO public.partida_usuario VALUES (137, 103, 46, 87);
INSERT INTO public.partida_usuario VALUES (138, 104, 46, 87);
INSERT INTO public.partida_usuario VALUES (139, 105, 46, 88);
INSERT INTO public.partida_usuario VALUES (140, 106, 46, 88);
INSERT INTO public.partida_usuario VALUES (141, 107, 46, 88);
INSERT INTO public.partida_usuario VALUES (142, 108, 46, 88);
INSERT INTO public.partida_usuario VALUES (144, 110, 49, 91);
INSERT INTO public.partida_usuario VALUES (145, 111, 49, 92);
INSERT INTO public.partida_usuario VALUES (146, 112, 49, 93);
INSERT INTO public.partida_usuario VALUES (147, 113, 49, 94);
INSERT INTO public.partida_usuario VALUES (148, 81, 50, 95);
INSERT INTO public.partida_usuario VALUES (149, 83, 50, 95);
INSERT INTO public.partida_usuario VALUES (150, 75, 50, 95);
INSERT INTO public.partida_usuario VALUES (151, 74, 50, 95);
INSERT INTO public.partida_usuario VALUES (152, 73, 50, 95);
INSERT INTO public.partida_usuario VALUES (153, 71, 50, 96);
INSERT INTO public.partida_usuario VALUES (154, 87, 50, 96);
INSERT INTO public.partida_usuario VALUES (155, 84, 50, 96);
INSERT INTO public.partida_usuario VALUES (156, 78, 50, 96);
INSERT INTO public.partida_usuario VALUES (157, 86, 50, 97);
INSERT INTO public.partida_usuario VALUES (158, 76, 50, 97);
INSERT INTO public.partida_usuario VALUES (159, 72, 50, 97);
INSERT INTO public.partida_usuario VALUES (160, 82, 50, 97);
INSERT INTO public.partida_usuario VALUES (161, 80, 50, 98);
INSERT INTO public.partida_usuario VALUES (162, 77, 50, 98);
INSERT INTO public.partida_usuario VALUES (163, 79, 50, 98);
INSERT INTO public.partida_usuario VALUES (164, 85, 50, 98);
INSERT INTO public.partida_usuario VALUES (165, 75, 51, 99);
INSERT INTO public.partida_usuario VALUES (166, 86, 51, 99);
INSERT INTO public.partida_usuario VALUES (167, 71, 51, 99);
INSERT INTO public.partida_usuario VALUES (168, 83, 51, 99);
INSERT INTO public.partida_usuario VALUES (169, 81, 51, 99);
INSERT INTO public.partida_usuario VALUES (170, 74, 51, 100);
INSERT INTO public.partida_usuario VALUES (171, 79, 51, 100);
INSERT INTO public.partida_usuario VALUES (172, 72, 51, 100);
INSERT INTO public.partida_usuario VALUES (173, 76, 51, 100);
INSERT INTO public.partida_usuario VALUES (174, 82, 51, 101);
INSERT INTO public.partida_usuario VALUES (175, 84, 51, 101);
INSERT INTO public.partida_usuario VALUES (176, 77, 51, 101);
INSERT INTO public.partida_usuario VALUES (177, 78, 51, 101);
INSERT INTO public.partida_usuario VALUES (178, 87, 51, 102);
INSERT INTO public.partida_usuario VALUES (179, 80, 51, 102);
INSERT INTO public.partida_usuario VALUES (180, 85, 51, 102);
INSERT INTO public.partida_usuario VALUES (181, 73, 51, 102);
INSERT INTO public.partida_usuario VALUES (182, 85, 52, 103);
INSERT INTO public.partida_usuario VALUES (183, 79, 52, 103);
INSERT INTO public.partida_usuario VALUES (184, 80, 52, 103);
INSERT INTO public.partida_usuario VALUES (185, 87, 52, 103);
INSERT INTO public.partida_usuario VALUES (186, 71, 52, 104);
INSERT INTO public.partida_usuario VALUES (187, 77, 52, 104);
INSERT INTO public.partida_usuario VALUES (188, 78, 52, 104);
INSERT INTO public.partida_usuario VALUES (189, 76, 52, 104);
INSERT INTO public.partida_usuario VALUES (190, 82, 52, 105);
INSERT INTO public.partida_usuario VALUES (191, 84, 52, 105);
INSERT INTO public.partida_usuario VALUES (192, 75, 52, 105);
INSERT INTO public.partida_usuario VALUES (193, 72, 52, 105);
INSERT INTO public.partida_usuario VALUES (194, 81, 52, 105);
INSERT INTO public.partida_usuario VALUES (195, 74, 52, 106);
INSERT INTO public.partida_usuario VALUES (196, 73, 52, 106);
INSERT INTO public.partida_usuario VALUES (197, 86, 52, 106);
INSERT INTO public.partida_usuario VALUES (198, 83, 52, 106);
INSERT INTO public.partida_usuario VALUES (199, 78, 53, 107);
INSERT INTO public.partida_usuario VALUES (200, 81, 53, 107);
INSERT INTO public.partida_usuario VALUES (201, 87, 53, 107);
INSERT INTO public.partida_usuario VALUES (202, 73, 53, 107);
INSERT INTO public.partida_usuario VALUES (203, 72, 53, 107);
INSERT INTO public.partida_usuario VALUES (204, 71, 53, 108);
INSERT INTO public.partida_usuario VALUES (205, 86, 53, 108);
INSERT INTO public.partida_usuario VALUES (206, 75, 53, 108);
INSERT INTO public.partida_usuario VALUES (207, 80, 53, 108);
INSERT INTO public.partida_usuario VALUES (208, 79, 53, 109);
INSERT INTO public.partida_usuario VALUES (209, 84, 53, 109);
INSERT INTO public.partida_usuario VALUES (210, 74, 53, 109);
INSERT INTO public.partida_usuario VALUES (211, 77, 53, 109);
INSERT INTO public.partida_usuario VALUES (212, 76, 53, 110);
INSERT INTO public.partida_usuario VALUES (213, 83, 53, 110);
INSERT INTO public.partida_usuario VALUES (214, 85, 53, 110);
INSERT INTO public.partida_usuario VALUES (215, 82, 53, 110);
INSERT INTO public.partida_usuario VALUES (216, 73, 54, 111);
INSERT INTO public.partida_usuario VALUES (217, 82, 54, 111);
INSERT INTO public.partida_usuario VALUES (218, 81, 54, 111);
INSERT INTO public.partida_usuario VALUES (219, 76, 54, 111);
INSERT INTO public.partida_usuario VALUES (220, 84, 54, 111);
INSERT INTO public.partida_usuario VALUES (221, 86, 54, 112);
INSERT INTO public.partida_usuario VALUES (222, 87, 54, 112);
INSERT INTO public.partida_usuario VALUES (223, 80, 54, 112);
INSERT INTO public.partida_usuario VALUES (224, 71, 54, 112);
INSERT INTO public.partida_usuario VALUES (225, 78, 54, 113);
INSERT INTO public.partida_usuario VALUES (226, 77, 54, 113);
INSERT INTO public.partida_usuario VALUES (227, 83, 54, 113);
INSERT INTO public.partida_usuario VALUES (228, 74, 54, 113);
INSERT INTO public.partida_usuario VALUES (229, 85, 54, 114);
INSERT INTO public.partida_usuario VALUES (230, 75, 54, 114);
INSERT INTO public.partida_usuario VALUES (231, 79, 54, 114);
INSERT INTO public.partida_usuario VALUES (232, 72, 54, 114);
INSERT INTO public.partida_usuario VALUES (233, 74, 55, 115);
INSERT INTO public.partida_usuario VALUES (234, 80, 55, 115);
INSERT INTO public.partida_usuario VALUES (235, 79, 55, 115);
INSERT INTO public.partida_usuario VALUES (236, 73, 55, 115);
INSERT INTO public.partida_usuario VALUES (237, 78, 55, 115);
INSERT INTO public.partida_usuario VALUES (238, 85, 55, 116);
INSERT INTO public.partida_usuario VALUES (239, 76, 55, 116);
INSERT INTO public.partida_usuario VALUES (240, 77, 55, 116);
INSERT INTO public.partida_usuario VALUES (241, 75, 55, 116);
INSERT INTO public.partida_usuario VALUES (242, 71, 55, 117);
INSERT INTO public.partida_usuario VALUES (243, 83, 55, 117);
INSERT INTO public.partida_usuario VALUES (244, 86, 55, 117);
INSERT INTO public.partida_usuario VALUES (245, 84, 55, 117);
INSERT INTO public.partida_usuario VALUES (246, 82, 55, 118);
INSERT INTO public.partida_usuario VALUES (247, 87, 55, 118);
INSERT INTO public.partida_usuario VALUES (248, 72, 55, 118);
INSERT INTO public.partida_usuario VALUES (249, 81, 55, 118);
INSERT INTO public.partida_usuario VALUES (250, 78, 56, 119);
INSERT INTO public.partida_usuario VALUES (251, 84, 56, 119);
INSERT INTO public.partida_usuario VALUES (252, 86, 56, 119);
INSERT INTO public.partida_usuario VALUES (253, 71, 56, 119);
INSERT INTO public.partida_usuario VALUES (254, 72, 56, 119);
INSERT INTO public.partida_usuario VALUES (255, 82, 56, 120);
INSERT INTO public.partida_usuario VALUES (256, 83, 56, 120);
INSERT INTO public.partida_usuario VALUES (257, 81, 56, 120);
INSERT INTO public.partida_usuario VALUES (258, 79, 56, 120);
INSERT INTO public.partida_usuario VALUES (259, 85, 56, 121);
INSERT INTO public.partida_usuario VALUES (260, 73, 56, 121);
INSERT INTO public.partida_usuario VALUES (261, 80, 56, 121);
INSERT INTO public.partida_usuario VALUES (262, 87, 56, 121);
INSERT INTO public.partida_usuario VALUES (263, 74, 56, 122);
INSERT INTO public.partida_usuario VALUES (264, 76, 56, 122);
INSERT INTO public.partida_usuario VALUES (265, 75, 56, 122);
INSERT INTO public.partida_usuario VALUES (266, 77, 56, 122);
INSERT INTO public.partida_usuario VALUES (267, 86, 57, 123);
INSERT INTO public.partida_usuario VALUES (268, 81, 57, 123);
INSERT INTO public.partida_usuario VALUES (269, 80, 57, 123);
INSERT INTO public.partida_usuario VALUES (270, 84, 57, 123);
INSERT INTO public.partida_usuario VALUES (271, 83, 57, 123);
INSERT INTO public.partida_usuario VALUES (272, 73, 57, 124);
INSERT INTO public.partida_usuario VALUES (273, 75, 57, 124);
INSERT INTO public.partida_usuario VALUES (274, 78, 57, 124);
INSERT INTO public.partida_usuario VALUES (275, 79, 57, 124);
INSERT INTO public.partida_usuario VALUES (276, 87, 57, 125);
INSERT INTO public.partida_usuario VALUES (277, 85, 57, 125);
INSERT INTO public.partida_usuario VALUES (278, 74, 57, 125);
INSERT INTO public.partida_usuario VALUES (279, 72, 57, 125);
INSERT INTO public.partida_usuario VALUES (280, 82, 57, 126);
INSERT INTO public.partida_usuario VALUES (281, 77, 57, 126);
INSERT INTO public.partida_usuario VALUES (282, 76, 57, 126);
INSERT INTO public.partida_usuario VALUES (283, 71, 57, 126);
INSERT INTO public.partida_usuario VALUES (284, 84, 59, 127);
INSERT INTO public.partida_usuario VALUES (285, 74, 59, 127);
INSERT INTO public.partida_usuario VALUES (286, 78, 59, 127);
INSERT INTO public.partida_usuario VALUES (287, 86, 59, 127);
INSERT INTO public.partida_usuario VALUES (288, 82, 59, 127);
INSERT INTO public.partida_usuario VALUES (289, 75, 59, 127);
INSERT INTO public.partida_usuario VALUES (290, 87, 59, 128);
INSERT INTO public.partida_usuario VALUES (291, 72, 59, 128);
INSERT INTO public.partida_usuario VALUES (292, 77, 59, 128);
INSERT INTO public.partida_usuario VALUES (293, 81, 59, 128);
INSERT INTO public.partida_usuario VALUES (294, 83, 59, 128);
INSERT INTO public.partida_usuario VALUES (295, 73, 59, 128);
INSERT INTO public.partida_usuario VALUES (296, 79, 59, 129);
INSERT INTO public.partida_usuario VALUES (297, 76, 59, 129);
INSERT INTO public.partida_usuario VALUES (298, 80, 59, 129);
INSERT INTO public.partida_usuario VALUES (299, 85, 59, 129);
INSERT INTO public.partida_usuario VALUES (300, 71, 59, 129);
INSERT INTO public.partida_usuario VALUES (301, 72, 60, 130);
INSERT INTO public.partida_usuario VALUES (302, 84, 60, 130);
INSERT INTO public.partida_usuario VALUES (303, 77, 60, 130);
INSERT INTO public.partida_usuario VALUES (304, 87, 60, 130);
INSERT INTO public.partida_usuario VALUES (305, 78, 60, 130);
INSERT INTO public.partida_usuario VALUES (306, 75, 60, 131);
INSERT INTO public.partida_usuario VALUES (307, 81, 60, 131);
INSERT INTO public.partida_usuario VALUES (308, 74, 60, 131);
INSERT INTO public.partida_usuario VALUES (309, 71, 60, 131);
INSERT INTO public.partida_usuario VALUES (310, 83, 60, 132);
INSERT INTO public.partida_usuario VALUES (311, 86, 60, 132);
INSERT INTO public.partida_usuario VALUES (312, 73, 60, 132);
INSERT INTO public.partida_usuario VALUES (313, 76, 60, 132);
INSERT INTO public.partida_usuario VALUES (314, 79, 60, 133);
INSERT INTO public.partida_usuario VALUES (315, 82, 60, 133);
INSERT INTO public.partida_usuario VALUES (316, 80, 60, 133);
INSERT INTO public.partida_usuario VALUES (317, 85, 60, 133);
INSERT INTO public.partida_usuario VALUES (327, 78, 71, 155);
INSERT INTO public.partida_usuario VALUES (328, 86, 71, 155);
INSERT INTO public.partida_usuario VALUES (329, 84, 71, 155);
INSERT INTO public.partida_usuario VALUES (330, 71, 71, 155);
INSERT INTO public.partida_usuario VALUES (331, 73, 71, 155);
INSERT INTO public.partida_usuario VALUES (332, 77, 71, 156);
INSERT INTO public.partida_usuario VALUES (333, 76, 71, 156);
INSERT INTO public.partida_usuario VALUES (334, 80, 71, 156);
INSERT INTO public.partida_usuario VALUES (335, 81, 71, 156);
INSERT INTO public.partida_usuario VALUES (336, 79, 71, 157);
INSERT INTO public.partida_usuario VALUES (337, 75, 71, 157);
INSERT INTO public.partida_usuario VALUES (338, 85, 71, 157);
INSERT INTO public.partida_usuario VALUES (339, 72, 71, 157);
INSERT INTO public.partida_usuario VALUES (340, 83, 71, 158);
INSERT INTO public.partida_usuario VALUES (341, 74, 71, 158);
INSERT INTO public.partida_usuario VALUES (342, 87, 71, 158);
INSERT INTO public.partida_usuario VALUES (343, 82, 71, 158);
INSERT INTO public.partida_usuario VALUES (344, 81, 72, 159);
INSERT INTO public.partida_usuario VALUES (345, 85, 72, 159);
INSERT INTO public.partida_usuario VALUES (346, 79, 72, 159);
INSERT INTO public.partida_usuario VALUES (347, 87, 72, 159);
INSERT INTO public.partida_usuario VALUES (348, 82, 72, 159);
INSERT INTO public.partida_usuario VALUES (349, 84, 72, 160);
INSERT INTO public.partida_usuario VALUES (350, 78, 72, 160);
INSERT INTO public.partida_usuario VALUES (351, 80, 72, 160);
INSERT INTO public.partida_usuario VALUES (352, 73, 72, 160);
INSERT INTO public.partida_usuario VALUES (353, 75, 72, 161);
INSERT INTO public.partida_usuario VALUES (354, 72, 72, 161);
INSERT INTO public.partida_usuario VALUES (355, 86, 72, 161);
INSERT INTO public.partida_usuario VALUES (356, 77, 72, 161);
INSERT INTO public.partida_usuario VALUES (357, 74, 72, 162);
INSERT INTO public.partida_usuario VALUES (358, 83, 72, 162);
INSERT INTO public.partida_usuario VALUES (359, 71, 72, 162);
INSERT INTO public.partida_usuario VALUES (360, 76, 72, 162);
INSERT INTO public.partida_usuario VALUES (361, 82, 73, 163);
INSERT INTO public.partida_usuario VALUES (362, 85, 73, 163);
INSERT INTO public.partida_usuario VALUES (363, 81, 73, 163);
INSERT INTO public.partida_usuario VALUES (364, 80, 73, 163);
INSERT INTO public.partida_usuario VALUES (365, 72, 73, 163);
INSERT INTO public.partida_usuario VALUES (366, 87, 73, 164);
INSERT INTO public.partida_usuario VALUES (367, 71, 73, 164);
INSERT INTO public.partida_usuario VALUES (368, 86, 73, 164);
INSERT INTO public.partida_usuario VALUES (369, 78, 73, 164);
INSERT INTO public.partida_usuario VALUES (370, 79, 73, 165);
INSERT INTO public.partida_usuario VALUES (371, 76, 73, 165);
INSERT INTO public.partida_usuario VALUES (372, 75, 73, 165);
INSERT INTO public.partida_usuario VALUES (373, 73, 73, 165);
INSERT INTO public.partida_usuario VALUES (374, 83, 73, 166);
INSERT INTO public.partida_usuario VALUES (375, 77, 73, 166);
INSERT INTO public.partida_usuario VALUES (376, 74, 73, 166);
INSERT INTO public.partida_usuario VALUES (377, 84, 73, 166);
INSERT INTO public.partida_usuario VALUES (378, 85, 74, 167);
INSERT INTO public.partida_usuario VALUES (379, 75, 74, 167);
INSERT INTO public.partida_usuario VALUES (380, 82, 74, 167);
INSERT INTO public.partida_usuario VALUES (381, 80, 74, 167);
INSERT INTO public.partida_usuario VALUES (382, 81, 74, 167);
INSERT INTO public.partida_usuario VALUES (383, 77, 74, 168);
INSERT INTO public.partida_usuario VALUES (384, 73, 74, 168);
INSERT INTO public.partida_usuario VALUES (385, 78, 74, 168);
INSERT INTO public.partida_usuario VALUES (386, 71, 74, 168);
INSERT INTO public.partida_usuario VALUES (387, 84, 74, 169);
INSERT INTO public.partida_usuario VALUES (388, 76, 74, 169);
INSERT INTO public.partida_usuario VALUES (389, 83, 74, 169);
INSERT INTO public.partida_usuario VALUES (390, 87, 74, 169);
INSERT INTO public.partida_usuario VALUES (391, 74, 74, 170);
INSERT INTO public.partida_usuario VALUES (392, 72, 74, 170);
INSERT INTO public.partida_usuario VALUES (393, 86, 74, 170);
INSERT INTO public.partida_usuario VALUES (394, 79, 74, 170);
INSERT INTO public.partida_usuario VALUES (395, 77, 75, 171);
INSERT INTO public.partida_usuario VALUES (396, 81, 75, 171);
INSERT INTO public.partida_usuario VALUES (397, 75, 75, 171);
INSERT INTO public.partida_usuario VALUES (398, 71, 75, 171);
INSERT INTO public.partida_usuario VALUES (399, 76, 75, 171);
INSERT INTO public.partida_usuario VALUES (400, 73, 75, 171);
INSERT INTO public.partida_usuario VALUES (401, 84, 75, 172);
INSERT INTO public.partida_usuario VALUES (402, 78, 75, 172);
INSERT INTO public.partida_usuario VALUES (403, 87, 75, 172);
INSERT INTO public.partida_usuario VALUES (404, 82, 75, 172);
INSERT INTO public.partida_usuario VALUES (405, 86, 75, 172);
INSERT INTO public.partida_usuario VALUES (406, 80, 75, 172);
INSERT INTO public.partida_usuario VALUES (407, 79, 75, 173);
INSERT INTO public.partida_usuario VALUES (408, 83, 75, 173);
INSERT INTO public.partida_usuario VALUES (409, 74, 75, 173);
INSERT INTO public.partida_usuario VALUES (410, 85, 75, 173);
INSERT INTO public.partida_usuario VALUES (411, 72, 75, 173);
INSERT INTO public.partida_usuario VALUES (412, 76, 76, 174);
INSERT INTO public.partida_usuario VALUES (413, 85, 76, 174);
INSERT INTO public.partida_usuario VALUES (414, 83, 76, 174);
INSERT INTO public.partida_usuario VALUES (415, 80, 76, 174);
INSERT INTO public.partida_usuario VALUES (416, 72, 76, 174);
INSERT INTO public.partida_usuario VALUES (417, 86, 76, 175);
INSERT INTO public.partida_usuario VALUES (418, 79, 76, 175);
INSERT INTO public.partida_usuario VALUES (419, 78, 76, 175);
INSERT INTO public.partida_usuario VALUES (420, 87, 76, 175);
INSERT INTO public.partida_usuario VALUES (421, 77, 76, 176);
INSERT INTO public.partida_usuario VALUES (422, 84, 76, 176);
INSERT INTO public.partida_usuario VALUES (423, 71, 76, 176);
INSERT INTO public.partida_usuario VALUES (424, 73, 76, 176);
INSERT INTO public.partida_usuario VALUES (425, 75, 76, 177);
INSERT INTO public.partida_usuario VALUES (426, 82, 76, 177);
INSERT INTO public.partida_usuario VALUES (427, 74, 76, 177);
INSERT INTO public.partida_usuario VALUES (428, 81, 76, 177);
INSERT INTO public.partida_usuario VALUES (429, 86, 77, 178);
INSERT INTO public.partida_usuario VALUES (430, 82, 77, 178);
INSERT INTO public.partida_usuario VALUES (431, 74, 77, 178);
INSERT INTO public.partida_usuario VALUES (432, 76, 77, 178);
INSERT INTO public.partida_usuario VALUES (433, 81, 77, 178);
INSERT INTO public.partida_usuario VALUES (434, 77, 77, 179);
INSERT INTO public.partida_usuario VALUES (435, 75, 77, 179);
INSERT INTO public.partida_usuario VALUES (436, 79, 77, 179);
INSERT INTO public.partida_usuario VALUES (437, 71, 77, 179);
INSERT INTO public.partida_usuario VALUES (438, 80, 77, 180);
INSERT INTO public.partida_usuario VALUES (439, 85, 77, 180);
INSERT INTO public.partida_usuario VALUES (440, 87, 77, 180);
INSERT INTO public.partida_usuario VALUES (441, 83, 77, 180);
INSERT INTO public.partida_usuario VALUES (442, 84, 77, 181);
INSERT INTO public.partida_usuario VALUES (443, 73, 77, 181);
INSERT INTO public.partida_usuario VALUES (444, 72, 77, 181);
INSERT INTO public.partida_usuario VALUES (445, 78, 77, 181);
INSERT INTO public.partida_usuario VALUES (446, 83, 78, 182);
INSERT INTO public.partida_usuario VALUES (447, 87, 78, 182);
INSERT INTO public.partida_usuario VALUES (448, 78, 78, 182);
INSERT INTO public.partida_usuario VALUES (449, 76, 78, 182);
INSERT INTO public.partida_usuario VALUES (450, 79, 78, 182);
INSERT INTO public.partida_usuario VALUES (451, 75, 78, 183);
INSERT INTO public.partida_usuario VALUES (452, 73, 78, 183);
INSERT INTO public.partida_usuario VALUES (453, 85, 78, 183);
INSERT INTO public.partida_usuario VALUES (454, 82, 78, 183);
INSERT INTO public.partida_usuario VALUES (455, 81, 78, 184);
INSERT INTO public.partida_usuario VALUES (456, 71, 78, 184);
INSERT INTO public.partida_usuario VALUES (457, 80, 78, 184);
INSERT INTO public.partida_usuario VALUES (458, 77, 78, 184);
INSERT INTO public.partida_usuario VALUES (459, 72, 78, 185);
INSERT INTO public.partida_usuario VALUES (460, 86, 78, 185);
INSERT INTO public.partida_usuario VALUES (461, 84, 78, 185);
INSERT INTO public.partida_usuario VALUES (462, 74, 78, 185);
INSERT INTO public.partida_usuario VALUES (463, 75, 79, 186);
INSERT INTO public.partida_usuario VALUES (464, 84, 79, 186);
INSERT INTO public.partida_usuario VALUES (465, 77, 79, 186);
INSERT INTO public.partida_usuario VALUES (466, 87, 79, 186);
INSERT INTO public.partida_usuario VALUES (467, 79, 79, 186);
INSERT INTO public.partida_usuario VALUES (468, 80, 79, 187);
INSERT INTO public.partida_usuario VALUES (469, 83, 79, 187);
INSERT INTO public.partida_usuario VALUES (470, 85, 79, 187);
INSERT INTO public.partida_usuario VALUES (471, 72, 79, 187);
INSERT INTO public.partida_usuario VALUES (472, 71, 79, 188);
INSERT INTO public.partida_usuario VALUES (473, 82, 79, 188);
INSERT INTO public.partida_usuario VALUES (474, 76, 79, 188);
INSERT INTO public.partida_usuario VALUES (475, 78, 79, 188);
INSERT INTO public.partida_usuario VALUES (476, 73, 79, 189);
INSERT INTO public.partida_usuario VALUES (477, 86, 79, 189);
INSERT INTO public.partida_usuario VALUES (478, 74, 79, 189);
INSERT INTO public.partida_usuario VALUES (479, 81, 79, 189);


--
-- TOC entry 5569 (class 0 OID 49392)
-- Dependencies: 261
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.persona VALUES (11, 'Arquetipo 1', 'https://example.com/imagen1.jpg', 'Este es el contexto de la persona 1, describe sus necesidades y problemas.', 67);
INSERT INTO public.persona VALUES (12, 'Arquetipo 2', 'https://example.com/imagen2.jpg', 'Este es el contexto de la persona 2, describe sus necesidades y problemas.', 37);
INSERT INTO public.persona VALUES (13, 'Arquetipo 3', 'https://example.com/imagen3.jpg', 'Este es el contexto de la persona 3, describe sus necesidades y problemas.', 51);
INSERT INTO public.persona VALUES (14, 'Arquetipo 4', 'https://example.com/imagen4.jpg', 'Este es el contexto de la persona 4, describe sus necesidades y problemas.', 49);
INSERT INTO public.persona VALUES (15, 'Arquetipo 5', 'https://example.com/imagen5.jpg', 'Este es el contexto de la persona 5, describe sus necesidades y problemas.', 40);
INSERT INTO public.persona VALUES (16, 'Arquetipo 6', 'https://example.com/imagen6.jpg', 'Este es el contexto de la persona 6, describe sus necesidades y problemas.', 55);
INSERT INTO public.persona VALUES (17, 'Arquetipo 7', 'https://example.com/imagen7.jpg', 'Este es el contexto de la persona 7, describe sus necesidades y problemas.', 62);
INSERT INTO public.persona VALUES (18, 'Arquetipo 8', 'https://example.com/imagen8.jpg', 'Este es el contexto de la persona 8, describe sus necesidades y problemas.', 55);
INSERT INTO public.persona VALUES (19, 'Arquetipo 9', 'https://example.com/imagen9.jpg', 'Este es el contexto de la persona 9, describe sus necesidades y problemas.', 43);
INSERT INTO public.persona VALUES (20, 'Arquetipo 10', 'https://example.com/imagen10.jpg', 'Este es el contexto de la persona 10, describe sus necesidades y problemas.', 54);


--
-- TOC entry 5571 (class 0 OID 49405)
-- Dependencies: 263
-- Data for Name: profesor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profesor VALUES (14, 15);
INSERT INTO public.profesor VALUES (15, 16);
INSERT INTO public.profesor VALUES (16, 20);
INSERT INTO public.profesor VALUES (17, 27);
INSERT INTO public.profesor VALUES (18, 28);
INSERT INTO public.profesor VALUES (19, 29);
INSERT INTO public.profesor VALUES (20, 31);
INSERT INTO public.profesor VALUES (21, 33);
INSERT INTO public.profesor VALUES (22, 34);
INSERT INTO public.profesor VALUES (23, 38);


--
-- TOC entry 5573 (class 0 OID 49414)
-- Dependencies: 265
-- Data for Name: ranking; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5575 (class 0 OID 49426)
-- Dependencies: 267
-- Data for Name: solucion_lego; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.solucion_lego VALUES (1, 13, '2025-01-14 06:53:11.365477', 'Esta es la descripción de la solución LEGO para el equipo 13', 'http://example.com/foto1.jpg');
INSERT INTO public.solucion_lego VALUES (2, 11, '2024-11-01 03:29:10.82534', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto2.jpg');
INSERT INTO public.solucion_lego VALUES (3, 4, '2024-08-29 05:22:58.221633', 'Esta es la descripción de la solución LEGO para el equipo 4', 'http://example.com/foto3.jpg');
INSERT INTO public.solucion_lego VALUES (4, 8, '2024-04-22 07:32:33.441879', 'Esta es la descripción de la solución LEGO para el equipo 8', 'http://example.com/foto4.jpg');
INSERT INTO public.solucion_lego VALUES (5, 5, '2025-06-26 00:13:39.563241', 'Esta es la descripción de la solución LEGO para el equipo 5', 'http://example.com/foto5.jpg');
INSERT INTO public.solucion_lego VALUES (6, 4, '2024-06-21 04:37:40.394021', 'Esta es la descripción de la solución LEGO para el equipo 4', 'http://example.com/foto6.jpg');
INSERT INTO public.solucion_lego VALUES (7, 11, '2024-03-27 22:55:40.20583', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto7.jpg');
INSERT INTO public.solucion_lego VALUES (8, 11, '2024-09-14 10:03:18.102579', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto8.jpg');
INSERT INTO public.solucion_lego VALUES (9, 12, '2024-06-07 14:50:55.172765', 'Esta es la descripción de la solución LEGO para el equipo 12', 'http://example.com/foto9.jpg');
INSERT INTO public.solucion_lego VALUES (11, 11, '2025-07-08 01:30:08.873501', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto11.jpg');
INSERT INTO public.solucion_lego VALUES (12, 9, '2025-05-11 05:52:30.326208', 'Esta es la descripción de la solución LEGO para el equipo 9', 'http://example.com/foto12.jpg');
INSERT INTO public.solucion_lego VALUES (13, 4, '2025-03-18 03:37:26.962707', 'Esta es la descripción de la solución LEGO para el equipo 4', 'http://example.com/foto13.jpg');
INSERT INTO public.solucion_lego VALUES (14, 5, '2024-07-27 17:45:44.832772', 'Esta es la descripción de la solución LEGO para el equipo 5', 'http://example.com/foto14.jpg');
INSERT INTO public.solucion_lego VALUES (16, 7, '2024-03-03 00:21:11.444528', 'Esta es la descripción de la solución LEGO para el equipo 7', 'http://example.com/foto16.jpg');
INSERT INTO public.solucion_lego VALUES (18, 5, '2025-04-02 06:48:12.859195', 'Esta es la descripción de la solución LEGO para el equipo 5', 'http://example.com/foto18.jpg');
INSERT INTO public.solucion_lego VALUES (19, 7, '2025-05-04 04:02:16.013743', 'Esta es la descripción de la solución LEGO para el equipo 7', 'http://example.com/foto19.jpg');
INSERT INTO public.solucion_lego VALUES (20, 12, '2024-07-28 03:36:48.53712', 'Esta es la descripción de la solución LEGO para el equipo 12', 'http://example.com/foto20.jpg');
INSERT INTO public.solucion_lego VALUES (21, 8, '2024-11-13 17:35:03.350653', 'Esta es la descripción de la solución LEGO para el equipo 8', 'http://example.com/foto21.jpg');
INSERT INTO public.solucion_lego VALUES (22, 15, '2025-05-09 02:58:50.311332', 'Esta es la descripción de la solución LEGO para el equipo 15', 'http://example.com/foto22.jpg');
INSERT INTO public.solucion_lego VALUES (23, 2, '2025-02-26 11:06:02.013206', 'Esta es la descripción de la solución LEGO para el equipo 2', 'http://example.com/foto23.jpg');
INSERT INTO public.solucion_lego VALUES (24, 15, '2025-09-11 01:16:45.751197', 'Esta es la descripción de la solución LEGO para el equipo 15', 'http://example.com/foto24.jpg');
INSERT INTO public.solucion_lego VALUES (25, 15, '2025-02-25 00:12:14.110616', 'Esta es la descripción de la solución LEGO para el equipo 15', 'http://example.com/foto25.jpg');
INSERT INTO public.solucion_lego VALUES (26, 15, '2025-07-27 22:41:01.855625', 'Esta es la descripción de la solución LEGO para el equipo 15', 'http://example.com/foto26.jpg');
INSERT INTO public.solucion_lego VALUES (27, 11, '2024-02-02 02:16:32.937498', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto27.jpg');
INSERT INTO public.solucion_lego VALUES (28, 4, '2025-06-26 17:17:55.143655', 'Esta es la descripción de la solución LEGO para el equipo 4', 'http://example.com/foto28.jpg');
INSERT INTO public.solucion_lego VALUES (29, 13, '2025-09-07 10:15:06.126331', 'Esta es la descripción de la solución LEGO para el equipo 13', 'http://example.com/foto29.jpg');
INSERT INTO public.solucion_lego VALUES (30, 14, '2024-10-20 18:38:26.823521', 'Esta es la descripción de la solución LEGO para el equipo 14', 'http://example.com/foto30.jpg');
INSERT INTO public.solucion_lego VALUES (31, 11, '2025-03-12 12:45:36.324355', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto31.jpg');
INSERT INTO public.solucion_lego VALUES (32, 5, '2025-07-26 14:27:50.149199', 'Esta es la descripción de la solución LEGO para el equipo 5', 'http://example.com/foto32.jpg');
INSERT INTO public.solucion_lego VALUES (33, 13, '2025-05-29 22:05:24.125474', 'Esta es la descripción de la solución LEGO para el equipo 13', 'http://example.com/foto33.jpg');
INSERT INTO public.solucion_lego VALUES (34, 11, '2025-04-22 05:43:50.075003', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto34.jpg');
INSERT INTO public.solucion_lego VALUES (35, 12, '2024-07-16 13:54:06.16917', 'Esta es la descripción de la solución LEGO para el equipo 12', 'http://example.com/foto35.jpg');
INSERT INTO public.solucion_lego VALUES (37, 1, '2024-05-02 06:02:40.664781', 'Esta es la descripción de la solución LEGO para el equipo 1', 'http://example.com/foto37.jpg');
INSERT INTO public.solucion_lego VALUES (38, 11, '2025-05-03 10:56:01.266189', 'Esta es la descripción de la solución LEGO para el equipo 11', 'http://example.com/foto38.jpg');
INSERT INTO public.solucion_lego VALUES (39, 2, '2024-10-26 00:26:09.728801', 'Esta es la descripción de la solución LEGO para el equipo 2', 'http://example.com/foto39.jpg');
INSERT INTO public.solucion_lego VALUES (40, 13, '2024-08-11 07:48:52.99491', 'Esta es la descripción de la solución LEGO para el equipo 13', 'http://example.com/foto40.jpg');
INSERT INTO public.solucion_lego VALUES (10, 2, '2025-10-09 19:00:52.269227', '', 'https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_2_1763523242.jpg');
INSERT INTO public.solucion_lego VALUES (15, 3, '2024-06-20 13:29:55.270537', '', 'https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_3_1763523254.jpg');
INSERT INTO public.solucion_lego VALUES (36, 4, '2025-10-03 16:38:45.533786', '', 'https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_4_1763523264.jpg');
INSERT INTO public.solucion_lego VALUES (17, 1, '2024-10-12 02:57:06.985563', '', 'https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_1_1763523391.jpeg');


--
-- TOC entry 5577 (class 0 OID 49439)
-- Dependencies: 269
-- Data for Name: tema_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tema_desafio VALUES (11, 'Sostenibilidad Ambiental', 'Crear soluciones para reducir el impacto ecológico en la ciudad.', 'ACTIVO');
INSERT INTO public.tema_desafio VALUES (12, 'Salud y Bienestar', 'Desarrollar ideas para mejorar la calidad de vida y la salud de las personas.', 'ACTIVO');
INSERT INTO public.tema_desafio VALUES (13, 'Educación Digital', 'Innovar en herramientas educativas para el aprendizaje en línea.', 'ACTIVO');
INSERT INTO public.tema_desafio VALUES (14, 'Inclusión Financiera', 'Crear servicios financieros accesibles para todos.', 'ACTIVO');


--
-- TOC entry 5579 (class 0 OID 49452)
-- Dependencies: 271
-- Data for Name: tipo_curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_curso VALUES (11, 'Obligatorio');
INSERT INTO public.tipo_curso VALUES (12, 'Electivo');
INSERT INTO public.tipo_curso VALUES (13, 'Taller');
INSERT INTO public.tipo_curso VALUES (14, 'Práctica Profesional');


--
-- TOC entry 5581 (class 0 OID 49461)
-- Dependencies: 273
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.token VALUES (1, 1, 'EVALUACION', 51, 12, '2024-04-10 18:09:33.528839');
INSERT INTO public.token VALUES (2, 9, 'RECOMPENSA_ETAPA', 10, 12, '2025-09-26 02:01:54.940606');
INSERT INTO public.token VALUES (3, 15, 'RECOMPENSA_ETAPA', 27, 15, '2024-03-29 08:46:16.51544');
INSERT INTO public.token VALUES (4, 11, 'BONIFICACION', 29, 15, '2024-11-06 21:44:42.55682');
INSERT INTO public.token VALUES (5, 3, 'BONIFICACION', 33, 12, '2024-07-27 22:19:22.305375');
INSERT INTO public.token VALUES (6, 6, 'RECOMPENSA_ETAPA', 39, 14, '2024-02-12 18:49:49.639137');
INSERT INTO public.token VALUES (7, 1, 'BONIFICACION', 32, 12, '2025-03-14 09:24:22.526059');
INSERT INTO public.token VALUES (8, 5, 'BONIFICACION', 13, 13, '2024-10-30 15:08:35.674309');
INSERT INTO public.token VALUES (9, 15, 'EVALUACION', 26, 14, '2024-07-26 12:52:49.654931');
INSERT INTO public.token VALUES (10, 1, 'BONIFICACION', 38, 13, '2024-07-18 01:38:59.858154');
INSERT INTO public.token VALUES (11, 8, 'RECOMPENSA_ETAPA', 42, 15, '2024-03-21 16:42:03.860435');
INSERT INTO public.token VALUES (12, 10, 'RECOMPENSA_ETAPA', 38, 14, '2025-04-11 13:41:34.31671');
INSERT INTO public.token VALUES (13, 11, 'EVALUACION', 45, 13, '2024-09-14 12:14:53.680236');
INSERT INTO public.token VALUES (14, 15, 'EVALUACION', 23, 12, '2025-07-24 13:39:10.738603');
INSERT INTO public.token VALUES (15, 6, 'BONIFICACION', 16, 13, '2025-08-18 06:03:02.199038');
INSERT INTO public.token VALUES (16, 8, 'RECOMPENSA_ETAPA', 21, 13, '2025-10-02 00:24:20.661658');
INSERT INTO public.token VALUES (17, 2, 'RECOMPENSA_ETAPA', 18, 15, '2025-02-26 08:58:03.642699');
INSERT INTO public.token VALUES (18, 2, 'RECOMPENSA_ETAPA', 15, 12, '2024-11-15 21:00:16.489501');
INSERT INTO public.token VALUES (19, 2, 'BONIFICACION', 51, 13, '2024-05-12 21:15:49.950913');
INSERT INTO public.token VALUES (20, 15, 'EVALUACION', 24, 15, '2025-07-16 01:42:01.747662');
INSERT INTO public.token VALUES (21, 13, 'RECOMPENSA_ETAPA', 22, 15, '2025-06-17 05:18:18.290524');
INSERT INTO public.token VALUES (22, 11, 'RECOMPENSA_ETAPA', 42, 13, '2024-12-23 08:40:30.904274');
INSERT INTO public.token VALUES (23, 15, 'RECOMPENSA_ETAPA', 47, 14, '2025-01-24 05:53:23.41809');
INSERT INTO public.token VALUES (24, 11, 'RECOMPENSA_ETAPA', 33, 15, '2024-10-17 02:48:25.32506');
INSERT INTO public.token VALUES (25, 4, 'EVALUACION', 13, 15, '2025-07-20 21:28:40.007538');
INSERT INTO public.token VALUES (26, 15, 'EVALUACION', 55, 15, '2024-12-02 14:37:35.787488');
INSERT INTO public.token VALUES (27, 11, 'BONIFICACION', 42, 12, '2024-02-05 07:23:21.068901');
INSERT INTO public.token VALUES (28, 13, 'BONIFICACION', 47, 14, '2024-04-14 01:13:51.363502');
INSERT INTO public.token VALUES (29, 4, 'EVALUACION', 48, 13, '2024-09-01 00:51:27.825221');
INSERT INTO public.token VALUES (30, 11, 'BONIFICACION', 37, 14, '2025-04-08 05:23:08.665474');
INSERT INTO public.token VALUES (31, 3, 'EVALUACION', 24, 13, '2025-01-19 02:20:34.290275');
INSERT INTO public.token VALUES (32, 9, 'EVALUACION', 44, 12, '2025-07-09 22:10:48.661553');
INSERT INTO public.token VALUES (33, 4, 'EVALUACION', 52, 15, '2025-01-01 09:31:52.747622');
INSERT INTO public.token VALUES (34, 13, 'RECOMPENSA_ETAPA', 48, 12, '2024-09-05 06:14:06.8262');
INSERT INTO public.token VALUES (35, 9, 'RECOMPENSA_ETAPA', 23, 12, '2024-04-19 18:32:21.969548');
INSERT INTO public.token VALUES (36, 10, 'BONIFICACION', 52, 12, '2025-10-17 01:07:41.776306');
INSERT INTO public.token VALUES (37, 14, 'BONIFICACION', 12, 12, '2024-04-20 05:28:57.975133');
INSERT INTO public.token VALUES (38, 2, 'BONIFICACION', 49, 12, '2024-07-08 11:33:51.21166');
INSERT INTO public.token VALUES (39, 10, 'EVALUACION', 42, 14, '2025-07-08 06:02:57.70063');
INSERT INTO public.token VALUES (40, 12, 'RECOMPENSA_ETAPA', 15, 12, '2024-09-13 22:48:52.212164');
INSERT INTO public.token VALUES (41, 14, 'EVALUACION', 32, 14, '2024-05-08 02:27:54.129372');
INSERT INTO public.token VALUES (42, 14, 'EVALUACION', 23, 14, '2025-05-05 03:46:11.347862');
INSERT INTO public.token VALUES (43, 5, 'BONIFICACION', 23, 12, '2025-03-12 10:48:37.829721');
INSERT INTO public.token VALUES (44, 5, 'RECOMPENSA_ETAPA', 57, 13, '2024-10-15 04:43:08.958282');
INSERT INTO public.token VALUES (45, 10, 'EVALUACION', 56, 13, '2024-05-09 20:31:10.551795');
INSERT INTO public.token VALUES (46, 2, 'RECOMPENSA_ETAPA', 44, 14, '2025-01-14 18:22:33.342983');
INSERT INTO public.token VALUES (47, 4, 'BONIFICACION', 27, 15, '2024-12-26 09:32:57.875848');
INSERT INTO public.token VALUES (48, 13, 'BONIFICACION', 53, 13, '2024-03-14 06:30:31.980977');
INSERT INTO public.token VALUES (49, 12, 'EVALUACION', 53, 12, '2024-06-02 13:32:49.939928');
INSERT INTO public.token VALUES (50, 8, 'RECOMPENSA_ETAPA', 14, 12, '2025-04-15 05:22:21.312078');
INSERT INTO public.token VALUES (51, 11, 'RECOMPENSA_ETAPA', 51, 12, '2024-11-18 15:37:38.095591');
INSERT INTO public.token VALUES (52, 12, 'EVALUACION', 55, 13, '2025-05-05 10:05:56.145645');
INSERT INTO public.token VALUES (53, 11, 'RECOMPENSA_ETAPA', 28, 12, '2024-11-03 15:44:48.033527');
INSERT INTO public.token VALUES (54, 11, 'BONIFICACION', 21, 15, '2024-07-22 15:33:58.627212');
INSERT INTO public.token VALUES (55, 4, 'EVALUACION', 51, 12, '2025-08-17 07:34:21.471317');
INSERT INTO public.token VALUES (56, 11, 'BONIFICACION', 48, 13, '2024-12-24 15:22:27.349706');
INSERT INTO public.token VALUES (57, 15, 'BONIFICACION', 20, 13, '2025-09-14 19:59:32.097404');
INSERT INTO public.token VALUES (58, 3, 'RECOMPENSA_ETAPA', 39, 14, '2024-08-10 16:56:54.396663');
INSERT INTO public.token VALUES (59, 13, 'EVALUACION', 44, 12, '2024-06-03 03:50:54.372243');
INSERT INTO public.token VALUES (60, 11, 'BONIFICACION', 47, 12, '2025-03-01 01:08:19.697139');
INSERT INTO public.token VALUES (61, 4, 'RECOMPENSA_ETAPA', 37, 14, '2024-05-04 17:38:29.982623');
INSERT INTO public.token VALUES (62, 12, 'RECOMPENSA_ETAPA', 52, 12, '2024-10-28 11:32:59.219502');
INSERT INTO public.token VALUES (63, 10, 'BONIFICACION', 58, 14, '2025-07-19 11:16:49.978947');
INSERT INTO public.token VALUES (64, 10, 'BONIFICACION', 45, 14, '2025-03-10 22:34:03.88082');
INSERT INTO public.token VALUES (65, 2, 'EVALUACION', 21, 14, '2024-04-26 17:33:55.805459');
INSERT INTO public.token VALUES (66, 10, 'BONIFICACION', 48, 13, '2024-03-20 16:30:19.700619');
INSERT INTO public.token VALUES (67, 3, 'EVALUACION', 45, 15, '2025-08-01 10:23:34.191388');
INSERT INTO public.token VALUES (68, 4, 'BONIFICACION', 57, 14, '2025-06-23 00:00:34.755423');
INSERT INTO public.token VALUES (69, 9, 'BONIFICACION', 31, 14, '2024-05-26 10:23:59.216772');
INSERT INTO public.token VALUES (70, 13, 'RECOMPENSA_ETAPA', 51, 15, '2025-05-27 05:15:37.919739');
INSERT INTO public.token VALUES (71, 12, 'BONIFICACION', 53, 12, '2024-08-26 16:57:09.748211');
INSERT INTO public.token VALUES (72, 5, 'BONIFICACION', 13, 14, '2025-03-22 04:53:39.478322');
INSERT INTO public.token VALUES (73, 13, 'BONIFICACION', 44, 14, '2024-05-13 04:50:57.417276');
INSERT INTO public.token VALUES (74, 9, 'BONIFICACION', 19, 12, '2025-03-01 10:48:42.301207');
INSERT INTO public.token VALUES (75, 4, 'EVALUACION', 29, 13, '2025-02-19 00:33:40.621142');
INSERT INTO public.token VALUES (76, 9, 'EVALUACION', 13, 15, '2025-08-04 05:45:40.029923');
INSERT INTO public.token VALUES (77, 15, 'RECOMPENSA_ETAPA', 10, 15, '2025-07-16 15:15:36.211912');
INSERT INTO public.token VALUES (78, 6, 'EVALUACION', 21, 15, '2024-01-19 20:39:32.014375');
INSERT INTO public.token VALUES (79, 11, 'BONIFICACION', 28, 13, '2024-11-07 13:55:21.789488');
INSERT INTO public.token VALUES (80, 7, 'BONIFICACION', 46, 14, '2025-03-19 11:10:06.730219');
INSERT INTO public.token VALUES (81, 14, 'BONIFICACION', 38, 12, '2025-03-31 23:09:36.881931');
INSERT INTO public.token VALUES (82, 13, 'RECOMPENSA_ETAPA', 27, 12, '2024-10-23 00:13:21.722714');
INSERT INTO public.token VALUES (83, 4, 'BONIFICACION', 24, 12, '2024-01-24 13:29:36.505341');
INSERT INTO public.token VALUES (84, 10, 'RECOMPENSA_ETAPA', 17, 14, '2025-09-10 01:04:27.592087');
INSERT INTO public.token VALUES (85, 1, 'EVALUACION', 31, 14, '2024-02-09 05:45:25.224888');
INSERT INTO public.token VALUES (86, 9, 'EVALUACION', 57, 13, '2024-03-11 20:18:14.098215');
INSERT INTO public.token VALUES (87, 5, 'RECOMPENSA_ETAPA', 20, 13, '2024-11-20 15:18:24.22711');
INSERT INTO public.token VALUES (88, 13, 'RECOMPENSA_ETAPA', 20, 15, '2025-06-29 17:46:00.463892');
INSERT INTO public.token VALUES (89, 15, 'BONIFICACION', 18, 12, '2024-07-22 12:20:07.983317');
INSERT INTO public.token VALUES (90, 13, 'BONIFICACION', 48, 15, '2024-10-30 16:29:31.806144');
INSERT INTO public.token VALUES (91, 8, 'EVALUACION', 13, 12, '2024-09-05 17:38:44.695914');
INSERT INTO public.token VALUES (92, 1, 'BONIFICACION', 25, 12, '2024-01-10 19:35:35.541505');
INSERT INTO public.token VALUES (93, 6, 'BONIFICACION', 55, 12, '2024-04-09 08:28:23.001745');
INSERT INTO public.token VALUES (94, 13, 'RECOMPENSA_ETAPA', 30, 12, '2025-07-26 09:21:40.032086');
INSERT INTO public.token VALUES (95, 5, 'BONIFICACION', 52, 12, '2024-05-24 06:36:59.361456');
INSERT INTO public.token VALUES (96, 3, 'BONIFICACION', 19, 13, '2025-09-02 22:18:29.161303');
INSERT INTO public.token VALUES (97, 10, 'BONIFICACION', 39, 14, '2024-09-16 22:10:33.690517');
INSERT INTO public.token VALUES (98, 1, 'BONIFICACION', 23, 14, '2024-01-01 12:18:47.568735');
INSERT INTO public.token VALUES (99, 6, 'BONIFICACION', 33, 15, '2024-07-01 21:17:03.100855');
INSERT INTO public.token VALUES (100, 2, 'EVALUACION', 49, 13, '2024-02-23 02:57:29.752884');


--
-- TOC entry 5585 (class 0 OID 49494)
-- Dependencies: 277
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.video VALUES (11, 'Video introductorio 1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 13);
INSERT INTO public.video VALUES (13, 'Video introductorio 3', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15);
INSERT INTO public.video VALUES (12, 'Video introductorio 2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 37);
INSERT INTO public.video VALUES (14, 'Fase1', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase1.mp4', NULL);
INSERT INTO public.video VALUES (15, 'IntroduccionEmprendimiento', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/IntroduccionEmprendimiento.mp4', NULL);
INSERT INTO public.video VALUES (16, 'Fase2', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase2.mp4', NULL);
INSERT INTO public.video VALUES (17, 'Fase3Empatia', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase3Empatia.mp4', NULL);
INSERT INTO public.video VALUES (18, 'Fase4Lego', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase4SolucionLego.mp4', NULL);
INSERT INTO public.video VALUES (19, 'Fase5Pitch', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase5Pitch.mp4', NULL);
INSERT INTO public.video VALUES (20, 'Cierre', 'https://storage.googleapis.com/mision-emprende-prototiposs/videos/CIerre.mp4', NULL);


--
-- TOC entry 5659 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 13, true);


--
-- TOC entry 5660 (class 0 OID 0)
-- Dependencies: 297
-- Name: api_progresoetapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_progresoetapa_id_seq', 1, false);


--
-- TOC entry 5661 (class 0 OID 0)
-- Dependencies: 221
-- Name: atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.atributo_id_seq', 1, false);


--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 284
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 286
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 5664 (class 0 OID 0)
-- Dependencies: 282
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 292, true);


--
-- TOC entry 5665 (class 0 OID 0)
-- Dependencies: 290
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- TOC entry 5666 (class 0 OID 0)
-- Dependencies: 288
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 3, true);


--
-- TOC entry 5667 (class 0 OID 0)
-- Dependencies: 292
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- TOC entry 5668 (class 0 OID 0)
-- Dependencies: 223
-- Name: carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrera_id_seq', 20, true);


--
-- TOC entry 5669 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_atributo_id_seq', 15, true);


--
-- TOC entry 5670 (class 0 OID 0)
-- Dependencies: 305
-- Name: conexion_partida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conexion_partida_id_seq', 20, true);


--
-- TOC entry 5671 (class 0 OID 0)
-- Dependencies: 227
-- Name: configuracion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_id_seq', 14, true);


--
-- TOC entry 5672 (class 0 OID 0)
-- Dependencies: 229
-- Name: configuracion_valor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_valor_id_seq', 1, false);


--
-- TOC entry 5673 (class 0 OID 0)
-- Dependencies: 233
-- Name: curso_estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curso_estudiante_id_seq', 69, true);


--
-- TOC entry 5674 (class 0 OID 0)
-- Dependencies: 231
-- Name: curso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curso_id_seq', 25, true);


--
-- TOC entry 5675 (class 0 OID 0)
-- Dependencies: 235
-- Name: desafio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desafio_id_seq', 20, true);


--
-- TOC entry 5676 (class 0 OID 0)
-- Dependencies: 294
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- TOC entry 5677 (class 0 OID 0)
-- Dependencies: 280
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 73, true);


--
-- TOC entry 5678 (class 0 OID 0)
-- Dependencies: 278
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 41, true);


--
-- TOC entry 5679 (class 0 OID 0)
-- Dependencies: 237
-- Name: equipo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipo_id_seq', 189, true);


--
-- TOC entry 5680 (class 0 OID 0)
-- Dependencies: 307
-- Name: estado_partida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_partida_id_seq', 3, true);


--
-- TOC entry 5681 (class 0 OID 0)
-- Dependencies: 240
-- Name: estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estudiante_id_seq', 70, true);


--
-- TOC entry 5682 (class 0 OID 0)
-- Dependencies: 242
-- Name: etapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etapa_id_seq', 15, true);


--
-- TOC entry 5683 (class 0 OID 0)
-- Dependencies: 244
-- Name: evaluacion_autoencuesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluacion_autoencuesta_id_seq', 1, false);


--
-- TOC entry 5684 (class 0 OID 0)
-- Dependencies: 246
-- Name: evaluacion_pitch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluacion_pitch_id_seq', 42, true);


--
-- TOC entry 5685 (class 0 OID 0)
-- Dependencies: 248
-- Name: facultad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facultad_id_seq', 15, true);


--
-- TOC entry 5686 (class 0 OID 0)
-- Dependencies: 250
-- Name: ganas_emprender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ganas_emprender_id_seq', 18, true);


--
-- TOC entry 5687 (class 0 OID 0)
-- Dependencies: 252
-- Name: instruccion_etapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instruccion_etapa_id_seq', 1, false);


--
-- TOC entry 5688 (class 0 OID 0)
-- Dependencies: 254
-- Name: lista_participante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_participante_id_seq', 164, true);


--
-- TOC entry 5689 (class 0 OID 0)
-- Dependencies: 256
-- Name: partida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partida_id_seq', 79, true);


--
-- TOC entry 5690 (class 0 OID 0)
-- Dependencies: 258
-- Name: partida_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partida_usuario_id_seq', 479, true);


--
-- TOC entry 5691 (class 0 OID 0)
-- Dependencies: 260
-- Name: persona_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persona_id_seq', 20, true);


--
-- TOC entry 5692 (class 0 OID 0)
-- Dependencies: 262
-- Name: profesor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesor_id_seq', 23, true);


--
-- TOC entry 5693 (class 0 OID 0)
-- Dependencies: 264
-- Name: ranking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ranking_id_seq', 1, false);


--
-- TOC entry 5694 (class 0 OID 0)
-- Dependencies: 266
-- Name: solucion_lego_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solucion_lego_id_seq', 40, true);


--
-- TOC entry 5695 (class 0 OID 0)
-- Dependencies: 268
-- Name: tema_desafio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tema_desafio_id_seq', 14, true);


--
-- TOC entry 5696 (class 0 OID 0)
-- Dependencies: 270
-- Name: tipo_curso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_curso_id_seq', 14, true);


--
-- TOC entry 5697 (class 0 OID 0)
-- Dependencies: 272
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_id_seq', 100, true);


--
-- TOC entry 5698 (class 0 OID 0)
-- Dependencies: 299
-- Name: usuario_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_groups_id_seq', 1, false);


--
-- TOC entry 5699 (class 0 OID 0)
-- Dependencies: 274
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 118, true);


--
-- TOC entry 5700 (class 0 OID 0)
-- Dependencies: 301
-- Name: usuario_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_user_permissions_id_seq', 1, false);


--
-- TOC entry 5701 (class 0 OID 0)
-- Dependencies: 276
-- Name: video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_id_seq', 20, true);


--
-- TOC entry 5166 (class 2606 OID 49506)
-- Name: administrador administrador_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5168 (class 2606 OID 49161)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- TOC entry 5292 (class 2606 OID 74040)
-- Name: api_progresoetapa api_progresoetapa_equipo_id_etapa_id_584085aa_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_equipo_id_etapa_id_584085aa_uniq UNIQUE (equipo_id, etapa_id);


--
-- TOC entry 5296 (class 2606 OID 74038)
-- Name: api_progresoetapa api_progresoetapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5300 (class 2606 OID 74120)
-- Name: api_usuario_groups api_usuario_groups_usuario_id_group_id_d9500af0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_usuario_id_group_id_d9500af0_uniq UNIQUE (usuario_id, group_id);


--
-- TOC entry 5304 (class 2606 OID 74134)
-- Name: api_usuario_user_permissions api_usuario_user_permiss_usuario_id_permission_id_7f855256_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_permiss_usuario_id_permission_id_7f855256_uniq UNIQUE (usuario_id, permission_id);


--
-- TOC entry 5170 (class 2606 OID 49171)
-- Name: atributo atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5256 (class 2606 OID 57523)
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 5261 (class 2606 OID 57444)
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 5264 (class 2606 OID 57396)
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5258 (class 2606 OID 57385)
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 5251 (class 2606 OID 57435)
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 5253 (class 2606 OID 57377)
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 5272 (class 2606 OID 57424)
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5275 (class 2606 OID 57459)
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 5266 (class 2606 OID 57413)
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- TOC entry 5278 (class 2606 OID 57433)
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5281 (class 2606 OID 57473)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 5269 (class 2606 OID 57516)
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 5311 (class 2606 OID 82228)
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- TOC entry 5313 (class 2606 OID 82230)
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- TOC entry 5172 (class 2606 OID 49182)
-- Name: carrera carrera_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera
    ADD CONSTRAINT carrera_pkey PRIMARY KEY (id);


--
-- TOC entry 5174 (class 2606 OID 49192)
-- Name: categoria_atributo categoria_atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo
    ADD CONSTRAINT categoria_atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5317 (class 2606 OID 90518)
-- Name: conexion_partida conexion_partida_partida_id_equipo_id_93b1883a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conexion_partida
    ADD CONSTRAINT conexion_partida_partida_id_equipo_id_93b1883a_uniq UNIQUE (partida_id, equipo_id);


--
-- TOC entry 5319 (class 2606 OID 90496)
-- Name: conexion_partida conexion_partida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conexion_partida
    ADD CONSTRAINT conexion_partida_pkey PRIMARY KEY (id);


--
-- TOC entry 5176 (class 2606 OID 49202)
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (id);


--
-- TOC entry 5178 (class 2606 OID 49215)
-- Name: configuracion_valor configuracion_valor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT configuracion_valor_pkey PRIMARY KEY (id);


--
-- TOC entry 5182 (class 2606 OID 49239)
-- Name: curso_estudiante curso_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT curso_estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5180 (class 2606 OID 49229)
-- Name: curso curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 49256)
-- Name: desafio desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_pkey PRIMARY KEY (id, persona_id);


--
-- TOC entry 5284 (class 2606 OID 57500)
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5246 (class 2606 OID 57367)
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 5248 (class 2606 OID 57365)
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5244 (class 2606 OID 57355)
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5288 (class 2606 OID 57536)
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 5187 (class 2606 OID 82308)
-- Name: equipo equipo_codigo_equipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_codigo_equipo_key UNIQUE (codigo_equipo);


--
-- TOC entry 5191 (class 2606 OID 49273)
-- Name: equipo_desafio equipo_desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT equipo_desafio_pkey PRIMARY KEY (equipo_id);


--
-- TOC entry 5189 (class 2606 OID 49265)
-- Name: equipo equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_pkey PRIMARY KEY (id);


--
-- TOC entry 5324 (class 2606 OID 90535)
-- Name: estado_partida estado_partida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_partida
    ADD CONSTRAINT estado_partida_pkey PRIMARY KEY (id);


--
-- TOC entry 5193 (class 2606 OID 49508)
-- Name: estudiante estudiante_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5195 (class 2606 OID 49283)
-- Name: estudiante estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5197 (class 2606 OID 49297)
-- Name: etapa etapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapa
    ADD CONSTRAINT etapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5199 (class 2606 OID 49309)
-- Name: evaluacion_autoencuesta evaluacion_autoencuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT evaluacion_autoencuesta_pkey PRIMARY KEY (id);


--
-- TOC entry 5201 (class 2606 OID 49510)
-- Name: evaluacion_pitch evaluacion_pitch_idequipeval_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT evaluacion_pitch_idequipeval_un UNIQUE (equipo_evaluador_id, equipo_evaluado_id);


--
-- TOC entry 5203 (class 2606 OID 49320)
-- Name: evaluacion_pitch evaluacion_pitch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT evaluacion_pitch_pkey PRIMARY KEY (id);


--
-- TOC entry 5205 (class 2606 OID 49333)
-- Name: facultad facultad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultad
    ADD CONSTRAINT facultad_pkey PRIMARY KEY (id);


--
-- TOC entry 5207 (class 2606 OID 49342)
-- Name: ganas_emprender ganas_emprender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ganas_emprender
    ADD CONSTRAINT ganas_emprender_pkey PRIMARY KEY (id);


--
-- TOC entry 5209 (class 2606 OID 49354)
-- Name: instruccion_etapa instruccion_etapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa
    ADD CONSTRAINT instruccion_etapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5211 (class 2606 OID 49364)
-- Name: lista_participante lista_participante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_participante
    ADD CONSTRAINT lista_participante_pkey PRIMARY KEY (id);


--
-- TOC entry 5213 (class 2606 OID 49512)
-- Name: partida partida_codigoacceso_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida
    ADD CONSTRAINT partida_codigoacceso_un UNIQUE (codigoacceso);


--
-- TOC entry 5215 (class 2606 OID 49378)
-- Name: partida partida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida
    ADD CONSTRAINT partida_pkey PRIMARY KEY (id);


--
-- TOC entry 5217 (class 2606 OID 49390)
-- Name: partida_usuario partida_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 5219 (class 2606 OID 49403)
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id);


--
-- TOC entry 5221 (class 2606 OID 49514)
-- Name: profesor profesor_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5223 (class 2606 OID 49412)
-- Name: profesor profesor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_pkey PRIMARY KEY (id);


--
-- TOC entry 5225 (class 2606 OID 49516)
-- Name: ranking ranking_idequipo_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_idequipo_un UNIQUE (equipo_id);


--
-- TOC entry 5227 (class 2606 OID 49424)
-- Name: ranking ranking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_pkey PRIMARY KEY (id);


--
-- TOC entry 5229 (class 2606 OID 49437)
-- Name: solucion_lego solucion_lego_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego
    ADD CONSTRAINT solucion_lego_pkey PRIMARY KEY (id);


--
-- TOC entry 5231 (class 2606 OID 49450)
-- Name: tema_desafio tema_desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema_desafio
    ADD CONSTRAINT tema_desafio_pkey PRIMARY KEY (id);


--
-- TOC entry 5233 (class 2606 OID 49459)
-- Name: tipo_curso tipo_curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_curso
    ADD CONSTRAINT tipo_curso_pkey PRIMARY KEY (id);


--
-- TOC entry 5235 (class 2606 OID 49472)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 5237 (class 2606 OID 74108)
-- Name: api_usuario usuario_email_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario
    ADD CONSTRAINT usuario_email_un UNIQUE (email);


--
-- TOC entry 5302 (class 2606 OID 74091)
-- Name: api_usuario_groups usuario_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT usuario_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5239 (class 2606 OID 49490)
-- Name: api_usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 5308 (class 2606 OID 74106)
-- Name: api_usuario_user_permissions usuario_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT usuario_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5242 (class 2606 OID 49504)
-- Name: video video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pkey PRIMARY KEY (id);


--
-- TOC entry 5290 (class 1259 OID 74056)
-- Name: api_progresoetapa_equipo_id_96cddc52; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_equipo_id_96cddc52 ON public.api_progresoetapa USING btree (equipo_id);


--
-- TOC entry 5293 (class 1259 OID 74057)
-- Name: api_progresoetapa_etapa_id_e7d57675; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_etapa_id_e7d57675 ON public.api_progresoetapa USING btree (etapa_id);


--
-- TOC entry 5294 (class 1259 OID 74058)
-- Name: api_progresoetapa_finished_by_user_id_23569deb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_finished_by_user_id_23569deb ON public.api_progresoetapa USING btree (finished_by_user_id);


--
-- TOC entry 5297 (class 1259 OID 74132)
-- Name: api_usuario_groups_group_id_a1787217; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_groups_group_id_a1787217 ON public.api_usuario_groups USING btree (group_id);


--
-- TOC entry 5298 (class 1259 OID 74131)
-- Name: api_usuario_groups_usuario_id_7c19c78d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_groups_usuario_id_7c19c78d ON public.api_usuario_groups USING btree (usuario_id);


--
-- TOC entry 5305 (class 1259 OID 74146)
-- Name: api_usuario_user_permissions_permission_id_0ae209ef; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_user_permissions_permission_id_0ae209ef ON public.api_usuario_user_permissions USING btree (permission_id);


--
-- TOC entry 5306 (class 1259 OID 74145)
-- Name: api_usuario_user_permissions_usuario_id_598fe587; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_user_permissions_usuario_id_598fe587 ON public.api_usuario_user_permissions USING btree (usuario_id);


--
-- TOC entry 5254 (class 1259 OID 57524)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 5259 (class 1259 OID 57455)
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- TOC entry 5262 (class 1259 OID 57456)
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- TOC entry 5249 (class 1259 OID 57441)
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- TOC entry 5270 (class 1259 OID 57471)
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- TOC entry 5273 (class 1259 OID 57470)
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- TOC entry 5276 (class 1259 OID 57485)
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- TOC entry 5279 (class 1259 OID 57484)
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- TOC entry 5267 (class 1259 OID 57517)
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- TOC entry 5309 (class 1259 OID 82236)
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- TOC entry 5314 (class 1259 OID 90514)
-- Name: conexion_partida_equipo_id_2db4e95f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conexion_partida_equipo_id_2db4e95f ON public.conexion_partida USING btree (equipo_id);


--
-- TOC entry 5315 (class 1259 OID 90515)
-- Name: conexion_partida_partida_id_71c38a49; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conexion_partida_partida_id_71c38a49 ON public.conexion_partida USING btree (partida_id);


--
-- TOC entry 5320 (class 1259 OID 90516)
-- Name: conexion_partida_usuario_id_dc100dc6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conexion_partida_usuario_id_dc100dc6 ON public.conexion_partida USING btree (usuario_id);


--
-- TOC entry 5282 (class 1259 OID 57511)
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- TOC entry 5285 (class 1259 OID 57512)
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- TOC entry 5286 (class 1259 OID 57538)
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- TOC entry 5289 (class 1259 OID 57537)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 5185 (class 1259 OID 82309)
-- Name: equipo_codigo_equipo_a4798dd6_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX equipo_codigo_equipo_a4798dd6_like ON public.equipo USING btree (codigo_equipo varchar_pattern_ops);


--
-- TOC entry 5321 (class 1259 OID 90541)
-- Name: estado_partida_activo_0010070d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX estado_partida_activo_0010070d ON public.estado_partida USING btree (activo);


--
-- TOC entry 5322 (class 1259 OID 90542)
-- Name: estado_partida_partida_id_43ec8c70; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX estado_partida_partida_id_43ec8c70 ON public.estado_partida USING btree (partida_id);


--
-- TOC entry 5325 (class 1259 OID 90545)
-- Name: idx_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estado ON public.estado_partida USING btree (estado_actual);


--
-- TOC entry 5326 (class 1259 OID 90543)
-- Name: idx_partida_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partida_activo ON public.estado_partida USING btree (partida_id, activo);


--
-- TOC entry 5327 (class 1259 OID 90544)
-- Name: idx_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_timestamp ON public.estado_partida USING btree ("timestamp");


--
-- TOC entry 5240 (class 1259 OID 82247)
-- Name: video_partida_id_0e889d8c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX video_partida_id_0e889d8c ON public.video USING btree (partida_id);


--
-- TOC entry 5328 (class 2606 OID 49519)
-- Name: administrador administrador_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5367 (class 2606 OID 74041)
-- Name: api_progresoetapa api_progresoetapa_equipo_id_96cddc52_fk_equipo_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_equipo_id_96cddc52_fk_equipo_id FOREIGN KEY (equipo_id) REFERENCES public.equipo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5368 (class 2606 OID 74046)
-- Name: api_progresoetapa api_progresoetapa_etapa_id_e7d57675_fk_etapa_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_etapa_id_e7d57675_fk_etapa_id FOREIGN KEY (etapa_id) REFERENCES public.etapa(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5369 (class 2606 OID 74051)
-- Name: api_progresoetapa api_progresoetapa_finished_by_user_id_23569deb_fk_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_finished_by_user_id_23569deb_fk_usuario_id FOREIGN KEY (finished_by_user_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5370 (class 2606 OID 74126)
-- Name: api_usuario_groups api_usuario_groups_group_id_a1787217_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_group_id_a1787217_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5371 (class 2606 OID 74121)
-- Name: api_usuario_groups api_usuario_groups_usuario_id_7c19c78d_fk_api_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_usuario_id_7c19c78d_fk_api_usuario_id FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5372 (class 2606 OID 74140)
-- Name: api_usuario_user_permissions api_usuario_user_per_permission_id_0ae209ef_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_per_permission_id_0ae209ef_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5373 (class 2606 OID 74135)
-- Name: api_usuario_user_permissions api_usuario_user_per_usuario_id_598fe587_fk_api_usuar; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_per_usuario_id_598fe587_fk_api_usuar FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5329 (class 2606 OID 49524)
-- Name: atributo atributo_categoria_atributo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_categoria_atributo_fk FOREIGN KEY (categoria_atributo_id) REFERENCES public.categoria_atributo(id);


--
-- TOC entry 5330 (class 2606 OID 49529)
-- Name: atributo atributo_equipo_desafio_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_equipo_desafio_fk FOREIGN KEY (equipo_desafio_id) REFERENCES public.equipo_desafio(equipo_id);


--
-- TOC entry 5359 (class 2606 OID 57450)
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5360 (class 2606 OID 57445)
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5358 (class 2606 OID 57436)
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5361 (class 2606 OID 57465)
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5362 (class 2606 OID 57460)
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5363 (class 2606 OID 57479)
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5364 (class 2606 OID 57474)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5374 (class 2606 OID 82231)
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_api_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_api_usuario_id FOREIGN KEY (user_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5331 (class 2606 OID 49534)
-- Name: carrera carrera_facultad_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera
    ADD CONSTRAINT carrera_facultad_fk FOREIGN KEY (facultad_id) REFERENCES public.facultad(id);


--
-- TOC entry 5375 (class 2606 OID 90499)
-- Name: conexion_partida conexion_partida_equipo_id_2db4e95f_fk_equipo_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conexion_partida
    ADD CONSTRAINT conexion_partida_equipo_id_2db4e95f_fk_equipo_id FOREIGN KEY (equipo_id) REFERENCES public.equipo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5376 (class 2606 OID 90504)
-- Name: conexion_partida conexion_partida_partida_id_71c38a49_fk_partida_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conexion_partida
    ADD CONSTRAINT conexion_partida_partida_id_71c38a49_fk_partida_id FOREIGN KEY (partida_id) REFERENCES public.partida(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5377 (class 2606 OID 90519)
-- Name: conexion_partida conexion_partida_usuario_id_dc100dc6_fk_api_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conexion_partida
    ADD CONSTRAINT conexion_partida_usuario_id_dc100dc6_fk_api_usuario_id FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5334 (class 2606 OID 49549)
-- Name: curso curso_carrera_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_carrera_fk FOREIGN KEY (carrera_id) REFERENCES public.carrera(id);


--
-- TOC entry 5335 (class 2606 OID 49564)
-- Name: curso curso_tipo_curso_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_tipo_curso_fk FOREIGN KEY (tipo_curso_id) REFERENCES public.tipo_curso(id);


--
-- TOC entry 5338 (class 2606 OID 49569)
-- Name: desafio desafio_persona_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_persona_fk FOREIGN KEY (persona_id) REFERENCES public.persona(id);


--
-- TOC entry 5339 (class 2606 OID 49574)
-- Name: desafio desafio_tema_desafio_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_tema_desafio_fk FOREIGN KEY (tema_desafio_id) REFERENCES public.tema_desafio(id);


--
-- TOC entry 5365 (class 2606 OID 57501)
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5366 (class 2606 OID 57506)
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5378 (class 2606 OID 90536)
-- Name: estado_partida estado_partida_partida_id_43ec8c70_fk_partida_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_partida
    ADD CONSTRAINT estado_partida_partida_id_43ec8c70_fk_partida_id FOREIGN KEY (partida_id) REFERENCES public.partida(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5342 (class 2606 OID 49589)
-- Name: estudiante estudiante_lista_participante_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_lista_participante_fk FOREIGN KEY (lista_participante_id) REFERENCES public.lista_participante(id);


--
-- TOC entry 5343 (class 2606 OID 49594)
-- Name: estudiante estudiante_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5332 (class 2606 OID 49539)
-- Name: configuracion_valor fk_confvalor_configuracion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT fk_confvalor_configuracion FOREIGN KEY (configuracion_id) REFERENCES public.configuracion(id);


--
-- TOC entry 5333 (class 2606 OID 49544)
-- Name: configuracion_valor fk_confvalor_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT fk_confvalor_usuario FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5336 (class 2606 OID 49554)
-- Name: curso_estudiante fk_cursoest_curso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT fk_cursoest_curso FOREIGN KEY (curso_id) REFERENCES public.curso(id);


--
-- TOC entry 5337 (class 2606 OID 49559)
-- Name: curso_estudiante fk_cursoest_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT fk_cursoest_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiante(id);


--
-- TOC entry 5340 (class 2606 OID 49579)
-- Name: equipo_desafio fk_equipodesafio_desafio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT fk_equipodesafio_desafio FOREIGN KEY (desafio_id, desafio_persona_id) REFERENCES public.desafio(id, persona_id);


--
-- TOC entry 5341 (class 2606 OID 49584)
-- Name: equipo_desafio fk_equipodesafio_equipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT fk_equipodesafio_equipo FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5344 (class 2606 OID 49599)
-- Name: evaluacion_autoencuesta fk_evalauto_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT fk_evalauto_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiante(id);


--
-- TOC entry 5345 (class 2606 OID 49604)
-- Name: evaluacion_autoencuesta fk_evalauto_ganas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT fk_evalauto_ganas FOREIGN KEY (ganas_emprender_id) REFERENCES public.ganas_emprender(id);


--
-- TOC entry 5346 (class 2606 OID 49614)
-- Name: evaluacion_pitch fk_evalpitch_equipo_evaluado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT fk_evalpitch_equipo_evaluado FOREIGN KEY (equipo_evaluado_id) REFERENCES public.equipo(id);


--
-- TOC entry 5347 (class 2606 OID 49609)
-- Name: evaluacion_pitch fk_evalpitch_equipo_evaluador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT fk_evalpitch_equipo_evaluador FOREIGN KEY (equipo_evaluador_id) REFERENCES public.equipo(id);


--
-- TOC entry 5348 (class 2606 OID 49619)
-- Name: instruccion_etapa instruccion_etapa_etapa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa
    ADD CONSTRAINT instruccion_etapa_etapa_fk FOREIGN KEY (etapa_id) REFERENCES public.etapa(id);


--
-- TOC entry 5349 (class 2606 OID 49624)
-- Name: partida_usuario partida_usuario_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5350 (class 2606 OID 49629)
-- Name: partida_usuario partida_usuario_partida_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_partida_fk FOREIGN KEY (partida_id) REFERENCES public.partida(id);


--
-- TOC entry 5351 (class 2606 OID 49634)
-- Name: partida_usuario partida_usuario_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5352 (class 2606 OID 49644)
-- Name: profesor profesor_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5353 (class 2606 OID 49649)
-- Name: ranking ranking_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5354 (class 2606 OID 49654)
-- Name: solucion_lego solucion_lego_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego
    ADD CONSTRAINT solucion_lego_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5355 (class 2606 OID 49659)
-- Name: token token_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5356 (class 2606 OID 49664)
-- Name: token token_etapa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_etapa_fk FOREIGN KEY (etapa_id) REFERENCES public.etapa(id);


--
-- TOC entry 5357 (class 2606 OID 82242)
-- Name: video video_partida_id_0e889d8c_fk_partida_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_partida_id_0e889d8c_fk_partida_id FOREIGN KEY (partida_id) REFERENCES public.partida(id) DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2025-11-30 17:48:10

--
-- PostgreSQL database dump complete
--



