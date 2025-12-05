Mision Emprende – Monorepo
==========================

Visión general
---------------
Aplicación web para gestionar misiones/retos de emprendimiento. Monorepo con frontend React (CRA + Tailwind) y backend Django/DRF. Incluye flujos para estudiantes, profesores y administradores.

Arquitectura (alto nivel)
-------------------------
- Frontend: React 18 (CRA), TailwindCSS, React Router v6. Build estático en `frontend/build` (se genera con `npm run build`).
- Backend: Django + Django REST Framework. Endpoints bajo `/api/` para autenticación, juegos/partidas, equipos, administración y almacenamiento.
- Base de datos: SQLite en dev; Postgres recomendado en despliegue (MySQL opcional con el driver correspondiente).
- Almacenamiento: URLs firmadas para ficheros (revisar `storage_service`).
- Infra: puede correr “bare metal” (Python + Node), o con Docker/Compose.

Estructura de carpetas principal
--------------------------------
- `backend/`          – Proyecto Django (settings en `config/`, app en `misionemprende/api`).
- `frontend/`         – App React (fuente en `src/`, estáticos en `public/`).
- `basedatos/`        – Scripts SQL de creación/poblado (opcional).
- `static/`           – Activos compartidos (servidos por Django en prod si usas collectstatic).
- Docs: hay README específicos en frontend y en módulos admin/profesor.

Estructura detallada
--------------------
Backend
- `backend/config/`            Settings/ASGI/WSGI/urls del proyecto Django.
- `backend/misionemprende/api/`
    - `models.py` + `migrations/`          Esquema de datos.
    - `serializers/`, `repositories/`, `services/`  Capa de acceso y lógica.
    - `views/` + `urls.py`                 ViewSets y endpoints funcionales.
    - `endpoints.py`                       Estado de juego (iniciar, estado actual).
    - `storage_service.py`                 URLs firmadas para archivos.
    - `tests.py`                           Pruebas backend.
- Scripts auxiliares eliminados ya no están en uso; el core queda en la app `api`.

Frontend (`frontend/src`)
- `components/`        Componentes generales (botones, modales, timer, tokens, etc.).
- `layouts/`           Plantillas comunes (AdminLayout, ProfessorLayout, StudentLayout).
- `modules/`
    - `admin/`           Páginas y vistas del rol admin (stats, profile, challenges).
    - `profesor/`        Vistas del rol profesor (home, perfil, grupos, waiting-room, game-active).
    - `student/`         Flujo principal de misiones/fases, overlays, videos, chatbot.
- `router/`            Configuración de rutas (React Router v6).
- `assets/`            Centralización de rutas a imágenes/sonidos/videos y hook `useAudio`.
- `utils/`             Helpers compartidos.
- `App.js`             Punto de entrada de la SPA.
- `index.css`          Estilos globales y Tailwind base.

Front-end modules (detalle breve)
- Student: fases (Phase1-7), temporizadores (`components/Timer`), overlays de tokens, videos intersticiales, Missy chatbot.
- Profesor: `ProfessorApp`, layout, group builder optimizado, waiting-room y game-active por PIN.
- Admin: `AdminApp` con rutas a stats, challenges y profile.

Frontend (detalle)
------------------
- Entrada: `frontend/src/App.js`.
- Módulos:
    - Estudiante: `frontend/src/modules/student/` (fases, timers, overlays de tokens, videos intersticiales, Missy chatbot).
    - Profesor: `frontend/src/modules/profesor/` (layout, waiting room, game active, builder de grupos optimizado).
    - Admin: `frontend/src/modules/admin/` (stats, profile, challenges).
- Activos: `public/assets/` (images, sounds, videos). Rutas centralizadas en `frontend/src/assets/index.js`.
- Estilos: Tailwind + clases utilitarias. Ajustes globales en `frontend/src/index.css`.
- Tests: `npm test` (Jest/RTL) desde `frontend/`.

Backend (detalle)
-----------------
- Proyecto Django en `backend/misionemprende/`.
- Settings/WSGI/ASGI: `backend/config/`.
- App API: `backend/misionemprende/api/` con:
    - `models.py` y `migrations/` para esquemas.
    - `serializers/`, `services/`, `repositories/` para lógica.
    - `views/` + `urls.py` (DRF viewsets y endpoints funcionales).
    - `endpoints.py` para gestión de estado de juego (iniciar, estado actual).
    - `storage_service.py` para URLs firmadas.
- Tests backend: `python manage.py test` desde `backend/misionemprende`.

API rápida (categorías)
-----------------------
- Auth: `login/`, `login/profesor/`, `login/admin/`, validación de códigos de acceso/equipo.
- Estudiantes/Usuarios/Cursos/Videos: viewsets registrados en el router DRF.
- Juego/Partidas: crear partida, asignar/obtener grupos, estado actual, iniciar juego.
- Admin: CRUD de temas/desafíos, datos auxiliares.
- Almacenamiento: `storage/signed-url/` y `signed-url/`.

Dependencias clave
------------------
Frontend:
- Node 18+ y npm.
- CRA toolchain, Tailwind, React Router, Jest.

Backend:
- Python 3.10+ recomendado.
- Django, Django REST Framework.
- Driver DB: `psycopg2` (Postgres) o `mysqlclient` (MySQL) según despliegue.
- Otros: `django-cors-headers`, ver `backend/misionemprende/requirements.txt`.

Variables de entorno (backend)
------------------------------
Ejemplo `.env` en `backend/misionemprende/`:
```
SECRET_KEY=pon_un_secret_key
DEBUG=True
ALLOWED_HOSTS=*

# Base de datos (Postgres ejemplo)
DB_NAME=misiondb
DB_USER=mision
DB_PASSWORD=TuPassword
DB_HOST=127.0.0.1
DB_PORT=5432

# Opcional: credenciales de almacenamiento externo
# STORAGE_KEY=...
```

Setup local sin Docker
----------------------
Backend:
```
cd backend/misionemprende
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Frontend:
```
cd frontend
npm install
npm start            # modo dev
npm run build        # genera frontend/build para producción
```

Despliegue con Postgres (sin Docker)
------------------------------------
```
sudo apt-get update -y
sudo apt-get install -y git python3 python3-venv python3-pip build-essential python3-dev \
        libpq-dev postgresql postgresql-contrib nodejs npm

# Configurar DB
sudo -u postgres psql -c "CREATE USER mision WITH PASSWORD 'TuPassword';"
sudo -u postgres psql -c "CREATE DATABASE misiondb OWNER mision;"

# Backend
cd backend/misionemprende
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000   # o gunicorn+nginx en prod

# Frontend
cd ../../frontend
npm install
npm run build
```

Despliegue con Docker/Compose (sugerido)
----------------------------------------
- Instalar Docker Engine y Docker Compose plugin.
- Servicios típicos: `backend` (gunicorn), `db` (Postgres), `frontend` (nginx sirviendo `build`).
- Variables en `.env` para DB y Django.
- Comandos: `docker compose up --build`.
- *(Pide un `docker-compose.yml` si quieres uno listo para este repo).* 

Nginx + Gunicorn (esquema mínimo)
---------------------------------
- Gunicorn: `gunicorn config.wsgi:application --bind 0.0.0.0:8000` (desde `backend/misionemprende`).
- Nginx: proxy `/api/` → `http://localhost:8000`, y servir `/` con archivos de `frontend/build`.

Tests
-----
- Frontend: `cd frontend && npm test`.
- Backend: `cd backend/misionemprende && python manage.py test`.

Builds y estáticos
------------------
- Frontend: `npm run build` genera `frontend/build` (no versionado).
- Backend: `python manage.py collectstatic --noinput` si sirves estáticos con Django.

Buenas prácticas
----------------
- No versionar `.env`, `db.sqlite3`, `venv/`, `node_modules/`, `frontend/build/` (ya en `.gitignore`).
- En producción: `DEBUG=False`, `ALLOWED_HOSTS` con tu dominio/IP, DB gestionada (RDS/cont.) preferible.
- Revisa CORS según orígenes del frontend; hay `cors-config.json` de referencia.

Soporte rápido
--------------
- Si el servidor no levanta: revisa variables de entorno y conexión a DB.
- Si faltan assets: `npm run build` y `collectstatic`.
- Si hay problemas CORS: ajusta settings y cabeceras permitidas.