# CLASSROOM CLOUD 360
## Plataforma LMS Enterprise — Fábrica de Software

---

## IDENTIDAD DEL PROYECTO

**Nombre:** Classroom Cloud 360
**Tipo:** Learning Management System (LMS) Enterprise SaaS Multitenant
**Versión Objetivo:** v1.0.0 Enterprise
**Fecha de Inicio:** 2026-07-02
**Estado:** Fase 1 — Análisis y Documentación

---

## MANDATOS ABSOLUTOS (NUNCA VIOLAR)

1. **NUNCA** generar código sin haber completado análisis, documentación y validación de la fase correspondiente.
2. **NUNCA** asumir requerimientos — siempre preguntar o documentar la decisión.
3. **NUNCA** eliminar funcionalidades existentes una vez implementadas.
4. **NUNCA** avanzar a la siguiente fase sin validar la anterior.
5. **SIEMPRE** trabajar sobre ramas de desarrollo (nunca directo a main).
6. **SIEMPRE** documentar cada decisión de arquitectura con su justificación.
7. **SIEMPRE** analizar el impacto de cada cambio antes de implementarlo.
8. **SIEMPRE** mantener todo el sistema responsive y accesible WCAG 2.2.
9. **SIEMPRE** aplicar OWASP Top 10, ISO 27001 y NIST en cada decisión de seguridad.
10. **NUNCA** usar iconos genéricos de IA — solo iconografía profesional.

---

## EQUIPO DE AGENTES — ACTIVAR SIMULTÁNEAMENTE

### DIRECCIÓN EJECUTIVA
- **CEO del Proyecto** — Visión, estrategia, decisiones de negocio de alto nivel
- **CTO** — Decisiones tecnológicas de primer nivel, aprobación de arquitectura
- **CPO (Chief Product Officer)** — Visión de producto, roadmap, priorización de features
- **CFO Digital** — ROI, métricas de negocio, modelo SaaS, pricing strategy

### GESTIÓN Y ANÁLISIS
- **Project Manager (Scrum/Kanban)** — Planificación de sprints, gestión de dependencias, timeline
- **Product Owner** — Backlog, historias de usuario, criterios de aceptación, priorización
- **Business Analyst Senior** — Levantamiento de requerimientos, casos de uso, reglas de negocio
- **Systems Analyst** — Análisis de sistemas existentes, integraciones, compatibilidad
- **Requirements Engineer** — Especificaciones técnicas formales, trazabilidad de requerimientos
- **Scrum Master** — Ceremonias ágiles, impedimentos, métricas de equipo

### ARQUITECTURA
- **Enterprise Architect** — Arquitectura de toda la empresa, patrones macro, decisiones estratégicas
- **Solution Architect** — Arquitectura de la solución completa end-to-end
- **Software Architect** — Patrones de software, principios SOLID, Clean Architecture, DDD
- **Cloud Architect** — Infraestructura cloud, escalabilidad, multi-región
- **Backend Architect** — Diseño de servicios, APIs, microservicios
- **Frontend Architect** — Arquitectura de componentes, state management, rendimiento UI
- **Database Architect** — Modelo de datos, normalización, estrategia de particionamiento
- **Integration Architect** — Integraciones externas, ESB, event-driven architecture
- **Security Architect** — Arquitectura de seguridad, zero-trust, defensa en profundidad
- **Data Architect** — Arquitectura de datos, analytics, reporting, data warehouse

### INFRAESTRUCTURA Y DEVOPS
- **DevOps Engineer Senior** — CI/CD, pipelines, automatización de infraestructura
- **Site Reliability Engineer (SRE)** — SLAs, SLOs, uptime, observabilidad, chaos engineering
- **Platform Engineer** — Developer experience, herramientas internas, scaffolding
- **Cloud Engineer** — Configuración y optimización de servicios cloud
- **Docker Specialist** — Containerización, imágenes optimizadas, Docker Compose
- **Kubernetes Specialist** — Orquestación, autoscaling, helm charts, ingress
- **CI/CD Specialist** — GitHub Actions, pipelines, automatización de releases
- **Infrastructure as Code Specialist** — Terraform, Pulumi, infraestructura declarativa
- **Network Engineer** — Networking, CDN, load balancing, DNS, Cloudflare config

### SEGURIDAD Y CUMPLIMIENTO
- **Cloud Security Engineer** — Seguridad en nube, IAM, políticas
- **Cybersecurity Expert** — Análisis de amenazas, defensa activa, incident response
- **Identity Specialist** — IAM, SSO, gestión de identidades
- **OAuth Specialist** — OAuth2, OIDC, flujos de autenticación
- **Azure AD Specialist** — Integración con Microsoft Entra ID, Azure AD B2B/B2C
- **Microsoft 365 Specialist** — Teams, SharePoint, OneDrive, integración Office
- **Google Workspace Specialist** — Google Drive, Meet, Classroom API integrations
- **PenTesting Specialist** — Pruebas de penetración, OWASP, vulnerabilidades
- **OWASP Specialist** — Top 10, ASVS, WSTG, mitigaciones
- **SOC Analyst** — Monitoreo, alertas, detección de anomalías
- **ISO 27001 Consultant** — Cumplimiento normativo, políticas SGSI
- **NIST Consultant** — Framework NIST CSF, controles de seguridad
- **GDPR / Privacy Expert** — Protección de datos personales, consentimiento, cumplimiento
- **Auditor Técnico** — Auditorías de código, configuración, cumplimiento

### DESARROLLO BACKEND
- **Laravel Senior (Lead)** — Laravel 12, arquitectura MVC, service providers
- **PHP Senior** — PHP 8.4, optimización, patrones avanzados
- **API Designer Senior** — Diseño de contratos API, versionamiento, evolución
- **REST API Specialist** — RESTful design, HATEOAS, HTTP standards
- **GraphQL Specialist** — Schema design, resolvers, subscriptions, DataLoader
- **WebSocket Engineer** — Tiempo real, Laravel Echo, Pusher, Soketi
- **Queue & Jobs Specialist** — Laravel Queues, Horizon, workers, background jobs
- **Event Sourcing Specialist** — CQRS, Event Store, proyecciones
- **Microservices Architect** — Descomposición de servicios, comunicación entre servicios

### DESARROLLO FRONTEND
- **React Senior (Lead)** — React 19, hooks, componentes, state management
- **Next.js Senior** — SSR, SSG, ISR, App Router, Server Components
- **TypeScript Senior** — Tipado estricto, generics, utility types, decorators
- **TailwindCSS Senior** — Design system, tokens, responsive utilities
- **UX/UI Senior** — Experiencia de usuario, flujos, wireframes, prototipos
- **Material Design Specialist** — Design system enterprise, componentes, tokens
- **Accessibility Expert (WCAG)** — WCAG 2.2 AA/AAA, ARIA, screen readers, keyboard nav
- **Animation Specialist** — Framer Motion, GSAP, micro-interacciones, transiciones
- **PWA Specialist** — Progressive Web App, offline support, service workers
- **Mobile Web Specialist** — Responsive avanzado, touch events, gestures

### BASE DE DATOS Y RENDIMIENTO
- **PostgreSQL Senior** — Diseño avanzado, triggers, stored procedures, particionamiento
- **Redis Specialist** — Cache, sessions, queues, pub/sub, cluster
- **Database Performance Expert** — Índices, query optimization, EXPLAIN ANALYZE
- **Search Engine Specialist** — Elasticsearch/OpenSearch, búsqueda full-text, facets
- **Data Migration Specialist** — Migraciones seguras, rollback, versioning de esquema

### STREAMING Y MULTIMEDIA
- **Video Streaming Engineer** — HLS, DASH, transcodificación, calidad adaptativa
- **CDN Specialist** — Cloudflare, cache edge, optimización de assets
- **Media Processing Engineer** — FFmpeg, thumbnails, procesamiento de video/audio
- **Storage Specialist** — S3, MinIO, políticas de retención, multipart upload

### CALIDAD Y PRUEBAS
- **QA Engineer Senior** — Plan de pruebas, casos de prueba, gestión de defectos
- **QA Automation Engineer** — Playwright, Cypress, pruebas E2E automatizadas
- **Testing Specialist** — Unit tests, integration tests, contract testing
- **Performance Engineer** — Load testing, k6, Artillery, análisis de cuellos de botella
- **Accessibility Tester** — Pruebas con NVDA, VoiceOver, axe-core

### INTELIGENCIA ARTIFICIAL
- **AI Engineer (Lead)** — Integración de modelos IA, orchestration, prompts
- **Prompt Engineer** — Diseño de prompts, few-shot, chain-of-thought
- **Machine Learning Engineer** — Modelos de recomendación, detección de riesgo
- **NLP Specialist** — Procesamiento de lenguaje natural, análisis de texto
- **RAG Specialist** — Retrieval Augmented Generation para contenido educativo
- **AI Safety Engineer** — Guardrails, evaluación de outputs, prevención de alucinaciones

### ANALYTICS Y REPORTES
- **Data Engineer** — Pipelines de datos, ETL, data warehouse
- **Reporting Specialist** — Diseño de reportes, KPIs, dashboards
- **Business Intelligence Analyst** — Métricas de aprendizaje, analytics educativos
- **Power BI Specialist** — Integración Power BI Embedded, reportes dinámicos
- **Learning Analytics Specialist** — xAPI, SCORM, métricas pedagógicas

### DOCUMENTACIÓN Y COMUNICACIÓN
- **Technical Writer Senior** — Documentación técnica, guías, runbooks
- **API Documentation Specialist** — OpenAPI/Swagger, Postman collections
- **UX Writer** — Microcopy, textos de interfaz, mensajes de error
- **SEO Specialist** — SEO técnico, meta tags, sitemap, structured data
- **Content Strategist** — Estrategia de contenido educativo, taxonomías

---

## STACK TECNOLÓGICO

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.x | Core UI framework |
| Next.js | 15.x | SSR/SSG/ISR, App Router |
| TypeScript | 5.x | Tipado estricto |
| TailwindCSS | 4.x | Styling y design system |
| Framer Motion | Latest | Animaciones |
| Zustand | Latest | State management global |
| TanStack Query | v5 | Server state, cache |
| React Hook Form | v7 | Formularios |
| Zod | Latest | Validación de esquemas |
| Radix UI | Latest | Componentes accesibles headless |
| Lucide Icons | Latest | Iconografía profesional |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Laravel | 12.x | Framework principal |
| PHP | 8.4 | Runtime |
| Laravel Sanctum | Latest | API tokens |
| Laravel Passport | Latest | OAuth2 server |
| Laravel Horizon | Latest | Queue monitoring |
| Laravel Echo | Latest | WebSockets |
| Laravel Telescope | Dev | Debugging |
| Spatie Permissions | Latest | RBAC |

### Base de Datos
| Tecnología | Versión | Uso |
|---|---|---|
| PostgreSQL | 17.x | Base de datos principal |
| Redis | 7.x | Cache, sesiones, colas, pub/sub |
| Elasticsearch | 8.x | Búsqueda full-text |

### Infraestructura
| Tecnología | Uso |
|---|---|
| Docker | Containerización |
| Docker Compose | Desarrollo local |
| Kubernetes | Producción, autoscaling |
| Nginx | Reverse proxy, serving |
| Cloudflare | CDN, WAF, DDoS |
| MinIO / S3 | Almacenamiento objetos |
| FFmpeg | Transcodificación de video |

### Monitoreo y Observabilidad
| Tecnología | Uso |
|---|---|
| Elastic Stack (ELK) | Logs centralizados |
| Grafana + Prometheus | Métricas de sistema |
| Sentry | Error tracking |
| Uptime Kuma | Monitoreo de uptime |

### APIs e Integraciones
| Estándar / Herramienta | Uso |
|---|---|
| REST API | API principal |
| GraphQL | API para analytics y reporting |
| JWT | Autenticación stateless |
| OAuth2 / OIDC | SSO externo |
| OpenAPI 3.1 / Swagger | Documentación de API |
| WebSockets | Tiempo real |
| xAPI (Tin Can) | Tracking de aprendizaje |
| SCORM 2004 | Compatibilidad con contenido |

---

## ESTÁNDARES DE DESARROLLO

### Principios de Arquitectura
- **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **DDD (Domain-Driven Design)** — Bounded contexts, entidades, value objects, aggregates
- **Clean Architecture** — Capas bien definidas, independencia de frameworks
- **Repository Pattern** — Abstracción de persistencia
- **CQRS** — Separación de comandos y queries
- **Event-Driven** — Eventos de dominio desacoplados
- **Hexagonal Architecture** — Ports and Adapters
- **Microservicios preparados** — Módulos desacoplados listos para extraerse

### Estándares de Código
- **PSR-12** — Estilo de código PHP
- **ESLint + Prettier** — Linting y formateo TypeScript/React
- **PHPStan nivel 8** — Análisis estático PHP
- **Conventional Commits** — Mensajes de commit estandarizados
- **SemVer** — Versionado semántico

### Seguridad Obligatoria
- OWASP Top 10 mitigado en cada capa
- ISO 27001 controles aplicados
- NIST CSF implementado
- GDPR / Ley 19.628 (Chile) cumplimiento

---

## MÓDULOS DEL SISTEMA

### Core Platform
1. **Dashboard** — Panel principal personalizado por rol
2. **Autenticación & Seguridad** — Login, 2FA, MFA, OAuth2, SSO
3. **Gestión de Usuarios** — CRUD completo con RBAC
4. **Roles & Permisos** — RBAC granular, herencia de permisos

### Usuarios Académicos
5. **Profesores** — Perfil, cursos asignados, carga académica
6. **Estudiantes** — Perfil, cursos inscritos, progreso, historial

### Contenido Académico
7. **Cursos** — Creación, publicación, versionado, duplicación
8. **Módulos** — Organización jerárquica dentro de cursos
9. **Lecciones** — Contenido granular, orden, prerequisitos
10. **Material de Estudio** — PDFs, PPTs, documentos, links
11. **Videos** — Upload, streaming HLS, transcodificación, chapters
12. **Biblioteca Digital** — Repositorio central de recursos
13. **Clases** — Sesiones sincrónicas y asincrónicas

### Evaluación y Seguimiento
14. **Tareas** — Asignación, entrega, rúbricas, retroalimentación
15. **Evaluaciones** — Quizzes, pruebas cronometradas
16. **Exámenes** — Exámenes formales con proctoring básico
17. **Banco de Preguntas** — Repositorio reutilizable con taxonomía Bloom
18. **Calificaciones** — Libro de notas, ponderaciones, promedios
19. **Certificados** — Generación automática, firma digital, verificación
20. **Asistencia** — Control de asistencia por clase y módulo

### Comunicación y Colaboración
21. **Calendario** — Eventos académicos, fechas límite, sincronización
22. **Notificaciones** — Push, email, in-app, configurable por usuario
23. **Mensajería** — Sistema interno de mensajes directos
24. **Chat** — Chat en tiempo real por curso/clase
25. **Videoclases** — Integración con Meet/Teams, grabaciones
26. **Foro** — Discusiones estructuradas por curso
27. **Comentarios** — Comentarios contextuales en contenido

### Analytics e Informes
28. **Reportes** — Reportes académicos personalizados
29. **Analytics** — Dashboard de métricas de aprendizaje
30. **Learning Analytics** — xAPI, progreso, tiempo, engagement

### Administración
31. **Panel Administrativo** — Superadmin, gestión de tenant
32. **Configuraciones** — Configuración global y por tenant
33. **Auditoría** — Log completo de acciones del sistema
34. **Logs** — Logs centralizados con ELK
35. **Respaldos** — Backup automático y restauración

### Extensibilidad
36. **API** — API pública documentada para integraciones
37. **Integraciones** — M365, Google Workspace, Zoom, etc.
38. **Marketplace** — Plugins y extensiones de terceros

### Inteligencia Artificial
39. **Asistente IA** — Chat contextual para estudiantes y profesores
40. **Generador de Preguntas** — IA para generar banco de preguntas
41. **Corrección Automática** — IA para tareas abiertas
42. **Detector de Riesgo** — Estudiantes en riesgo académico
43. **Recomendador** — Cursos y contenido recomendado
44. **Traductor** — Traducción de contenido multicultural
45. **Generador de Resúmenes** — Síntesis automática de contenido

---

## ROLES DEL SISTEMA

| Rol | Descripción | Nivel |
|---|---|---|
| **Superadmin** | Control total del sistema multi-tenant | 1 |
| **Admin de Institución** | Admin de su tenant/institución | 2 |
| **Coordinador Académico** | Gestión de cursos y profesores | 3 |
| **Profesor** | Crear y gestionar sus cursos | 4 |
| **Ayudante** | Asistir al profesor, corregir | 5 |
| **Estudiante** | Acceder a cursos inscritos | 6 |
| **Apoderado/Tutor** | Ver progreso de su pupilo | 7 |
| **Auditor** | Solo lectura con acceso completo | 8 |
| **Soporte** | Soporte técnico de la plataforma | 9 |

---

## FASES DEL PROYECTO

### FASE 1 — Análisis Completo (SIN CÓDIGO)
**Entregables requeridos:**
- [ ] Mapa del Sistema (componentes, servicios, dependencias)
- [ ] Mapa Funcional (funciones por módulo y rol)
- [ ] Mapa de Procesos (flujos de negocio end-to-end)
- [ ] Mapa de Permisos (matriz rol × acción × recurso)
- [ ] Mapa de Usuarios (personas, journeys, casos de uso)
- [ ] Mapa de Seguridad (controles, amenazas, mitigaciones)
- [ ] Mapa de APIs (endpoints, contratos, versiones)
- [ ] Mapa de Base de Datos (entidades, relaciones, volumen estimado)
- [ ] Mapa de Módulos (límites, dependencias, prioridades)
- [ ] Mapa UX (flujos de usuario por rol)
- [ ] Mapa UI (sistema de diseño, componentes, tokens)
- [ ] Mapa Responsive (breakpoints, adaptaciones por dispositivo)

### FASE 2 — Diseño de Arquitectura
- [ ] Diagrama de arquitectura general (C4 Model)
- [ ] Arquitectura de microservicios
- [ ] Arquitectura de seguridad
- [ ] Arquitectura de datos
- [ ] Architecture Decision Records (ADRs)

### FASE 3 — Diseño de Base de Datos
- [ ] Modelo entidad-relación completo
- [ ] DDL de todas las tablas
- [ ] Índices y particionamiento
- [ ] Estrategia de multi-tenancy
- [ ] Estrategia de backup

### FASE 4 — Diseño de APIs
- [ ] OpenAPI 3.1 spec completo
- [ ] Colecciones Postman
- [ ] Estrategia de versionamiento
- [ ] Contratos de error

### FASE 5 — Diseño de Navegación
- [ ] Sitemap completo
- [ ] Flujos de navegación por rol
- [ ] Information Architecture

### FASE 6 — Mockups
- [ ] Wireframes de todas las pantallas
- [ ] Mockups de alta fidelidad
- [ ] Prototipos interactivos

### FASE 7 — Diseño UX
- [ ] User journeys completos
- [ ] Usability testing plan
- [ ] Accesibilidad WCAG 2.2

### FASE 8 — Diseño UI
- [ ] Design system completo
- [ ] Tokens de diseño
- [ ] Componentes documentados
- [ ] Dark mode / Light mode

### FASE 9 — Desarrollo (Orden de implementación)
1. Infraestructura base (Docker, Nginx, CI/CD)
2. Autenticación & Autorización
3. Gestión de Usuarios & Roles
4. Módulo de Cursos
5. Módulo de Contenido (lecciones, videos)
6. Módulo de Evaluaciones
7. Módulo de Comunicación (chat, notificaciones)
8. Módulo de Analytics
9. Módulo de IA
10. Módulo de Integraciones
11. Panel Administrativo
12. API pública

---

## SEGURIDAD (OBLIGATORIO EN TODO MOMENTO)

### Autenticación
- 2FA obligatorio para roles admin+
- MFA con TOTP (Google Authenticator, Authy)
- OAuth2 con PKCE
- JWT con refresh tokens rotativos
- Session management seguro
- Detección de sesiones anómalas

### Protección de Datos
- Cifrado AES-256 en reposo
- TLS 1.3 en tránsito
- Hashing bcrypt/argon2 para passwords
- Tokenización de datos sensibles
- Data masking en logs

### Protección de Aplicación
- CSRF tokens en todos los formularios
- XSS prevention (CSP headers, sanitización)
- SQL Injection prevention (query builder, preparados)
- Rate limiting por IP y usuario
- CAPTCHA en login y registro
- Input validation en frontend y backend
- Output encoding

### Auditoría
- Log de todas las acciones críticas
- Retención de logs: 90 días hot, 1 año cold
- Alertas de anomalías en tiempo real
- Backups automáticos cifrados
- Pruebas de restauración mensuales

---

## RENDIMIENTO OBJETIVO

| Métrica | Objetivo |
|---|---|
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Tiempo de carga de página | < 2s en 4G |
| Respuesta de API | < 200ms p95 |
| Respuesta de queries SQL | < 100ms p95 |
| Concurrent users soportados | > 10,000 |
| Uptime SLA | 99.9% |

---

## BREAKPOINTS RESPONSIVE

| Breakpoint | Nombre | Resolución |
|---|---|---|
| `2xl` | Desktop Full HD | 1920px |
| `xl` | Desktop Large | 1600px, 1440px |
| `lg` | Desktop | 1366px, 1280px |
| `md` | Tablet Landscape | 1024px |
| `sm` | Tablet Portrait | 768px |
| `xs` | Mobile Large | 480px |
| `2xs` | Mobile Standard | 390px |
| `3xs` | Mobile Small | 360px |

---

## INSPIRACIÓN UX/UI

- **Google Classroom** — Simplicidad, tarjetas de cursos
- **Microsoft Teams** — Navegación lateral, colaboración
- **Notion** — Bloques de contenido, personalización
- **Canvas LMS** — Estructura académica sólida
- **Microsoft 365** — Integración de herramientas
- **Slack** — Comunicación y notificaciones
- **Linear** — Velocidad, teclado, micro-interacciones
- **Vercel Dashboard** — UI moderna, métricas claras

---

## ESTRUCTURA DE CARPETAS (PLANIFICADA)

```
Classroom Cloud 360/
├── docs/                          # Toda la documentación
│   ├── fase-1-analisis/           # Mapas y análisis
│   ├── fase-2-arquitectura/       # ADRs, diagramas
│   ├── fase-3-base-de-datos/      # Esquemas, migraciones
│   ├── fase-4-apis/               # OpenAPI specs
│   ├── fase-5-navegacion/         # Sitemap, flujos
│   ├── fase-6-mockups/            # Wireframes, prototipos
│   ├── fase-7-ux/                 # User journeys, testing
│   └── fase-8-ui/                 # Design system, tokens
├── backend/                       # Laravel 12
│   ├── app/
│   │   ├── Domain/                # DDD — Bounded contexts
│   │   ├── Application/           # Use cases, CQRS
│   │   ├── Infrastructure/        # Repositorios, servicios ext.
│   │   └── Presentation/          # HTTP Controllers, Resources
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── tests/
├── frontend/                      # Next.js 15 + React 19
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   ├── components/            # Componentes reutilizables
│   │   ├── features/              # Feature modules
│   │   ├── hooks/                 # Custom hooks
│   │   ├── lib/                   # Utilidades
│   │   ├── stores/                # Zustand stores
│   │   └── types/                 # TypeScript types
│   └── public/
├── infrastructure/                # Docker, K8s, Terraform
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── nginx/
└── .github/                       # CI/CD workflows
    └── workflows/
```

---

## CÓMO TRABAJAR CON ESTE PROYECTO

Al iniciar cada sesión:
1. Leer este CLAUDE.md completo
2. Verificar la fase activa actual
3. No avanzar sin validar la fase anterior
4. Documentar todas las decisiones
5. Nunca asumir — siempre preguntar

Al finalizar cada sesión:
1. Actualizar el estado de la fase
2. Documentar decisiones tomadas
3. Registrar pendientes
4. Actualizar MEMORY.md si hay decisiones importantes

---

## OBJETIVO FINAL

Construir **Classroom Cloud 360** como la mejor plataforma LMS enterprise moderna del mercado latinoamericano, con calidad comparable a Canvas LMS y Moodle Enterprise pero con UX moderna al nivel de Notion y Linear.

**Características diferenciadores:**
- Asistente IA integrado nativo (no plugin)
- UX moderna y velocidad al nivel de herramientas SaaS modernas
- Multi-tenant desde el primer día
- Cumplimiento normativo completo
- Videoclases sin depender de terceros pagos
- Analytics de aprendizaje en tiempo real
- Mobile-first responsive perfecto
- Accesibilidad WCAG 2.2 real (no decorativa)
