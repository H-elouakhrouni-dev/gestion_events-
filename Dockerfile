# Multi-stage build for frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Main stage with PHP and Laravel
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    pdo_sqlite \
    mbstring \
    xml \
    && a2enmod rewrite \
    && a2enmod proxy \
    && a2enmod proxy_http

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy backend code
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy frontend build output to public directory
COPY --from=frontend-build /app/frontend/dist ./public/dist

# Create necessary directories and set permissions
RUN mkdir -p storage/logs bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data /app

# Configure Apache virtual host
RUN echo '<VirtualHost *:80>\
    DocumentRoot /app/public\
    <Directory /app/public>\
    AllowOverride All\
    Require all granted\
    <IfModule mod_rewrite.c>\
    RewriteEngine On\
    RewriteCond %{REQUEST_FILENAME} !-f\
    RewriteCond %{REQUEST_FILENAME} !-d\
    RewriteRule ^ index.php [QSA,L]\
    </IfModule>\
    </Directory>\
    <Directory /app/public/dist>\
    AllowOverride All\
    Require all granted\
    <IfModule mod_rewrite.c>\
    RewriteEngine On\
    RewriteCond %{REQUEST_FILENAME} !-f\
    RewriteCond %{REQUEST_FILENAME} !-d\
    RewriteRule ^ /index.html [QSA,L]\
    </IfModule>\
    rectory>\
    t>' > /etc/apache2/sites-available/000-default.conf
    
    PP_KEY if needed
    ample .env || true
    artisan key:generate --force || true

# Expose port
    0
    
    Apache
    2-foreground"]
                    