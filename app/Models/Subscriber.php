<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    protected $fillable = ['email', 'name', 'lang', 'confirmed', 'token', 'confirmed_at', 'unsubscribe_token'];

    protected $casts = [
        'confirmed'    => 'boolean',
        'confirmed_at' => 'datetime',
    ];

    public function scopeConfirmed($query)
    {
        return $query->where('confirmed', true);
    }

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($subscriber) {
            $subscriber->token = Str::random(64);
            $subscriber->unsubscribe_token = Str::random(64);
        });
    }

    /**
     * Get or generate the unsubscribe token (for existing subscribers without one).
     */
    public function getUnsubscribeUrl(): string
    {
        if (!$this->unsubscribe_token) {
            $this->update(['unsubscribe_token' => Str::random(64)]);
        }

        return url("/newsletter/unsubscribe/{$this->unsubscribe_token}");
    }
}
