<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();
            $table->string('verification_code')->unique();
            $table->timestamp('issued_at');
            $table->timestamp('expires_at')->nullable();
            $table->string('pdf_url')->nullable();
            $table->json('metadata')->nullable();
            $table->decimal('final_score', 5, 2)->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('verification_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
