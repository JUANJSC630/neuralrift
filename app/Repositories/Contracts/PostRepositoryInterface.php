<?php

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Post;

interface PostRepositoryInterface
{
    public function findPublishedBySlug(string $slug, string $lang): Post;

    public function getPublishedPaginated(string $lang, array $filters, int $perPage = 12): LengthAwarePaginator;

    public function getFeatured(string $lang): ?Post;

    public function getRecent(string $lang, ?int $excludeId = null, int $limit = 6): Collection;

    public function getPopular(string $lang, int $limit = 4): Collection;

    public function getRelated(Post $post, string $lang, int $limit = 3): Collection;

    public function getAdminPaginated(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function getTopByWeeklyViews(int $limit = 5): Collection;
}
