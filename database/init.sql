
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'docente', 'estudiante');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('presente', 'ausente', 'tardanza', 'justificado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLA: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    username        VARCHAR(100) UNIQUE NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'estudiante',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: estudiantes
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    program      VARCHAR(255) NOT NULL,
    semester     INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 10),
    created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: cursos
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    code       VARCHAR(20) UNIQUE NOT NULL,
    program    VARCHAR(255) NOT NULL,
    semester   INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLA: matriculas (relación estudiantes - cursos)
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (student_id, course_id)
);

-- ============================================================
-- TABLA: sesiones_de_asistencia
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id           SERIAL PRIMARY KEY,
    course_id    INTEGER NOT NULL REFERENCES courses(id),
    date         TIMESTAMP NOT NULL DEFAULT NOW(),
    topic        VARCHAR(500),
    session_code VARCHAR(20) UNIQUE NOT NULL,
    is_open      BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT NOW(),
    closed_at    TIMESTAMP
);

-- ============================================================
-- TABLA: asistencia
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
    id            SERIAL PRIMARY KEY,
    session_id    INTEGER NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id    INTEGER NOT NULL REFERENCES students(id),
    status        attendance_status NOT NULL DEFAULT 'ausente',
    notes         VARCHAR(500),
    registered_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (session_id, student_id)
);

-- ============================================================
-- ÍNDICES para rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course ON attendance_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_code ON attendance_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- DATOS SEMILLA (usuarios de prueba)
-- Contraseña para todos: "unimayor2024"
-- Hash bcrypt generado con passlib
-- ============================================================
INSERT INTO users (email, username, full_name, hashed_password, role) VALUES
    ('admin@unimayor.edu.co', 'admin', 'Administrador Unimayor',
     '$2b$12$vgLR28kL9oWdYTAcx6gCnOog8TgInGtCDAGQDnKhs9KLEzB4M2Xba', 'admin'),
    ('docente@unimayor.edu.co', 'docente1', 'Victor P',
     '$2b$12$vgLR28kL9oWdYTAcx6gCnOog8TgInGtCDAGQDnKhs9KLEzB4M2Xba', 'docente'),
    ('docente2@unimayor.edu.co', 'docente2', 'Alvaro pito',
     '$2b$12$vgLR28kL9oWdYTAcx6gCnOog8TgInGtCDAGQDnKhs9KLEzB4M2Xba', 'docente'),
    ('estudiante@unimayor.edu.co', 'estudiante1', 'María Pérez',
     '$2b$12$QT1gU1KmCsxji2xUatbmLegZ0b8L00ubnbHVtaOjRGL0FlpDcn8lG', 'estudiante'),
    ('estudiante2@unimayor.edu.co', 'estudiante2', 'jesus caicedo',
     '$2b$12$vgLR28kL9oWdYTAcx6gCnOog8TgInGtCDAGQDnKhs9KLEzB4M2Xba', 'estudiante')
ON CONFLICT (email) DO NOTHING;

INSERT INTO students (user_id, student_code, program, semester)
SELECT id, 'UNI-2026-001', 'Ingeniería de Sistemas', 4
FROM users WHERE email = 'estudiante@unimayor.edu.co'
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO students (user_id, student_code, program, semester)
SELECT id, 'UNI-2026-002', 'Ingeniería de Sistemas', 4
FROM users WHERE email = 'estudiante2@unimayor.edu.co'
ON CONFLICT (student_code) DO NOTHING;

INSERT INTO courses (name, code, program, semester, teacher_id)
SELECT 'Electiva 5 ', 'ELE5-2026', 'Ingeniería de Sistemas', 4, u.id
FROM users u WHERE u.email = 'docente@unimayor.edu.co'
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses (name, code, program, semester, teacher_id)
SELECT 'sistemas distribuidos', 'S-distribuidos', 'Ingeniería de Sistemas', 4, u.id
FROM users u WHERE u.email = 'docente2@unimayor.edu.co'
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- FUNCIÓN: auto-update updated_at en users
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
