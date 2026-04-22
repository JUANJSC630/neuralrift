<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAll(): Collection
    {
        return Category::ordered()->get();
    }

    public function getWithPostCounts(): Collection
    {
        return Category::withCount(['posts' => fn ($q) => $q->published()])
            ->ordered()
            ->get();
    }

    public function findBySlug(string $slug): Category
    {
        return Category::where('slug', $slug)->firstOrFail();
    }

    public function findOrFail(int $id): Category
    {
        return Category::findOrFail($id);
    }
}
