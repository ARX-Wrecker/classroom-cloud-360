<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'lesson_id',
        'title',
        'description',
        'time_limit',
        'passing_score',
        'max_attempts',
        'randomize_questions',
        'show_answers',
        'is_published',
    ];

    protected $casts = [
        'randomize_questions' => 'boolean',
        'show_answers'        => 'boolean',
        'is_published'        => 'boolean',
        'passing_score'       => 'decimal:2',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function getUserAttempts(int $userId): int
    {
        return $this->submissions()
            ->where('user_id', $userId)
            ->where('type', 'quiz')
            ->count();
    }

    public function canAttempt(int $userId): bool
    {
        if ($this->max_attempts === null) {
            return true;
        }
        return $this->getUserAttempts($userId) < $this->max_attempts;
    }
}
