<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'description',
        'instructions',
        'due_date',
        'max_score',
        'passing_score',
        'allow_late',
        'late_penalty_percent',
        'file_types_allowed',
        'max_file_size_mb',
        'is_published',
    ];

    protected $casts = [
        'due_date'          => 'datetime',
        'max_score'         => 'decimal:2',
        'passing_score'     => 'decimal:2',
        'allow_late'        => 'boolean',
        'is_published'      => 'boolean',
        'file_types_allowed' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function getUserSubmission(int $userId): ?Submission
    {
        return $this->submissions()->where('user_id', $userId)->latest()->first();
    }

    public function isOverdue(): bool
    {
        return $this->due_date !== null && $this->due_date->isPast();
    }
}
