#!/bin/sh
set -e

echo "=== Classroom Cloud 360 Backend Starting ==="

chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
touch /var/www/html/storage/logs/laravel.log 2>/dev/null || true

echo "Waiting for PostgreSQL..."
for i in $(seq 1 30); do
    if php -r "new PDO('pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; then
        echo "PostgreSQL ready!"
        break
    fi
    echo "  attempt $i/30..."
    sleep 2
done

php artisan package:discover --ansi 2>/dev/null || true
php artisan migrate --force --no-interaction 2>&1 || echo "Migration had warnings (non-fatal)"
php artisan db:seed --force --no-interaction 2>/dev/null || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link --force 2>/dev/null || true

echo "=== Starting services ==="
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
