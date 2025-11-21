--
-- PostgreSQL database dump
--

\restrict ECR5a7WAUjZiNKU5yadFq9WDgeBAtt8jcwwqB38zUbLZCScA5lC2BbZCJPncUK2

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 22:52:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 332 (class 1255 OID 49715)
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
-- TOC entry 334 (class 1255 OID 49717)
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
-- TOC entry 328 (class 1255 OID 49678)
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
-- TOC entry 329 (class 1255 OID 49679)
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
-- TOC entry 338 (class 1255 OID 49721)
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
-- TOC entry 342 (class 1255 OID 49725)
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
-- TOC entry 324 (class 1255 OID 49673)
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
-- TOC entry 336 (class 1255 OID 49719)
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
-- TOC entry 330 (class 1255 OID 49680)
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
-- TOC entry 344 (class 1255 OID 49727)
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
-- TOC entry 335 (class 1255 OID 49718)
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
-- TOC entry 305 (class 1255 OID 49681)
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
-- TOC entry 339 (class 1255 OID 49722)
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
-- TOC entry 325 (class 1255 OID 49675)
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
-- TOC entry 306 (class 1255 OID 49682)
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
-- TOC entry 307 (class 1255 OID 49683)
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
-- TOC entry 337 (class 1255 OID 49720)
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
-- TOC entry 343 (class 1255 OID 49726)
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
-- TOC entry 308 (class 1255 OID 49684)
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
-- TOC entry 333 (class 1255 OID 49716)
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
-- TOC entry 340 (class 1255 OID 49723)
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
-- TOC entry 311 (class 1255 OID 49687)
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
-- TOC entry 345 (class 1255 OID 49728)
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
-- TOC entry 309 (class 1255 OID 49685)
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
-- TOC entry 326 (class 1255 OID 49676)
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
-- TOC entry 341 (class 1255 OID 49724)
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
-- TOC entry 327 (class 1255 OID 49677)
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
-- TOC entry 310 (class 1255 OID 49686)
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
-- TOC entry 331 (class 1255 OID 49714)
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
-- TOC entry 323 (class 1255 OID 49670)
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
-- TOC entry 5586 (class 0 OID 0)
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
-- TOC entry 5587 (class 0 OID 0)
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
-- TOC entry 5588 (class 0 OID 0)
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
-- TOC entry 5589 (class 0 OID 0)
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
-- TOC entry 5590 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_atributo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_atributo_id_seq OWNED BY public.categoria_atributo.id;


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
-- TOC entry 5591 (class 0 OID 0)
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
-- TOC entry 5592 (class 0 OID 0)
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
-- TOC entry 5593 (class 0 OID 0)
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
-- TOC entry 5594 (class 0 OID 0)
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
-- TOC entry 5595 (class 0 OID 0)
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
    tamanoequipo integer
);


ALTER TABLE public.equipo OWNER TO postgres;

--
-- TOC entry 5596 (class 0 OID 0)
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
-- TOC entry 5597 (class 0 OID 0)
-- Dependencies: 237
-- Name: equipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipo_id_seq OWNED BY public.equipo.id;


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
-- TOC entry 5598 (class 0 OID 0)
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
-- TOC entry 5599 (class 0 OID 0)
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
-- TOC entry 5600 (class 0 OID 0)
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
-- TOC entry 5601 (class 0 OID 0)
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
-- TOC entry 5602 (class 0 OID 0)
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
-- TOC entry 5603 (class 0 OID 0)
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
-- TOC entry 5604 (class 0 OID 0)
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
-- TOC entry 5605 (class 0 OID 0)
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
-- TOC entry 5606 (class 0 OID 0)
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
-- TOC entry 5607 (class 0 OID 0)
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
-- TOC entry 5608 (class 0 OID 0)
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
-- TOC entry 5609 (class 0 OID 0)
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
-- TOC entry 5610 (class 0 OID 0)
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
-- TOC entry 5611 (class 0 OID 0)
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
-- TOC entry 5612 (class 0 OID 0)
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
-- TOC entry 5613 (class 0 OID 0)
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
-- TOC entry 5614 (class 0 OID 0)
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
-- TOC entry 5615 (class 0 OID 0)
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
-- TOC entry 5616 (class 0 OID 0)
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
-- TOC entry 5617 (class 0 OID 0)
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
-- TOC entry 5618 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.token IS 'Sistema de tokens y recompensas';


--
-- TOC entry 5619 (class 0 OID 0)
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
-- TOC entry 5620 (class 0 OID 0)
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
-- TOC entry 5621 (class 0 OID 0)
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
-- TOC entry 5622 (class 0 OID 0)
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
-- TOC entry 5102 (class 2604 OID 49157)
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- TOC entry 5140 (class 2604 OID 49478)
-- Name: api_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 5103 (class 2604 OID 49166)
-- Name: atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo ALTER COLUMN id SET DEFAULT nextval('public.atributo_id_seq'::regclass);


--
-- TOC entry 5104 (class 2604 OID 49176)
-- Name: carrera id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera ALTER COLUMN id SET DEFAULT nextval('public.carrera_id_seq'::regclass);


--
-- TOC entry 5106 (class 2604 OID 49188)
-- Name: categoria_atributo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo ALTER COLUMN id SET DEFAULT nextval('public.categoria_atributo_id_seq'::regclass);


--
-- TOC entry 5107 (class 2604 OID 49197)
-- Name: configuracion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion ALTER COLUMN id SET DEFAULT nextval('public.configuracion_id_seq'::regclass);


--
-- TOC entry 5108 (class 2604 OID 49207)
-- Name: configuracion_valor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor ALTER COLUMN id SET DEFAULT nextval('public.configuracion_valor_id_seq'::regclass);


--
-- TOC entry 5109 (class 2604 OID 49220)
-- Name: curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso ALTER COLUMN id SET DEFAULT nextval('public.curso_id_seq'::regclass);


--
-- TOC entry 5110 (class 2604 OID 49234)
-- Name: curso_estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante ALTER COLUMN id SET DEFAULT nextval('public.curso_estudiante_id_seq'::regclass);


--
-- TOC entry 5111 (class 2604 OID 49244)
-- Name: desafio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio ALTER COLUMN id SET DEFAULT nextval('public.desafio_id_seq'::regclass);


--
-- TOC entry 5114 (class 2604 OID 49261)
-- Name: equipo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo ALTER COLUMN id SET DEFAULT nextval('public.equipo_id_seq'::regclass);


--
-- TOC entry 5115 (class 2604 OID 49278)
-- Name: estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante ALTER COLUMN id SET DEFAULT nextval('public.estudiante_id_seq'::regclass);


--
-- TOC entry 5116 (class 2604 OID 49288)
-- Name: etapa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapa ALTER COLUMN id SET DEFAULT nextval('public.etapa_id_seq'::regclass);


--
-- TOC entry 5118 (class 2604 OID 49302)
-- Name: evaluacion_autoencuesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_autoencuesta_id_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 49315)
-- Name: evaluacion_pitch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_pitch_id_seq'::regclass);


--
-- TOC entry 5120 (class 2604 OID 49329)
-- Name: facultad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultad ALTER COLUMN id SET DEFAULT nextval('public.facultad_id_seq'::regclass);


--
-- TOC entry 5121 (class 2604 OID 49338)
-- Name: ganas_emprender id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ganas_emprender ALTER COLUMN id SET DEFAULT nextval('public.ganas_emprender_id_seq'::regclass);


--
-- TOC entry 5122 (class 2604 OID 49347)
-- Name: instruccion_etapa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa ALTER COLUMN id SET DEFAULT nextval('public.instruccion_etapa_id_seq'::regclass);


--
-- TOC entry 5123 (class 2604 OID 49359)
-- Name: lista_participante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_participante ALTER COLUMN id SET DEFAULT nextval('public.lista_participante_id_seq'::regclass);


--
-- TOC entry 5124 (class 2604 OID 49369)
-- Name: partida id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida ALTER COLUMN id SET DEFAULT nextval('public.partida_id_seq'::regclass);


--
-- TOC entry 5128 (class 2604 OID 49384)
-- Name: partida_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario ALTER COLUMN id SET DEFAULT nextval('public.partida_usuario_id_seq'::regclass);


--
-- TOC entry 5129 (class 2604 OID 49395)
-- Name: persona id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona ALTER COLUMN id SET DEFAULT nextval('public.persona_id_seq'::regclass);


--
-- TOC entry 5130 (class 2604 OID 49408)
-- Name: profesor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor ALTER COLUMN id SET DEFAULT nextval('public.profesor_id_seq'::regclass);


--
-- TOC entry 5131 (class 2604 OID 49417)
-- Name: ranking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking ALTER COLUMN id SET DEFAULT nextval('public.ranking_id_seq'::regclass);


--
-- TOC entry 5133 (class 2604 OID 49429)
-- Name: solucion_lego id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego ALTER COLUMN id SET DEFAULT nextval('public.solucion_lego_id_seq'::regclass);


--
-- TOC entry 5135 (class 2604 OID 49442)
-- Name: tema_desafio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema_desafio ALTER COLUMN id SET DEFAULT nextval('public.tema_desafio_id_seq'::regclass);


--
-- TOC entry 5137 (class 2604 OID 49455)
-- Name: tipo_curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_curso ALTER COLUMN id SET DEFAULT nextval('public.tipo_curso_id_seq'::regclass);


--
-- TOC entry 5138 (class 2604 OID 49464)
-- Name: token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);


--
-- TOC entry 5143 (class 2604 OID 49497)
-- Name: video id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video ALTER COLUMN id SET DEFAULT nextval('public.video_id_seq'::regclass);


--
-- TOC entry 5497 (class 0 OID 49154)
-- Dependencies: 220
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, usuario_id) FROM stdin;
9	14
10	18
11	19
12	22
13	24
\.


--
-- TOC entry 5575 (class 0 OID 74029)
-- Dependencies: 298
-- Data for Name: api_progresoetapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_progresoetapa (id, start_at, end_at, finished_by_system, equipo_id, etapa_id, finished_by_user_id) FROM stdin;
\.


--
-- TOC entry 5552 (class 0 OID 49475)
-- Dependencies: 275
-- Data for Name: api_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_usuario (id, email, nombre, apellido, tipousuario, fechacreacion, estado, password, is_active, is_staff, is_superuser, last_login) FROM stdin;
16	usuario3@innovate.com	Nombre3	Apellido3	PROFESOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$Cr816VCHvZoQxy1U4syzm3$m3eFTceHZsFr5f9Nsv14ybjff7lQjZWqo1cWw7GIfN4=	t	f	f	\N
17	usuario4@innovate.com	Nombre4	Apellido4	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$OxofMDo8fMsdzfbw6xbS9r$Tby+XGy4qXpe8htoKQMpXDLvijlYyor0jDTievrzXmg=	t	f	f	\N
18	usuario5@innovate.com	Nombre5	Apellido5	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$6arZ6STuaxNoAtSxZ0o25d$NFjzMi8DdvPZjiUT5S6t5xQaWjQA3pIcbXmk+7kBFeE=	t	f	f	\N
19	usuario6@innovate.com	Nombre6	Apellido6	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$c5fHc2vGAFbxeShshka0Do$BuiKJRk/StfzrfagkxXAEuMrUHizhXyEQZWO8jze+Tc=	t	f	f	\N
20	usuario7@innovate.com	Nombre7	Apellido7	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$LxqAXwhu92bO6OYquQYS0T$BNKonmvJxdajN5FsC4ufJyQWsy8mqav2YG1koDdvC4Y=	t	f	f	\N
21	usuario8@innovate.com	Nombre8	Apellido8	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$9yPZe5RmwRiRrPjkBWGLQF$cdGeCCvh6wKX+nI7vF3bEZwHXtMhDPpM+TyYnOIYIjo=	t	f	f	\N
22	usuario9@innovate.com	Nombre9	Apellido9	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$JeAVZp5WuJf1KuzWjASPxv$HcuYGe1XOrKzFJbgfQfdYMBlWr/G9jo6pwxzAMeZKwY=	t	f	f	\N
24	usuario11@innovate.com	Nombre11	Apellido11	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$SpHo8J6tvLYl9gWg85e0Z0$tJjmIJeziOse7SQbvWcCz3qaRRdnchEkewpw4wDPkoM=	t	f	f	\N
25	usuario12@innovate.com	Nombre12	Apellido12	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$f6Gd1E1h2MXSfRYs0EMgvX$ijLD/yEa7q1EaAVtIfru+BVop7sPzOUrWW41HO0xJ20=	t	f	f	\N
26	usuario13@innovate.com	Nombre13	Apellido13	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$hVzeoexl3byydQZYPFYgOj$EPHUC3hRplnbXgcSdpK0e4372xTNZEhQLZvpXjVAdT8=	t	f	f	\N
28	usuario15@innovate.com	Nombre15	Apellido15	PROFESOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$zlzSGoRheOHd6pnk68AXUj$soxajG2nHrHTS9BFbk1uQEKdkqQquE6P3gsgeGHLtB4=	t	f	f	\N
29	usuario16@innovate.com	Nombre16	Apellido16	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$sciykl0d5rSnwWRDOwXepz$4yAVkUJ+Fdi8itE7AripHukaD0hA5q8j83wOXwQrWhs=	t	f	f	\N
31	usuario18@innovate.com	Nombre18	Apellido18	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$G9srVdfZPMhGTkTZgvJsdP$XISO+WsfGb2hR6yRLvfj1tu5xQiFpC7KWpLWNZdS/Sk=	t	f	f	\N
32	usuario19@innovate.com	Nombre19	Apellido19	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$iThHJPM93m4R7HOEsw68oY$zaWeNy0Z4GV5GkDU0RWD4HSb5y+nce+ir2QkKZTUjOI=	t	f	f	\N
33	usuario20@innovate.com	Nombre20	Apellido20	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$jWfM9nkaD4UIbDPJhpil6f$gjB81+0WkgLcebtwJqJO/0mDsHTBUu0V6md88G0ZDQ4=	t	f	f	\N
35	usuario22@innovate.com	Nombre22	Apellido22	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$B076wHM5Vyvt0U5LYOecLE$0b/PasSeEu5E5BXZO/Mg5WcwMQxnsneoe0bEa5PW29w=	t	f	f	\N
36	usuario23@innovate.com	Nombre23	Apellido23	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$lUgOkodNLT8HVWQjX3T14e$NhTTeCmapGtFG+Jg86VGN/E1Wq7nnU/6l/SNdE3ZbBo=	t	f	f	\N
38	usuario25@innovate.com	Nombre25	Apellido25	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$XYB51riOfOxSQaKwFE8r9d$dw0TielviyKvxTgyrLKXPI681LxfAUTG1m1n2YsovSU=	t	f	f	\N
39	usuario26@innovate.com	Nombre26	Apellido26	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$1vZi3rmdJEPA7f3KDjrib5$B/w9Vrr+4OMHRpxaUmArHSsK7+4eTyE2GTKfNO5bUAA=	t	f	f	\N
41	usuario28@innovate.com	Nombre28	Apellido28	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$C8pv1CD2tWSZaAsAPaoy0X$lQuXGATkDIadY9FLcTX6WoICrekeMDUEzGiLtZ4eU2E=	t	f	f	\N
42	usuario29@innovate.com	Nombre29	Apellido29	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$32nYsf6JSwYjHffWFJ66Pj$tfgGssk7HIAyG2XbrkjkH3y0apXbVbxN6a/1iQ98QzU=	t	f	f	\N
43	usuario30@innovate.com	Nombre30	Apellido30	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$aK3RWZnvAuigtUoBRHkPVS$JufkZDacYcSeVcjkQusWgvaw14HO7aJiZgPRYIh97yE=	t	f	f	\N
45	usuario32@innovate.com	Nombre32	Apellido32	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$tJT3wyIgT0fzJSXrazC4mw$jufK6nUSDhVWDuPAweKV+Zp4nFdqQR4QW1a6Od/+CG4=	t	f	f	\N
46	usuario33@innovate.com	Nombre33	Apellido33	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$6ThmMGNIIcsKwQAAbEklRN$pS4FFDCKLif0PCoWIOB9A7O29ICoGirTKB+GSXAn7kI=	t	f	f	\N
47	usuario34@innovate.com	Nombre34	Apellido34	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$xl5J1Jpi0AGWi0I65GR3V7$5GRjXstBqu18FgEV1nseinbwBKhmknqgucdhgsaFXcU=	t	f	f	\N
49	usuario36@innovate.com	Nombre36	Apellido36	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$GlVDmbfBaQTxBDxiR8SzKM$9X/aFb8vCAwH11yU+iVJtQ93NpZNbdor4ie36c3W73A=	t	f	f	\N
50	usuario37@innovate.com	Nombre37	Apellido37	PROFESOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$2vc4cYes7Rqhai379YNC16$Zc214TnF5zkDxw/HUI/erWfQdNgFuWOhPQDGoNKfTAw=	t	f	f	\N
52	usuario39@innovate.com	Nombre39	Apellido39	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$3UDBwLHeWv3jS2jjOBITEm$FkdQ2wQsHLyzobM12qWMh1KUaxwqesATbvAJZ8MN2JU=	t	f	f	\N
53	usuario40@innovate.com	Nombre40	Apellido40	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$REoR74PFubTo23lWgiC5q3$eqL4BcjEqEBdMLYmP3AiRPSwuofvtF22Yg7fwqeDvh8=	t	f	f	\N
54	usuario41@innovate.com	Nombre41	Apellido41	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$9QxaGD6HrewF5GekcKTy4u$RXulO1Lir3ATflhscczJn7dvkiWhJJ8uqiEgs4MAhJc=	t	f	f	\N
56	usuario43@innovate.com	Nombre43	Apellido43	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$gVnB9Fvum4RwYD78JyYHYi$UtxtvehizzAw9dfjky4O2UEbpPrrcvFWGFXa9aF5iI0=	t	f	f	\N
15	usuario2@innovate.com	Nombre2	Apellido2	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$PdyNr9iUQU2wHKfTonep85$flRHvgcFDXGcegJCm79SVCUszWwX3/Wl/c/xCBat3HM=	t	f	f	\N
57	usuario44@innovate.com	Nombre44	Apellido44	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$zXQiGIe6Flv60XHV3ANllS$5qR0mQn65tl+wLXNsa9F2an/oNeY9qAQlJUu8rNlx0A=	t	f	f	\N
59	usuario46@innovate.com	Nombre46	Apellido46	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$rCph7eV0Jf74PjWROCFD1v$W2uHjQaLy6S3K7OG+ZLCNrwO16YO4a0BrZu1UYh4Qq0=	t	f	f	\N
60	usuario47@innovate.com	Nombre47	Apellido47	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$S9F6hPJUdnVV7VrvpPPcjw$z5b0XlUQOC5sZLHkvAmkZVZHE1sRNLhs252Ft2FFXN4=	t	f	f	\N
61	usuario48@innovate.com	Nombre48	Apellido48	PROFESOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$eVclmqsZt5Ihv4AiV5OXE0$7C3XSGRPHci/m9EO3iR1/NcLOk8yNmSmzs+us9i8RKI=	t	f	f	\N
63	usuario50@innovate.com	Nombre50	Apellido50	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$Gi22eji49Me9GnSgGu8zzu$ep+Mx2m9HZHJQuOAgwOoGJ04K68A3ITSPUUMt6pXXQM=	t	f	f	\N
79	matvergaraf@udd.cl	MATÍAS ALEJANDRO	VERGARA FLORES	ESTUDIANTE	2025-11-07 09:43:43.277927	ACTIVO	pbkdf2_sha256$1000000$vo3aqNlQCwZ724RwC7h0Mg$8qfTgV3rA3/7VRLkvJAb+rSndNfqku/vuHEYmvwZNOw=	t	f	f	\N
80	lanascot@udd.cl	LEANDRO	AÑASCO TELLERI	ESTUDIANTE	2025-11-07 09:43:43.281866	ACTIVO	pbkdf2_sha256$1000000$BKFNdbsaa7PZZX3cmLekDk$TOMlMPgTQ+5T7IOrB/0kmLyKqs2hJ7vk8/4o1z1HiAI=	t	f	f	\N
81	spagem@udd.cl	SANTIAGO ANDRÉS	PAGE MUNITA	ESTUDIANTE	2025-11-07 09:43:43.286407	ACTIVO	pbkdf2_sha256$1000000$qeeVsajtMjGv5CdLmJqMQX$X0pfoG6rfmVzAnJkXkufF1/HSHeTeik11NEwtySzW3k=	t	f	f	\N
82	jsaavedrah@udd.cl	JOSE IGNACIO	SAAVEDRA HANS	ESTUDIANTE	2025-11-07 09:43:43.290242	ACTIVO	pbkdf2_sha256$1000000$tI3Ym8QUVGpCKHvSlL1NrE$wVqFYioaKROruCFoV6SRXW+ri5nLXjtXO2WwghBRSjg=	t	f	f	\N
85	j.azuajep@udd.cl	JESUS ALEJANDRO	AZUAJE PEREZ	ESTUDIANTE	2025-11-07 09:43:43.302956	ACTIVO	pbkdf2_sha256$1000000$3O2SKbppU89YDCEHagAoCC$IhJ5UnFBEwbPKqDo62Lt5TCf66L5lNt+WbbjLjyBHTE=	t	f	f	\N
86	r.barbosap@udd.cl	RAIMUNDO	BARBOSA PETIT	ESTUDIANTE	2025-11-07 09:43:43.306022	ACTIVO	pbkdf2_sha256$1000000$4256Qz7nKPcncRyIDXFyYS$hW8Mv9+UioX/6fS9193ppzW1jdjYvsJLudLqIQdFlZ8=	t	f	f	\N
87	a.reyesp@udd.cl	AGUSTÍN EDUARDO	REYES PEREIRA	ESTUDIANTE	2025-11-07 09:43:43.308965	ACTIVO	pbkdf2_sha256$1000000$IFVUmumqfOhIYUyqihNsUd$TGjvVAYGrHayX3rZRcgfXobv5/RcZuHumM++Zs2+j5E=	t	f	f	\N
88	alumno1@correo.com	Juan	Pérez Gómez	ESTUDIANTE	2025-11-15 23:08:07.478461	ACTIVO	password_temporal_123	t	f	f	\N
89	alumno2@correo.com	Ana	López Martínez	ESTUDIANTE	2025-11-15 23:08:08.426436	ACTIVO	password_temporal_123	t	f	f	\N
90	alumno3@correo.com	Carlos	Ramírez Torres	ESTUDIANTE	2025-11-15 23:08:08.43118	ACTIVO	password_temporal_123	t	f	f	\N
23	usuario10@innovate.com	Nombre10	Apellido10	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$aZX6VxYhc0ANi54L6QK3oc$vLLf18jATbnczrFtAfhDuF6pJrfllM4uKdpFxgR6ZTA=	t	f	f	\N
27	usuario14@innovate.com	Nombre14	Apellido14	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$ccy88dzD68JU82JRKdLEoI$ikP9LqEaz55J3tY5o88zgPqQdbzXPJedbgf/pQR0mfc=	t	f	f	\N
30	usuario17@innovate.com	Nombre17	Apellido17	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$1qZVVBGZw0qkEev4TX5jTm$qd8PcqsRyq0EjIVcauOabTxkih8DhAtJCCej7XKWKf8=	t	f	f	\N
34	usuario21@innovate.com	Nombre21	Apellido21	PROFESOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$HITgggqjMQNOkSk54vwx3z$USR01jnKLxCNmgyTcA0h9FDLpm08BDYTzbNVpW5QEdU=	t	f	f	\N
37	usuario24@innovate.com	Nombre24	Apellido24	ESTUDIANTE	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$qeG48BIDB16eMCHzM7tJ3Y$V+Fp7UqSQoxsX7TsAwDwnpuKbQBl8E/AAR9GpQm6CaI=	t	f	f	\N
40	usuario27@innovate.com	Nombre27	Apellido27	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$UyvzIMfAOotmBBirYrmYUq$GeC4cpq/3XvyrUYVBWUOuLHBZtp5nO6IRNDvwPZfrIc=	t	f	f	\N
44	usuario31@innovate.com	Nombre31	Apellido31	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$2yWo51vrBc4gBBWRi9kU0k$zRlaLUoH/dD0HKybXeFA6HwQ0WLT4u3eb0c5kbl3Q9Q=	t	f	f	\N
48	usuario35@innovate.com	Nombre35	Apellido35	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$s6V9sDvOa1vJqG2t3LqwhH$lg97r2dskmJqCYSwWMUZGapyZFD/UWY/r7dmzX7PIDo=	t	f	f	\N
51	usuario38@innovate.com	Nombre38	Apellido38	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$oT7B2RoOMw3xaNb3S0MnIz$55oLByq4C+euOuvCwBfaLiQXIrOeUg0qrZMIDEpC7tI=	t	f	f	\N
55	usuario42@innovate.com	Nombre42	Apellido42	ADMINISTRADOR	2025-10-18 14:40:49.170842	ACTIVO	pbkdf2_sha256$1000000$s7deGtcMgx4OogOg67UDUF$qwdPg/aVH7DqxSPaCrZlY7BwuVGJiNmP3BQ7aKo0wsY=	t	f	f	\N
58	usuario45@innovate.com	Nombre45	Apellido45	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$9BPNXt0DN4uIToYnsKo2vi$UhIYnsPUXX7vaTz7nbzCvoOIHzvyiGwhI2A3yDO+FFU=	t	f	f	\N
62	usuario49@innovate.com	Nombre49	Apellido49	ESTUDIANTE	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$lyqWzLmdMIxjIu0VYmaDOf$t4cJtYofs/RfSHhTfI/mmmkSABmrJ86RAcrk0Zd3jnY=	t	f	f	\N
14	usuario1@innovate.com	Nombre1	Apellido1	ADMINISTRADOR	2025-10-18 14:40:49.170842	INACTIVO	pbkdf2_sha256$1000000$5pLg4SdSwj5yATmthJP2oz$xbNWfg9vaLzWmPiKlxefD7McBYprNUD2xluVP6nTU5M=	t	f	f	\N
71	s.ruizr@udd.cl	SEBASTIAN FERNANDO	RUIZ RIFFO	ESTUDIANTE	2025-11-07 09:43:43.119475	ACTIVO	pbkdf2_sha256$1000000$hjd01TjUlUGCBrUiO0tEL9$fBbYMQFzCq8CXoik3DLYfv7NtBqXRzMHr1ZJFwqXWok=	t	f	f	\N
72	d.romerob@udd.cl	DANIEL ANDRÉS	ROMERO BELTRÁN	ESTUDIANTE	2025-11-07 09:43:43.24881	ACTIVO	pbkdf2_sha256$1000000$tToQfuNnsWqlGpPeKyXuK7$70Kd4hXPx+cL1yM4iOXD27HAW7EGSRloUaqd52Nn6JE=	t	f	f	\N
73	m.guerreroa@udd.cl	MARTÍN ISAIAS	GUERRERO ANCAPICHÚN	ESTUDIANTE	2025-11-07 09:43:43.25485	ACTIVO	pbkdf2_sha256$1000000$lpRQ4M6Si8lzMwxUsSTY6t$pD4j6FAFpN6itqB36QtUIGVEZmId1vZXXpo3zJVA28Q=	t	f	f	\N
74	l.riquelmet@udd.cl	LUCAS JEREMÍAS	RIQUELME TORRES	ESTUDIANTE	2025-11-07 09:43:43.258776	ACTIVO	pbkdf2_sha256$1000000$2PdKNYGCtGPNPXSlQVwjiK$FJ392p3ca6w/pfpJ+tK6AhmLnh06yDZ9WbWlHKp30Tg=	t	f	f	\N
75	m.olivaresr@udd.cl	MARTÍN ALEJANDRO	OLIVARES ROJAS	ESTUDIANTE	2025-11-07 09:43:43.262529	ACTIVO	pbkdf2_sha256$1000000$xBLICaO2jO9cY5m0ATAjd0$jhN1H4ntdcStUlpGHj7rsFIpe1eM/klMv+r1oKvUQAo=	t	f	f	\N
76	r.varelar@udd.cl	RENATO IGNACIO	VARELA ROJAS	ESTUDIANTE	2025-11-07 09:43:43.265929	ACTIVO	pbkdf2_sha256$1000000$V2wqJjylEC8GcntD5lnwwp$caxhha1xpICGH3SaCYe7kBYJ2GPqRBZd2jSOL2Ac4Nc=	t	f	f	\N
77	sramorinoc@udd.cl	SEBASTIÁN	RAMORINO CARRILLO	ESTUDIANTE	2025-11-07 09:43:43.270801	ACTIVO	pbkdf2_sha256$1000000$0dWp11XUW2X007C9fVqYeK$h7CBHe6xDoB9BPc46ZucYvyfXajg5D7HEeD/++2kmyI=	t	f	f	\N
78	a.barrientosv@udd.cl	ALEJANDRO PATRICIO	BARRIENTOS VILLALOBOS	ESTUDIANTE	2025-11-07 09:43:43.273608	ACTIVO	pbkdf2_sha256$1000000$8kzpyBmOkumLZEjxnXZdIL$trsfvHrvsYPTcxuztaLvlXV7pCqsDlVbMOZY+VVilic=	t	f	f	\N
83	a.torresf@udd.cl	ÁLVARO FRANCISCO	TORRES FERNÁNDEZ	ESTUDIANTE	2025-11-07 09:43:43.294272	ACTIVO	pbkdf2_sha256$1000000$hdEHMkBFWi9TofRznwvZa5$uhyofInGfAv5caDFGEn/gQkSmBPDtkCDDluVv/ISkcs=	t	f	f	\N
84	b.farinal@udd.cl	BASTIÁN IGNACIO	FARIÑA LARA	ESTUDIANTE	2025-11-07 09:43:43.298558	ACTIVO	pbkdf2_sha256$1000000$Yeioa9dXz3q79ddMhcUS8n$DdnZiIa6UVjw8BGT04/4VC/ndCTK9YGKlGhtB06lVco=	t	f	f	\N
\.


--
-- TOC entry 5577 (class 0 OID 74084)
-- Dependencies: 300
-- Data for Name: api_usuario_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_usuario_groups (id, usuario_id, group_id) FROM stdin;
\.


--
-- TOC entry 5579 (class 0 OID 74099)
-- Dependencies: 302
-- Data for Name: api_usuario_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_usuario_user_permissions (id, usuario_id, permission_id) FROM stdin;
\.


--
-- TOC entry 5499 (class 0 OID 49163)
-- Dependencies: 222
-- Data for Name: atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atributo (id, valoratributo, categoria_atributo_id, equipo_desafio_id) FROM stdin;
\.


--
-- TOC entry 5562 (class 0 OID 57379)
-- Dependencies: 285
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- TOC entry 5564 (class 0 OID 57389)
-- Dependencies: 287
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- TOC entry 5560 (class 0 OID 57369)
-- Dependencies: 283
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add carrera	7	add_carrera
26	Can change carrera	7	change_carrera
27	Can delete carrera	7	delete_carrera
28	Can view carrera	7	view_carrera
29	Can add token	8	add_token
30	Can change token	8	change_token
31	Can delete token	8	delete_token
32	Can view token	8	view_token
33	Can add curso estudiante	9	add_cursoestudiante
34	Can change curso estudiante	9	change_cursoestudiante
35	Can delete curso estudiante	9	delete_cursoestudiante
36	Can view curso estudiante	9	view_cursoestudiante
37	Can add categoria atributo	10	add_categoriaatributo
38	Can change categoria atributo	10	change_categoriaatributo
39	Can delete categoria atributo	10	delete_categoriaatributo
40	Can view categoria atributo	10	view_categoriaatributo
41	Can add partida usuario	11	add_partidausuario
42	Can change partida usuario	11	change_partidausuario
43	Can delete partida usuario	11	delete_partidausuario
44	Can view partida usuario	11	view_partidausuario
45	Can add usuario	12	add_usuario
46	Can change usuario	12	change_usuario
47	Can delete usuario	12	delete_usuario
48	Can view usuario	12	view_usuario
49	Can add ranking	13	add_ranking
50	Can change ranking	13	change_ranking
51	Can delete ranking	13	delete_ranking
52	Can view ranking	13	view_ranking
53	Can add facultad	14	add_facultad
54	Can change facultad	14	change_facultad
55	Can delete facultad	14	delete_facultad
56	Can view facultad	14	view_facultad
57	Can add solucion lego	15	add_solucionlego
58	Can change solucion lego	15	change_solucionlego
59	Can delete solucion lego	15	delete_solucionlego
60	Can view solucion lego	15	view_solucionlego
61	Can add etapa	16	add_etapa
62	Can change etapa	16	change_etapa
63	Can delete etapa	16	delete_etapa
64	Can view etapa	16	view_etapa
65	Can add evaluacion pitch	17	add_evaluacionpitch
66	Can change evaluacion pitch	17	change_evaluacionpitch
67	Can delete evaluacion pitch	17	delete_evaluacionpitch
68	Can view evaluacion pitch	17	view_evaluacionpitch
69	Can add configuracion valor	18	add_configuracionvalor
70	Can change configuracion valor	18	change_configuracionvalor
71	Can delete configuracion valor	18	delete_configuracionvalor
72	Can view configuracion valor	18	view_configuracionvalor
73	Can add ganas emprender	19	add_ganasemprender
74	Can change ganas emprender	19	change_ganasemprender
75	Can delete ganas emprender	19	delete_ganasemprender
76	Can view ganas emprender	19	view_ganasemprender
77	Can add estudiante	20	add_estudiante
78	Can change estudiante	20	change_estudiante
79	Can delete estudiante	20	delete_estudiante
80	Can view estudiante	20	view_estudiante
81	Can add persona	21	add_persona
82	Can change persona	21	change_persona
83	Can delete persona	21	delete_persona
84	Can view persona	21	view_persona
85	Can add curso	22	add_curso
86	Can change curso	22	change_curso
87	Can delete curso	22	delete_curso
88	Can view curso	22	view_curso
89	Can add video	23	add_video
90	Can change video	23	change_video
91	Can delete video	23	delete_video
92	Can view video	23	view_video
93	Can add profesor	24	add_profesor
94	Can change profesor	24	change_profesor
95	Can delete profesor	24	delete_profesor
96	Can view profesor	24	view_profesor
97	Can add administrador	25	add_administrador
98	Can change administrador	25	change_administrador
99	Can delete administrador	25	delete_administrador
100	Can view administrador	25	view_administrador
101	Can add configuracion	26	add_configuracion
102	Can change configuracion	26	change_configuracion
103	Can delete configuracion	26	delete_configuracion
104	Can view configuracion	26	view_configuracion
105	Can add evaluacion autoencuesta	27	add_evaluacionautoencuesta
106	Can change evaluacion autoencuesta	27	change_evaluacionautoencuesta
107	Can delete evaluacion autoencuesta	27	delete_evaluacionautoencuesta
108	Can view evaluacion autoencuesta	27	view_evaluacionautoencuesta
109	Can add tipo curso	28	add_tipocurso
110	Can change tipo curso	28	change_tipocurso
111	Can delete tipo curso	28	delete_tipocurso
112	Can view tipo curso	28	view_tipocurso
113	Can add tema desafio	29	add_temadesafio
114	Can change tema desafio	29	change_temadesafio
115	Can delete tema desafio	29	delete_temadesafio
116	Can view tema desafio	29	view_temadesafio
117	Can add partida	30	add_partida
118	Can change partida	30	change_partida
119	Can delete partida	30	delete_partida
120	Can view partida	30	view_partida
121	Can add equipo desafio	31	add_equipodesafio
122	Can change equipo desafio	31	change_equipodesafio
123	Can delete equipo desafio	31	delete_equipodesafio
124	Can view equipo desafio	31	view_equipodesafio
125	Can add atributo	32	add_atributo
126	Can change atributo	32	change_atributo
127	Can delete atributo	32	delete_atributo
128	Can view atributo	32	view_atributo
129	Can add equipo	33	add_equipo
130	Can change equipo	33	change_equipo
131	Can delete equipo	33	delete_equipo
132	Can view equipo	33	view_equipo
133	Can add lista participante	34	add_listaparticipante
134	Can change lista participante	34	change_listaparticipante
135	Can delete lista participante	34	delete_listaparticipante
136	Can view lista participante	34	view_listaparticipante
137	Can add instruccion etapa	35	add_instruccionetapa
138	Can change instruccion etapa	35	change_instruccionetapa
139	Can delete instruccion etapa	35	delete_instruccionetapa
140	Can view instruccion etapa	35	view_instruccionetapa
141	Can add desafio	36	add_desafio
142	Can change desafio	36	change_desafio
143	Can delete desafio	36	delete_desafio
144	Can view desafio	36	view_desafio
145	Can add administrador	37	add_administrador
146	Can change administrador	37	change_administrador
147	Can delete administrador	37	delete_administrador
148	Can view administrador	37	view_administrador
149	Can add atributo	38	add_atributo
150	Can change atributo	38	change_atributo
151	Can delete atributo	38	delete_atributo
152	Can view atributo	38	view_atributo
153	Can add carrera	39	add_carrera
154	Can change carrera	39	change_carrera
155	Can delete carrera	39	delete_carrera
156	Can view carrera	39	view_carrera
157	Can add categoria atributo	40	add_categoriaatributo
158	Can change categoria atributo	40	change_categoriaatributo
159	Can delete categoria atributo	40	delete_categoriaatributo
160	Can view categoria atributo	40	view_categoriaatributo
161	Can add configuracion	41	add_configuracion
162	Can change configuracion	41	change_configuracion
163	Can delete configuracion	41	delete_configuracion
164	Can view configuracion	41	view_configuracion
165	Can add configuracion valor	42	add_configuracionvalor
166	Can change configuracion valor	42	change_configuracionvalor
167	Can delete configuracion valor	42	delete_configuracionvalor
168	Can view configuracion valor	42	view_configuracionvalor
169	Can add curso	43	add_curso
170	Can change curso	43	change_curso
171	Can delete curso	43	delete_curso
172	Can view curso	43	view_curso
173	Can add curso estudiante	44	add_cursoestudiante
174	Can change curso estudiante	44	change_cursoestudiante
175	Can delete curso estudiante	44	delete_cursoestudiante
176	Can view curso estudiante	44	view_cursoestudiante
177	Can add desafio	45	add_desafio
178	Can change desafio	45	change_desafio
179	Can delete desafio	45	delete_desafio
180	Can view desafio	45	view_desafio
181	Can add estudiante	46	add_estudiante
182	Can change estudiante	46	change_estudiante
183	Can delete estudiante	46	delete_estudiante
184	Can view estudiante	46	view_estudiante
185	Can add etapa	47	add_etapa
186	Can change etapa	47	change_etapa
187	Can delete etapa	47	delete_etapa
188	Can view etapa	47	view_etapa
189	Can add evaluacion autoencuesta	48	add_evaluacionautoencuesta
190	Can change evaluacion autoencuesta	48	change_evaluacionautoencuesta
191	Can delete evaluacion autoencuesta	48	delete_evaluacionautoencuesta
192	Can view evaluacion autoencuesta	48	view_evaluacionautoencuesta
193	Can add evaluacion pitch	49	add_evaluacionpitch
194	Can change evaluacion pitch	49	change_evaluacionpitch
195	Can delete evaluacion pitch	49	delete_evaluacionpitch
196	Can view evaluacion pitch	49	view_evaluacionpitch
197	Can add facultad	50	add_facultad
198	Can change facultad	50	change_facultad
199	Can delete facultad	50	delete_facultad
200	Can view facultad	50	view_facultad
201	Can add ganas emprender	51	add_ganasemprender
202	Can change ganas emprender	51	change_ganasemprender
203	Can delete ganas emprender	51	delete_ganasemprender
204	Can view ganas emprender	51	view_ganasemprender
205	Can add instruccion etapa	52	add_instruccionetapa
206	Can change instruccion etapa	52	change_instruccionetapa
207	Can delete instruccion etapa	52	delete_instruccionetapa
208	Can view instruccion etapa	52	view_instruccionetapa
209	Can add lista participante	53	add_listaparticipante
210	Can change lista participante	53	change_listaparticipante
211	Can delete lista participante	53	delete_listaparticipante
212	Can view lista participante	53	view_listaparticipante
213	Can add partida	54	add_partida
214	Can change partida	54	change_partida
215	Can delete partida	54	delete_partida
216	Can view partida	54	view_partida
217	Can add partida usuario	55	add_partidausuario
218	Can change partida usuario	55	change_partidausuario
219	Can delete partida usuario	55	delete_partidausuario
220	Can view partida usuario	55	view_partidausuario
221	Can add persona	56	add_persona
222	Can change persona	56	change_persona
223	Can delete persona	56	delete_persona
224	Can view persona	56	view_persona
225	Can add profesor	57	add_profesor
226	Can change profesor	57	change_profesor
227	Can delete profesor	57	delete_profesor
228	Can view profesor	57	view_profesor
229	Can add ranking	58	add_ranking
230	Can change ranking	58	change_ranking
231	Can delete ranking	58	delete_ranking
232	Can view ranking	58	view_ranking
233	Can add solucion lego	59	add_solucionlego
234	Can change solucion lego	59	change_solucionlego
235	Can delete solucion lego	59	delete_solucionlego
236	Can view solucion lego	59	view_solucionlego
237	Can add tema desafio	60	add_temadesafio
238	Can change tema desafio	60	change_temadesafio
239	Can delete tema desafio	60	delete_temadesafio
240	Can view tema desafio	60	view_temadesafio
241	Can add tipo curso	61	add_tipocurso
242	Can change tipo curso	61	change_tipocurso
243	Can delete tipo curso	61	delete_tipocurso
244	Can view tipo curso	61	view_tipocurso
245	Can add token	62	add_token
246	Can change token	62	change_token
247	Can delete token	62	delete_token
248	Can view token	62	view_token
249	Can add usuario	63	add_usuario
250	Can change usuario	63	change_usuario
251	Can delete usuario	63	delete_usuario
252	Can view usuario	63	view_usuario
253	Can add video	64	add_video
254	Can change video	64	change_video
255	Can delete video	64	delete_video
256	Can view video	64	view_video
257	Can add vista detalle equipo	65	add_vistadetalleequipo
258	Can change vista detalle equipo	65	change_vistadetalleequipo
259	Can delete vista detalle equipo	65	delete_vistadetalleequipo
260	Can view vista detalle equipo	65	view_vistadetalleequipo
261	Can add equipo	66	add_equipo
262	Can change equipo	66	change_equipo
263	Can delete equipo	66	delete_equipo
264	Can view equipo	66	view_equipo
265	Can add equipo desafio	67	add_equipodesafio
266	Can change equipo desafio	67	change_equipodesafio
267	Can delete equipo desafio	67	delete_equipodesafio
268	Can view equipo desafio	67	view_equipodesafio
269	Can add Token	68	add_token
270	Can change Token	68	change_token
271	Can delete Token	68	delete_token
272	Can view Token	68	view_token
273	Can add Token	69	add_tokenproxy
274	Can change Token	69	change_tokenproxy
275	Can delete Token	69	delete_tokenproxy
276	Can view Token	69	view_tokenproxy
277	Can add progreso etapa	70	add_progresoetapa
278	Can change progreso etapa	70	change_progresoetapa
279	Can delete progreso etapa	70	delete_progresoetapa
280	Can view progreso etapa	70	view_progresoetapa
281	Can add vista detalle equipo	71	add_vistadetalleequipo
282	Can change vista detalle equipo	71	change_vistadetalleequipo
283	Can delete vista detalle equipo	71	delete_vistadetalleequipo
284	Can view vista detalle equipo	71	view_vistadetalleequipo
\.


--
-- TOC entry 5566 (class 0 OID 57398)
-- Dependencies: 289
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$1000000$Lzvl79qvi1g8q7haCRUcWv$b51F5jhvhwBpeF/BRvqLNAPa/ntx8+zInTM7S+rWAWo=	2025-10-25 15:32:31.829619-03	t	Laura			Laura@udd.cl	t	t	2025-10-25 15:28:31.58239-03
2	pbkdf2_sha256$1000000$GmevnN8D3SINJ8VoyhuZdM$lzD7UzIi4HxASgACYYbLx2xrUHdRlzSZFCc1fBlKdA8=	2025-11-05 00:20:46.579178-03	t	administrador			admin@udd.cl	t	t	2025-11-05 00:20:17.602472-03
3	pbkdf2_sha256$1000000$hSGkehSkiwNmkcpL4yOmaL$gbdrbq2+3+8FVvPxBYL4Ukr51jbsPGOCB0AHiSHGJcM=	2025-11-14 21:40:41.196963-03	t	admin			admin@gmail.com	t	t	2025-11-14 21:38:44.622697-03
\.


--
-- TOC entry 5568 (class 0 OID 57417)
-- Dependencies: 291
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- TOC entry 5570 (class 0 OID 57426)
-- Dependencies: 293
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- TOC entry 5580 (class 0 OID 82221)
-- Dependencies: 304
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
18c402745b7577166f6fa509e67cb2737e5ffc7a	2025-11-15 16:21:13.796049-03	20
9de11e0fa92442db62eab9dea5bf81082a88d317	2025-11-15 16:23:53.424103-03	18
ddfb180e1541c04be19b013d920d148b42208dd4	2025-11-15 16:25:48.477995-03	15
\.


--
-- TOC entry 5501 (class 0 OID 49173)
-- Dependencies: 224
-- Data for Name: carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrera (id, facultad_id, nombre, estado) FROM stdin;
11	14	Carrera de 4bb259f9f4	ACTIVO
12	14	Carrera de e00c0ad633	ACTIVO
13	13	Carrera de d0c971bf5b	ACTIVO
14	15	Carrera de 3397ef3136	ACTIVO
15	14	Carrera de d358976667	ACTIVO
16	11	Carrera de e756f5e315	ACTIVO
17	12	Carrera de ece4403d6f	ACTIVO
18	11	Carrera de 8443a903e3	ACTIVO
19	13	Carrera de 2c7dd3dceb	ACTIVO
20	12	Carrera de 2ce100e415	ACTIVO
\.


--
-- TOC entry 5503 (class 0 OID 49185)
-- Dependencies: 226
-- Data for Name: categoria_atributo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_atributo (id, nombrecategoria) FROM stdin;
11	Creatividad
12	Comunicación Efectiva
13	Liderazgo
14	Resolución de Problemas
15	Trabajo en Equipo
\.


--
-- TOC entry 5505 (class 0 OID 49194)
-- Dependencies: 228
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion (id, nombre, tipodato) FROM stdin;
11	Tiempo máximo por etapa	INTEGER
12	Permitir registro de nuevos usuarios	BOOLEAN
13	Mensaje de bienvenida del sistema	TEXT
14	Versión del sistema	VARCHAR
\.


--
-- TOC entry 5507 (class 0 OID 49204)
-- Dependencies: 230
-- Data for Name: configuracion_valor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_valor (id, valor, configuracion_id, usuario_id) FROM stdin;
\.


--
-- TOC entry 5509 (class 0 OID 49217)
-- Dependencies: 232
-- Data for Name: curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curso (id, carrera_id, tipo_curso_id, codigo, nombre, descripcion) FROM stdin;
1	16	12	SIG978	Curso de da944ce280f66e3	\N
2	18	11	SIG326	Curso de 76e985311a116c1	\N
3	11	13	SIG138	Curso de 0dd04b38abcbd3a	\N
4	14	13	SIG745	Curso de 382f7582150787f	\N
5	16	11	SIG895	Curso de 9078b98a29d1407	\N
6	15	14	SIG143	Curso de a432bbb6af9d11b	\N
7	13	13	SIG463	Curso de 461832b9dd96a35	\N
8	16	12	SIG665	Curso de 89134499b1220f6	\N
9	12	11	SIG951	Curso de 741c81d89c6da61	\N
10	14	14	SIG293	Curso de f8233f44afd057a	\N
11	13	11	SIG617	Curso de e3d85f3ac997e0d	\N
12	13	13	SIG999	Curso de 1b1c6a45246d076	\N
13	13	13	SIG477	Curso de 74701ff0c893874	\N
14	17	11	SIG569	Curso de ff0ac7b67fe3ec9	\N
15	17	11	SIG446	Curso de 689430b8df98cc2	\N
16	16	13	SIG755	Curso de a16e36e63060471	\N
17	16	11	SIG688	Curso de 3087ad307a04df6	\N
18	18	14	SIG860	Curso de cc6e0f380c393fc	\N
19	18	13	SIG656	Curso de 07194ea4c1f4e19	\N
20	14	12	SIG172	Curso de 5472535e8d4221f	\N
21	14	13	SIG411	Curso de 6caf38f711fbccc	\N
22	11	13	SIG992	Curso de 648c2516c80d7a2	\N
23	20	11	SIG162	Curso de 3749981c663a012	\N
24	11	11	SIG766	Curso de 61eae6f3a4f4968	\N
25	15	14	SIG325	Curso de 55ce74e28563a02	\N
\.


--
-- TOC entry 5511 (class 0 OID 49231)
-- Dependencies: 234
-- Data for Name: curso_estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curso_estudiante (id, curso_id, estudiante_id) FROM stdin;
1	24	17
2	15	20
3	11	16
4	8	10
5	19	17
6	25	14
7	18	20
8	1	22
9	7	21
10	6	9
11	17	16
12	14	9
13	22	18
14	4	21
15	9	8
16	20	8
17	19	15
18	10	22
19	12	14
20	6	16
21	15	17
22	13	21
23	19	18
24	9	23
25	9	16
26	9	18
27	16	13
28	21	18
29	3	13
30	12	12
31	21	22
32	10	14
33	3	17
34	4	23
35	3	23
36	1	10
37	12	20
38	20	12
39	2	23
40	14	20
41	14	10
42	6	15
43	4	8
44	8	16
45	15	18
46	9	9
47	3	11
48	4	9
49	20	19
50	8	8
51	24	11
52	24	10
53	22	11
54	13	8
55	15	19
56	25	9
57	16	23
58	3	15
59	5	13
60	2	17
61	2	9
62	7	13
63	3	19
64	14	11
65	23	22
66	2	16
67	11	20
68	24	18
69	25	19
\.


--
-- TOC entry 5513 (class 0 OID 49241)
-- Dependencies: 236
-- Data for Name: desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.desafio (id, tema_desafio_id, fechacreacion, titulo, descripcion, nombrepersona, edadpersona, contexto, estado, persona_id) FROM stdin;
1	11	2025-09-01 23:01:47.877898	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 1	\N	\N	\N	ACTIVO	17
2	13	2025-08-09 09:11:51.291562	Desafío sobre Educación Digital	Descripción detallada del desafío número 2	\N	\N	\N	ACTIVO	15
3	14	2024-07-04 12:39:30.305611	Desafío sobre Inclusión Financiera	Descripción detallada del desafío número 3	\N	\N	\N	ACTIVO	11
4	12	2024-03-08 22:13:11.957012	Desafío sobre Salud y Bienestar	Descripción detallada del desafío número 4	\N	\N	\N	ACTIVO	12
5	11	2024-10-16 19:56:39.800008	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 5	\N	\N	\N	ACTIVO	15
6	13	2025-01-07 08:22:20.146426	Desafío sobre Educación Digital	Descripción detallada del desafío número 6	\N	\N	\N	ACTIVO	15
7	14	2025-03-31 04:28:34.865083	Desafío sobre Inclusión Financiera	Descripción detallada del desafío número 7	\N	\N	\N	ACTIVO	11
8	13	2025-06-11 23:54:19.939649	Desafío sobre Educación Digital	Descripción detallada del desafío número 8	\N	\N	\N	ACTIVO	20
9	11	2025-09-21 09:47:40.8443	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 9	\N	\N	\N	ACTIVO	17
10	13	2024-07-12 13:08:12.36341	Desafío sobre Educación Digital	Descripción detallada del desafío número 10	\N	\N	\N	ACTIVO	14
11	12	2025-06-30 17:12:46.038242	Desafío sobre Salud y Bienestar	Descripción detallada del desafío número 11	\N	\N	\N	ACTIVO	19
12	11	2024-08-30 15:39:12.824944	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 12	\N	\N	\N	ACTIVO	17
13	12	2024-07-14 00:36:39.465698	Desafío sobre Salud y Bienestar	Descripción detallada del desafío número 13	\N	\N	\N	ACTIVO	13
14	12	2025-08-09 03:21:48.091541	Desafío sobre Salud y Bienestar	Descripción detallada del desafío número 14	\N	\N	\N	ACTIVO	20
15	13	2025-08-13 18:05:39.388644	Desafío sobre Educación Digital	Descripción detallada del desafío número 15	\N	\N	\N	ACTIVO	20
16	13	2024-02-23 10:30:31.165824	Desafío sobre Educación Digital	Descripción detallada del desafío número 16	\N	\N	\N	ACTIVO	14
17	11	2024-09-10 09:07:47.002826	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 17	\N	\N	\N	ACTIVO	15
18	11	2024-12-05 09:41:30.169727	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 18	\N	\N	\N	ACTIVO	19
19	13	2024-04-08 20:01:19.502879	Desafío sobre Educación Digital	Descripción detallada del desafío número 19	\N	\N	\N	ACTIVO	18
20	11	2025-01-29 10:45:21.299431	Desafío sobre Sostenibilidad Ambiental	Descripción detallada del desafío número 20	\N	\N	\N	ACTIVO	12
\.


--
-- TOC entry 5572 (class 0 OID 57487)
-- Dependencies: 295
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- TOC entry 5558 (class 0 OID 57357)
-- Dependencies: 281
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	api	carrera
8	api	token
9	api	cursoestudiante
10	api	categoriaatributo
11	api	partidausuario
12	api	usuario
13	api	ranking
14	api	facultad
15	api	solucionlego
16	api	etapa
17	api	evaluacionpitch
18	api	configuracionvalor
19	api	ganasemprender
20	api	estudiante
21	api	persona
22	api	curso
23	api	video
24	api	profesor
25	api	administrador
26	api	configuracion
27	api	evaluacionautoencuesta
28	api	tipocurso
29	api	temadesafio
30	api	partida
31	api	equipodesafio
32	api	atributo
33	api	equipo
34	api	listaparticipante
35	api	instruccionetapa
36	api	desafio
37	usuarios	administrador
38	usuarios	atributo
39	usuarios	carrera
40	usuarios	categoriaatributo
41	usuarios	configuracion
42	usuarios	configuracionvalor
43	usuarios	curso
44	usuarios	cursoestudiante
45	usuarios	desafio
46	usuarios	estudiante
47	usuarios	etapa
48	usuarios	evaluacionautoencuesta
49	usuarios	evaluacionpitch
50	usuarios	facultad
51	usuarios	ganasemprender
52	usuarios	instruccionetapa
53	usuarios	listaparticipante
54	usuarios	partida
55	usuarios	partidausuario
56	usuarios	persona
57	usuarios	profesor
58	usuarios	ranking
59	usuarios	solucionlego
60	usuarios	temadesafio
61	usuarios	tipocurso
62	usuarios	token
63	usuarios	usuario
64	usuarios	video
65	usuarios	vistadetalleequipo
66	usuarios	equipo
67	usuarios	equipodesafio
68	authtoken	token
69	authtoken	tokenproxy
70	api	progresoetapa
71	api	vistadetalleequipo
\.


--
-- TOC entry 5556 (class 0 OID 57345)
-- Dependencies: 279
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-10-25 15:23:03.106593-03
2	auth	0001_initial	2025-10-25 15:23:03.603182-03
3	admin	0001_initial	2025-10-25 15:23:03.672413-03
4	admin	0002_logentry_remove_auto_add	2025-10-25 15:23:03.679025-03
5	admin	0003_logentry_add_action_flag_choices	2025-10-25 15:23:03.684182-03
6	contenttypes	0002_remove_content_type_name	2025-10-25 15:23:03.748912-03
7	auth	0002_alter_permission_name_max_length	2025-10-25 15:23:03.754342-03
8	auth	0003_alter_user_email_max_length	2025-10-25 15:23:03.760869-03
9	auth	0004_alter_user_username_opts	2025-10-25 15:23:03.766725-03
10	auth	0005_alter_user_last_login_null	2025-10-25 15:23:03.772258-03
11	auth	0006_require_contenttypes_0002	2025-10-25 15:23:03.773678-03
12	auth	0007_alter_validators_add_error_messages	2025-10-25 15:23:03.778007-03
13	auth	0008_alter_user_username_max_length	2025-10-25 15:23:03.914902-03
14	auth	0009_alter_user_last_name_max_length	2025-10-25 15:23:03.921672-03
15	auth	0010_alter_group_name_max_length	2025-10-25 15:23:03.928168-03
16	auth	0011_update_proxy_permissions	2025-10-25 15:23:03.933781-03
17	auth	0012_alter_user_first_name_max_length	2025-10-25 15:23:03.942185-03
18	sessions	0001_initial	2025-10-25 15:23:04.056943-03
19	api	0001_initial	2025-10-25 16:16:05.507758-03
20	api	0002_alter_estudiante_table_comment_and_more	2025-10-25 16:29:22.018552-03
21	usuarios	0001_initial	2025-11-05 00:29:52.011786-03
26	api	0003_rename_contrasena_usuario_password_progresoetapa	2025-11-14 21:09:57.340567-03
27	api	0004_alter_usuario_fechacreacion	2025-11-14 21:22:52.898293-03
28	api	0005_alter_usuario_table_comment_and_more	2025-11-14 22:03:38.306614-03
29	api	0006_vistadetalleequipo_alter_usuario_table	2025-11-15 16:10:09.175636-03
30	authtoken	0001_initial	2025-11-15 16:18:41.842467-03
31	authtoken	0002_auto_20160226_1747	2025-11-15 16:18:41.916193-03
32	authtoken	0003_tokenproxy	2025-11-15 16:18:41.919205-03
33	authtoken	0004_alter_tokenproxy_options	2025-11-15 16:18:41.922889-03
34	api	0007_alter_partida_video	2025-11-15 19:14:23.575038-03
35	api	0008_add_partida_to_video	2025-11-19 02:17:25.228474-03
36	api	0009_copy_partida_video_data	2025-11-19 02:17:25.458055-03
37	api	0010_remove_partida_video	2025-11-19 02:17:25.915378-03
\.


--
-- TOC entry 5573 (class 0 OID 57527)
-- Dependencies: 296
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
ppj0y2dr5w5qtk030tnvbp5mll3pr52v	.eJxVjDsOwjAQBe_iGlleB-xASc8ZrP0ZB5AjxUmFuDuJlALamXnvbRIuc0lL0ykNYi4GzOGXEfJT6ybkgfU-Wh7rPA1kt8TuttnbKPq67u3fQcFW1rU6DCdVyhnJs0BQAD064oBn8nkllEn7DmIX0InHniUG1YgZ0DGZzxcvaTnu:1vCj43:oKmssOlJWYddn1ul7gNaPOduDbIxBFcAYQif6C-mUn4	2025-11-08 15:32:31.944624-03
gmjtlir1yc3sqq5smvdnj7seyspq6sex	.eJxVjEEOwiAQRe_C2pBSKjAu3XsGMsOAVA0kpV0Z7y5NutDt--_9t_C4rdlvLS5-ZnERozj9MsLwjGUf-IHlXmWoZV1mkrsij7XJW-X4uh7u30HGlnttNBtUanDJAATUMBE4tudBm0ScrEUFxAam6LrQOQOSpjgGdK634vMF1lc3zA:1vGU4k:YcG6weU5VNgHK_3sfzRSVwezG-bG2WsToKEsMbYIICU	2025-11-19 00:20:46.697904-03
zx1nqhy7alvyw5d5z4p2suh6shc16p6t	.eJxVjMsOwiAUBf-FtSG8Hy7d9xsIFy5SNZCUdmX8d9ukC92emTlvEuK21rANXMKcyZVIcvndIKYntgPkR2z3TlNv6zIDPRR60kGnnvF1O92_gxpH3WslFSDXXDqZk0SnkjNCF800Uzklz7NRUTLnlPXFCNBg0AtuC9idRUE-X8IVNxw:1vK4LJ:D6coT0UY0NsFD731JSHccq3L7DcJRGYQwV80OfAuTqc	2025-11-28 21:40:41.27002-03
\.


--
-- TOC entry 5515 (class 0 OID 49258)
-- Dependencies: 238
-- Data for Name: equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipo (id, nombreequipo, tamanoequipo) FROM stdin;
1	Los Pioneros 1	3
2	Los Visionarios 2	4
3	Los Innovadores 3	3
4	Los Creativos 4	3
5	Los Titanes 5	4
6	Los Creativos 6	3
7	Los Pioneros 7	3
8	Los Titanes 8	3
9	Los Visionarios 9	3
10	Los Pioneros 10	5
11	Los Creativos 11	4
12	Los Exploradores 12	3
13	Los Creativos 13	4
14	Los Titanes 14	5
15	Los Pioneros 15	4
16	Equipo 1	\N
17	Equipo 2	\N
18	Equipo 3	\N
19	Equipo 4	\N
20	Equipo 1	\N
21	Equipo 2	\N
22	Equipo 3	\N
23	Equipo 4	\N
24	Equipo 1	\N
25	Equipo 2	\N
26	Equipo 3	\N
27	Equipo 4	\N
60	Equipo 1	\N
61	Equipo 2	\N
62	Equipo 3	\N
63	Equipo 4	\N
64	Equipo 1	\N
65	Equipo 2	\N
66	Equipo 3	\N
67	Equipo 4	\N
68	Equipo 1	\N
69	Equipo 2	\N
70	Equipo 3	\N
71	Equipo 4	\N
72	Los Exploradores	2
73	Los Innovadores	1
74	Los Exploradores	2
75	Los Innovadores	1
76	Los Exploradores	2
77	Los Innovadores	1
\.


--
-- TOC entry 5516 (class 0 OID 49266)
-- Dependencies: 239
-- Data for Name: equipo_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipo_desafio (equipo_id, desafio_id, desafio_persona_id) FROM stdin;
1	4	12
2	13	13
3	1	17
4	20	12
5	16	14
6	6	15
7	3	11
8	20	12
9	14	20
10	8	20
11	15	20
12	9	17
13	10	14
14	8	20
15	11	19
\.


--
-- TOC entry 5518 (class 0 OID 49275)
-- Dependencies: 241
-- Data for Name: estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estudiante (id, usuario_id, lista_participante_id) FROM stdin;
8	17	21
9	21	22
10	23	23
11	25	24
12	30	25
13	37	26
14	40	27
15	42	28
16	43	29
17	45	30
18	52	31
19	54	32
20	57	33
21	58	34
22	59	35
23	62	36
28	71	122
29	72	123
30	73	124
31	74	125
32	75	126
33	76	127
34	77	128
35	78	129
36	79	130
37	80	131
38	81	132
39	82	133
40	83	134
41	84	135
42	85	136
43	86	137
44	87	138
45	88	139
46	89	140
47	90	141
\.


--
-- TOC entry 5520 (class 0 OID 49285)
-- Dependencies: 243
-- Data for Name: etapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etapa (id, nombreetapa, duracionminutos, orden, descripcion, estado, textohabilidad) FROM stdin;
12	Ideación	30	1	Generar ideas innovadoras para resolver el desafío.	ACTIVO	Fomenta la creatividad y el pensamiento lateral.
13	Prototipado	45	2	Construir un prototipo de baja fidelidad de la solución.	ACTIVO	Desarrolla habilidades de construcción y diseño rápido.
14	Validación	20	3	Obtener retroalimentación sobre el prototipo.	ACTIVO	Practica la escucha activa y la empatía.
15	Pitch Final	15	4	Presentar la solución final de forma convincente.	ACTIVO	Mejora la comunicación y la persuasión.
\.


--
-- TOC entry 5522 (class 0 OID 49299)
-- Dependencies: 245
-- Data for Name: evaluacion_autoencuesta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluacion_autoencuesta (id, estudiante_id, ganas_emprender_id, evalsatisf, comentarios) FROM stdin;
\.


--
-- TOC entry 5524 (class 0 OID 49312)
-- Dependencies: 247
-- Data for Name: evaluacion_pitch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluacion_pitch (id, equipo_evaluador_id, equipo_evaluado_id, puntajeequipo, puntajeempatia, puntajecreatividad, puntajecomunicacion) FROM stdin;
1	8	1	2	2	4	3
2	2	7	2	4	2	3
3	7	8	3	2	4	1
4	14	15	3	3	3	4
5	1	9	1	2	4	4
6	9	3	3	1	1	2
7	7	11	2	4	2	3
8	4	10	4	2	2	4
9	4	12	2	4	1	4
10	13	14	2	4	3	3
11	4	3	3	3	3	4
12	15	3	4	4	4	4
13	6	8	1	1	4	1
14	5	10	2	4	3	2
15	6	10	4	1	1	1
16	5	9	2	2	3	1
17	1	3	4	4	1	1
18	4	1	4	2	3	2
19	13	1	1	1	1	2
20	3	14	1	2	2	4
21	11	2	4	1	2	4
22	15	11	2	4	1	2
23	10	5	1	3	1	4
24	8	5	2	1	2	2
25	6	9	2	2	3	3
26	12	5	1	2	2	4
27	14	1	2	1	1	4
28	4	7	1	2	1	4
29	6	5	3	1	4	2
30	12	14	3	2	2	4
31	10	2	3	3	2	2
32	9	1	2	3	3	1
33	11	15	2	1	4	4
34	1	4	3	2	3	3
35	3	11	3	2	2	1
36	15	2	3	2	4	1
37	11	6	4	3	1	3
38	10	13	4	4	2	3
39	13	7	2	3	4	4
40	1	13	3	4	4	1
41	9	2	4	3	1	4
42	7	6	4	4	3	4
\.


--
-- TOC entry 5526 (class 0 OID 49326)
-- Dependencies: 249
-- Data for Name: facultad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facultad (id, nombre) FROM stdin;
11	Facultad de Ingeniería y Ciencias
12	Facultad de Economía y Negocios
13	Facultad de Diseño y Comunicación
14	Facultad de Ciencias Sociales
15	Facultad de Artes Liberales
\.


--
-- TOC entry 5528 (class 0 OID 49335)
-- Dependencies: 251
-- Data for Name: ganas_emprender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ganas_emprender (id, descripcion) FROM stdin;
11	¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?
12	¿Disfrutas de los desafíos y de resolver problemas complejos?
13	¿Te sientes cómodo tomando riesgos calculados?
14	¿Te motiva la idea de crear tu propio camino profesional?
15	¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?
16	¿Disfrutas de los desafíos y de resolver problemas complejos?
17	¿Te sientes cómodo tomando riesgos calculados?
18	¿Te motiva la idea de crear tu propio camino profesional?
\.


--
-- TOC entry 5530 (class 0 OID 49344)
-- Dependencies: 253
-- Data for Name: instruccion_etapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instruccion_etapa (id, etapa_id, contenido) FROM stdin;
\.


--
-- TOC entry 5532 (class 0 OID 49356)
-- Dependencies: 255
-- Data for Name: lista_participante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_participante (id, emailestudiante, nombreestudiante) FROM stdin;
21	estudiante1@pre-registro.com	Participante 1
22	estudiante2@pre-registro.com	Participante 2
23	estudiante3@pre-registro.com	Participante 3
24	estudiante4@pre-registro.com	Participante 4
25	estudiante5@pre-registro.com	Participante 5
26	estudiante6@pre-registro.com	Participante 6
27	estudiante7@pre-registro.com	Participante 7
28	estudiante8@pre-registro.com	Participante 8
29	estudiante9@pre-registro.com	Participante 9
30	estudiante10@pre-registro.com	Participante 10
31	estudiante11@pre-registro.com	Participante 11
32	estudiante12@pre-registro.com	Participante 12
33	estudiante13@pre-registro.com	Participante 13
34	estudiante14@pre-registro.com	Participante 14
35	estudiante15@pre-registro.com	Participante 15
36	estudiante16@pre-registro.com	Participante 16
37	estudiante17@pre-registro.com	Participante 17
38	estudiante18@pre-registro.com	Participante 18
39	estudiante19@pre-registro.com	Participante 19
40	estudiante20@pre-registro.com	Participante 20
41	estudiante21@pre-registro.com	Participante 21
42	estudiante22@pre-registro.com	Participante 22
43	estudiante23@pre-registro.com	Participante 23
44	estudiante24@pre-registro.com	Participante 24
45	estudiante25@pre-registro.com	Participante 25
46	estudiante26@pre-registro.com	Participante 26
47	estudiante27@pre-registro.com	Participante 27
48	estudiante28@pre-registro.com	Participante 28
49	estudiante29@pre-registro.com	Participante 29
50	estudiante30@pre-registro.com	Participante 30
51	estudiante31@pre-registro.com	Participante 31
52	estudiante32@pre-registro.com	Participante 32
53	estudiante33@pre-registro.com	Participante 33
54	estudiante34@pre-registro.com	Participante 34
55	estudiante35@pre-registro.com	Participante 35
56	estudiante36@pre-registro.com	Participante 36
57	estudiante37@pre-registro.com	Participante 37
58	estudiante38@pre-registro.com	Participante 38
59	estudiante39@pre-registro.com	Participante 39
60	estudiante40@pre-registro.com	Participante 40
61	estudiante41@pre-registro.com	Participante 41
62	estudiante42@pre-registro.com	Participante 42
63	estudiante43@pre-registro.com	Participante 43
64	estudiante44@pre-registro.com	Participante 44
65	estudiante45@pre-registro.com	Participante 45
66	estudiante46@pre-registro.com	Participante 46
67	estudiante47@pre-registro.com	Participante 47
68	estudiante48@pre-registro.com	Participante 48
69	estudiante49@pre-registro.com	Participante 49
70	estudiante50@pre-registro.com	Participante 50
71	estudiante51@pre-registro.com	Participante 51
72	estudiante52@pre-registro.com	Participante 52
73	estudiante53@pre-registro.com	Participante 53
74	estudiante54@pre-registro.com	Participante 54
75	estudiante55@pre-registro.com	Participante 55
76	estudiante56@pre-registro.com	Participante 56
77	estudiante57@pre-registro.com	Participante 57
78	estudiante58@pre-registro.com	Participante 58
79	estudiante59@pre-registro.com	Participante 59
80	estudiante60@pre-registro.com	Participante 60
81	estudiante61@pre-registro.com	Participante 61
82	estudiante62@pre-registro.com	Participante 62
83	estudiante63@pre-registro.com	Participante 63
84	estudiante64@pre-registro.com	Participante 64
85	estudiante65@pre-registro.com	Participante 65
86	estudiante66@pre-registro.com	Participante 66
87	estudiante67@pre-registro.com	Participante 67
88	estudiante68@pre-registro.com	Participante 68
89	estudiante69@pre-registro.com	Participante 69
90	estudiante70@pre-registro.com	Participante 70
91	estudiante71@pre-registro.com	Participante 71
92	estudiante72@pre-registro.com	Participante 72
93	estudiante73@pre-registro.com	Participante 73
94	estudiante74@pre-registro.com	Participante 74
95	estudiante75@pre-registro.com	Participante 75
96	estudiante76@pre-registro.com	Participante 76
97	estudiante77@pre-registro.com	Participante 77
98	estudiante78@pre-registro.com	Participante 78
99	estudiante79@pre-registro.com	Participante 79
100	estudiante80@pre-registro.com	Participante 80
101	estudiante81@pre-registro.com	Participante 81
102	estudiante82@pre-registro.com	Participante 82
103	estudiante83@pre-registro.com	Participante 83
104	estudiante84@pre-registro.com	Participante 84
105	estudiante85@pre-registro.com	Participante 85
106	estudiante86@pre-registro.com	Participante 86
107	estudiante87@pre-registro.com	Participante 87
108	estudiante88@pre-registro.com	Participante 88
109	estudiante89@pre-registro.com	Participante 89
110	estudiante90@pre-registro.com	Participante 90
111	estudiante91@pre-registro.com	Participante 91
112	estudiante92@pre-registro.com	Participante 92
113	estudiante93@pre-registro.com	Participante 93
114	estudiante94@pre-registro.com	Participante 94
115	estudiante95@pre-registro.com	Participante 95
116	estudiante96@pre-registro.com	Participante 96
117	estudiante97@pre-registro.com	Participante 97
118	estudiante98@pre-registro.com	Participante 98
119	estudiante99@pre-registro.com	Participante 99
120	estudiante100@pre-registro.com	Participante 100
122	s.ruizr@udd.cl	SEBASTIAN FERNANDO
123	d.romerob@udd.cl	DANIEL ANDRÉS
124	m.guerreroa@udd.cl	MARTÍN ISAIAS
125	l.riquelmet@udd.cl	LUCAS JEREMÍAS
126	m.olivaresr@udd.cl	MARTÍN ALEJANDRO
127	r.varelar@udd.cl	RENATO IGNACIO
128	sramorinoc@udd.cl	SEBASTIÁN
129	a.barrientosv@udd.cl	ALEJANDRO PATRICIO
130	matvergaraf@udd.cl	MATÍAS ALEJANDRO
131	lanascot@udd.cl	LEANDRO
132	spagem@udd.cl	SANTIAGO ANDRÉS
133	jsaavedrah@udd.cl	JOSE IGNACIO
134	a.torresf@udd.cl	ÁLVARO FRANCISCO
135	b.farinal@udd.cl	BASTIÁN IGNACIO
136	j.azuajep@udd.cl	JESUS ALEJANDRO
137	r.barbosap@udd.cl	RAIMUNDO
138	a.reyesp@udd.cl	AGUSTÍN EDUARDO
139	alumno1@correo.com	Juan
140	alumno2@correo.com	Ana
141	alumno3@correo.com	Carlos
\.


--
-- TOC entry 5534 (class 0 OID 49366)
-- Dependencies: 257
-- Data for Name: partida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partida (id, fechacreacion, estado, codigoacceso, fechainicio, fechafin, maxequipos, maxparticipantes) FROM stdin;
1	2025-10-18 14:50:40.112565	CONFIGURACION	98738E	2024-03-19 02:55:22.408867	2024-03-19 03:27:45.447719	4	\N
2	2025-10-18 14:50:40.112565	CONFIGURACION	F78799	2024-06-03 19:02:46.259056	2024-06-03 19:09:58.137267	4	\N
3	2025-10-18 14:50:40.112565	FINALIZADO	FC453C	2025-03-22 13:54:09.109928	2025-03-22 16:05:22.673101	4	\N
4	2025-10-18 14:50:40.112565	FINALIZADO	4170D9	2025-06-11 16:58:52.647256	2025-06-11 17:44:26.089538	4	\N
5	2025-10-18 14:50:40.112565	CONFIGURACION	31CD8B	2024-09-02 20:58:44.034226	2024-09-02 21:36:02.936818	4	\N
6	2025-10-18 14:50:40.112565	EN_CURSO	17B431	2025-09-19 19:18:14.806233	2025-09-19 19:56:43.439446	4	\N
7	2025-10-18 14:50:40.112565	FINALIZADO	CE15FE	2025-02-14 11:00:37.42886	2025-02-14 13:48:37.985098	4	\N
8	2025-10-18 14:50:40.112565	CONFIGURACION	ED84F5	2024-02-18 21:20:49.296616	2024-02-18 22:55:53.280601	4	\N
9	2025-10-18 14:50:40.112565	FINALIZADO	4C48BB	2025-05-12 03:35:14.71211	2025-05-12 05:26:24.67552	4	\N
10	2025-10-18 14:50:40.112565	CONFIGURACION	4CCA5F	2024-04-12 08:32:46.697173	2024-04-12 11:19:15.070375	4	\N
11	2025-10-18 14:50:40.112565	FINALIZADO	024951	2025-10-14 12:02:07.57281	2025-10-14 14:55:58.072399	4	\N
12	2025-10-18 14:50:40.112565	FINALIZADO	0463BE	2024-03-28 02:10:03.55197	2024-03-28 02:50:29.840274	4	\N
13	2025-10-18 14:50:40.112565	FINALIZADO	BC5C17	2024-08-29 01:13:16.951274	2024-08-29 02:33:45.895574	4	\N
14	2025-10-18 14:50:40.112565	CONFIGURACION	0FE9E6	2024-10-08 20:27:19.009803	2024-10-08 20:44:32.172144	4	\N
15	2025-10-18 14:50:40.112565	EN_CURSO	62FEE8	2024-09-05 07:42:35.581965	2024-09-05 08:50:24.391801	4	\N
23	2025-11-07 04:22:00.2378	EN_CURSO	\N	\N	\N	\N	\N
24	2025-11-07 04:27:14.853781	EN_CURSO	\N	\N	\N	\N	\N
25	2025-11-07 05:02:58.717672	EN_CURSO	\N	\N	\N	\N	\N
35	2025-11-07 09:43:43.113288	EN_CURSO	\N	\N	\N	\N	\N
36	2025-11-07 09:49:42.994644	EN_CURSO	\N	\N	\N	\N	\N
37	2025-11-07 17:48:47.388679	EN_CURSO	\N	\N	\N	\N	\N
39	2025-11-15 22:14:53.978704	EN_CURSO	6f00de9b	\N	\N	4	20
40	2025-11-15 22:14:56.887095	EN_CURSO	2d756056	\N	\N	4	20
\.


--
-- TOC entry 5536 (class 0 OID 49381)
-- Dependencies: 259
-- Data for Name: partida_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partida_usuario (id, usuario_id, partida_id, equipo_id) FROM stdin;
1	59	12	5
2	54	1	5
3	52	12	2
4	57	9	7
5	17	7	14
6	43	12	2
7	40	3	13
8	40	14	10
9	17	12	4
10	30	13	5
11	42	13	4
12	57	12	13
13	21	4	13
14	42	3	11
15	42	5	14
16	21	6	7
17	17	6	7
18	30	2	8
19	43	10	14
20	42	6	12
21	30	11	8
22	62	12	2
23	43	8	14
24	17	1	15
25	52	11	1
26	58	12	6
27	30	8	5
28	30	10	4
29	45	2	2
30	25	2	4
31	62	15	12
32	57	2	7
33	43	13	4
34	52	4	5
35	58	8	4
36	37	8	13
37	59	9	7
38	62	8	9
39	30	12	8
40	37	13	13
41	62	7	11
42	45	13	4
43	52	14	14
44	45	9	12
45	17	15	14
46	30	3	3
47	30	6	8
48	25	9	14
49	59	14	13
50	57	15	10
51	23	5	1
52	37	5	9
53	71	35	60
54	72	35	61
55	73	35	62
56	74	35	63
57	75	35	60
58	76	35	61
59	77	35	62
60	78	35	63
61	79	35	60
62	80	35	61
63	81	35	62
64	82	35	63
65	83	35	60
66	84	35	61
67	85	35	62
68	86	35	63
69	87	35	60
70	71	36	64
71	75	36	65
72	84	36	66
73	85	36	67
74	78	36	64
75	73	36	65
76	79	36	66
77	86	36	67
78	87	36	64
79	77	36	65
80	80	36	66
81	81	36	67
82	82	36	64
83	76	36	65
84	74	36	66
85	72	36	67
86	83	36	64
87	72	37	68
88	79	37	69
89	76	37	70
90	77	37	71
91	73	37	68
92	74	37	69
93	86	37	70
94	87	37	71
95	78	37	68
96	71	37	69
97	84	37	70
98	75	37	71
99	80	37	68
100	83	37	69
101	81	37	70
102	85	37	71
103	82	37	68
104	88	40	72
105	89	40	72
106	90	40	73
\.


--
-- TOC entry 5538 (class 0 OID 49392)
-- Dependencies: 261
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persona (id, nombrepersona, imagenurl, contextopersona, edad) FROM stdin;
11	Arquetipo 1	https://example.com/imagen1.jpg	Este es el contexto de la persona 1, describe sus necesidades y problemas.	67
12	Arquetipo 2	https://example.com/imagen2.jpg	Este es el contexto de la persona 2, describe sus necesidades y problemas.	37
13	Arquetipo 3	https://example.com/imagen3.jpg	Este es el contexto de la persona 3, describe sus necesidades y problemas.	51
14	Arquetipo 4	https://example.com/imagen4.jpg	Este es el contexto de la persona 4, describe sus necesidades y problemas.	49
15	Arquetipo 5	https://example.com/imagen5.jpg	Este es el contexto de la persona 5, describe sus necesidades y problemas.	40
16	Arquetipo 6	https://example.com/imagen6.jpg	Este es el contexto de la persona 6, describe sus necesidades y problemas.	55
17	Arquetipo 7	https://example.com/imagen7.jpg	Este es el contexto de la persona 7, describe sus necesidades y problemas.	62
18	Arquetipo 8	https://example.com/imagen8.jpg	Este es el contexto de la persona 8, describe sus necesidades y problemas.	55
19	Arquetipo 9	https://example.com/imagen9.jpg	Este es el contexto de la persona 9, describe sus necesidades y problemas.	43
20	Arquetipo 10	https://example.com/imagen10.jpg	Este es el contexto de la persona 10, describe sus necesidades y problemas.	54
\.


--
-- TOC entry 5540 (class 0 OID 49405)
-- Dependencies: 263
-- Data for Name: profesor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesor (id, usuario_id) FROM stdin;
14	15
15	16
16	20
17	27
18	28
19	29
20	31
21	33
22	34
23	38
\.


--
-- TOC entry 5542 (class 0 OID 49414)
-- Dependencies: 265
-- Data for Name: ranking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ranking (id, equipo_id, totaltokens, posicionfinal) FROM stdin;
\.


--
-- TOC entry 5544 (class 0 OID 49426)
-- Dependencies: 267
-- Data for Name: solucion_lego; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solucion_lego (id, equipo_id, fechacreacion, descripsoluc, fotoprototipurl) FROM stdin;
1	13	2025-01-14 06:53:11.365477	Esta es la descripción de la solución LEGO para el equipo 13	http://example.com/foto1.jpg
2	11	2024-11-01 03:29:10.82534	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto2.jpg
3	4	2024-08-29 05:22:58.221633	Esta es la descripción de la solución LEGO para el equipo 4	http://example.com/foto3.jpg
4	8	2024-04-22 07:32:33.441879	Esta es la descripción de la solución LEGO para el equipo 8	http://example.com/foto4.jpg
5	5	2025-06-26 00:13:39.563241	Esta es la descripción de la solución LEGO para el equipo 5	http://example.com/foto5.jpg
6	4	2024-06-21 04:37:40.394021	Esta es la descripción de la solución LEGO para el equipo 4	http://example.com/foto6.jpg
7	11	2024-03-27 22:55:40.20583	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto7.jpg
8	11	2024-09-14 10:03:18.102579	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto8.jpg
9	12	2024-06-07 14:50:55.172765	Esta es la descripción de la solución LEGO para el equipo 12	http://example.com/foto9.jpg
11	11	2025-07-08 01:30:08.873501	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto11.jpg
12	9	2025-05-11 05:52:30.326208	Esta es la descripción de la solución LEGO para el equipo 9	http://example.com/foto12.jpg
13	4	2025-03-18 03:37:26.962707	Esta es la descripción de la solución LEGO para el equipo 4	http://example.com/foto13.jpg
14	5	2024-07-27 17:45:44.832772	Esta es la descripción de la solución LEGO para el equipo 5	http://example.com/foto14.jpg
16	7	2024-03-03 00:21:11.444528	Esta es la descripción de la solución LEGO para el equipo 7	http://example.com/foto16.jpg
18	5	2025-04-02 06:48:12.859195	Esta es la descripción de la solución LEGO para el equipo 5	http://example.com/foto18.jpg
19	7	2025-05-04 04:02:16.013743	Esta es la descripción de la solución LEGO para el equipo 7	http://example.com/foto19.jpg
20	12	2024-07-28 03:36:48.53712	Esta es la descripción de la solución LEGO para el equipo 12	http://example.com/foto20.jpg
21	8	2024-11-13 17:35:03.350653	Esta es la descripción de la solución LEGO para el equipo 8	http://example.com/foto21.jpg
22	15	2025-05-09 02:58:50.311332	Esta es la descripción de la solución LEGO para el equipo 15	http://example.com/foto22.jpg
23	2	2025-02-26 11:06:02.013206	Esta es la descripción de la solución LEGO para el equipo 2	http://example.com/foto23.jpg
24	15	2025-09-11 01:16:45.751197	Esta es la descripción de la solución LEGO para el equipo 15	http://example.com/foto24.jpg
25	15	2025-02-25 00:12:14.110616	Esta es la descripción de la solución LEGO para el equipo 15	http://example.com/foto25.jpg
26	15	2025-07-27 22:41:01.855625	Esta es la descripción de la solución LEGO para el equipo 15	http://example.com/foto26.jpg
27	11	2024-02-02 02:16:32.937498	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto27.jpg
28	4	2025-06-26 17:17:55.143655	Esta es la descripción de la solución LEGO para el equipo 4	http://example.com/foto28.jpg
29	13	2025-09-07 10:15:06.126331	Esta es la descripción de la solución LEGO para el equipo 13	http://example.com/foto29.jpg
30	14	2024-10-20 18:38:26.823521	Esta es la descripción de la solución LEGO para el equipo 14	http://example.com/foto30.jpg
31	11	2025-03-12 12:45:36.324355	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto31.jpg
32	5	2025-07-26 14:27:50.149199	Esta es la descripción de la solución LEGO para el equipo 5	http://example.com/foto32.jpg
33	13	2025-05-29 22:05:24.125474	Esta es la descripción de la solución LEGO para el equipo 13	http://example.com/foto33.jpg
34	11	2025-04-22 05:43:50.075003	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto34.jpg
35	12	2024-07-16 13:54:06.16917	Esta es la descripción de la solución LEGO para el equipo 12	http://example.com/foto35.jpg
37	1	2024-05-02 06:02:40.664781	Esta es la descripción de la solución LEGO para el equipo 1	http://example.com/foto37.jpg
38	11	2025-05-03 10:56:01.266189	Esta es la descripción de la solución LEGO para el equipo 11	http://example.com/foto38.jpg
39	2	2024-10-26 00:26:09.728801	Esta es la descripción de la solución LEGO para el equipo 2	http://example.com/foto39.jpg
40	13	2024-08-11 07:48:52.99491	Esta es la descripción de la solución LEGO para el equipo 13	http://example.com/foto40.jpg
10	2	2025-10-09 19:00:52.269227		https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_2_1763523242.jpg
15	3	2024-06-20 13:29:55.270537		https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_3_1763523254.jpg
36	4	2025-10-03 16:38:45.533786		https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_4_1763523264.jpg
17	1	2024-10-12 02:57:06.985563		https://storage.googleapis.com/mision-emprende-prototiposs/soluciones/group_1_1763523391.jpeg
\.


--
-- TOC entry 5546 (class 0 OID 49439)
-- Dependencies: 269
-- Data for Name: tema_desafio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tema_desafio (id, nombretema, descripcion, estado) FROM stdin;
11	Sostenibilidad Ambiental	Crear soluciones para reducir el impacto ecológico en la ciudad.	ACTIVO
12	Salud y Bienestar	Desarrollar ideas para mejorar la calidad de vida y la salud de las personas.	ACTIVO
13	Educación Digital	Innovar en herramientas educativas para el aprendizaje en línea.	ACTIVO
14	Inclusión Financiera	Crear servicios financieros accesibles para todos.	ACTIVO
\.


--
-- TOC entry 5548 (class 0 OID 49452)
-- Dependencies: 271
-- Data for Name: tipo_curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_curso (id, nombre) FROM stdin;
11	Obligatorio
12	Electivo
13	Taller
14	Práctica Profesional
\.


--
-- TOC entry 5550 (class 0 OID 49461)
-- Dependencies: 273
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, equipo_id, tipotoken, cantidad, etapa_id, fechaotorgada) FROM stdin;
1	1	EVALUACION	51	12	2024-04-10 18:09:33.528839
2	9	RECOMPENSA_ETAPA	10	12	2025-09-26 02:01:54.940606
3	15	RECOMPENSA_ETAPA	27	15	2024-03-29 08:46:16.51544
4	11	BONIFICACION	29	15	2024-11-06 21:44:42.55682
5	3	BONIFICACION	33	12	2024-07-27 22:19:22.305375
6	6	RECOMPENSA_ETAPA	39	14	2024-02-12 18:49:49.639137
7	1	BONIFICACION	32	12	2025-03-14 09:24:22.526059
8	5	BONIFICACION	13	13	2024-10-30 15:08:35.674309
9	15	EVALUACION	26	14	2024-07-26 12:52:49.654931
10	1	BONIFICACION	38	13	2024-07-18 01:38:59.858154
11	8	RECOMPENSA_ETAPA	42	15	2024-03-21 16:42:03.860435
12	10	RECOMPENSA_ETAPA	38	14	2025-04-11 13:41:34.31671
13	11	EVALUACION	45	13	2024-09-14 12:14:53.680236
14	15	EVALUACION	23	12	2025-07-24 13:39:10.738603
15	6	BONIFICACION	16	13	2025-08-18 06:03:02.199038
16	8	RECOMPENSA_ETAPA	21	13	2025-10-02 00:24:20.661658
17	2	RECOMPENSA_ETAPA	18	15	2025-02-26 08:58:03.642699
18	2	RECOMPENSA_ETAPA	15	12	2024-11-15 21:00:16.489501
19	2	BONIFICACION	51	13	2024-05-12 21:15:49.950913
20	15	EVALUACION	24	15	2025-07-16 01:42:01.747662
21	13	RECOMPENSA_ETAPA	22	15	2025-06-17 05:18:18.290524
22	11	RECOMPENSA_ETAPA	42	13	2024-12-23 08:40:30.904274
23	15	RECOMPENSA_ETAPA	47	14	2025-01-24 05:53:23.41809
24	11	RECOMPENSA_ETAPA	33	15	2024-10-17 02:48:25.32506
25	4	EVALUACION	13	15	2025-07-20 21:28:40.007538
26	15	EVALUACION	55	15	2024-12-02 14:37:35.787488
27	11	BONIFICACION	42	12	2024-02-05 07:23:21.068901
28	13	BONIFICACION	47	14	2024-04-14 01:13:51.363502
29	4	EVALUACION	48	13	2024-09-01 00:51:27.825221
30	11	BONIFICACION	37	14	2025-04-08 05:23:08.665474
31	3	EVALUACION	24	13	2025-01-19 02:20:34.290275
32	9	EVALUACION	44	12	2025-07-09 22:10:48.661553
33	4	EVALUACION	52	15	2025-01-01 09:31:52.747622
34	13	RECOMPENSA_ETAPA	48	12	2024-09-05 06:14:06.8262
35	9	RECOMPENSA_ETAPA	23	12	2024-04-19 18:32:21.969548
36	10	BONIFICACION	52	12	2025-10-17 01:07:41.776306
37	14	BONIFICACION	12	12	2024-04-20 05:28:57.975133
38	2	BONIFICACION	49	12	2024-07-08 11:33:51.21166
39	10	EVALUACION	42	14	2025-07-08 06:02:57.70063
40	12	RECOMPENSA_ETAPA	15	12	2024-09-13 22:48:52.212164
41	14	EVALUACION	32	14	2024-05-08 02:27:54.129372
42	14	EVALUACION	23	14	2025-05-05 03:46:11.347862
43	5	BONIFICACION	23	12	2025-03-12 10:48:37.829721
44	5	RECOMPENSA_ETAPA	57	13	2024-10-15 04:43:08.958282
45	10	EVALUACION	56	13	2024-05-09 20:31:10.551795
46	2	RECOMPENSA_ETAPA	44	14	2025-01-14 18:22:33.342983
47	4	BONIFICACION	27	15	2024-12-26 09:32:57.875848
48	13	BONIFICACION	53	13	2024-03-14 06:30:31.980977
49	12	EVALUACION	53	12	2024-06-02 13:32:49.939928
50	8	RECOMPENSA_ETAPA	14	12	2025-04-15 05:22:21.312078
51	11	RECOMPENSA_ETAPA	51	12	2024-11-18 15:37:38.095591
52	12	EVALUACION	55	13	2025-05-05 10:05:56.145645
53	11	RECOMPENSA_ETAPA	28	12	2024-11-03 15:44:48.033527
54	11	BONIFICACION	21	15	2024-07-22 15:33:58.627212
55	4	EVALUACION	51	12	2025-08-17 07:34:21.471317
56	11	BONIFICACION	48	13	2024-12-24 15:22:27.349706
57	15	BONIFICACION	20	13	2025-09-14 19:59:32.097404
58	3	RECOMPENSA_ETAPA	39	14	2024-08-10 16:56:54.396663
59	13	EVALUACION	44	12	2024-06-03 03:50:54.372243
60	11	BONIFICACION	47	12	2025-03-01 01:08:19.697139
61	4	RECOMPENSA_ETAPA	37	14	2024-05-04 17:38:29.982623
62	12	RECOMPENSA_ETAPA	52	12	2024-10-28 11:32:59.219502
63	10	BONIFICACION	58	14	2025-07-19 11:16:49.978947
64	10	BONIFICACION	45	14	2025-03-10 22:34:03.88082
65	2	EVALUACION	21	14	2024-04-26 17:33:55.805459
66	10	BONIFICACION	48	13	2024-03-20 16:30:19.700619
67	3	EVALUACION	45	15	2025-08-01 10:23:34.191388
68	4	BONIFICACION	57	14	2025-06-23 00:00:34.755423
69	9	BONIFICACION	31	14	2024-05-26 10:23:59.216772
70	13	RECOMPENSA_ETAPA	51	15	2025-05-27 05:15:37.919739
71	12	BONIFICACION	53	12	2024-08-26 16:57:09.748211
72	5	BONIFICACION	13	14	2025-03-22 04:53:39.478322
73	13	BONIFICACION	44	14	2024-05-13 04:50:57.417276
74	9	BONIFICACION	19	12	2025-03-01 10:48:42.301207
75	4	EVALUACION	29	13	2025-02-19 00:33:40.621142
76	9	EVALUACION	13	15	2025-08-04 05:45:40.029923
77	15	RECOMPENSA_ETAPA	10	15	2025-07-16 15:15:36.211912
78	6	EVALUACION	21	15	2024-01-19 20:39:32.014375
79	11	BONIFICACION	28	13	2024-11-07 13:55:21.789488
80	7	BONIFICACION	46	14	2025-03-19 11:10:06.730219
81	14	BONIFICACION	38	12	2025-03-31 23:09:36.881931
82	13	RECOMPENSA_ETAPA	27	12	2024-10-23 00:13:21.722714
83	4	BONIFICACION	24	12	2024-01-24 13:29:36.505341
84	10	RECOMPENSA_ETAPA	17	14	2025-09-10 01:04:27.592087
85	1	EVALUACION	31	14	2024-02-09 05:45:25.224888
86	9	EVALUACION	57	13	2024-03-11 20:18:14.098215
87	5	RECOMPENSA_ETAPA	20	13	2024-11-20 15:18:24.22711
88	13	RECOMPENSA_ETAPA	20	15	2025-06-29 17:46:00.463892
89	15	BONIFICACION	18	12	2024-07-22 12:20:07.983317
90	13	BONIFICACION	48	15	2024-10-30 16:29:31.806144
91	8	EVALUACION	13	12	2024-09-05 17:38:44.695914
92	1	BONIFICACION	25	12	2024-01-10 19:35:35.541505
93	6	BONIFICACION	55	12	2024-04-09 08:28:23.001745
94	13	RECOMPENSA_ETAPA	30	12	2025-07-26 09:21:40.032086
95	5	BONIFICACION	52	12	2024-05-24 06:36:59.361456
96	3	BONIFICACION	19	13	2025-09-02 22:18:29.161303
97	10	BONIFICACION	39	14	2024-09-16 22:10:33.690517
98	1	BONIFICACION	23	14	2024-01-01 12:18:47.568735
99	6	BONIFICACION	33	15	2024-07-01 21:17:03.100855
100	2	EVALUACION	49	13	2024-02-23 02:57:29.752884
\.


--
-- TOC entry 5554 (class 0 OID 49494)
-- Dependencies: 277
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video (id, nombrevideo, url, partida_id) FROM stdin;
11	Video introductorio 1	https://www.youtube.com/watch?v=dQw4w9WgXcQ	13
13	Video introductorio 3	https://www.youtube.com/watch?v=dQw4w9WgXcQ	15
12	Video introductorio 2	https://www.youtube.com/watch?v=dQw4w9WgXcQ	37
14	Fase1	https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase1.mp4	\N
15	IntroduccionEmprendimiento	https://storage.googleapis.com/mision-emprende-prototiposs/videos/IntroduccionEmprendimiento.mp4	\N
16	Fase2	https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase2.mp4	\N
17	Fase3Empatia	https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase3Empatia.mp4	\N
18	Fase4Lego	https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase4SolucionLego.mp4	\N
19	Fase5Pitch	https://storage.googleapis.com/mision-emprende-prototiposs/videos/Fase5Pitch.mp4	\N
20	Cierre	https://storage.googleapis.com/mision-emprende-prototiposs/videos/CIerre.mp4	\N
\.


--
-- TOC entry 5623 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 13, true);


--
-- TOC entry 5624 (class 0 OID 0)
-- Dependencies: 297
-- Name: api_progresoetapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_progresoetapa_id_seq', 1, false);


--
-- TOC entry 5625 (class 0 OID 0)
-- Dependencies: 221
-- Name: atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.atributo_id_seq', 1, false);


--
-- TOC entry 5626 (class 0 OID 0)
-- Dependencies: 284
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- TOC entry 5627 (class 0 OID 0)
-- Dependencies: 286
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 5628 (class 0 OID 0)
-- Dependencies: 282
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 284, true);


--
-- TOC entry 5629 (class 0 OID 0)
-- Dependencies: 290
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- TOC entry 5630 (class 0 OID 0)
-- Dependencies: 288
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 3, true);


--
-- TOC entry 5631 (class 0 OID 0)
-- Dependencies: 292
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- TOC entry 5632 (class 0 OID 0)
-- Dependencies: 223
-- Name: carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrera_id_seq', 20, true);


--
-- TOC entry 5633 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_atributo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_atributo_id_seq', 15, true);


--
-- TOC entry 5634 (class 0 OID 0)
-- Dependencies: 227
-- Name: configuracion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_id_seq', 14, true);


--
-- TOC entry 5635 (class 0 OID 0)
-- Dependencies: 229
-- Name: configuracion_valor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_valor_id_seq', 1, false);


--
-- TOC entry 5636 (class 0 OID 0)
-- Dependencies: 233
-- Name: curso_estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curso_estudiante_id_seq', 69, true);


--
-- TOC entry 5637 (class 0 OID 0)
-- Dependencies: 231
-- Name: curso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curso_id_seq', 25, true);


--
-- TOC entry 5638 (class 0 OID 0)
-- Dependencies: 235
-- Name: desafio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desafio_id_seq', 20, true);


--
-- TOC entry 5639 (class 0 OID 0)
-- Dependencies: 294
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- TOC entry 5640 (class 0 OID 0)
-- Dependencies: 280
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 71, true);


--
-- TOC entry 5641 (class 0 OID 0)
-- Dependencies: 278
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 37, true);


--
-- TOC entry 5642 (class 0 OID 0)
-- Dependencies: 237
-- Name: equipo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipo_id_seq', 80, true);


--
-- TOC entry 5643 (class 0 OID 0)
-- Dependencies: 240
-- Name: estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estudiante_id_seq', 47, true);


--
-- TOC entry 5644 (class 0 OID 0)
-- Dependencies: 242
-- Name: etapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etapa_id_seq', 15, true);


--
-- TOC entry 5645 (class 0 OID 0)
-- Dependencies: 244
-- Name: evaluacion_autoencuesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluacion_autoencuesta_id_seq', 1, false);


--
-- TOC entry 5646 (class 0 OID 0)
-- Dependencies: 246
-- Name: evaluacion_pitch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluacion_pitch_id_seq', 42, true);


--
-- TOC entry 5647 (class 0 OID 0)
-- Dependencies: 248
-- Name: facultad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facultad_id_seq', 15, true);


--
-- TOC entry 5648 (class 0 OID 0)
-- Dependencies: 250
-- Name: ganas_emprender_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ganas_emprender_id_seq', 18, true);


--
-- TOC entry 5649 (class 0 OID 0)
-- Dependencies: 252
-- Name: instruccion_etapa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instruccion_etapa_id_seq', 1, false);


--
-- TOC entry 5650 (class 0 OID 0)
-- Dependencies: 254
-- Name: lista_participante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_participante_id_seq', 141, true);


--
-- TOC entry 5651 (class 0 OID 0)
-- Dependencies: 256
-- Name: partida_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partida_id_seq', 40, true);


--
-- TOC entry 5652 (class 0 OID 0)
-- Dependencies: 258
-- Name: partida_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partida_usuario_id_seq', 106, true);


--
-- TOC entry 5653 (class 0 OID 0)
-- Dependencies: 260
-- Name: persona_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persona_id_seq', 20, true);


--
-- TOC entry 5654 (class 0 OID 0)
-- Dependencies: 262
-- Name: profesor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesor_id_seq', 23, true);


--
-- TOC entry 5655 (class 0 OID 0)
-- Dependencies: 264
-- Name: ranking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ranking_id_seq', 1, false);


--
-- TOC entry 5656 (class 0 OID 0)
-- Dependencies: 266
-- Name: solucion_lego_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solucion_lego_id_seq', 40, true);


--
-- TOC entry 5657 (class 0 OID 0)
-- Dependencies: 268
-- Name: tema_desafio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tema_desafio_id_seq', 14, true);


--
-- TOC entry 5658 (class 0 OID 0)
-- Dependencies: 270
-- Name: tipo_curso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_curso_id_seq', 14, true);


--
-- TOC entry 5659 (class 0 OID 0)
-- Dependencies: 272
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_id_seq', 100, true);


--
-- TOC entry 5660 (class 0 OID 0)
-- Dependencies: 299
-- Name: usuario_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_groups_id_seq', 1, false);


--
-- TOC entry 5661 (class 0 OID 0)
-- Dependencies: 274
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 90, true);


--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 301
-- Name: usuario_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_user_permissions_id_seq', 1, false);


--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 276
-- Name: video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_id_seq', 20, true);


--
-- TOC entry 5156 (class 2606 OID 49506)
-- Name: administrador administrador_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5158 (class 2606 OID 49161)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- TOC entry 5279 (class 2606 OID 74040)
-- Name: api_progresoetapa api_progresoetapa_equipo_id_etapa_id_584085aa_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_equipo_id_etapa_id_584085aa_uniq UNIQUE (equipo_id, etapa_id);


--
-- TOC entry 5283 (class 2606 OID 74038)
-- Name: api_progresoetapa api_progresoetapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5287 (class 2606 OID 74120)
-- Name: api_usuario_groups api_usuario_groups_usuario_id_group_id_d9500af0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_usuario_id_group_id_d9500af0_uniq UNIQUE (usuario_id, group_id);


--
-- TOC entry 5291 (class 2606 OID 74134)
-- Name: api_usuario_user_permissions api_usuario_user_permiss_usuario_id_permission_id_7f855256_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_permiss_usuario_id_permission_id_7f855256_uniq UNIQUE (usuario_id, permission_id);


--
-- TOC entry 5160 (class 2606 OID 49171)
-- Name: atributo atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5243 (class 2606 OID 57523)
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 5248 (class 2606 OID 57444)
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 5251 (class 2606 OID 57396)
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5245 (class 2606 OID 57385)
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 5238 (class 2606 OID 57435)
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 5240 (class 2606 OID 57377)
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 5259 (class 2606 OID 57424)
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5262 (class 2606 OID 57459)
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 5253 (class 2606 OID 57413)
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- TOC entry 5265 (class 2606 OID 57433)
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5268 (class 2606 OID 57473)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 5256 (class 2606 OID 57516)
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 5298 (class 2606 OID 82228)
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- TOC entry 5300 (class 2606 OID 82230)
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- TOC entry 5162 (class 2606 OID 49182)
-- Name: carrera carrera_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera
    ADD CONSTRAINT carrera_pkey PRIMARY KEY (id);


--
-- TOC entry 5164 (class 2606 OID 49192)
-- Name: categoria_atributo categoria_atributo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_atributo
    ADD CONSTRAINT categoria_atributo_pkey PRIMARY KEY (id);


--
-- TOC entry 5166 (class 2606 OID 49202)
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (id);


--
-- TOC entry 5168 (class 2606 OID 49215)
-- Name: configuracion_valor configuracion_valor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT configuracion_valor_pkey PRIMARY KEY (id);


--
-- TOC entry 5172 (class 2606 OID 49239)
-- Name: curso_estudiante curso_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT curso_estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5170 (class 2606 OID 49229)
-- Name: curso curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_pkey PRIMARY KEY (id);


--
-- TOC entry 5174 (class 2606 OID 49256)
-- Name: desafio desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_pkey PRIMARY KEY (id, persona_id);


--
-- TOC entry 5271 (class 2606 OID 57500)
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5233 (class 2606 OID 57367)
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 5235 (class 2606 OID 57365)
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5231 (class 2606 OID 57355)
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5275 (class 2606 OID 57536)
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 5178 (class 2606 OID 49273)
-- Name: equipo_desafio equipo_desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT equipo_desafio_pkey PRIMARY KEY (equipo_id);


--
-- TOC entry 5176 (class 2606 OID 49265)
-- Name: equipo equipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT equipo_pkey PRIMARY KEY (id);


--
-- TOC entry 5180 (class 2606 OID 49508)
-- Name: estudiante estudiante_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5182 (class 2606 OID 49283)
-- Name: estudiante estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 49297)
-- Name: etapa etapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etapa
    ADD CONSTRAINT etapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5186 (class 2606 OID 49309)
-- Name: evaluacion_autoencuesta evaluacion_autoencuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT evaluacion_autoencuesta_pkey PRIMARY KEY (id);


--
-- TOC entry 5188 (class 2606 OID 49510)
-- Name: evaluacion_pitch evaluacion_pitch_idequipeval_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT evaluacion_pitch_idequipeval_un UNIQUE (equipo_evaluador_id, equipo_evaluado_id);


--
-- TOC entry 5190 (class 2606 OID 49320)
-- Name: evaluacion_pitch evaluacion_pitch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT evaluacion_pitch_pkey PRIMARY KEY (id);


--
-- TOC entry 5192 (class 2606 OID 49333)
-- Name: facultad facultad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultad
    ADD CONSTRAINT facultad_pkey PRIMARY KEY (id);


--
-- TOC entry 5194 (class 2606 OID 49342)
-- Name: ganas_emprender ganas_emprender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ganas_emprender
    ADD CONSTRAINT ganas_emprender_pkey PRIMARY KEY (id);


--
-- TOC entry 5196 (class 2606 OID 49354)
-- Name: instruccion_etapa instruccion_etapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa
    ADD CONSTRAINT instruccion_etapa_pkey PRIMARY KEY (id);


--
-- TOC entry 5198 (class 2606 OID 49364)
-- Name: lista_participante lista_participante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_participante
    ADD CONSTRAINT lista_participante_pkey PRIMARY KEY (id);


--
-- TOC entry 5200 (class 2606 OID 49512)
-- Name: partida partida_codigoacceso_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida
    ADD CONSTRAINT partida_codigoacceso_un UNIQUE (codigoacceso);


--
-- TOC entry 5202 (class 2606 OID 49378)
-- Name: partida partida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida
    ADD CONSTRAINT partida_pkey PRIMARY KEY (id);


--
-- TOC entry 5204 (class 2606 OID 49390)
-- Name: partida_usuario partida_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 5206 (class 2606 OID 49403)
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id);


--
-- TOC entry 5208 (class 2606 OID 49514)
-- Name: profesor profesor_idusuario_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_idusuario_un UNIQUE (usuario_id);


--
-- TOC entry 5210 (class 2606 OID 49412)
-- Name: profesor profesor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_pkey PRIMARY KEY (id);


--
-- TOC entry 5212 (class 2606 OID 49516)
-- Name: ranking ranking_idequipo_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_idequipo_un UNIQUE (equipo_id);


--
-- TOC entry 5214 (class 2606 OID 49424)
-- Name: ranking ranking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_pkey PRIMARY KEY (id);


--
-- TOC entry 5216 (class 2606 OID 49437)
-- Name: solucion_lego solucion_lego_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego
    ADD CONSTRAINT solucion_lego_pkey PRIMARY KEY (id);


--
-- TOC entry 5218 (class 2606 OID 49450)
-- Name: tema_desafio tema_desafio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema_desafio
    ADD CONSTRAINT tema_desafio_pkey PRIMARY KEY (id);


--
-- TOC entry 5220 (class 2606 OID 49459)
-- Name: tipo_curso tipo_curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_curso
    ADD CONSTRAINT tipo_curso_pkey PRIMARY KEY (id);


--
-- TOC entry 5222 (class 2606 OID 49472)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 5224 (class 2606 OID 74108)
-- Name: api_usuario usuario_email_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario
    ADD CONSTRAINT usuario_email_un UNIQUE (email);


--
-- TOC entry 5289 (class 2606 OID 74091)
-- Name: api_usuario_groups usuario_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT usuario_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5226 (class 2606 OID 49490)
-- Name: api_usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 5295 (class 2606 OID 74106)
-- Name: api_usuario_user_permissions usuario_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT usuario_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5229 (class 2606 OID 49504)
-- Name: video video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_pkey PRIMARY KEY (id);


--
-- TOC entry 5277 (class 1259 OID 74056)
-- Name: api_progresoetapa_equipo_id_96cddc52; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_equipo_id_96cddc52 ON public.api_progresoetapa USING btree (equipo_id);


--
-- TOC entry 5280 (class 1259 OID 74057)
-- Name: api_progresoetapa_etapa_id_e7d57675; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_etapa_id_e7d57675 ON public.api_progresoetapa USING btree (etapa_id);


--
-- TOC entry 5281 (class 1259 OID 74058)
-- Name: api_progresoetapa_finished_by_user_id_23569deb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_progresoetapa_finished_by_user_id_23569deb ON public.api_progresoetapa USING btree (finished_by_user_id);


--
-- TOC entry 5284 (class 1259 OID 74132)
-- Name: api_usuario_groups_group_id_a1787217; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_groups_group_id_a1787217 ON public.api_usuario_groups USING btree (group_id);


--
-- TOC entry 5285 (class 1259 OID 74131)
-- Name: api_usuario_groups_usuario_id_7c19c78d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_groups_usuario_id_7c19c78d ON public.api_usuario_groups USING btree (usuario_id);


--
-- TOC entry 5292 (class 1259 OID 74146)
-- Name: api_usuario_user_permissions_permission_id_0ae209ef; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_user_permissions_permission_id_0ae209ef ON public.api_usuario_user_permissions USING btree (permission_id);


--
-- TOC entry 5293 (class 1259 OID 74145)
-- Name: api_usuario_user_permissions_usuario_id_598fe587; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_usuario_user_permissions_usuario_id_598fe587 ON public.api_usuario_user_permissions USING btree (usuario_id);


--
-- TOC entry 5241 (class 1259 OID 57524)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 5246 (class 1259 OID 57455)
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- TOC entry 5249 (class 1259 OID 57456)
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- TOC entry 5236 (class 1259 OID 57441)
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- TOC entry 5257 (class 1259 OID 57471)
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- TOC entry 5260 (class 1259 OID 57470)
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- TOC entry 5263 (class 1259 OID 57485)
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- TOC entry 5266 (class 1259 OID 57484)
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- TOC entry 5254 (class 1259 OID 57517)
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- TOC entry 5296 (class 1259 OID 82236)
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- TOC entry 5269 (class 1259 OID 57511)
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- TOC entry 5272 (class 1259 OID 57512)
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- TOC entry 5273 (class 1259 OID 57538)
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- TOC entry 5276 (class 1259 OID 57537)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 5227 (class 1259 OID 82247)
-- Name: video_partida_id_0e889d8c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX video_partida_id_0e889d8c ON public.video USING btree (partida_id);


--
-- TOC entry 5301 (class 2606 OID 49519)
-- Name: administrador administrador_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5340 (class 2606 OID 74041)
-- Name: api_progresoetapa api_progresoetapa_equipo_id_96cddc52_fk_equipo_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_equipo_id_96cddc52_fk_equipo_id FOREIGN KEY (equipo_id) REFERENCES public.equipo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5341 (class 2606 OID 74046)
-- Name: api_progresoetapa api_progresoetapa_etapa_id_e7d57675_fk_etapa_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_etapa_id_e7d57675_fk_etapa_id FOREIGN KEY (etapa_id) REFERENCES public.etapa(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5342 (class 2606 OID 74051)
-- Name: api_progresoetapa api_progresoetapa_finished_by_user_id_23569deb_fk_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_progresoetapa
    ADD CONSTRAINT api_progresoetapa_finished_by_user_id_23569deb_fk_usuario_id FOREIGN KEY (finished_by_user_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5343 (class 2606 OID 74126)
-- Name: api_usuario_groups api_usuario_groups_group_id_a1787217_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_group_id_a1787217_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5344 (class 2606 OID 74121)
-- Name: api_usuario_groups api_usuario_groups_usuario_id_7c19c78d_fk_api_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_groups
    ADD CONSTRAINT api_usuario_groups_usuario_id_7c19c78d_fk_api_usuario_id FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5345 (class 2606 OID 74140)
-- Name: api_usuario_user_permissions api_usuario_user_per_permission_id_0ae209ef_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_per_permission_id_0ae209ef_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5346 (class 2606 OID 74135)
-- Name: api_usuario_user_permissions api_usuario_user_per_usuario_id_598fe587_fk_api_usuar; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_usuario_user_permissions
    ADD CONSTRAINT api_usuario_user_per_usuario_id_598fe587_fk_api_usuar FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5302 (class 2606 OID 49524)
-- Name: atributo atributo_categoria_atributo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_categoria_atributo_fk FOREIGN KEY (categoria_atributo_id) REFERENCES public.categoria_atributo(id);


--
-- TOC entry 5303 (class 2606 OID 49529)
-- Name: atributo atributo_equipo_desafio_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributo
    ADD CONSTRAINT atributo_equipo_desafio_fk FOREIGN KEY (equipo_desafio_id) REFERENCES public.equipo_desafio(equipo_id);


--
-- TOC entry 5332 (class 2606 OID 57450)
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5333 (class 2606 OID 57445)
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5331 (class 2606 OID 57436)
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5334 (class 2606 OID 57465)
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5335 (class 2606 OID 57460)
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5336 (class 2606 OID 57479)
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5337 (class 2606 OID 57474)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5347 (class 2606 OID 82231)
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_api_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_api_usuario_id FOREIGN KEY (user_id) REFERENCES public.api_usuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5304 (class 2606 OID 49534)
-- Name: carrera carrera_facultad_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera
    ADD CONSTRAINT carrera_facultad_fk FOREIGN KEY (facultad_id) REFERENCES public.facultad(id);


--
-- TOC entry 5307 (class 2606 OID 49549)
-- Name: curso curso_carrera_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_carrera_fk FOREIGN KEY (carrera_id) REFERENCES public.carrera(id);


--
-- TOC entry 5308 (class 2606 OID 49564)
-- Name: curso curso_tipo_curso_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_tipo_curso_fk FOREIGN KEY (tipo_curso_id) REFERENCES public.tipo_curso(id);


--
-- TOC entry 5311 (class 2606 OID 49569)
-- Name: desafio desafio_persona_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_persona_fk FOREIGN KEY (persona_id) REFERENCES public.persona(id);


--
-- TOC entry 5312 (class 2606 OID 49574)
-- Name: desafio desafio_tema_desafio_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desafio
    ADD CONSTRAINT desafio_tema_desafio_fk FOREIGN KEY (tema_desafio_id) REFERENCES public.tema_desafio(id);


--
-- TOC entry 5338 (class 2606 OID 57501)
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5339 (class 2606 OID 57506)
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5315 (class 2606 OID 49589)
-- Name: estudiante estudiante_lista_participante_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_lista_participante_fk FOREIGN KEY (lista_participante_id) REFERENCES public.lista_participante(id);


--
-- TOC entry 5316 (class 2606 OID 49594)
-- Name: estudiante estudiante_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5305 (class 2606 OID 49539)
-- Name: configuracion_valor fk_confvalor_configuracion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT fk_confvalor_configuracion FOREIGN KEY (configuracion_id) REFERENCES public.configuracion(id);


--
-- TOC entry 5306 (class 2606 OID 49544)
-- Name: configuracion_valor fk_confvalor_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_valor
    ADD CONSTRAINT fk_confvalor_usuario FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5309 (class 2606 OID 49554)
-- Name: curso_estudiante fk_cursoest_curso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT fk_cursoest_curso FOREIGN KEY (curso_id) REFERENCES public.curso(id);


--
-- TOC entry 5310 (class 2606 OID 49559)
-- Name: curso_estudiante fk_cursoest_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curso_estudiante
    ADD CONSTRAINT fk_cursoest_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiante(id);


--
-- TOC entry 5313 (class 2606 OID 49579)
-- Name: equipo_desafio fk_equipodesafio_desafio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT fk_equipodesafio_desafio FOREIGN KEY (desafio_id, desafio_persona_id) REFERENCES public.desafio(id, persona_id);


--
-- TOC entry 5314 (class 2606 OID 49584)
-- Name: equipo_desafio fk_equipodesafio_equipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipo_desafio
    ADD CONSTRAINT fk_equipodesafio_equipo FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5317 (class 2606 OID 49599)
-- Name: evaluacion_autoencuesta fk_evalauto_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT fk_evalauto_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiante(id);


--
-- TOC entry 5318 (class 2606 OID 49604)
-- Name: evaluacion_autoencuesta fk_evalauto_ganas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_autoencuesta
    ADD CONSTRAINT fk_evalauto_ganas FOREIGN KEY (ganas_emprender_id) REFERENCES public.ganas_emprender(id);


--
-- TOC entry 5319 (class 2606 OID 49614)
-- Name: evaluacion_pitch fk_evalpitch_equipo_evaluado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT fk_evalpitch_equipo_evaluado FOREIGN KEY (equipo_evaluado_id) REFERENCES public.equipo(id);


--
-- TOC entry 5320 (class 2606 OID 49609)
-- Name: evaluacion_pitch fk_evalpitch_equipo_evaluador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_pitch
    ADD CONSTRAINT fk_evalpitch_equipo_evaluador FOREIGN KEY (equipo_evaluador_id) REFERENCES public.equipo(id);


--
-- TOC entry 5321 (class 2606 OID 49619)
-- Name: instruccion_etapa instruccion_etapa_etapa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instruccion_etapa
    ADD CONSTRAINT instruccion_etapa_etapa_fk FOREIGN KEY (etapa_id) REFERENCES public.etapa(id);


--
-- TOC entry 5322 (class 2606 OID 49624)
-- Name: partida_usuario partida_usuario_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5323 (class 2606 OID 49629)
-- Name: partida_usuario partida_usuario_partida_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_partida_fk FOREIGN KEY (partida_id) REFERENCES public.partida(id);


--
-- TOC entry 5324 (class 2606 OID 49634)
-- Name: partida_usuario partida_usuario_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partida_usuario
    ADD CONSTRAINT partida_usuario_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5325 (class 2606 OID 49644)
-- Name: profesor profesor_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.api_usuario(id);


--
-- TOC entry 5326 (class 2606 OID 49649)
-- Name: ranking ranking_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5327 (class 2606 OID 49654)
-- Name: solucion_lego solucion_lego_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solucion_lego
    ADD CONSTRAINT solucion_lego_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5328 (class 2606 OID 49659)
-- Name: token token_equipo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_equipo_fk FOREIGN KEY (equipo_id) REFERENCES public.equipo(id);


--
-- TOC entry 5329 (class 2606 OID 49664)
-- Name: token token_etapa_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_etapa_fk FOREIGN KEY (etapa_id) REFERENCES public.etapa(id);


--
-- TOC entry 5330 (class 2606 OID 82242)
-- Name: video video_partida_id_0e889d8c_fk_partida_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video
    ADD CONSTRAINT video_partida_id_0e889d8c_fk_partida_id FOREIGN KEY (partida_id) REFERENCES public.partida(id) DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2025-11-20 22:52:58

--
-- PostgreSQL database dump complete
--

\unrestrict ECR5a7WAUjZiNKU5yadFq9WDgeBAtt8jcwwqB38zUbLZCScA5lC2BbZCJPncUK2

