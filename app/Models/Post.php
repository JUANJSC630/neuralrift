<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'title_en',
        'slug',
        'slug_en',
        'excerpt',
        'excerpt_en',
        'content',
        'content_en',
        'cover_image',
        'og_image',
        'meta_title',
        'meta_title_en',
        'meta_description',
        'meta_description_en',
        'status',
        'lang',
        'published_at',
        'featured',
        'allow_comments',
        'indexable',
        'read_time',
        'views_count',
        'schema_markup',
    ];

    protected $casts = [
        'published_at'  => 'datetime',
        'featured'      => 'boolean',
        'allow_comments' => 'boolean',
        'indexable'     => 'boolean',
        'schema_markup' => 'array',
    ];

    // ── Relaciones ────────────────────────────────────
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function affiliates(): BelongsToMany
    {
        return $this->belongsToMany(Affiliate::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(PostView::class);
    }

    // ── Scopes ───────────────────────────────────────
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeForLang(Builder $query, string $lang): Builder
    {
        return $query->whereIn('lang', [$lang, 'both']);
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->orderByDesc('views_count');
    }

    // ── Auto-calcular read_time y slug ───────────────
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Post $post) {
            // Calcular tiempo de lectura
            $text = strip_tags($post->content ?? '');
            $wordCount = str_word_count($text);
            $post->read_time = max(1, (int) ceil($wordCount / 200));

            // Auto-slug
            if (empty($post->slug)) {
                $post->slug = str($post->title)->slug();
            }
            if (!empty($post->title_en) && empty($post->slug_en)) {
                $post->slug_en = str($post->title_en)->slug();
            }
        });
    }

    // ── Helpers ──────────────────────────────────────
    public function getUrlAttribute(): string
    {
        return url("/blog/{$this->slug}");
    }

    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at <= now();
    }
}
