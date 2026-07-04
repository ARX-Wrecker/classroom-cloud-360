<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'video_url',
        'video_duration',
        'duration_seconds',
        'order',
        'type',
        'is_published',
        'is_preview',
        'attachments',
        'transcript',
    ];

    protected $casts = [
        'is_published'   => 'boolean',
        'is_preview'     => 'boolean',
        'attachments'    => 'array',
    ];

    const TYPE_VIDEO  = 'video';
    const TYPE_TEXT   = 'text';
    const TYPE_QUIZ   = 'quiz';
    const TYPE_LIVE   = 'live';

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function course()
    {
        return $this->hasOneThrough(Course::class, Module::class, 'id', 'id', 'module_id', 'course_id');
    }

    public function completions()
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function isCompletedBy(int $userId): bool
    {
        return $this->completions()->where('user_id', $userId)->exists();
    }
}
