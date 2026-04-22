<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PostRepository implements PostRepositoryInterface
{
    public function findPublishedBySlug(string $slug, string $lang): Post
    {
        $slugColumn = $lang === 'en' ? 'slug_en' : 'slug';

        return Post::published()
            ->where($slugColumn, $slug)
            ->with(['category', 'author', 'tags', 'affiliates'])
            ->firstOrFail();
    }

    public function getPublishedPaginated(string $lang, array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $isEn = $lang === 'en';

        $query = Post::published()
            ->with(['category', 'author', 'tags'])
            ->forLang($lang);

        if (!empty($filters['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category']));
        }

        if (!empty($filters['tag'])) {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $filters['tag']));
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(fn ($q) => $isEn
                ? $q->where('title_en', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%")
                : $q->where('title', 'like', "%{$search}%")->orWhere('excerpt', 'like', "%{$search}%")
            );
        }

        match ($filters['sort'] ?? 'recent') {
            'popular'  => $query->orderByDesc('views_count'),
            'shortest' => $query->orderBy('read_time'),
            default    => $query->latest('published_at'),
        };

        return $query->paginate($perPage)->withQueryString();
    }

    public function getFeatured(string $lang): ?Post
    {
        return Post::published()
            ->featured()
            ->forLang($lang)
            ->with(['category', 'author', 'tags'])
            ->latest('published_at')
            ->first();
    }

    public function getRecent(string $lang, ?int $excludeId = null, int $limit = 6): Collection
    {
        return Post::published()
            ->forLang($lang)
            ->with(['category', 'author'])
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->latest('published_at')
            ->take($limit)
            ->get();
    }

    public function getPopular(string $lang, int $limit = 4): Collection
    {
        return Post::published()
            ->forLang($lang)
            ->with(['category'])
            ->orderByDesc('views_count')
            ->take($limit)
            ->get(['id', 'title', 'title_en', 'slug', 'slug_en', 'cover_image', 'views_count', 'read_time', 'published_at', 'category_id', 'lang']);
    }

    public function getRelated(Post $post, string $lang, int $limit = 3): Collection
    {
        return Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->forLang($lang)
            ->with(['category', 'author'])
            ->latest('published_at')
            ->take($limit)
            ->get();
    }

    public function getAdminPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Post::with(['category', 'author'])->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getTopByWeeklyViews(int $limit = 5): Collection
    {
        return Post::published()
            ->withCount(['views as week_views' => fn ($q) =>
                $q->where('viewed_at', '>=', now()->subWeek())
            ])
            ->orderByDesc('week_views')
            ->take($limit)
            ->get(['id', 'title', 'slug', 'views_count']);
    }
}
