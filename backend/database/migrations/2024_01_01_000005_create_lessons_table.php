<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->string('video_duration')->nullable();
            $table->integer('duration_seconds')->default(0);
            $table->integer('order')->default(0);
            $table->enum('type', ['video', 'text', 'quiz', 'live'])->default('video');
            $table->boolean('is_published')->default(true);
            $table->boolean('is_preview')->default(false);
            $table->json('attachments')->nullable();
            $table->text('transcript')->nullable();
            $table->timestamps();

            $table->index(['module_id', 'order']);
            $table->index('type');
        });

        // lesson_completions se crea en migración 2024_01_01_000007 (después de enrollments)
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
