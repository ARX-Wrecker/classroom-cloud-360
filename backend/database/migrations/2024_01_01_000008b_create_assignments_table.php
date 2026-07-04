<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('instructions')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->decimal('max_score', 6, 2)->default(100);
            $table->decimal('passing_score', 5, 2)->default(60);
            $table->boolean('allow_late')->default(false);
            $table->integer('late_penalty_percent')->default(0);
            $table->json('file_types_allowed')->nullable();
            $table->integer('max_file_size_mb')->default(10);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index('course_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
