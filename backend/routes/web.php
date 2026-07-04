<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Classroom Cloud 360 API',
        'version' => '1.0.0',
        'docs'    => url('/api/v1'),
    ]);
});
