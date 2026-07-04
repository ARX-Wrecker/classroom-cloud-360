<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('quiz_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assignment_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['quiz', 'assignment'])->default('quiz');
            $table->json('answers')->nullable();
            $table->decimal('score', 6, 2)->nullable();
            $table->decimal('max_score', 6, 2)->nullable();
            $table->boolean('passed')->nullable();
            $table->integer('time_spent')->nullable()->comment('In seconds');
            $table->text('feedback')->nullable();
            $table->foreignId('graded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('graded_at')->nullable();
            $table->enum('status', ['pending', 'graded', 'rejected'])->default('pending');
            $table->json('files')->nullable();
            $table->integer('attempt_number')->default(1);
            $table->timestamps();

            $table->index(['user_id', 'quiz_id']);
            $table->index(['user_id', 'assignment_id']);
            $table->index('enrollment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
