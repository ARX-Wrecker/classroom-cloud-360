<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // enrollments: consultas frecuentes por user_id, course_id, status
        Schema::table('enrollments', function (Blueprint $table) {
            if (!$this->indexExists('enrollments', 'enrollments_user_id_status_index')) {
                $table->index(['user_id', 'status'], 'enrollments_user_id_status_index');
            }
            if (!$this->indexExists('enrollments', 'enrollments_course_id_status_index')) {
                $table->index(['course_id', 'status'], 'enrollments_course_id_status_index');
            }
            if (!$this->indexExists('enrollments', 'enrollments_last_accessed_at_index')) {
                $table->index('last_accessed_at', 'enrollments_last_accessed_at_index');
            }
        });

        // lessons: buscar por module_id muy frecuente
        Schema::table('lessons', function (Blueprint $table) {
            if (!$this->indexExists('lessons', 'lessons_module_id_order_index')) {
                $table->index(['module_id', 'order'], 'lessons_module_id_order_index');
            }
        });

        // lesson_completions: buscar por enrollment_id
        Schema::table('lesson_completions', function (Blueprint $table) {
            if (!$this->indexExists('lesson_completions', 'lc_enrollment_id_index')) {
                $table->index('enrollment_id', 'lc_enrollment_id_index');
            }
            if (!$this->indexExists('lesson_completions', 'lc_user_lesson_index')) {
                $table->index(['user_id', 'lesson_id'], 'lc_user_lesson_index');
            }
        });

        // notifications: leer no leídas por usuario
        Schema::table('notifications', function (Blueprint $table) {
            if (!$this->indexExists('notifications', 'notifications_user_read_index')) {
                $table->index(['user_id', 'is_read', 'created_at'], 'notifications_user_read_index');
            }
        });

        // courses: filtros frecuentes
        Schema::table('courses', function (Blueprint $table) {
            if (!$this->indexExists('courses', 'courses_instructor_published_index')) {
                $table->index(['instructor_id', 'is_published'], 'courses_instructor_published_index');
            }
            if (!$this->indexExists('courses', 'courses_tenant_published_index')) {
                $table->index(['tenant_id', 'is_published'], 'courses_tenant_published_index');
            }
        });

        // modules: buscar por course_id
        Schema::table('modules', function (Blueprint $table) {
            if (!$this->indexExists('modules', 'modules_course_id_order_index')) {
                $table->index(['course_id', 'order'], 'modules_course_id_order_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropIndexIfExists('enrollments_user_id_status_index');
            $table->dropIndexIfExists('enrollments_course_id_status_index');
            $table->dropIndexIfExists('enrollments_last_accessed_at_index');
        });
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropIndexIfExists('lessons_module_id_order_index');
        });
        Schema::table('lesson_completions', function (Blueprint $table) {
            $table->dropIndexIfExists('lc_enrollment_id_index');
            $table->dropIndexIfExists('lc_user_lesson_index');
        });
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndexIfExists('notifications_user_read_index');
        });
        Schema::table('courses', function (Blueprint $table) {
            $table->dropIndexIfExists('courses_instructor_published_index');
            $table->dropIndexIfExists('courses_tenant_published_index');
        });
        Schema::table('modules', function (Blueprint $table) {
            $table->dropIndexIfExists('modules_course_id_order_index');
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        return collect(\DB::select("
            SELECT indexname FROM pg_indexes
            WHERE tablename = ? AND indexname = ?
        ", [$table, $index]))->isNotEmpty();
    }
};
