<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ForumPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'course_id',
        'module_id',
        'lesson_id',
        'parent_id',
        'title',
        'body',
        'is_pinned',
        'is_answered',
        'likes_count',
        'replies_count',
        'type',
    ];

    protected $casts = [
        'is_pinned'   => 'boolean',
        'is_answered' => 'boolean',
    ];

    const TYPE_DISCUSSION = 'discussion';
    const TYPE_QUESTION   = 'question';
    const TYPE_REPLY      = 'reply';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    public function parent()
    {
        return $this->belongsTo(ForumPost::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(ForumPost::class, 'parent_id')->orderBy('created_at');
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeForCourse($query, int $courseId)
    {
        return $query->where('course_id', $courseId);
    }
}
