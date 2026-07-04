# Classroom Cloud 360 — Backend

LMS SaaS multi-tenant construido en Laravel 12 / PHP 8.4.

## Requisitos

- PHP 8.4+
- Composer 2.x
- PostgreSQL 15+ (o MySQL 8+)
- Redis 7+

## Instalación Rápida

```bash
# 1. Instalar dependencias
composer install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Generar clave de aplicación
php artisan key:generate

# 4. Configurar .env con tus credenciales de base de datos

# 5. Ejecutar migraciones y seeders
php artisan migrate --seed

# 6. Levantar servidor de desarrollo
php artisan serve
# → http://localhost:8000
```

## Credenciales del Seeder

| Rol          | Email                                      | Contraseña      |
|--------------|--------------------------------------------|-----------------|
| SuperAdmin   | admin@classroomcloud360.com                | Admin123!       |
| Instructor 1 | maria.gonzalez@classroomcloud360.com       | Instructor123!  |
| Instructor 2 | carlos.mendoza@classroomcloud360.com       | Instructor123!  |
| Estudiante   | ana.lopez@example.com                      | Student123!     |

## Endpoints Principales

### Auth
- `POST /api/v1/auth/register` — Registro
- `POST /api/v1/auth/login` — Login → retorna Bearer token
- `POST /api/v1/auth/logout` — Logout (requiere auth)
- `GET  /api/v1/auth/me` — Perfil del usuario autenticado

### Cursos
- `GET  /api/v1/courses` — Listar cursos (filtros: search, category, level)
- `GET  /api/v1/courses/{id}` — Ver curso con módulos y lecciones
- `POST /api/v1/courses` — Crear curso (instructor/admin)
- `POST /api/v1/courses/{id}/enroll` — Inscribirse
- `POST /api/v1/courses/{id}/publish` — Publicar/despublicar

### Módulos y Lecciones
- `GET  /api/v1/courses/{courseId}/modules` — Módulos del curso
- `POST /api/v1/courses/{courseId}/modules` — Crear módulo
- `GET  /api/v1/modules/{moduleId}/lessons` — Lecciones del módulo
- `POST /api/v1/lessons/{id}/complete` — Marcar lección completada

### Dashboard & Analytics
- `GET /api/v1/dashboard` — Dashboard adaptado por rol
- `GET /api/v1/analytics/my-progress` — Progreso del estudiante
- `GET /api/v1/analytics/overview` — Resumen admin (admin/superadmin)

### Certificados
- `GET  /api/v1/certificates` — Mis certificados
- `POST /api/v1/certificates/generate/{enrollmentId}` — Generar certificado
- `GET  /api/v1/certificates/verify/{code}` — Verificar (público)

## Estructura del Proyecto

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/   ← 12 controllers
│   │   ├── Middleware/           ← Role + Tenant
│   │   └── Resources/            ← API Resources
│   └── Models/                   ← 15 modelos Eloquent
├── database/
│   ├── migrations/               ← 16 migraciones
│   └── seeders/                  ← DatabaseSeeder completo
├── routes/
│   └── api.php                   ← Todas las rutas v1
├── config/
│   └── cors.php                  ← CORS configurado
└── bootstrap/
    └── app.php                   ← Middleware + Exception handlers
```

## Multi-Tenancy

Enviar header `X-Tenant-Slug: demo-academy` en cada request,
o usar subdominio: `demo-academy.classroomcloud360.local`

## Autenticación

Todos los endpoints protegidos requieren:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```
