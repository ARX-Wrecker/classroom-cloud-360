#!/bin/bash
echo "Iniciando en modo desarrollo (sin Docker)..."
echo ""

# Check required tools
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP no esta instalado. Instalar PHP 8.4+"
    exit 1
fi

if ! command -v composer &> /dev/null; then
    echo "ERROR: Composer no esta instalado. Instalar desde https://getcomposer.org"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no esta instalado. Instalar desde https://nodejs.org"
    exit 1
fi

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

# --- BACKEND ---
echo "--- Configurando Backend Laravel ---"
cd "$BASE_DIR/backend"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "OK: .env creado desde .env.example"
    else
        echo "AVISO: Crear manualmente backend/.env con la configuracion de DB y Redis"
    fi
fi

if [ ! -d vendor ]; then
    echo "Instalando dependencias PHP (composer install)..."
    composer install
fi

php artisan key:generate --ansi
php artisan migrate --seed

echo "Iniciando servidor Laravel en http://localhost:8000 ..."
php artisan serve --port=8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# --- FRONTEND ---
echo ""
echo "--- Configurando Frontend Next.js ---"
cd "$BASE_DIR/frontend"

if [ ! -f .env.local ]; then
    cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Classroom Cloud 360
EOF
    echo "OK: .env.local creado para frontend"
fi

if [ ! -d node_modules ]; then
    echo "Instalando dependencias Node (npm install)..."
    npm install
fi

echo "Iniciando servidor Next.js en http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "OK: Servidores de desarrollo iniciados!"
echo ""
echo "URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000/api/v1"
echo ""
echo "Credenciales:"
echo "   Admin:       admin@classroomcloud360.com"
echo "   Password:    Admin123!"
echo ""
echo "Para detener los servidores:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   O presiona Ctrl+C"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servidores detenidos.'; exit 0" INT TERM
wait
