<?php

use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CertificateController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ForumController;
use App\Http\Controllers\Api\V1\LessonController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\ModuleController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\QuizController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Classroom Cloud 360 — API Routes v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('tenant')->group(function () {

    // ─── Auth Public ──────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register',       [AuthController::class, 'register']);
        Route::post('/login',          [AuthController::class, 'login']);
        Route::post('/forgot-password',[AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // ─── Public endpoints ────────────────────────────────────────────────
    Route::get('/courses',                    [CourseController::class, 'index']);
    Route::get('/courses/{id}',               [CourseController::class, 'show']);
    Route::get('/categories',                 [CategoryController::class, 'index']);
    Route::get('/categories/{id}',            [CategoryController::class, 'show']);
    Route::get('/certificates/verify/{code}', [CertificateController::class, 'verify']);

    // ─── Authenticated ───────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('/logout',        [AuthController::class, 'logout']);
            Route::get('/me',             [AuthController::class, 'me']);
            Route::post('/refresh',       [AuthController::class, 'refreshToken']);
            Route::patch('/profile',      [AuthController::class, 'updateProfile']);
        });

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // ─── Courses ──────────────────────────────────────────────────────
        Route::post('/courses',              [CourseController::class, 'store']);
        Route::put('/courses/{id}',          [CourseController::class, 'update']);
        Route::patch('/courses/{id}',        [CourseController::class, 'update']);
        Route::delete('/courses/{id}',       [CourseController::class, 'destroy']);
        Route::post('/courses/{id}/publish', [CourseController::class, 'publish']);
        Route::post('/courses/{id}/enroll',  [CourseController::class, 'enroll']);
        Route::get('/my-courses',            [CourseController::class, 'myCourses']);

        // ─── Modules (nested under courses) ───────────────────────────────
        Route::prefix('courses/{courseId}/modules')->group(function () {
            Route::get('/',           [ModuleController::class, 'index']);
            Route::post('/',          [ModuleController::class, 'store']);
            Route::get('/{moduleId}', [ModuleController::class, 'show']);
            Route::put('/{moduleId}', [ModuleController::class, 'update']);
            Route::patch('/{moduleId}', [ModuleController::class, 'update']);
            Route::delete('/{moduleId}', [ModuleController::class, 'destroy']);
        });

        // ─── Lessons (nested under modules) ───────────────────────────────
        Route::prefix('modules/{moduleId}/lessons')->group(function () {
            Route::get('/',            [LessonController::class, 'index']);
            Route::post('/',           [LessonController::class, 'store']);
            Route::get('/{lessonId}',  [LessonController::class, 'show']);
            Route::put('/{lessonId}',  [LessonController::class, 'update']);
            Route::patch('/{lessonId}',[LessonController::class, 'update']);
            Route::delete('/{lessonId}',[LessonController::class, 'destroy']);
        });
        Route::post('/lessons/{id}/complete', [LessonController::class, 'markComplete']);

        // ─── Quizzes ──────────────────────────────────────────────────────
        Route::apiResource('/quizzes', QuizController::class);
        Route::post('/quizzes/{id}/submit', [QuizController::class, 'submit']);

        // ─── Certificates ─────────────────────────────────────────────────
        Route::get('/certificates',                          [CertificateController::class, 'index']);
        Route::get('/certificates/{id}',                     [CertificateController::class, 'show']);
        Route::post('/certificates/generate/{enrollmentId}', [CertificateController::class, 'generate']);

        // ─── Notifications ────────────────────────────────────────────────
        Route::get('/notifications',                  [NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read',       [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all',        [NotificationController::class, 'markAllRead']);
        Route::delete('/notifications/{id}',          [NotificationController::class, 'destroy']);

        // ─── Messages ─────────────────────────────────────────────────────
        Route::get('/messages',       [MessageController::class, 'index']);
        Route::post('/messages',      [MessageController::class, 'store']);
        Route::get('/messages/{id}',  [MessageController::class, 'show']);
        Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

        // ─── Forum ────────────────────────────────────────────────────────
        Route::get('/forum',         [ForumController::class, 'index']);
        Route::post('/forum',        [ForumController::class, 'store']);
        Route::get('/forum/{id}',    [ForumController::class, 'show']);
        Route::put('/forum/{id}',    [ForumController::class, 'update']);
        Route::patch('/forum/{id}',  [ForumController::class, 'update']);
        Route::delete('/forum/{id}', [ForumController::class, 'destroy']);

        // ─── Analytics ────────────────────────────────────────────────────
        Route::get('/analytics/my-progress', [AnalyticsController::class, 'myProgress']);

        // ─── Admin / SuperAdmin Only ──────────────────────────────────────
        Route::middleware('role:admin,superadmin')->group(function () {

            // Users management
            Route::get('/users',                [UserController::class, 'index']);
            Route::post('/users',               [UserController::class, 'store']);
            Route::get('/users/{id}',           [UserController::class, 'show']);
            Route::put('/users/{id}',           [UserController::class, 'update']);
            Route::patch('/users/{id}',         [UserController::class, 'update']);
            Route::delete('/users/{id}',        [UserController::class, 'destroy']);
            Route::patch('/users/{id}/role',    [UserController::class, 'changeRole']);
            Route::patch('/users/{id}/toggle',  [UserController::class, 'toggleActive']);

            // Categories management
            Route::post('/categories',          [CategoryController::class, 'store']);
            Route::put('/categories/{id}',      [CategoryController::class, 'update']);
            Route::patch('/categories/{id}',    [CategoryController::class, 'update']);
            Route::delete('/categories/{id}',   [CategoryController::class, 'destroy']);

            // Analytics
            Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
            Route::get('/analytics/courses',  [AnalyticsController::class, 'courses']);
        });
    });
});

// Health check
Route::get('/health', fn() => response()->json([
    'success'   => true,
    'message'   => 'Classroom Cloud 360 API is running.',
    'version'   => 'v1',
    'timestamp' => now()->toISOString(),
]));
