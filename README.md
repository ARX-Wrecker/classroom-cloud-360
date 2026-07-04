# Classroom Cloud 360

Plataforma LMS (Learning Management System) empresarial construida con Laravel 11 (backend) y Next.js 14 (frontend), con soporte para gestión de cursos, estudiantes, instructores, evaluaciones y reportes avanzados.

---

## Requisitos

### Con Docker (recomendado)
- Docker 24.x o superior
- Docker Compose v2.x o superior
- 4 GB RAM disponible mínimo

### Sin Docker (desarrollo directo)
- PHP 8.4 con extensiones: pdo_pgsql, gd, zip, bcmath, redis, opcache, pcntl
- Composer 2.x
- Node.js 20 LTS
- npm 10.x
- PostgreSQL 15+ (local)
- Redis 7+ (local)

---

## Instalacion rapida con Docker

### 1. Clonar el repositorio

```bash
git clone <repo-url> "Classroom Cloud 360"
cd "Classroom Cloud 360"
```

### 2. Ejecutar el script de inicio

```bash
chmod +x start.sh
./start.sh
```

El script:
- Verifica que Docker este instalado
- Crea el archivo `backend/.env` desde `.env.example` si no existe
- Levanta todos los servicios con `docker-compose up -d`
- Muestra las URLs y credenciales de acceso

### 3. Acceder a la aplicacion

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- Nginx (proxy unificado): http://localhost:80
- MinIO Console: http://localhost:9001

---

## Instalacion sin Docker (desarrollo local)

Requiere tener PostgreSQL y Redis corriendo localmente.

### 1. Configurar el backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

Editar `backend/.env` con los datos de conexion a PostgreSQL y Redis locales, luego:

```bash
php artisan migrate --seed
php artisan serve --port=8000
```

### 2. Configurar el frontend

```bash
cd frontend
cp .env.example .env.local
# Editar .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm install
npm run dev
```

### O usar el script automatico

```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## Credenciales por defecto

| Servicio         | Usuario                            | Password                  |
|------------------|------------------------------------|---------------------------|
| App (Admin)      | admin@classroomcloud360.com        | Admin123!                 |
| PostgreSQL       | cc360_user                         | cc360_secure_password_2024 |
| Redis            | (sin usuario)                      | cc360_redis_password      |
| MinIO Console    | cc360_minio_user                   | cc360_minio_password_2024 |

---

## URLs de servicios

| Servicio          | URL                        | Puerto |
|-------------------|----------------------------|--------|
| Frontend (Next.js)| http://localhost:3000      | 3000   |
| Backend (Laravel) | http://localhost:8000      | 8000   |
| Nginx Proxy       | http://localhost:80        | 80     |
| MinIO API         | http://localhost:9000      | 9000   |
| MinIO Console     | http://localhost:9001      | 9001   |
| PostgreSQL        | localhost:5432             | 5432   |
| Redis             | localhost:6379             | 6379   |

---

## Estructura del proyecto

```
Classroom Cloud 360/
├── docker-compose.yml          # Orquestacion de servicios
├── start.sh                    # Script de inicio rapido (Docker)
├── start-dev.sh                # Script de inicio sin Docker
├── README.md
│
├── backend/                    # API Laravel 11
│   ├── Dockerfile
│   ├── docker/
│   │   ├── entrypoint.sh       # Script de arranque del contenedor
│   │   ├── supervisord.conf    # Supervisor: php-fpm + nginx + queue
│   │   ├── php-fpm.conf        # Configuracion PHP-FPM
│   │   └── nginx.conf          # Nginx interno del contenedor backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── .env.example
│
├── frontend/                   # UI Next.js 14
│   ├── Dockerfile
│   ├── app/                    # App Router
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── infrastructure/
│   ├── nginx/
│   │   ├── nginx.conf          # Configuracion principal Nginx
│   │   └── default.conf        # Virtual host: proxy a frontend y backend
│   └── postgres/
│       └── init.sql            # Extensiones y setup inicial de DB
│
└── storage/
    └── app/                    # Archivos subidos (compartido con backend)
```

---

## Comandos utiles

### Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio especifico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volumes (CUIDADO: borra la base de datos)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend

# Reconstruir imagenes
docker-compose build --no-cache

# Entrar al contenedor backend
docker exec -it cc360_backend sh

# Ejecutar artisan
docker exec -it cc360_backend php artisan migrate
docker exec -it cc360_backend php artisan db:seed
docker exec -it cc360_backend php artisan tinker
```

### Backend Laravel

```bash
# Correr migraciones
php artisan migrate

# Revertir y re-ejecutar migraciones con seeders
php artisan migrate:fresh --seed

# Crear un nuevo modelo con migracion
php artisan make:model NombreModelo -m

# Crear un controlador de API
php artisan make:controller Api/NombreController --api

# Limpiar caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Procesar queue manualmente
php artisan queue:work
```

### Frontend Next.js

```bash
# Modo desarrollo
npm run dev

# Build de produccion
npm run build

# Iniciar servidor de produccion
npm start

# Linting
npm run lint
```

---

## Variables de entorno importantes

### Backend (`backend/.env`)

```env
APP_NAME="Classroom Cloud 360"
APP_ENV=local
APP_KEY=                        # Generado con php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1               # 'postgres' en Docker
DB_PORT=5432
DB_DATABASE=classroom_cloud_360
DB_USERNAME=cc360_user
DB_PASSWORD=cc360_secure_password_2024

REDIS_HOST=127.0.0.1            # 'redis' en Docker
REDIS_PASSWORD=cc360_redis_password
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=cc360_minio_user
AWS_SECRET_ACCESS_KEY=cc360_minio_password_2024
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=classroom-cloud-360
AWS_ENDPOINT=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Classroom Cloud 360
```

---

## Arquitectura

```
[Usuario] --> [Nginx :80] --> [Frontend Next.js :3000]
                          --> [Backend Laravel :8000] --> [PostgreSQL :5432]
                                                      --> [Redis :6379]
                                                      --> [MinIO :9000]
```

El Nginx actua como reverse proxy unificado:
- Las rutas `/api/*` y `/storage/*` se delegan al backend Laravel
- Todo lo demas se sirve desde el frontend Next.js
- El backend internamente usa su propio Nginx + PHP-FPM gestionados por Supervisor

---

## Soporte y contacto

Proyecto desarrollado en la Fabrica de Software Empresarial.
Para reportar problemas o solicitar funcionalidades, crear un issue en el repositorio del proyecto.
