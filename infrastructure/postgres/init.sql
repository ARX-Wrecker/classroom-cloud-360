-- Classroom Cloud 360 - Inicialización de la base de datos
-- Versión 1.0

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Comentario de versión
COMMENT ON DATABASE classroom_cloud_360 IS 'Classroom Cloud 360 LMS Database v1.0';

-- Crear schema adicional para auditoría
CREATE SCHEMA IF NOT EXISTS audit;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
