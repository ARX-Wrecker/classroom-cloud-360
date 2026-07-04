<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'logo',
        'plan',
        'is_active',
        'max_students',
        'max_courses',
        'settings',
        'expires_at',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'settings'   => 'array',
        'expires_at' => 'datetime',
    ];

    const PLAN_FREE       = 'free';
    const PLAN_BASIC      = 'basic';
    const PLAN_PRO        = 'pro';
    const PLAN_ENTERPRISE = 'enterprise';

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function isActive(): bool
    {
        return $this->is_active && ($this->expires_at === null || $this->expires_at->isFuture());
    }
}
