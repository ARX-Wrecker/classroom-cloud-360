<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'enrollment_id',
        'submission_id',
        'quiz_id',
        'assignment_id',
        'graded_by',
        'score',
        'max_score',
        'letter_grade',
        'feedback',
        'graded_at',
        'is_final',
    ];

    protected $casts = [
        'graded_at' => 'datetime',
        'score'     => 'decimal:2',
        'max_score' => 'decimal:2',
        'is_final'  => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function gradedByUser()
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    public function getPercentageAttribute(): float
    {
        if (!$this->max_score || $this->max_score == 0) {
            return 0;
        }
        return round(($this->score / $this->max_score) * 100, 2);
    }

    public function calculateLetterGrade(): string
    {
        $pct = $this->percentage;
        return match (true) {
            $pct >= 90 => 'A',
            $pct >= 80 => 'B',
            $pct >= 70 => 'C',
            $pct >= 60 => 'D',
            default    => 'F',
        };
    }
}
