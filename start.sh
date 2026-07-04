#!/bin/bash
echo "Iniciando Classroom Cloud 360..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no esta instalado. Instalarlo desde https://docker.com"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "ERROR: Docker Compose no esta disponible."
    exit 1
fi

# Copy env if not exists
if [ ! -f backend/.env ]; then
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        echo "OK: Archivo .env creado desde .env.example"
    else
        echo "AVISO: No existe backend/.env.example. Crear manualmente backend/.env"
    fi
fi

# Start services
echo "Levantando servicios con Docker Compose..."
docker-compose up -d

# Wait a moment for services to initialize
echo "Esperando que los servicios inicien (15 segundos)..."
sleep 15

# Show status
echo ""
echo "Estado de contenedores:"
docker-compose ps
echo ""
echo "OK: Classroom Cloud 360 iniciado!"
echo ""
echo "URLs:"
echo "   Frontend:       http://localhost:3000"
echo "   Backend API:    http://localhost:8000/api/v1"
echo "   Nginx (proxy):  http://localhost:80"
echo "   MinIO Console:  http://localhost:9001"
echo "   MinIO API:      http://localhost:9000"
echo ""
echo "Credenciales:"
echo "   Admin:          admin@classroomcloud360.com"
echo "   Password:       Admin123!"
echo ""
echo "   MinIO User:     cc360_minio_user"
echo "   MinIO Password: cc360_minio_password_2024"
echo ""
echo "Comandos utiles:"
echo "   Ver logs:       docker-compose logs -f"
echo "   Detener:        docker-compose down"
echo "   Reiniciar:      docker-compose restart"
echo ""
