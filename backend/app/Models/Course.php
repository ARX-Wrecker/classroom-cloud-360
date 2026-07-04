<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'thumbnail',
        'preview_video',
        'price',
        'is_free',
        'is_published',
        'published_at',
        'instructor_id',
        'tenant_id',
        'category_id',
        'level',
        'language',
        'duration_hours',
        'total_lessons',
        'requirements',
        'what_you_learn',
        'tags',
        'certificate_enabled',
        'max_students',
        'rating',
        'rating_count',
    ];

    protected $casts = [
        'is_free'              => 'boolean',
        'is_published'         => 'boolean',
        'certificate_enabled'  => 'boolean',
        'price'                => 'decimal:2',
        'duration_hours'       => 'decimal:1',
        'requirements'         => 'array',
        'what_you_learn'       => 'array',
        'tags'                 => 'array',
        'published_at'         => 'datetime',
        'rating'               => 'decimal:2',
    ];

    const LEVEL_BEGINNER     = 'beginner';
    const LEVEL_INTERMEDIATE = 'intermediate';
    const LEVEL_ADVANCED     = 'advanced';

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('progress', 'completed_at', 'started_at')
            ->withTimestamps();
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function forumPosts()
    {
        return $this->hasMany(ForumPost::class);
    }

    public function isEnrolled(int $userId): bool
    {
        return $this->enrollments()->where('user_id', $userId)->exists();
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'ILIKE', "%{$term}%")
              ->orWhere('description', 'ILIKE', "%{$term}%");
        });
    }
}
