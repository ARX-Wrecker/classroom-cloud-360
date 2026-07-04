<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('forum_posts')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('body');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_answered')->default(false);
            $table->integer('likes_count')->default(0);
            $table->integer('replies_count')->default(0);
            $table->enum('type', ['discussion', 'question', 'reply'])->default('discussion');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['course_id', 'type']);
            $table->index(['parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }
};
