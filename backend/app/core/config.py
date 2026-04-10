from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Aplicación
    APP_NAME: str = "Sistema de Asistencia Unimayor"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-production"

    # Base de datos
    DATABASE_URL: str = "postgresql://unimayor_user:password@db:5432/unimayor_asistencia"

    # JWT
    JWT_SECRET_KEY: str = "jwt-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://frontend:3000"]

    # Reportes
    REPORTS_DIR: str = "/app/reports"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
