<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('instructor_id')->constrained('users');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('preview_video')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('is_free')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->string('language', 10)->default('es');
            $table->decimal('duration_hours', 6, 1)->default(0);
            $table->integer('total_lessons')->default(0);
            $table->json('requirements')->nullable();
            $table->json('what_you_learn')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('certificate_enabled')->default(true);
            $table->integer('max_students')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('rating_count')->default(0);
            $table->integer('enrolled_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'is_published']);
            $table->index(['instructor_id', 'is_published']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
