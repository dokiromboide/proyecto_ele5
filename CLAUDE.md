# CLAUDE.md — Sistema de Asistencia Unimayor
## Colegio Mayor del Cauca · Electiva 5

Este archivo guía a los agentes de IA del equipo de desarrollo. Léelo antes de realizar cualquier cambio.

---

## Descripción del Proyecto

Sistema web de **toma de asistencia académica** para el **Colegio Mayor del Cauca (Unimayor)**. Permite a docentes crear sesiones de clase con código único, a estudiantes marcar su asistencia, y genera reportes exportables en Excel/PDF.

## Stack Tecnológico

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| Frontend | React 18 + Vite + Tailwind CSS | 3000 |
| Backend | FastAPI 0.111 + Python 3.11 | 8000 |
| Base de Datos | PostgreSQL 15 | 5432 |
| Contenedores | Docker + docker-compose | - |
| Gestión de tareas | Jira (proyecto ELE5) | - |

## Equipo de Agentes IA

### 1. `jira-agent`
**Rol**: Gestor de proyecto. Crea y gestiona tickets, épicas, sprints en Jira.
**Usar cuando**: Necesites crear tareas, mover tickets, consultar backlog.

### 2. `backend-agent`
**Rol**: Desarrollador backend. Implementa endpoints FastAPI, modelos SQLAlchemy, lógica de negocio.
**Usar cuando**: Necesites crear/editar endpoints, modelos, schemas, autenticación.

### 3. `frontend-agent`
**Rol**: Desarrollador frontend. Implementa componentes React con tema Unimayor.
**Usar cuando**: Necesites crear/editar páginas, componentes, integrar API.

### 4. `database-agent`
**Rol**: DBA. Diseña esquemas, escribe migraciones Alembic, optimiza queries.
**Usar cuando**: Necesites modificar el esquema BD, crear migraciones, queries complejos.

### 5. `devops-agent`
**Rol**: Ingeniero de infraestructura. Gestiona Docker, CI/CD, configuración de entornos.
**Usar cuando**: Haya problemas con Docker, builds, despliegue o variables de entorno.

### 6. `qa-agent`
**Rol**: QA Engineer. Revisa código, escribe tests, valida criterios de aceptación.
**Usar cuando**: Necesites tests, revisión de código, validación de seguridad.

## Flujo de Trabajo

```
1. jira-agent crea ticket en Jira (ELE5)
        ↓
2. backend-agent implementa endpoint/modelo
        ↓
3. database-agent crea migración si es necesario
        ↓
4. frontend-agent implementa la UI que consume el endpoint
        ↓
5. qa-agent revisa y escribe tests
        ↓
6. devops-agent verifica que Docker compile y pase healthchecks
        ↓
7. jira-agent mueve ticket a "Done"
```

## Convenciones de Commits

```
feat(backend): agregar endpoint de cursos
feat(frontend): crear componente AttendanceTable
fix(backend): corregir validación de roles en /attendance
fix(db): corregir migración de tabla enrollments
feat(docker): agregar healthcheck al backend
test(backend): agregar tests para auth endpoints
docs: actualizar README con instrucciones de instalación
```

## Estructura de Carpetas

```
proyecto_ele5/
├── .claude/agents/          # Definición de los 6 agentes IA
├── backend/                 # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── core/            # config, database, security
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routers/         # FastAPI routers
│   │   └── schemas/         # Pydantic schemas
│   └── alembic/             # Migraciones
├── frontend/                # React + Vite + Tailwind
│   └── src/
│       ├── components/      # Componentes reutilizables
│       ├── contexts/        # AuthContext
│       ├── pages/           # Páginas de la app
│       └── services/        # Llamadas a la API
├── database/                # Scripts SQL iniciales
├── agents/prompts/          # Templates de prompts adicionales
├── docs/                    # Documentación adicional
├── docker-compose.yml       # Orquestación producción
├── docker-compose.dev.yml   # Overrides desarrollo
└── .env.example             # Variables de entorno (template)
```

## Roles de Usuario

| Rol | Permisos |
|-----|---------|
| `admin` | Todo: CRUD usuarios, cursos, reportes globales |
| `docente` | Crear sesiones, tomar asistencia, ver reportes de sus cursos |
| `estudiante` | Marcar asistencia con código de sesión, ver su propio historial |

## Credenciales de Prueba (desarrollo)

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | unimayor2024 | Administrador |
| docente1 | unimayor2024 | Docente |
| estudiante1 | unimayor2024 | Estudiante |

## Variables de Entorno Críticas

Copiar `.env.example` a `.env` antes de iniciar:
```bash
cp .env.example .env
```

Cambiar en producción: `SECRET_KEY`, `JWT_SECRET_KEY`, `POSTGRES_PASSWORD`.

## Comandos de Inicio Rápido

```bash
# 1. Clonar y configurar
git clone https://github.com/dokiromboide/proyecto_ele5.git
cd proyecto_ele5
cp .env.example .env

# 2. Levantar en desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 3. Ver la app
open http://localhost:3000   # Frontend
open http://localhost:8000/docs  # API docs (Swagger)
```
