<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'enrollment_id',
        'quiz_id',
        'assignment_id',
        'type',
        'answers',
        'score',
        'max_score',
        'passed',
        'time_spent',
        'feedback',
        'graded_by',
        'graded_at',
        'status',
        'files',
        'attempt_number',
    ];

    protected $casts = [
        'answers'    => 'array',
        'files'      => 'array',
        'passed'     => 'boolean',
        'graded_at'  => 'datetime',
        'score'      => 'decimal:2',
        'max_score'  => 'decimal:2',
    ];

    const TYPE_QUIZ       = 'quiz';
    const TYPE_ASSIGNMENT = 'assignment';

    const STATUS_PENDING  = 'pending';
    const STATUS_GRADED   = 'graded';
    const STATUS_REJECTED = 'rejected';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function gradedBy()
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    public function grade()
    {
        return $this->hasOne(Grade::class);
    }

    public function getScorePercentAttribute(): float
    {
        if (!$this->max_score || $this->max_score == 0) {
            return 0;
        }
        return round(($this->score / $this->max_score) * 100, 2);
    }
}
