<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\ForumPost;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Seeding Class Cloud 360...');

        // ── 1. Tenant ─────────────────────────────────────────────────────
        $tenant = Tenant::create([
            'name'       => 'Class Cloud 360',
            'slug'       => 'classcloud360',
            'domain'     => 'classcloud360.cl',
            'plan'       => 'pro',
            'is_active'  => true,
            'max_students' => 500,
            'max_courses'  => 50,
            'settings'   => [
                'primary_color'   => '#6366F1',
                'secondary_color' => '#8B5CF6',
                'logo_text'       => 'Class Cloud 360',
                'allow_free_courses' => true,
                'certificate_signature' => 'Class Cloud 360 — Director Académico',
            ],
        ]);

        $this->command->info("  ✓ Tenant '{$tenant->name}' creado.");

        // ── 2. SuperAdmin ─────────────────────────────────────────────────
        $superadmin = User::create([
            'tenant_id' => $tenant->id,
            'name'      => 'Super Administrador',
            'email'     => 'admin@classcloud360.cl',
            'password'  => Hash::make('Admin123!'),
            'role'      => User::ROLE_SUPERADMIN,
            'is_active' => true,
            'bio'       => 'Administrador principal de la plataforma Class Cloud 360.',
            'phone'     => '+56912345678',
            'timezone'  => 'America/Santiago',
            'language'  => 'es',
            'country'   => 'CL',
        ]);

        $this->command->info("  ✓ SuperAdmin '{$superadmin->email}' creado.");

        // ── 3. Instructors ────────────────────────────────────────────────
        $instructor1 = User::create([
            'tenant_id' => $tenant->id,
            'name'      => 'María González',
            'email'     => 'maria.gonzalez@classcloud360.cl',
            'password'  => Hash::make('Instructor123!'),
            'role'      => User::ROLE_INSTRUCTOR,
            'is_active' => true,
            'bio'       => 'Ingeniera en Informática con 10 años de experiencia en desarrollo web. Especialista en React, Node.js y arquitecturas cloud.',
            'phone'     => '+56987654321',
            'timezone'  => 'America/Santiago',
            'language'  => 'es',
            'country'   => 'CL',
        ]);

        $instructor2 = User::create([
            'tenant_id' => $tenant->id,
            'name'      => 'Carlos Mendoza',
            'email'     => 'carlos.mendoza@classcloud360.cl',
            'password'  => Hash::make('Instructor123!'),
            'role'      => User::ROLE_INSTRUCTOR,
            'is_active' => true,
            'bio'       => 'MBA y consultor de negocios con más de 15 años de experiencia en empresas Fortune 500. Experto en estrategia empresarial y marketing digital.',
            'phone'     => '+56976543210',
            'timezone'  => 'America/Santiago',
            'language'  => 'es',
            'country'   => 'CL',
        ]);

        $this->command->info("  ✓ 2 instructores creados.");

        // ── 4. Students ───────────────────────────────────────────────────
        $studentNames = [
            ['Ana López',      'ana.lopez@example.com'],
            ['Pedro Ramírez',  'pedro.ramirez@example.com'],
            ['Sofía Torres',   'sofia.torres@example.com'],
            ['Diego Herrera',  'diego.herrera@example.com'],
            ['Valentina Ruiz', 'valentina.ruiz@example.com'],
            ['Matías Silva',   'matias.silva@example.com'],
            ['Camila Vargas',  'camila.vargas@example.com'],
            ['Lucas Moreno',   'lucas.moreno@example.com'],
            ['Isabella Jiménez','isabella.jimenez@example.com'],
            ['Sebastián Castro','sebastian.castro@example.com'],
        ];

        $students = [];
        foreach ($studentNames as [$name, $email]) {
            $students[] = User::create([
                'tenant_id' => $tenant->id,
                'name'      => $name,
                'email'     => $email,
                'password'  => Hash::make('Student123!'),
                'role'      => User::ROLE_STUDENT,
                'is_active' => true,
                'timezone'  => 'America/Santiago',
                'language'  => 'es',
                'country'   => 'CL',
            ]);
        }

        $this->command->info("  ✓ 10 estudiantes creados.");

        // ── 5. Categories ─────────────────────────────────────────────────
        $catTech = Category::create([
            'tenant_id'   => $tenant->id,
            'name'        => 'Tecnología',
            'slug'        => 'tecnologia',
            'description' => 'Cursos de programación, desarrollo web, mobile, cloud computing e inteligencia artificial.',
            'icon'        => 'laptop-code',
            'color'       => '#6366F1',
            'is_active'   => true,
            'order'       => 1,
        ]);

        $catBusiness = Category::create([
            'tenant_id'   => $tenant->id,
            'name'        => 'Negocios',
            'slug'        => 'negocios',
            'description' => 'Cursos de administración, marketing, emprendimiento, finanzas y liderazgo empresarial.',
            'icon'        => 'briefcase',
            'color'       => '#10B981',
            'is_active'   => true,
            'order'       => 2,
        ]);

        $catDesign = Category::create([
            'tenant_id'   => $tenant->id,
            'name'        => 'Diseño',
            'slug'        => 'diseno',
            'description' => 'Cursos de diseño gráfico, UX/UI, diseño web, ilustración y fotografía.',
            'icon'        => 'palette',
            'color'       => '#F59E0B',
            'is_active'   => true,
            'order'       => 3,
        ]);

        $this->command->info("  ✓ 3 categorías creadas.");

        // ── 6. Course 1: Desarrollo Web con Laravel ───────────────────────
        $course1 = Course::create([
            'tenant_id'         => $tenant->id,
            'instructor_id'     => $instructor1->id,
            'category_id'       => $catTech->id,
            'title'             => 'Desarrollo Web Completo con Laravel 11',
            'slug'              => 'desarrollo-web-laravel-11',
            'description'       => 'Aprende a construir aplicaciones web profesionales con Laravel 11, el framework PHP más popular del mundo. Desde fundamentos hasta APIs avanzadas y deployment en producción.',
            'short_description' => 'Domina Laravel 11 y construye apps web robustas desde cero hasta producción.',
            'price'             => 49990,
            'is_free'           => false,
            'is_published'      => true,
            'published_at'      => now()->subDays(30),
            'level'             => 'intermediate',
            'language'          => 'es',
            'duration_hours'    => 28.5,
            'certificate_enabled' => true,
            'requirements'      => [
                'Conocimientos básicos de PHP',
                'HTML y CSS básico',
                'Bases de datos relacionales',
                'Ganas de aprender',
            ],
            'what_you_learn'    => [
                'Instalar y configurar Laravel 11',
                'Crear APIs RESTful profesionales',
                'Autenticación con Laravel Sanctum',
                'Eloquent ORM avanzado',
                'Queues y Jobs en background',
                'Testing con PHPUnit',
                'Deploy en VPS y cloud',
            ],
            'tags'              => ['laravel', 'php', 'api', 'backend', 'web'],
            'rating'            => 4.8,
            'rating_count'      => 127,
            'enrolled_count'    => 0,
        ]);

        // Módulos del curso 1
        $module1_1 = Module::create([
            'course_id'      => $course1->id,
            'title'          => 'Fundamentos de Laravel',
            'description'    => 'Instalación, configuración y primeros pasos con el framework.',
            'order'          => 1,
            'is_published'   => true,
            'duration_hours' => 4.0,
        ]);

        Lesson::create(['module_id' => $module1_1->id, 'title' => 'Introducción a Laravel y MVC', 'type' => 'video', 'video_url' => 'https://example.com/videos/laravel-intro', 'duration_seconds' => 1800, 'order' => 1, 'is_preview' => true, 'content' => 'En esta lección aprenderemos qué es Laravel, sus ventajas y el patrón MVC que utiliza.']);
        Lesson::create(['module_id' => $module1_1->id, 'title' => 'Instalación y configuración del entorno', 'type' => 'video', 'video_url' => 'https://example.com/videos/laravel-install', 'duration_seconds' => 2400, 'order' => 2, 'content' => 'Instalamos PHP 8.4, Composer y configuramos nuestro entorno de desarrollo local con Herd o Laravel Sail.']);
        Lesson::create(['module_id' => $module1_1->id, 'title' => 'Estructura de directorios explicada', 'type' => 'text', 'duration_seconds' => 600, 'order' => 3, 'content' => "# Estructura de Laravel\n\n## Directorios principales:\n- **app/** - Código de la aplicación\n- **config/** - Archivos de configuración\n- **database/** - Migraciones y seeders\n- **routes/** - Definición de rutas\n- **resources/** - Vistas y assets\n\nCada directorio tiene una responsabilidad específica..."]);
        Lesson::create(['module_id' => $module1_1->id, 'title' => 'Rutas y Controllers básicos', 'type' => 'video', 'video_url' => 'https://example.com/videos/routes-controllers', 'duration_seconds' => 3000, 'order' => 4, 'content' => 'Aprende a definir rutas RESTful y crear controllers para manejar las peticiones HTTP.']);

        $module1_2 = Module::create([
            'course_id'      => $course1->id,
            'title'          => 'Eloquent ORM y Base de Datos',
            'description'    => 'Modelos, relaciones, consultas y migraciones con Eloquent.',
            'order'          => 2,
            'is_published'   => true,
            'duration_hours' => 6.5,
        ]);

        Lesson::create(['module_id' => $module1_2->id, 'title' => 'Migraciones y Schema Builder', 'type' => 'video', 'video_url' => 'https://example.com/videos/migrations', 'duration_seconds' => 2700, 'order' => 1, 'content' => 'Crea y maneja migraciones para controlar el esquema de tu base de datos.']);
        Lesson::create(['module_id' => $module1_2->id, 'title' => 'Modelos Eloquent y CRUD', 'type' => 'video', 'video_url' => 'https://example.com/videos/eloquent-crud', 'duration_seconds' => 3600, 'order' => 2, 'content' => 'Aprende a realizar operaciones CRUD con Eloquent ORM de forma elegante y eficiente.']);
        Lesson::create(['module_id' => $module1_2->id, 'title' => 'Relaciones: HasMany, BelongsTo, ManyToMany', 'type' => 'video', 'video_url' => 'https://example.com/videos/relations', 'duration_seconds' => 4200, 'order' => 3, 'content' => 'Domina las relaciones entre modelos para construir estructuras de datos complejas.']);
        Lesson::create(['module_id' => $module1_2->id, 'title' => 'Seeders y Factories', 'type' => 'video', 'video_url' => 'https://example.com/videos/seeders', 'duration_seconds' => 1800, 'order' => 4, 'content' => 'Genera datos de prueba de forma automática con Factories y pobla la base de datos con Seeders.']);

        $module1_3 = Module::create([
            'course_id'      => $course1->id,
            'title'          => 'APIs RESTful con Sanctum',
            'description'    => 'Construye APIs modernas con autenticación por tokens.',
            'order'          => 3,
            'is_published'   => true,
            'duration_hours' => 8.0,
        ]);

        Lesson::create(['module_id' => $module1_3->id, 'title' => 'Diseño de APIs RESTful', 'type' => 'text', 'duration_seconds' => 900, 'order' => 1, 'content' => "# Principios REST\n\nUna API REST debe seguir estos principios:\n1. **Stateless** - Sin estado entre peticiones\n2. **Uniform Interface** - URLs consistentes\n3. **Resource-based** - Todo es un recurso\n4. **HTTP Methods** - GET, POST, PUT, DELETE\n\n## Convenciones de URLs:\n- GET /api/courses - Listar\n- POST /api/courses - Crear\n- GET /api/courses/{id} - Ver uno\n- PUT /api/courses/{id} - Actualizar\n- DELETE /api/courses/{id} - Eliminar"]);
        Lesson::create(['module_id' => $module1_3->id, 'title' => 'Autenticación con Laravel Sanctum', 'type' => 'video', 'video_url' => 'https://example.com/videos/sanctum', 'duration_seconds' => 3600, 'order' => 2, 'content' => 'Implementa autenticación segura por tokens con Laravel Sanctum para tus APIs.']);
        Lesson::create(['module_id' => $module1_3->id, 'title' => 'API Resources y transformaciones', 'type' => 'video', 'video_url' => 'https://example.com/videos/api-resources', 'duration_seconds' => 2400, 'order' => 3, 'content' => 'Usa API Resources para transformar y formatear las respuestas JSON de tu API.']);

        $course1->update(['total_lessons' => $course1->lessons()->count()]);
        $this->command->info("  ✓ Curso 1 creado: '{$course1->title}'");

        // ── 7. Course 2: Marketing Digital ───────────────────────────────
        $course2 = Course::create([
            'tenant_id'         => $tenant->id,
            'instructor_id'     => $instructor2->id,
            'category_id'       => $catBusiness->id,
            'title'             => 'Marketing Digital para Emprendedores 2024',
            'slug'              => 'marketing-digital-emprendedores-2024',
            'description'       => 'Aprende las estrategias de marketing digital más efectivas para hacer crecer tu negocio en línea. Redes sociales, SEO, email marketing, publicidad pagada y más.',
            'short_description' => 'Estrategias probadas de marketing digital para hacer crecer tu negocio.',
            'price'             => 0,
            'is_free'           => true,
            'is_published'      => true,
            'published_at'      => now()->subDays(15),
            'level'             => 'beginner',
            'language'          => 'es',
            'duration_hours'    => 12.0,
            'certificate_enabled' => true,
            'requirements'      => [
                'Tener un negocio o idea de negocio',
                'Acceso a internet',
                'Cuenta en redes sociales',
            ],
            'what_you_learn'    => [
                'Crear una estrategia de marketing digital',
                'Gestionar redes sociales profesionalmente',
                'Optimizar SEO de tu sitio web',
                'Crear campañas de email marketing',
                'Publicidad en Meta Ads y Google Ads',
                'Analizar métricas y KPIs',
            ],
            'tags'              => ['marketing', 'digital', 'seo', 'redes-sociales', 'emprendimiento'],
            'rating'            => 4.6,
            'rating_count'      => 89,
            'enrolled_count'    => 0,
        ]);

        $module2_1 = Module::create([
            'course_id'      => $course2->id,
            'title'          => 'Fundamentos del Marketing Digital',
            'description'    => 'Conceptos base y ecosistema digital.',
            'order'          => 1,
            'is_published'   => true,
            'duration_hours' => 3.0,
        ]);

        Lesson::create(['module_id' => $module2_1->id, 'title' => '¿Qué es el Marketing Digital?', 'type' => 'video', 'video_url' => 'https://example.com/videos/mkt-intro', 'duration_seconds' => 1500, 'order' => 1, 'is_preview' => true, 'content' => 'Introducción al mundo del marketing digital y cómo ha revolucionado la forma de hacer negocios.']);
        Lesson::create(['module_id' => $module2_1->id, 'title' => 'El embudo de ventas digital', 'type' => 'video', 'video_url' => 'https://example.com/videos/funnel', 'duration_seconds' => 2100, 'order' => 2, 'content' => 'Aprende el concepto de funnel o embudo de ventas y cómo aplicarlo en tu estrategia digital.']);
        Lesson::create(['module_id' => $module2_1->id, 'title' => 'Definiendo tu buyer persona', 'type' => 'text', 'duration_seconds' => 900, 'order' => 3, 'content' => "# Tu Cliente Ideal\n\nEl buyer persona es la representación semi-ficticia de tu cliente ideal.\n\n## Cómo crear tu buyer persona:\n1. **Demografía** - Edad, género, ubicación\n2. **Psicografía** - Valores, intereses, miedos\n3. **Comportamiento** - Cómo compra, qué canales usa\n4. **Objetivos** - Qué quiere lograr\n5. **Pain Points** - Qué problemas tiene\n\nMientras más específico seas, más efectivo será tu marketing."]);

        $module2_2 = Module::create([
            'course_id'      => $course2->id,
            'title'          => 'Redes Sociales y Contenido',
            'description'    => 'Estrategias para Instagram, LinkedIn, TikTok y más.',
            'order'          => 2,
            'is_published'   => true,
            'duration_hours' => 5.0,
        ]);

        Lesson::create(['module_id' => $module2_2->id, 'title' => 'Instagram para negocios', 'type' => 'video', 'video_url' => 'https://example.com/videos/instagram-biz', 'duration_seconds' => 3000, 'order' => 1, 'content' => 'Aprende a crear un perfil profesional, estrategia de contenido y cómo crecer orgánicamente en Instagram.']);
        Lesson::create(['module_id' => $module2_2->id, 'title' => 'LinkedIn: la red B2B', 'type' => 'video', 'video_url' => 'https://example.com/videos/linkedin', 'duration_seconds' => 2400, 'order' => 2, 'content' => 'Maximiza tu presencia en LinkedIn para conectar con profesionales y generar oportunidades de negocio.']);
        Lesson::create(['module_id' => $module2_2->id, 'title' => 'Content Calendar: planifica tu contenido', 'type' => 'text', 'duration_seconds' => 600, 'order' => 3, 'content' => "# Calendario de Contenido\n\nUn calendario de contenido te ayuda a:\n- Mantener consistencia en las publicaciones\n- Planificar campañas con anticipación\n- Diversificar tipos de contenido\n- Alinear el contenido con objetivos de negocio\n\n## Formato sugerido:\n| Fecha | Red | Tipo | Tema | Status |\n|-------|-----|------|------|--------|\n| Lunes | IG  | Post | Tips | Borrador |"]);

        $course2->update(['total_lessons' => $course2->lessons()->count()]);
        $this->command->info("  ✓ Curso 2 creado: '{$course2->title}'");

        // ── 8. Course 3: Diseño UI/UX ─────────────────────────────────────
        $course3 = Course::create([
            'tenant_id'         => $tenant->id,
            'instructor_id'     => $instructor1->id,
            'category_id'       => $catDesign->id,
            'title'             => 'Diseño UX/UI con Figma — De 0 a Profesional',
            'slug'              => 'diseno-ux-ui-figma-profesional',
            'description'       => 'Aprende los fundamentos del diseño UX/UI y domina Figma para crear interfaces digitales hermosas y funcionales. Incluye proyectos reales y portfolio.',
            'short_description' => 'Domina Figma y el diseño UX/UI para crear productos digitales que enamoran.',
            'price'             => 39990,
            'is_free'           => false,
            'is_published'      => true,
            'published_at'      => now()->subDays(7),
            'level'             => 'beginner',
            'language'          => 'es',
            'duration_hours'    => 20.0,
            'certificate_enabled' => true,
            'requirements'      => [
                'No se requiere experiencia previa en diseño',
                'Computador con acceso a internet',
                'Cuenta gratuita en Figma',
            ],
            'what_you_learn'    => [
                'Principios fundamentales de UX',
                'Principios de diseño visual UI',
                'Dominar Figma desde cero',
                'Crear wireframes y prototipos',
                'Design Systems y componentes',
                'Presentar tu diseño a clientes',
            ],
            'tags'              => ['ux', 'ui', 'figma', 'diseño', 'prototipo'],
            'rating'            => 4.9,
            'rating_count'      => 43,
            'enrolled_count'    => 0,
        ]);

        $module3_1 = Module::create([
            'course_id'      => $course3->id,
            'title'          => 'Fundamentos de UX Design',
            'description'    => 'Investigación, empatía y proceso de diseño centrado en el usuario.',
            'order'          => 1,
            'is_published'   => true,
            'duration_hours' => 4.0,
        ]);

        Lesson::create(['module_id' => $module3_1->id, 'title' => 'Introducción al UX Design', 'type' => 'video', 'video_url' => 'https://example.com/videos/ux-intro', 'duration_seconds' => 1800, 'order' => 1, 'is_preview' => true, 'content' => 'Qué es UX, por qué importa y cómo el buen diseño impacta en los negocios.']);
        Lesson::create(['module_id' => $module3_1->id, 'title' => 'Research: entendiendo al usuario', 'type' => 'video', 'video_url' => 'https://example.com/videos/ux-research', 'duration_seconds' => 2700, 'order' => 2, 'content' => 'Técnicas de investigación de usuarios: entrevistas, encuestas, user testing y análisis de datos.']);
        Lesson::create(['module_id' => $module3_1->id, 'title' => 'Arquitectura de información y user flows', 'type' => 'video', 'video_url' => 'https://example.com/videos/ia-flows', 'duration_seconds' => 2400, 'order' => 3, 'content' => 'Cómo organizar la información y diseñar los flujos de usuario para una experiencia intuitiva.']);

        $module3_2 = Module::create([
            'course_id'      => $course3->id,
            'title'          => 'Figma — Domina la herramienta',
            'description'    => 'Todo sobre Figma: componentes, auto-layout, variables y prototipado.',
            'order'          => 2,
            'is_published'   => true,
            'duration_hours' => 8.0,
        ]);

        Lesson::create(['module_id' => $module3_2->id, 'title' => 'Figma desde cero: interfaz y herramientas', 'type' => 'video', 'video_url' => 'https://example.com/videos/figma-basics', 'duration_seconds' => 3600, 'order' => 1, 'content' => 'Tour completo por la interfaz de Figma: frames, layers, herramientas de dibujo y shortcuts.']);
        Lesson::create(['module_id' => $module3_2->id, 'title' => 'Componentes y Design System', 'type' => 'video', 'video_url' => 'https://example.com/videos/figma-components', 'duration_seconds' => 4200, 'order' => 2, 'content' => 'Crea y gestiona componentes reutilizables para construir un Design System escalable.']);
        Lesson::create(['module_id' => $module3_2->id, 'title' => 'Auto Layout avanzado', 'type' => 'video', 'video_url' => 'https://example.com/videos/auto-layout', 'duration_seconds' => 3000, 'order' => 3, 'content' => 'Domina Auto Layout para crear diseños responsive y flexibles que se adaptan al contenido.']);
        Lesson::create(['module_id' => $module3_2->id, 'title' => 'Prototipado e interacciones', 'type' => 'video', 'video_url' => 'https://example.com/videos/prototyping', 'duration_seconds' => 2700, 'order' => 4, 'content' => 'Crea prototipos interactivos con animaciones y transiciones para presentar tus diseños.']);

        $course3->update(['total_lessons' => $course3->lessons()->count()]);
        $this->command->info("  ✓ Curso 3 creado: '{$course3->title}'");

        // ── 9. Quiz para curso 1 ──────────────────────────────────────────
        $quiz1 = Quiz::create([
            'course_id'    => $course1->id,
            'module_id'    => $module1_1->id,
            'title'        => 'Evaluación: Fundamentos de Laravel',
            'description'  => 'Evalúa tus conocimientos sobre los fundamentos del framework Laravel.',
            'time_limit'   => 20,
            'passing_score' => 70,
            'max_attempts'  => 3,
            'randomize_questions' => false,
            'show_answers'        => true,
            'is_published'        => true,
        ]);

        Question::create(['quiz_id' => $quiz1->id, 'type' => 'multiple_choice', 'question' => '¿Qué comando de Artisan crea un nuevo Controller?', 'options' => ['php artisan make:model Controller', 'php artisan make:controller NombreController', 'php artisan create:controller NombreController', 'php artisan new controller'], 'correct_answer' => ['php artisan make:controller NombreController'], 'explanation' => 'El comando correcto es php artisan make:controller NombreController, opcionalmente con --resource para generar todos los métodos CRUD.', 'points' => 1, 'order' => 1]);
        Question::create(['quiz_id' => $quiz1->id, 'type' => 'true_false', 'question' => '¿Laravel utiliza el patrón de diseño MVC (Model-View-Controller)?', 'options' => ['Verdadero', 'Falso'], 'correct_answer' => ['Verdadero'], 'explanation' => 'Laravel sigue el patrón MVC donde Models manejan la lógica de datos, Views la presentación y Controllers la lógica de negocio.', 'points' => 1, 'order' => 2]);
        Question::create(['quiz_id' => $quiz1->id, 'type' => 'multiple_choice', 'question' => '¿En qué directorio se definen las rutas de la API en Laravel?', 'options' => ['app/routes/', 'routes/api.php', 'config/routes.php', 'resources/routes/'], 'correct_answer' => ['routes/api.php'], 'explanation' => 'Las rutas de la API se definen en routes/api.php y automáticamente tienen el prefijo /api.', 'points' => 1, 'order' => 3]);
        Question::create(['quiz_id' => $quiz1->id, 'type' => 'open', 'question' => '¿Cuál es la principal ventaja de usar migraciones en lugar de crear tablas manualmente en la base de datos?', 'options' => null, 'correct_answer' => ['Control de versiones del esquema'], 'explanation' => 'Las migraciones permiten versionar el esquema de la base de datos, revertir cambios y sincronizar entre entornos de desarrollo.', 'points' => 2, 'order' => 4]);

        $this->command->info("  ✓ Quiz creado para Curso 1.");

        // ── 10. Enrollments ───────────────────────────────────────────────
        $enrollmentData = [
            // Students enrolled in course 1 (Laravel)
            [$students[0]->id, $course1->id, 75.0, 'active'],
            [$students[1]->id, $course1->id, 100.0, 'completed'],
            [$students[2]->id, $course1->id, 30.0, 'active'],
            [$students[3]->id, $course1->id, 50.0, 'active'],
            // Students enrolled in course 2 (Marketing)
            [$students[0]->id, $course2->id, 100.0, 'completed'],
            [$students[4]->id, $course2->id, 60.0, 'active'],
            [$students[5]->id, $course2->id, 80.0, 'active'],
            [$students[6]->id, $course2->id, 40.0, 'active'],
            [$students[7]->id, $course2->id, 100.0, 'completed'],
            // Students enrolled in course 3 (UX/UI)
            [$students[2]->id, $course3->id, 20.0, 'active'],
            [$students[8]->id, $course3->id, 55.0, 'active'],
            [$students[9]->id, $course3->id, 90.0, 'active'],
        ];

        foreach ($enrollmentData as [$userId, $courseId, $progress, $status]) {
            $enrollment = Enrollment::create([
                'user_id'          => $userId,
                'course_id'        => $courseId,
                'progress'         => $progress,
                'status'           => $status,
                'started_at'       => now()->subDays(rand(5, 25)),
                'completed_at'     => $status === 'completed' ? now()->subDays(rand(1, 5)) : null,
                'last_accessed_at' => now()->subHours(rand(1, 48)),
                'amount_paid'      => $courseId === $course2->id ? 0 : ($courseId === $course1->id ? 49990 : 39990),
            ]);

            // Update enrolled count
            Course::find($courseId)->increment('enrolled_count');

            // Generate certificate for completed enrollments
            if ($status === 'completed') {
                Certificate::create([
                    'user_id'       => $userId,
                    'course_id'     => $courseId,
                    'enrollment_id' => $enrollment->id,
                    'issued_at'     => now()->subDays(rand(1, 3)),
                    'final_score'   => rand(75, 98),
                    'metadata'      => [
                        'student_name'  => User::find($userId)->name,
                        'course_title'  => Course::find($courseId)->title,
                        'completed_at'  => now()->subDays(rand(1, 5))->toDateString(),
                    ],
                ]);
            }
        }

        $this->command->info("  ✓ " . count($enrollmentData) . " inscripciones creadas.");

        // ── 11. Forum Posts ───────────────────────────────────────────────
        $post1 = ForumPost::create([
            'user_id'   => $students[0]->id,
            'course_id' => $course1->id,
            'module_id' => $module1_1->id,
            'title'     => '¿Cuál es la diferencia entre Route::get y Route::resource?',
            'body'      => 'Hola a todos! Estoy confundido sobre cuándo usar Route::get() y cuándo usar Route::resource(). ¿Pueden explicarme las diferencias? Gracias!',
            'type'      => 'question',
            'replies_count' => 2,
        ]);

        ForumPost::create([
            'user_id'   => $instructor1->id,
            'course_id' => $course1->id,
            'parent_id' => $post1->id,
            'body'      => '¡Excelente pregunta! Route::get() define una sola ruta para el método GET. Route::resource() en cambio genera automáticamente 7 rutas (index, create, store, show, edit, update, destroy) para el CRUD completo. Usa resource() cuando necesitas todas las operaciones CRUD y Route::get/post() para rutas específicas.',
            'type'      => 'reply',
        ]);

        ForumPost::create([
            'user_id'   => $students[1]->id,
            'course_id' => $course1->id,
            'parent_id' => $post1->id,
            'body'      => 'Complementando lo que dijo María: también puedes usar Route::apiResource() que omite las rutas create y edit (que son para formularios HTML), siendo ideal para APIs puras.',
            'type'      => 'reply',
        ]);

        $this->command->info("  ✓ Posts del foro creados.");

        $this->command->newLine();
        $this->command->info('✅ Seeding completado exitosamente!');
        $this->command->info('');
        $this->command->table(
            ['Credential', 'Value'],
            [
                ['SuperAdmin Email', 'admin@classcloud360.cl'],
                ['SuperAdmin Password', 'Admin123!'],
                ['Instructor 1 Email', 'maria.gonzalez@classcloud360.cl'],
                ['Instructor 2 Email', 'carlos.mendoza@classcloud360.cl'],
                ['Instructor Password', 'Instructor123!'],
                ['Student Email (example)', 'ana.lopez@example.com'],
                ['Student Password', 'Student123!'],
                ['Tenant', 'Demo Academy (slug: demo-academy)'],
                ['Categories', 'Tecnología, Negocios, Diseño'],
                ['Courses', '3 cursos completos con módulos y lecciones'],
            ]
        );
    }
}
