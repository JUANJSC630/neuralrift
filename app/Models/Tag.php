<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = ['name', 'name_en', 'slug', 'color'];

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = str($tag->name)->slug();
            }
        });
    }
}
