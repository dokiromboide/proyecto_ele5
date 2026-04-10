# Arquitectura del Sistema - proyecto_ele5
## Sistema de Asistencia Unimayor

---

## Diagrama de Arquitectura General

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK: unimayor_net                 │
│                                                                      │
│   ┌───────────────────┐         ┌───────────────────┐              │
│   │    FRONTEND        │  HTTP   │     BACKEND        │  SQL        │
│   │   React 18 + Vite  │◄──────►│    FastAPI 0.111   │◄──────────► │
│   │   Tailwind CSS     │  :8000  │    Python 3.11     │  PostgreSQL │
│   │   :3000            │         │    SQLAlchemy      │  :5432      │
│   └───────────────────┘         └───────────────────┘              │
│                                          │                           │
│                               ┌──────────▼──────────┐              │
│                               │   PostgreSQL 15      │              │
│                               │   unimayor_asistencia│              │
│                               │   Vol: postgres_data │              │
│                               └─────────────────────┘              │
└──────────────────────────────────────────────────────────────────────┘
         │                              │
    http://localhost:3000    http://localhost:8000
```

---

## Flujo de Autenticación (JWT)

```
Usuario               Frontend              Backend              DB
   │                     │                     │                  │
   │  1. POST /login      │                     │                  │
   │──────────────────►  │                     │                  │
   │                     │  2. POST /api/v1/auth/login            │
   │                     │────────────────────►│                  │
   │                     │                     │ 3. Buscar usuario│
   │                     │                     │────────────────► │
   │                     │                     │◄──────────────── │
   │                     │                     │ 4. Verificar bcrypt│
   │                     │  5. {access_token,  │                  │
   │                     │     refresh_token}  │                  │
   │                     │◄────────────────────│                  │
   │  6. Guardar tokens  │                     │                  │
   │  en localStorage    │                     │                  │
   │◄────────────────────│                     │                  │
   │                     │                     │                  │
   │  7. GET /dashboard  │                     │                  │
   │  (con token)        │  Authorization:     │                  │
   │────────────────────►│  Bearer <token>     │                  │
   │                     │────────────────────►│                  │
   │                     │                     │ 8. Decodificar JWT│
   │                     │  9. Datos del dash  │                  │
   │◄────────────────────│◄────────────────────│                  │
```

---

## Flujo de Toma de Asistencia

```
DOCENTE                            ESTUDIANTE
   │                                    │
   │ 1. POST /attendance/sessions        │
   │ {course_id, topic}                 │
   │──────────────────► API             │
   │                     │             │
   │ 2. Devuelve         │             │
   │ {session_code: "AB4X2Y"}           │
   │◄────────────────────│             │
   │                     │             │
   │ 3. Muestra código   │             │
   │    en pantalla      │             │
   │                     │             │
   │                     │ 4. Estudiante ve código
   │                     │             │
   │                     │ 5. POST /attendance/mark
   │                     │ {session_code: "AB4X2Y",
   │                     │  student_code: "UNI-001"}
   │                     │────────────►│
   │                     │             │
   │                     │ 6. {status: "presente"}
   │                     │◄────────────│
   │                     │             │
   │ 7. PATCH /attendance/sessions/{id}/close
   │──────────────────── │             │
   │ 8. Sesión cerrada   │             │
```

---

## Modelo de Datos (Entidad-Relación)

```
USERS ──────────────────── STUDENTS
(id, email, username,       (id, user_id FK, student_code,
 full_name, role,            program, semester)
 hashed_password)               │
        │                       │ N:M via ENROLLMENTS
        │ 1:N                   │
        ▼                       ▼
    COURSES ────────────── ENROLLMENTS
    (id, name, code,       (student_id FK,
     teacher_id FK,         course_id FK,
     program, semester)     enrolled_at)
        │
        │ 1:N
        ▼
  ATTENDANCE_SESSIONS
  (id, course_id FK,
   session_code UNIQUE,
   date, topic, is_open)
        │
        │ 1:N
        ▼
   ATTENDANCE
   (id, session_id FK,
    student_id FK,
    status ENUM,
    registered_at)
```

---

## Roles y Permisos por Endpoint

| Endpoint | admin | docente | estudiante |
|----------|-------|---------|------------|
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ❌ | ❌ |
| POST /attendance/sessions | ✅ | ✅ | ❌ |
| POST /attendance/mark | ❌ | ❌ | ✅ |
| GET /attendance/sessions/{id}/records | ✅ | ✅ | ❌ |
| PATCH /attendance/sessions/{id}/close | ✅ | ✅ | ❌ |
| GET /reports/course/{id}/summary | ✅ | ✅ (solo sus cursos) | ❌ |
| GET /reports/course/{id}/excel | ✅ | ✅ (solo sus cursos) | ❌ |

---

## Agentes IA y Sus Responsabilidades

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│ jira-agent  │────►│ backend-agent │────►│frontend-agent│
│             │     │               │     │              │
│ Crea tickets│     │ Implementa    │     │ Implementa   │
│ Gestiona    │     │ endpoints API │     │ UI/UX        │
│ sprints     │     │ Lógica negocio│     │ Tema Unimayor│
└─────────────┘     └───────┬───────┘     └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
      ┌──────────────┐  ┌──────────┐  ┌──────────┐
      │database-agent│  │qa-agent  │  │devops-   │
      │              │  │          │  │agent     │
      │ Esquema SQL  │  │ Tests    │  │ Docker   │
      │ Migraciones  │  │ Revisión │  │ CI/CD    │
      │ Queries      │  │ código   │  │ Deploy   │
      └──────────────┘  └──────────┘  └──────────┘
```

---

## Variables de Entorno por Servicio

### Backend (FastAPI)
- `DATABASE_URL`: Cadena de conexión PostgreSQL
- `JWT_SECRET_KEY`: Clave secreta para firmar tokens
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`: Expiración del access token
- `BACKEND_CORS_ORIGINS`: Orígenes permitidos para CORS

### Frontend (React/Vite)
- `VITE_API_URL`: URL base del backend

### Base de Datos (PostgreSQL)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Credenciales

---

## Orden de Inicio de Contenedores

```
1. db (PostgreSQL)           → healthcheck: pg_isready
        ↓ (depends_on healthy)
2. backend (FastAPI)         → healthcheck: GET /health
        ↓ (depends_on)
3. frontend (React)          → sirve en :3000
```
