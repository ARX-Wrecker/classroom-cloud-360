#!/bin/sh
set -e

echo "Starting Classroom Cloud 360 Backend..."

# Fix storage permissions at runtime
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
touch /var/www/html/storage/logs/laravel.log 2>/dev/null || true
chmod 666 /var/www/html/storage/logs/laravel.log 2>/dev/null || true

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:GENERATE_THIS_KEY" ]; then
    php artisan key:generate --force
fi

# Wait for database
echo "Waiting for database..."
while ! php -r "new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; do
    sleep 1
done
echo "Database ready!"

# Discover packages (requires .env)
php artisan package:discover --ansi 2>/dev/null || true

# Run migrations
php artisan migrate --force

# Run seeders on fresh install
php artisan db:seed --force 2>/dev/null || true

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start supervisor (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
