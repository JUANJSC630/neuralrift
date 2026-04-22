<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    protected $fillable = ['email', 'name', 'lang', 'confirmed', 'token', 'confirmed_at'];

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
        });
    }
}
