<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Affiliate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo',
        'url',
        'website',
        'description',
        'description_en',
        'commission',
        'commission_type',
        'commission_value',
        'cookie_duration',
        'pros',
        'cons',
        'rating',
        'category',
        'badge',
        'active',
        'featured',
        'clicks_count',
        'order',
    ];

    protected $casts = [
        'pros'     => 'array',
        'cons'     => 'array',
        'active'   => 'boolean',
        'featured' => 'boolean',
        'rating'   => 'float',
    ];

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(AffiliateClick::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($affiliate) {
            if (empty($affiliate->slug)) {
                $affiliate->slug = str($affiliate->name)->slug();
            }
        });
    }
}
