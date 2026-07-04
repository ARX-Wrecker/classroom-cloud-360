FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    nginx \
    supervisor \
    autoconf \
    g++ \
    make

RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    gd \
    zip \
    bcmath \
    opcache \
    pcntl

RUN pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY backend/ .

RUN composer install --optimize-autoloader --no-interaction --no-scripts \
    && composer dump-autoload --optimize --no-interaction --no-scripts

RUN mkdir -p /var/www/html/storage/app/public \
             /var/www/html/storage/framework/cache \
             /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/logs \
             /var/www/html/bootstrap/cache \
             /var/log/supervisor \
             /var/log/php-fpm \
             /var/run \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

COPY backend/docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY backend/docker/nginx.conf /etc/nginx/http.d/default.conf
COPY backend/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY backend/docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && chmod +x /var/www/html/artisan

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
