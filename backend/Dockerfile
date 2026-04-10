# ============================================================
# Dockerfile - Backend FastAPI (Unimayor)
# Multi-stage build: development + production
# ============================================================

FROM python:3.11-slim AS base

WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Etapa desarrollo ----
FROM base AS development
ENV APP_ENV=development
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---- Etapa producción ----
FROM base AS production
ENV APP_ENV=production
COPY . .
RUN pip install gunicorn
EXPOSE 8000
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
