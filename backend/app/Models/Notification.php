<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'data',
        'read_at',
        'action_url',
        'icon',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'data'    => 'array',
    ];

    const TYPE_ENROLLMENT    = 'enrollment';
    const TYPE_COURSE_UPDATE = 'course_update';
    const TYPE_GRADE         = 'grade';
    const TYPE_CERTIFICATE   = 'certificate';
    const TYPE_MESSAGE       = 'message';
    const TYPE_FORUM_REPLY   = 'forum_reply';
    const TYPE_SYSTEM        = 'system';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function markAsRead(): void
    {
        if (!$this->isRead()) {
            $this->update(['read_at' => now()]);
        }
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }
}
