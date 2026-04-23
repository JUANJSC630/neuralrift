<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Comment extends Model
{
    protected $fillable = [
        'post_id',
        'parent_id',
        'user_id',
        'author_name',
        'author_email',
        'body',
        'status',
        'ip_address',
        'user_agent',
        'depth',
    ];

    protected $casts = [
        'depth' => 'integer',
    ];

    public const MAX_DEPTH = 2;

    // ── Relaciones ────────────────────────────────────

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ────────────────────────────────────────

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopeTopLevel(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    // ── Helpers ───────────────────────────────────────

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function canHaveReplies(): bool
    {
        return $this->depth < self::MAX_DEPTH;
    }

    public function getInitialAttribute(): string
    {
        return strtoupper(mb_substr($this->author_name, 0, 1));
    }
}
