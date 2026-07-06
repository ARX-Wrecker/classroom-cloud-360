<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    | Classroom Cloud 360 — permite peticiones desde el frontend
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3001'),
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:4173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.classcloud360\.cl$#',
        '#^https://classcloud360\.cl$#',
        '#^http://localhost(:\d+)?$#',
        '#^http://127\.0\.0\.1(:\d+)?$#',
    ],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'Accept',
        'Origin',
        'X-CSRF-TOKEN',
        'X-Tenant-ID',
        'X-Tenant-Slug',
    ],

    'exposed_headers' => [
        'Authorization',
        'X-Total-Count',
        'X-Page',
    ],

    'max_age' => 86400, // 24 hours

    'supports_credentials' => true,

];
