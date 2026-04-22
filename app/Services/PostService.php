<?php

namespace App\Services;

use App\Repositories\Contracts\PostRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Post;

class PostService
{
    public function __construct(
        private PostRepositoryInterface $posts,
    ) {}

    public function getPostForShow(string $slug, string $lang): Post
    {
        return $this->posts->findPublishedBySlug($slug, $lang);
    }

    public function getListingData(string $lang, array $filters): array
    {
        return [
            'featured' => $this->posts->getFeatured($lang),
            'posts'    => $this->posts->getPublishedPaginated($lang, $filters),
        ];
    }

    public function getRecent(string $lang, ?int $excludeId = null, int $limit = 6): Collection
    {
        return $this->posts->getRecent($lang, $excludeId, $limit);
    }

    public function getPopular(string $lang, int $limit = 4): Collection
    {
        return $this->posts->getPopular($lang, $limit);
    }

    public function getRelated(Post $post, string $lang, int $limit = 3): Collection
    {
        return $this->posts->getRelated($post, $lang, $limit);
    }

    public function getAdminPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->posts->getAdminPaginated($filters, $perPage);
    }

    public function getTopByWeeklyViews(int $limit = 5): Collection
    {
        return $this->posts->getTopByWeeklyViews($limit);
    }
}
