<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'progress',
        'started_at',
        'completed_at',
        'last_accessed_at',
        'status',
        'payment_id',
        'amount_paid',
    ];

    protected $casts = [
        'started_at'       => 'datetime',
        'completed_at'     => 'datetime',
        'last_accessed_at' => 'datetime',
        'progress'         => 'decimal:2',
        'amount_paid'      => 'decimal:2',
    ];

    const STATUS_ACTIVE    = 'active';
    const STATUS_COMPLETED = 'completed';
    const STATUS_SUSPENDED = 'suspended';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class);
    }

    public function lessonCompletions()
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED || $this->completed_at !== null;
    }

    public function updateProgress(): void
    {
        $totalLessons = $this->course->lessons()->count();
        if ($totalLessons === 0) {
            return;
        }
        $completedLessons = LessonCompletion::where('enrollment_id', $this->id)->count();
        $this->progress = ($completedLessons / $totalLessons) * 100;

        if ($this->progress >= 100) {
            $this->status       = self::STATUS_COMPLETED;
            $this->completed_at = now();
        }
        $this->last_accessed_at = now();
        $this->save();
    }
}
