<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'type',
        'question',
        'options',
        'correct_answer',
        'explanation',
        'points',
        'order',
        'media_url',
    ];

    protected $casts = [
        'options'        => 'array',
        'correct_answer' => 'array',
        'points'         => 'decimal:2',
    ];

    protected $hidden = [
        'correct_answer',
    ];

    const TYPE_MULTIPLE_CHOICE = 'multiple_choice';
    const TYPE_TRUE_FALSE      = 'true_false';
    const TYPE_OPEN            = 'open';
    const TYPE_FILL_BLANK      = 'fill_blank';

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function checkAnswer(mixed $answer): bool
    {
        if ($this->type === self::TYPE_OPEN) {
            return true; // Open questions require manual grading
        }

        $correct = $this->correct_answer;
        if (is_array($correct)) {
            if (is_array($answer)) {
                sort($correct);
                sort($answer);
                return $correct === $answer;
            }
            return in_array($answer, $correct);
        }

        return strtolower(trim((string) $answer)) === strtolower(trim((string) $correct));
    }
}
